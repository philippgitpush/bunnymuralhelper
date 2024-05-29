// entrypoints & interaction events

const pieces = document.querySelectorAll('.piece');
pieces.forEach(piece => { piece.addEventListener('pointerdown', pointerDown) });
document.addEventListener("pointermove", pointerMove);
document.addEventListener('pointerup', pointerUp);

let draggedPiece = null;
let dummyPiece = null;
let lastMove = null;
let solved = false;

function pointerDown(e) {
  if (draggedPiece) return; // return if already mids dragging a piece

  draggedPiece = this;
  updateSelected(draggedPiece);
}

function pointerUp(e) {
  if (!draggedPiece) return; // return empty action

  let x = e.clientX;
  let y = e.clientY;

  // move or swap piece
  const hoveredSlot = document.elementFromPoint(x, y).closest('.slot');
  if (!solved && hoveredSlot) hoveredSlot.children.length === 0 ? placePiece(hoveredSlot) : swapPiece(hoveredSlot);
  
  // cleanup
  removeCursor();
  removeHovering();
  removeDragging();
  
  // check if puzzle was solved
  if (!solved && hoveredSlot) checkSolved(hoveredSlot);
}

function pointerMove(e) {
  if (!draggedPiece || !e.isPrimary) return;

  let x = e.clientX;
  let y = e.clientY;

  if (!dummyPiece) createCursor(draggedPiece.cloneNode(true), x, y);

  updateDragging();
  updateCursor(x, y);
  removeSelected();
  updateHovering(document.elementFromPoint(x, y).closest('.slot'));
}

// place / swap behaviour

function placePiece(slot) {
  slot.appendChild(draggedPiece);
  playSound(sound_place);
}

function swapPiece(slot) {
  const pieceInSlot = slot.children[0];
  const parentOfDraggedPiece = draggedPiece.parentElement;
  const parentOfPieceInSlot = pieceInSlot.parentElement;
  
  parentOfDraggedPiece.insertBefore(pieceInSlot, draggedPiece);
  parentOfPieceInSlot.appendChild(draggedPiece);
  
  if (pieceInSlot != draggedPiece) playSound(sound_swap);
}

// cursor behaviour + dragging & hovering

function createCursor(reference, x, y) {
  dummyPiece = reference;
  dummyPiece.classList.add('dummy');
  document.body.appendChild(dummyPiece);
  updateCursor(x, y);
}

function updateCursor(x, y) {
  dummyPiece.style.top = (y - dummyPiece.offsetHeight / 2) + 'px';
  dummyPiece.style.left = (x - dummyPiece.offsetHeight / 2) + 'px';
}

function removeCursor() {
  if (dummyPiece) document.body.removeChild(dummyPiece);
  dummyPiece = null;
}

function updateDragging() {
  draggedPiece.classList.add('dragging');
  document.body.classList.add('dragging');
}

function removeDragging() {
  document.body.classList.remove('dragging');
  draggedPiece.classList.remove('dragging');
  draggedPiece = null;
}

function updateHovering(elem) {
  removeHovering();
  if (elem !== null) elem.classList.add('hovering');
}

function removeHovering() {
  document.querySelectorAll('.hovering').forEach(function(e) { e.classList.remove('hovering') });
}

function removeSelected() {
  document.querySelectorAll('.selected').forEach(function(e) { e.classList.remove('selected') });
  document.body.classList.remove('dim-pieces');
}

function updateSelected(elem) {
  if (elem.classList.contains('selected')) { // toggle if already selected piece
    removeSelected();
    return;
  }

  removeSelected();
  elem.classList.add('selected');
  document.body.classList.add('dim-pieces');
}

// mobile fixes

document.ondblclick = function(e) { e.preventDefault() } // disable safari double-click zoom

// sounds

var sound_place = new Audio("assets/sounds/50.ogg");
var sound_swap = new Audio("assets/sounds/62.ogg");
var sound_melody = new Audio("assets/sounds/134.ogg");

function playSound(sound) {
  sound.currentTime = 0; // avoids sounds cutting out when playback didn't finish
  sound.volume = 0.4;
  sound.play();
}

// render puzzle tiles / pieces

