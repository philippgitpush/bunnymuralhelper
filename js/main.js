// entrypoints
const pieces = document.querySelectorAll('.piece');
const slots = document.querySelectorAll('.slot');
const piecesContainer = document.getElementById('pieces');

// drag & drop logic
pieces.forEach(piece => {
  piece.addEventListener('dragstart', dragStart);
  piece.addEventListener('dragend', dragEnd);
});

slots.forEach(slot => {
  slot.addEventListener('dragover', dragOver);
  slot.addEventListener('drop', dragDrop);
});

let draggedPiece = null;

function dragStart() {
  draggedPiece = this;
  document.body.classList.add('dragging');
}

function dragEnd() {
  draggedPiece = null;
  document.body.classList.remove('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop(e) {
  if (!e.target.classList.contains('slot'))  return;
  
  // when the slot is empty, append piece
  if (this.children.length === 0) {
    this.appendChild(draggedPiece);
    playSound(sound_place);
    return;
  }
  
  // when the slot isn't empty, swap pieces
  const pieceInSlot = this.children[0];
  const parentOfDraggedPiece = draggedPiece.parentElement;
  const parentOfPieceInSlot = pieceInSlot.parentElement;
  
  parentOfDraggedPiece.insertBefore(pieceInSlot, draggedPiece);
  parentOfPieceInSlot.appendChild(draggedPiece);
  playSound(sound_swap);
}

// sounds
var sound_place = new Audio("assets/50.ogg");
var sound_swap = new Audio("assets/62.ogg");

function playSound(sound) {
  sound.currentTime = 0;
  sound.volume = 0.4;
  sound.play();
}

// render puzzle tiles / pieces
document.addEventListener("DOMContentLoaded", function() {
  const pieces = document.querySelectorAll(".piece");
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
    
    for (let i = 0; i < topCount; i++) {
      const pixelTop = document.createElement("div");
      pixelTop.classList.add("pixel", "white");
      topContainer.appendChild(pixelTop);
    }
    
    for (let i = 0; i < rightCount; i++) {
      const pixelRight = document.createElement("div");
      pixelRight.classList.add("pixel", "white");
      rightContainer.appendChild(pixelRight);
    }
    
    for (let i = 0; i < bottomCount; i++) {
      const pixelBottom = document.createElement("div");
      pixelBottom.classList.add("pixel", "white");
      bottomContainer.appendChild(pixelBottom);
    }
    
    for (let i = 0; i < leftCount; i++) {
      const pixelLeft = document.createElement("div");
      pixelLeft.classList.add("pixel", "white");
      leftContainer.appendChild(pixelLeft);
    }
  }
});
