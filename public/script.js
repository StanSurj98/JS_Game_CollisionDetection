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

    // We moved offset logic below in .drawImage() because of rotating the animation
    this.x = x;
    this.y = y;

    // Sprite Img Source
    this.image = new Image();
    this.image.src = "./images/boom.png";

    // Animation frames
    this.frame = 0;
    this.timer = 0;
    // For Rotating Animation
    this.angle = Math.random() * 6.2; // Roughly the Radian of a circle 360deg

    // Sounds
    this.sound = new Audio();
    this.sound.src = "./sounds/boom.wav"
  }
  update() {
    // Play sounds only once
    if (this.frame === 0) {
      this.sound.play();
    }
    this.timer++;
    // For every x frames, only THEN animate the next frame - slowing it down
    if(this.timer % 7 === 0) {
      this.frame ++;
    }
  }
  draw() {
    // Next, what if we want to make each cloud rotate randomly as we make explosions?
    ctx.save(); // saves the translate rotation of 1 image draw 
    ctx.translate(this.x, this.y); // this affects the destination x, y below in .drawImage()
    ctx.rotate(this.angle);
    ctx.drawImage(
      this.image,
      this.spriteWidth * this.frame, // Single Frame, remember this is where we CROP
      0, // Since we only have 1 row in this sprite sheet, always at 0
      this.spriteWidth, // "cropping UNTIL" sprite's dimensions
      this.spriteHeight,
      0 - this.width / 2, // "draw STARTING AT" 0, 0 (still this.x, this.y because of ctx.translate(this.x, this.y))
      0 - this.height / 2, // but offset by half its dimensions so it's centered on click
      this.width, // "UNTIL" canvas dimensions (in this case, scaled to art)
      this.height
    );
    ctx.restore(); // and again, making sure we come back to the base rotation on next call
  }
}

// ---- Main Explosion Function
const createExplosion = (e) => {
  // console.log("Clicked: ", e);
  let positionX = e.x - canvasPosition.left;
  let positionY = e.y - canvasPosition.top;
  // Store our active explosions into the empty array
  explosions.push(new Explosion(positionX, positionY));
}


// ---- Add events to call new explosion
window.addEventListener("click", function (e) {
  createExplosion(e);
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
