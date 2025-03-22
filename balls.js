// This makes the canvas fill up the screen using const because we won't be reassigning the values
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// Constants for ball properties
const MIN_SIZE = 10;
const MAX_SIZE = 20;
const MIN_SPEED = -7;
const MAX_SPEED = 7;

// Function to generate a random number between min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a random non-zero number between min and max
function randomNonZero(min, max) {
  let value = 0;
  while (value === 0) {
    value = random(min, max);
  }
  return value;
}

// Helper function: returns a random rgb() color string
function randomRGB() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

// Class for the balls
class Ball {
  constructor(x, y, velX, velY, color, size) {
    // Telling the ball where to start, how fast to go, what color, and what size
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  // Drawing the ball
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // Update the ball's position and handle bouncing off walls
  update() {
    if (this.x + this.size >= width || this.x - this.size <= 0) {
      this.velX = -this.velX;
    }
    if (this.y + this.size >= height || this.y - this.size <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // Detect collisions with other balls and change color or bounce
  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          // Change color on collision
          ball.color = this.color = randomRGB();

          // Adjust velocities to simulate a bounce
          const tempVelX = this.velX;
          const tempVelY = this.velY;
          this.velX = ball.velX;
          this.velY = ball.velY;
          ball.velX = tempVelX;
          ball.velY = tempVelY;
        }
      }
    }
  }
}

// Array to store the balls
const balls = [];

// Create 25 balls at random positions, ensuring no overlap
while (balls.length < 25) {
  const size = random(MIN_SIZE, MAX_SIZE);
  const ball = new Ball(
    random(size, width - size),
    random(size, height - size),
    randomNonZero(MIN_SPEED, MAX_SPEED),
    randomNonZero(MIN_SPEED, MAX_SPEED),
    randomRGB(),
    size
  );

  // Ensure no overlap with existing balls
  let overlapping = false;
  for (const existingBall of balls) {
    const dx = ball.x - existingBall.x;
    const dy = ball.y - existingBall.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < ball.size + existingBall.size) {
      overlapping = true;
      break;
    }
  }

  if (!overlapping) {
    balls.push(ball);
  }
}

// Animation loop updates and repeats the loop
function loop() {
  // Trailing effect
  ctx.fillStyle = "rgb(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  // Iterate over all balls and run their methods
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  // Request the next animation frame
  requestAnimationFrame(loop);
}

// Start the animation loop
loop();