document.addEventListener("DOMContentLoaded", function() {
  pieces.forEach(piece => {
    const innerData = piece.dataset.inner ? piece.dataset.inner.split(" ") : [];
    const outerData = piece.dataset.outer ? piece.dataset.outer.split(" ") : [];
    
    const innerContainer = document.createElement("div");
    innerContainer.classList.add("inner");
    piece.appendChild(innerContainer);
    
    const outerContainer = document.createElement("div");
    outerContainer.classList.add("outer");
    piece.appendChild(outerContainer);
    
    const outerTopContainer = document.createElement("div");
    outerTopContainer.classList.add("top");
    outerContainer.appendChild(outerTopContainer);
    
    const outerRightContainer = document.createElement("div");
    outerRightContainer.classList.add("right");
    outerContainer.appendChild(outerRightContainer);
    
    const outerBottomContainer = document.createElement("div");
    outerBottomContainer.classList.add("bottom");
    outerContainer.appendChild(outerBottomContainer);
    
    const outerLeftContainer = document.createElement("div");
    outerLeftContainer.classList.add("left");
    outerContainer.appendChild(outerLeftContainer);
    
    renderPixels(innerData, innerContainer);
    renderOuterPixels(outerData, outerTopContainer, outerRightContainer, outerBottomContainer, outerLeftContainer);
  });
  
  function renderPixels(data, container) {
    data.forEach(color => {
      const pixel = document.createElement("div");
      pixel.classList.add("pixel");
      pixel.classList.add(color);
      container.appendChild(pixel);
    });
  }
  
  function renderOuterPixels(data, topContainer, rightContainer, bottomContainer, leftContainer) {
    const [topCount, rightCount, bottomCount, leftCount] = data.map(Number);
    
    function createPixels(container, count) {
      for (let i = 0; i < count; i++) {
        const pixel = document.createElement("div");
        pixel.classList.add("pixel", "white");
        container.appendChild(pixel);
      }
    }

    createPixels(topContainer, topCount);
    createPixels(rightContainer, rightCount);
    createPixels(bottomContainer, bottomCount);
    createPixels(leftContainer, leftCount);
  }
});

// solution check

let solutionMap = {
  "1": "22", "2": "42", "3": "12", "4": "24", "5": "49", "6": "7", "7": "31", "8": "29", "9": "3", "10": "43", "11": "18", "12": "23", "13": "26", "14": "39", "15": "8", "16": "14", "17": "36", "18": "13", "19": "44", "20": "6", "21": "17", "22": "25", "23": "35", "24": "15", "25": "28", "26": "37", "27": "38", "28": "16", "29": "33", "30": "5", "31": "20", "32": "27", "33": "9", "34": "30", "35": "50", "36": "2", "37": "10", "38": "45", "39": "32", "40": "46", "41": "48", "42": "4", "43": "40", "44": "41", "45": "19", "46": "21", "47": "11", "48": "1", "49": "34", "50": "47"
};

function checkSolved(last) {
  let currentSolution = true;

  // check if pieces match solution's positions
  for (let slot in solutionMap) {  
    const piece = solutionMap[slot];

    let target = document.querySelector('.slot[data-id="' + slot + '"]');
    if (!target.firstElementChild || target.firstElementChild.dataset.id != piece) currentSolution = false;
  }

  // play the ending sequence when puzzle is correct/solved
  if (currentSolution) playEnding(parseInt(last.dataset.id));
}

function playEnding(slot) {
  solved = true;
  playSound(sound_melody);
  clearEventsAndStyles();

  // animated slot-grid highlight
  let group = getNearbySlotsGroup(slot);
  let highlightInterval = setInterval(function() {
    setHighlighted(group);

    // add next neighbours for the next interval, remove past slots & duplicates
    group.forEach(function(e) {
      group = group.filter(group => group !== e); // remove past
      group = group.concat(filterAlreadyHighlighted(getNearbySlotsGroup(e))); // add next
      group = group.filter((item, index) => group.indexOf(item) === index); // filter duplicates
    });

    // clear interval when finished
    if (!group.length) clearInterval(highlightInterval);

  }, 150);
}

function filterAlreadyHighlighted(slots) {
  let arr = [];

  if (slots.length) slots.forEach(function(e) {
    const target = document.querySelector('.slot[data-id="' + e + '"]');
    if (!target.classList.contains('highlight')) arr.push(e);
  })

  return arr;
}

function setHighlighted(slots) {
  slots.forEach(function(e) {
    const target = document.querySelector('.slot[data-id="' + e + '"]');
    target.classList.add('highlight');
  })
}

// tile mapping for animations

function getNearbySlotsGroup(slot) {
  let arr = Array.from({ length: 50 }, (_, i) => i + 1); // list all slots on the board
  let group = [];

  for (let i = 1; i < 6; i++) { // 5 rows

    // split board into 5 rows
    const sliced = arr.slice(i * 10 - 10, i * 10);

    // declaration of possible neighbours
    const above = slot - 10;
    const right = slot + 1;
    const below = slot + 10;
    const left = slot - 1;

    // check for left & right neighbour
    if (sliced.includes(slot)) {
      if (sliced.includes(left) && !group.includes(left)) group.push(left); // left
      if (sliced.includes(right) && !group.includes(right)) group.push(right); // right
    }

    // check for neighbour above & below
    if (arr.includes(above) && !group.includes(above)) group.push(above); // above
    if (arr.includes(below) && !group.includes(below)) group.push(below); // below
  }

  return group;
}

function clearEventsAndStyles() {
  //events
  document.removeEventListener('pointermove', pointerMove);

  // styles
  pieces.forEach(function(e) { e.classList.remove('selected') });
  document.getElementById('puzzle').classList.add('solved');
  document.getElementById('pieces').classList.add('solved');
  document.body.classList.remove('dim-pieces');
}

// debug

function populateBoard(solved) {
  for (let i = 0; i < pieces.length; i++) {
    let slot = document.querySelector('.slot[data-id="' + (i + 1) + '"]');
    draggedPiece = pieces[i];

    if (solved) draggedPiece = document.querySelector('.piece[data-id="' + solutionMap[i + 1] + '"]');
    
    placePiece(slot);
  }

  draggedPiece = null;
}
