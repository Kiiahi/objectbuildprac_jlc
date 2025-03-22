const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

const MIN_SIZE = 10;
const MAX_SIZE = 20;
const MIN_SPEED = -7;
const MAX_SPEED = 7;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomNonZero(min, max) {
  let value = 0;
  while (value === 0) {
    value = random(min, max);
  }
  return value;
}

function randomRGB() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

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

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
          ball.color = this.color = randomRGB();

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

const balls = [];

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

function loop() {
  ctx.fillStyle = "rgb(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }

  requestAnimationFrame(loop);
}

loop();