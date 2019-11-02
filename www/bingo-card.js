function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
}

function fillBoard(clues) {
  for (let i = 0; i < 25; i++) {
    let row = Math.floor(i / 5) + 1;
    let colno = i % 5;
    let col = "BINGO".substring(colno, colno + 1);
    let cell = document.getElementById(col+row);
    if (cell) {
      const div = document.createElement('div');
      div.innerText = clues[i];
      cell.appendChild(div);
    }
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
  const cells = document.querySelectorAll('.board div');
  for (const cell of cells) {
    cell.addEventListener('click', function(event) {
      console.log('click');
      this.classList.toggle('marked');
    });
  }
}

if (document.readyState != 'loading') {
  ready();
} else {
  document.addEventListener('DOMContentLoaded', ready);
}
