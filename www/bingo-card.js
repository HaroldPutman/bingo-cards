function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
}

function saveBoard() {
  const cells = document.querySelectorAll('.board > div');
  const serialized = Array.from(cells).map((el) => {
    return {
      t: el.innerText,
      m: el.classList.contains('marked')
    }
  });
  localStorage.setItem('saved', JSON.stringify(serialized));
}

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

function clickCell(event) {
  this.classList.toggle('marked');
  const rect = event.target.getBoundingClientRect();
  const offset = (event.clientX - rect.left) / rect.width;
  this.style.backgroundPositionX = (offset * 100)+'%';
}

function buildEmptyBoard(board) {
  for (let i = 0; i < 25; i++) {
    const cell = document.createElement('div');
    const div = document.createElement('div');
    cell.appendChild(div);
    cell.addEventListener('click', clickCell);
    board.appendChild(cell);
  }
}

function fillBoard(content) {
  const cells = document.querySelectorAll('.board > div');
  cells.forEach((cell, index) => {
    const div = cell.querySelector('div');
    div.innerText = content[index].t;
    cell.classList.toggle('marked', content[index].m);
  })
}

function resetBoard(cluefile) {
  req=new XMLHttpRequest();
  req.open("GET", cluefile ,true);
  req.overrideMimeType("application/json");
  req.send();
  req.onload = function onLoad() {
    const clues = JSON.parse(req.responseText);
    shuffle(clues);
    clues[12] = 'FREE';
    fillBoard(clues.map((text) => {
      return {
        t: text,
        m: false
      };
    }));
  };
}

function loadBoard(cluefile) {
  const saved = localStorage.getItem('saved');
  if (!saved) {
    resetBoard(cluefile);
  } else {
    fillBoard(JSON.parse(saved));
  }
}

function ready() {
  const searchParams = new URLSearchParams(window.location.search);
  let cluefile = 'film-tropes.json'
  if (searchParams.has('clues')) {
    cluefile = searchParams.get('clues');
  }
  const board = document.querySelector('.board');
  buildEmptyBoard(board);
  loadBoard(cluefile);
  buildHeading();
  const resetButton = document.querySelector('.controls .reset');
  resetButton.addEventListener('click', (event)=> {
    resetBoard(cluefile);
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
