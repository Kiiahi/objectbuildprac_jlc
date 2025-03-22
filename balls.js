//This makes the canvas fill up the screen Using const because we wont be reassigning the values
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");


const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

//naming a function to make random number btwn min and max
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function: returns a random rgb() color string
function randomRGB() {
    return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
  }
// making a class for the balls
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

  //  Drawing the ball
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    //  actually making a circle in the ball
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  // The Office scene where they wait for the ball to hit the corners . not using if else becasue they are all happenidng at the same time
  update() {
    // "bouncing" off the walls
    if ((this.x + this.size) >= width) {
      this.velX = -this.velX;
    }
    if ((this.x - this.size) <= 0) {
      this.velX = -this.velX;
    }
   
    if ((this.y + this.size) >= height) {
      this.velY = -this.velY;
    }
    if ((this.y - this.size) <= 0) {
      this.velY = -this.velY;
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  // This part is about the changing colors when the balls collide
  collisionDetect() {
    for (const ball of balls) {
   
      if (this !== ball) {
        // IDstance using pythagorean theorum.  dx and dy are the distances between the two balls on the x and y axes
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
       
       
        if (distance < this.size + ball.size) {
          // New color at random when they hit each other but not itself
          ball.color = this.color = randomRGB();
        }
      }
    }
  }
}

// array to store the ball
const balls = [];

// array w\ 25 balls, at random
while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(

    random(size, width - size),
    random(size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),  
    size          
  );
  balls.push(ball);
}

// Animation loop updates and repeats the loop
function loop() {
  // trailing effect
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);

  // Iterate over all balls and run their methods
  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }
 
  // animation
  requestAnimationFrame(loop);
}

//  tells js o start animation loop
loop();