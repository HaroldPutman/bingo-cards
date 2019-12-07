/**
 * Tracks an event to Analytics.
 * @param {String} action The action name.
 * @param {Object} data The tag data.
 */
function trackEvent(action, data) {
  if (typeof gtag === 'function') {
    gtag('event', action, data);
  }
}

/**
 * Shuffles the contents of an array.
 * @param {Array} array
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
}

/**
 * Checks for Bingo on the board by scanning for patterns.
 * @param {Number} board A binary representation of the current
 * state of the board.
 * @returns {Array} An array of the found bingo patterns.
 */
function findBingos(board) {
  const bingos = [];
  const row0 = parseInt('1111100000000000000000000', 2);
  const col0 = parseInt('1000010000100001000010000', 2);
  const leftDiag = parseInt('1000001000001000001000001', 2);
  const rightDiag = parseInt('0000100010001000100010000', 2);
  if ((board & leftDiag) === leftDiag) {
    bingos.push(leftDiag);
  }
  if ((board & rightDiag) === rightDiag) {
    bingos.push(rightDiag);
  }
  for (let r = 0; r < 25; r += 5) {
    let row = row0 >> r;
    if ((board & row) === row) {
      bingos.push(row);
    }
  }
  for (let c = 0; c < 5; c += 1) {
    let col = col0 >> c;
    if ((board & col) === col) {
      bingos.push(col);
    }
  }
  return bingos;
}

/**
 * Turns the board into a single number. Each bit representing the
 * state of a cell.
 * @return {Number} The digitized board.
 */
function digitizeBoard() {
  return Array.from(document.querySelectorAll('.board > div'))
    .reduce((acc, el) => {
      acc = (acc << 1) | (el.classList.contains('marked') ? 1 : 0);
      return acc;
    }, 0);
}

/**
 * Clear the bingo states.
 */
function clearBingos() {
  Array.from(document.querySelectorAll('.bingo')).forEach((el) => {
    el.classList.remove('bingo');
  });
}

/**
 * Mark all the bingos on the board.
 * @param {Array} bingos An array of zero or more bingo combinations.
 */
function markBingos(bingos) {
  bingos.forEach((mask) => {
    let currentBit = parseInt('1000000000000000000000000', 2);
    Array.from(document.querySelectorAll('.board > div'))
      .forEach((el) => {
        if (mask & currentBit) {
          el.classList.add('bingo');
        }
        currentBit >>= 1;
      });
  });
  if (bingos.length) {
    const h1 = document.querySelector('.card h1');
    h1.classList.add('bingo');
  }
}

/**
 * Checks the board for a bingo. If there is one it will
 * mark the cells involved.
 * @returns {Number} The number of bingos found.
 */
function checkForBingo() {
  clearBingos();
  const board = digitizeBoard();
  const bingos = findBingos(board);
  markBingos(bingos);
  return bingos.length;
}

/**
 * Stores the state of the board so that it can
 * survive a browser refresh. Because this can happen
 * on iOS when you switch apps and come back to Safari.
 */
function saveBoard() {
  const cells = document.querySelectorAll('.board > div');
  const serialized = Array.from(cells).map((el) => {
    return {
      t: el.innerText,
      m: el.classList.contains('marked')
    }
  });
  localStorage.setItem('saved', JSON.stringify(serialized));
  localStorage.setItem('savedAt', Date.now());
}

/**
 * Make the BINGO heading road by splitting the h1 text.
 * This lets the markup be more semantic.
 */
function buildHeading() {
  const el = document.querySelector('.card h1');
  const text = el.innerText;
  el.innerText = '';
  Array.from(text).forEach((ch) => {
    const span = document.createElement('span');
    span.innerText = ch;
    el.appendChild(span);
  });
}

/**
 * Handle clicking on a cell by toggling the dauber mark.
 * @param {Object} event The click event.
 */
function clickCell(event) {
  const  marked = this.classList.toggle('marked');
  if (marked) {
    trackEvent('mark', {
      event_category: 'user',
      value: event.target.innerText
    });
  }
  const bingos = checkForBingo();
  const rect = event.target.getBoundingClientRect();
  const offset = (event.clientX - rect.left) / rect.width;
  this.style.backgroundPositionX = (offset * 100)+'%';
}

/**
 * Create an empty bingo card.
 * @param {DomElement} board The container for bingo card.
 */
function buildEmptyBoard(board) {
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    const div = document.createElement('div');
    cell.appendChild(div);
    cell.addEventListener('click', clickCell);
    board.appendChild(cell);
  }
}

/**
 * Fill the bingo card with content.
 * @param {Array} content An array of objects with
 *    `t`: Text in the cell
 *    `m`: The state of the dauber mark.
 */
function fillCells(content) {
  const cells = document.querySelectorAll('.board > div');
  cells.forEach((cell, index) => {
    const div = cell.querySelector('div');
    div.innerText = content[index].t;
    cell.classList.toggle('marked', content[index].m);
  })
}

/**
 * Loads content from the specified file to fill the board.
 * @param {String} tropeDefinitions URL of the JSON trope file.
 */
function loadBoard(tropeDefinitions) {
  req=new XMLHttpRequest();
  req.open("GET", tropeDefinitions, true);
  req.overrideMimeType("application/json");
  req.send();
  req.onload = function onLoad() {
    const tropes = JSON.parse(req.responseText);
    shuffle(tropes);
    tropes[12] = 'FREE';
    trackEvent('load', { value: tropeDefinitions });
    fillCells(tropes.map((text) => {
      return {
        t: text,
        m: false
      };
    }));
  };
}

/**
 * Pull text into the cells, either from Saved data or from
 * a trope file.
 * @param {String} tropeDefinitions URL JSON file to get new tropes.
 */
function populateBoard(tropeDefinitions) {
  let age = 0;
  const saved = localStorage.getItem('saved');
  if (saved) {
    const savedAt = Number(localStorage.getItem('savedAt'));
    age = Math.floor((Date.now() - savedAt) / 1000);
  }
  if (!saved || (age > 7200)) {
    loadBoard(tropeDefinitions);
  } else {
    trackEvent('restore', { value: age });
    fillCells(JSON.parse(saved));
    checkForBingo();
  }
}

/**
 * Handles the Document Ready event.
 */
function ready() {
  const searchParams = new URLSearchParams(window.location.search);
  let tropeDefinitions = 'film-tropes.json'
  if (searchParams.has('tropes')) {
    tropeDefinitions = searchParams.get('tropes');
  }
  const board = document.querySelector('.board');
  buildEmptyBoard(board);
  populateBoard(tropeDefinitions);
  buildHeading();
  const resetButton = document.querySelector('.controls .reset');
  resetButton.addEventListener('click', (event)=> {
    trackEvent('reset', { event_category: 'user' });
    clearBingos();
    loadBoard(tropeDefinitions);
  })
  window.addEventListener('unload', (event) => {
    saveBoard();
  });
}

if (document.readyState != 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}
