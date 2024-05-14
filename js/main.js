// entrypoints
const pieces = document.querySelectorAll('.piece');
const slots = document.querySelectorAll('.slot');
const piecesContainer = document.getElementById('pieces');

// pointer events
pieces.forEach(piece => {
  piece.addEventListener('pointerdown', pointerDown);
});

// mouseup event
document.addEventListener('mouseup', mouseUp);

let draggedPiece = null;
let offsetX = 0;
let offsetY = 0;
let dummyPiece = null;

function pointerDown(e) {
  draggedPiece = this;
  draggedPiece.classList.add('dragging');

  // create a dummy clone of the dragged piece to display as the cursor while dragging
  dummyPiece = draggedPiece.cloneNode(true);
  dummyPiece.classList.add('dummy');
  document.body.appendChild(dummyPiece);

  dummyPiece.style.position = 'fixed';
  dummyPiece.style.pointerEvents = 'none';
  updateDummyPiecePosition(e.pageX, e.pageY);
}

function mouseUp(e) {
  if (!draggedPiece) return;

  const hoveredSlot = document.elementFromPoint(e.clientX, e.clientY).closest('.slot');
  
  if (hoveredSlot && hoveredSlot.classList.contains('slot')) {
    if (hoveredSlot.children.length === 0) {
      hoveredSlot.appendChild(draggedPiece);
      playSound(sound_place);
    } else {
      const pieceInSlot = hoveredSlot.children[0];
      const parentOfDraggedPiece = draggedPiece.parentElement;
      const parentOfPieceInSlot = pieceInSlot.parentElement;
      
      parentOfDraggedPiece.insertBefore(pieceInSlot, draggedPiece);
      parentOfPieceInSlot.appendChild(draggedPiece);
      playSound(sound_swap);
    }
  }

  if (dummyPiece) document.body.removeChild(dummyPiece);

  draggedPiece.classList.remove('dragging');
  draggedPiece = null;
}

function updateDummyPiecePosition(x, y) {
  dummyPiece.style.top = (y - dummyPiece.offsetHeight / 2) + 'px';
  dummyPiece.style.left = (x - dummyPiece.offsetHeight / 2) + 'px';
}

// update the position of the dummy piece while dragging
document.addEventListener('mousemove', e => {
  if (dummyPiece) {
    updateDummyPiecePosition(e.pageX, e.pageY);
  }
});

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
