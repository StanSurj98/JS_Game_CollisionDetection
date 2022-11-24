/** @type {HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 500;
canvas.height = 700;
// For "offsetting" the canvas position with our click event below
let canvasPosition = canvas.getBoundingClientRect(); // returns object with measurements
console.log("Canvas Position: ", canvasPosition);

// To hold all of our explosion objects upon collision
const explosions = [];

class Explosion {
  constructor(x, y) {
    // Dimension of each frame
    this.spriteWidth = 200;
    this.spriteHeight = 178;
    // Scale it on canvas
    this.width = this.spriteWidth * 0.7;
    this.height = this.spriteHeight * 0.7;
    // Multiplication is more performant in JS, so instead of x / 2 => x * 0.5

    // It makes sense to offset for centering INSIDE class since we have access to size
    this.x = x - this.width * 0.5; // again, for centering offset by half its dimensions
    this.y = y - this.height * 0.5;

    // Sprite Img Source
    this.image = new Image();
    this.image.src = "./images/boom.png";

    // Animation frames
    this.frame = 0;
    this.timer = 0;
  }
  update() {
    this.timer++;
    // For every x frames, only THEN animate the next frame - slowing it down
    if(this.timer % 7 === 0) {
      this.frame ++;
    }
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
      this.height
    );
  }
}

// ---- Add events to call the cloud animation now
window.addEventListener("click", function (e) {
  // console.log("Clicked: ", e);
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  // Store our active explosions into the empty array
  explosions.push(new Explosion(positionX, positionY));
});

// ---- Main Animation Sequences
const animate = () => {
  // ---- Always clear old frames at the beginning
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  // ---- Loop thru all active explosions, call its class methods
  for (let i = 0; i < explosions.length; i++) {
    explosions[i].update();
    explosions[i].draw();
    // Here we can check if explosions has run thru its entire animation frames
    if (explosions[i].frame > 5) {
      explosions.splice(i, 1); // we'll delete that particular explosion at that index
      i--; // making sure to move index back by 1 since its neighbour is now gone
    }
  }
  requestAnimationFrame(animate); 
};
animate();
