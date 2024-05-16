// entrypoints & interaction events

const pieces = document.querySelectorAll('.piece');
pieces.forEach(piece => { piece.addEventListener('pointerdown', pointerDown) });
document.addEventListener("pointermove", pointerMove);
document.addEventListener('pointerup', pointerUp);

let draggedPiece = null;
let dummyPiece = null;
let lastMove = null;

function pointerDown(e) {
  if (draggedPiece) return; // return if already mids dragging a piece

  let x = e.clientX;
  let y = e.clientY;

  draggedPiece = this;

  // update visuals
  createCursor(this.cloneNode(true), x, y);
  updateSelected(draggedPiece);
  updateCursor(x, y);
  updateDragging();
}

function pointerUp(e) {
  if (!draggedPiece) return; // return empty action

  let x = e.clientX;
  let y = e.clientY;

  // move or swap piece
  const hoveredSlot = document.elementFromPoint(x, y).closest('.slot');
  if (hoveredSlot) hoveredSlot.children.length === 0 ? placePiece(hoveredSlot) : swapPiece(hoveredSlot);
  
  // cleanup
  removeCursor();
  removeHovering();
  removeDragging();
}

function pointerMove(e) {
  if (!draggedPiece || !e.isPrimary) return;
  updateCursor(e.clientX, e.clientY);
  updateHovering(document.elementFromPoint(e.clientX, e.clientY).closest('.slot'));
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

function updateSelected(elem) {
  if (elem.classList.contains('selected')) { // deselect if interacting with already selected piece
    elem.classList.remove('selected');
    return;
  }

  document.querySelectorAll('.selected').forEach(function(e) { e.classList.remove('selected') });
  elem.classList.add('selected');
}

// mobile fixes

document.ondblclick = function(e) { e.preventDefault() } // disable safari double-click zoom

// sounds

var sound_place = new Audio("assets/50.ogg");
var sound_swap = new Audio("assets/62.ogg");

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
