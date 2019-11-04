function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
}

function fillBoard(clues) {
  const cells = document.querySelectorAll('.board > div');
  cells.forEach((cell, index) => {
    const div = document.createElement('div');
    div.innerText = clues[index];
    cell.appendChild(div);
  });
}

function explodeHeading(el) {
  const text = el.innerText;
  el.innerText = '';
  for (let i = 0 ; i < text.length; i++) {
    const span = document.createElement('span');
    span.innerText = text[i];
    el.appendChild(span);
  }
}

function ready() {
  const searchParams = new URLSearchParams(window.location.search);
  let cluefile = 'film-tropes.json'
  if (searchParams.has('clues')) {
    cluefile = searchParams.get('clues');
  }
  req=new XMLHttpRequest();
  req.open("GET", cluefile ,true);
  req.overrideMimeType("application/json");
  req.send();
  req.onload = function onLoad() {
    const clues = JSON.parse(req.responseText);
    shuffle(clues);
    fillBoard(clues);
  };
  const head = document.querySelector('.card h1');
  explodeHeading(head);
  const cells = document.querySelectorAll('.board div');
  cells.forEach((cell) => {
    cell.addEventListener('click', function(event) {
      console.log('click');
      this.classList.toggle('marked');
    });
  });
}

if (document.readyState != 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}
