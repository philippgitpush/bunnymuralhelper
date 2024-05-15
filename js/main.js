// mobile support
let mobile = false;
mobileCheck();

// entrypoints
const pieces = document.querySelectorAll('.piece');

// start interaction events
pieces.forEach(piece => {
  piece.addEventListener('pointerdown', pointerDown);
  piece.addEventListener("touchstart", pointerDown);
});

// stop interaction events
document.addEventListener('mouseup', mouseUp);
document.addEventListener("touchend", mouseUp);

let draggedPiece = null;
let dummyPiece = null;
let lastMove = null;

function pointerDown(e) {
  if (e.type == "pointerdown" && mobile) return;
  let x = e.clientX;
  let y = e.clientY;

  if (mobile) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }

  lastMove = e;
  draggedPiece = this;
  draggedPiece.classList.add('dragging');
  document.body.classList.add('dragging');
  
  // create a dummy clone of the dragged piece to display as the cursor while dragging
  dummyPiece = draggedPiece.cloneNode(true);
  dummyPiece.classList.add('dummy');
  document.body.appendChild(dummyPiece);
  
  dummyPiece.style.position = 'fixed';
  dummyPiece.style.pointerEvents = 'none';
  updateDummyPiecePosition(x, y);
}

function mouseUp(e) {
  if (e.type == "mouseup" && mobile) return;
  if (!draggedPiece) return;

  let x = e.clientX;
  let y = e.clientY;

  if (mobile) {
    if (!lastMove) return;

    x = lastMove.touches[0].clientX;
    y = lastMove.touches[0].clientY;
  }

  const hoveredSlot = document.elementFromPoint(x, y).closest('.slot');
  
  // swap or set piece with/to new slot
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
      if (pieceInSlot != draggedPiece) playSound(sound_swap);
    }
  }
  
  // cleanup
  document.querySelectorAll('.hovering').forEach(function(e) { e.classList.remove('hovering') });
  if (dummyPiece) document.body.removeChild(dummyPiece);
  document.body.classList.remove('dragging');
  draggedPiece.classList.remove('dragging');
  draggedPiece = null;
  dummyPiece = null;
  lastMove = null;
}

function updateDummyPiecePosition(x, y) {
  dummyPiece.style.top = (y - dummyPiece.offsetHeight / 2) + 'px';
  dummyPiece.style.left = (x - dummyPiece.offsetHeight / 2) + 'px';
}

// movement events
document.addEventListener("mousemove", mouseMove);
document.addEventListener("touchmove", mouseMove);

function mouseMove(e) {
  if (e.type == "mousemove" && mobile) return;
  if (!dummyPiece) return;
  
  let x = e.clientX;
  let y = e.clientY;

  if (mobile) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }

  // add hovering-slot indicator
  document.querySelectorAll('.hovering').forEach(function(e) { e.classList.remove('hovering') });
  let hovering = document.elementFromPoint(x, y).closest('.slot');
  if (hovering) hovering.classList.add('hovering');

  // store last move for touchend event
  lastMove = e;

  updateDummyPiecePosition(x, y);
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

function mobileCheck() {
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) mobile = true;})(navigator.userAgent||navigator.vendor||window.opera);
};
