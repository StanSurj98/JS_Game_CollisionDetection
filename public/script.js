/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
ctx.fillStyle = "white";
ctx.fillRect(50, 50, 100, 150);

// To hold all of our explosion objects upon collision
const explosions = [];

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.spriteWidth = 200;
    this.spriteHeight = 178;
    // Scale it on canvas to sprite sheet's frame size
    this.width = this.spriteWidth * 0.5;
    this.height = this.spriteHeight * 0.5;
    // Multiplication is more performant in JS, so instead of x / 2 => x * 0.5
    this.image = new Image();
    this.image.src = "./images/boom.png";

    // Animation frames
    this.frame = 0;
  }
  update() {
    this.frame++;
  }
  draw() {
    // ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame, // Single Frame, remember this is where we CROP
      0, // Since we only have 1 row in this sprite sheet, always at 0
      this.spriteWidth, // "cropping UNTIL" sprite's dimensions
      this.spriteHeight,
      this.x, // "draw STARTING AT" x, y coords
      this.y,
      this.width, // "UNTIL" canvas dimensions (in this case, scaled to art)
      this.height,
    );
  }
}


// We will add events to call the cloud animation now
window.addEventListener("click", function(e) {
  console.log("Clicked: ", e);
  ctx.fillStyle = 'white';
  ctx.fillRect(e.x, e.y, 50, 50);
})