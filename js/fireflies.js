// canvas initialization
const canvas = document.getElementById("fireflies");
const ctx = canvas.getContext("2d");
let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// firefly class definition
class Firefly {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.s = Math.random() * 2;
    this.ang = Math.random() * 2 * Math.PI;
    this.v = this.s * this.s / 16;
  }

  move() {
    this.x += this.v * Math.cos(this.ang);
    this.y += this.v * Math.sin(this.ang);
    this.ang += (Math.random() * 20 * Math.PI / 180) - (10 * Math.PI / 180);
  }

  show() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.s * 1.5, 0, 2 * Math.PI);
    ctx.fillStyle = "#48ffcc";
    ctx.fill();
  }
}

const fireflies = [];

// generate fireflies
function generateFireflies() {
  if (fireflies.length < 100) {
    for (let j = 0; j < 10; j++) {
      fireflies.push(new Firefly());
    }
  }
}

// draw function
function draw() {
  generateFireflies();

  for (let i = 0; i < fireflies.length; i++) {
    fireflies[i].move();
    fireflies[i].show();

    // remove fireflies that go beyond canvas boundaries
    if (fireflies[i].x < 0 || fireflies[i].x > w || fireflies[i].y < 0 || fireflies[i].y > h) {
      fireflies.splice(i, 1);
    }
  }
}

function initCanvas() {
  ctx.fillStyle = "rgba(30,30,30,1)";
  ctx.fillRect(0, 0, w, h);
}

window.addEventListener("resize", function() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  initCanvas();
});

function loop() {
  window.requestAnimationFrame(loop);
  ctx.clearRect(0, 0, w, h);
  draw();
}

initCanvas();
loop();
