import Block from "./Block.js";

class Game {
  constructor(stageWidth, backgroundColor, blockColors, fps) {
    this.canvas = document.createElement("canvas");
    document.body.appendChild(this.canvas);
    this.canvas.style.backgroundColor = backgroundColor;
    this.ctx = this.canvas.getContext("2d");
    this.fps = fps;
    this.stageWidth = stageWidth;
    this.stageHeight =
      window.innerHeight / (window.innerWidth / this.stageWidth);
    this.size = this.canvas.clientWidth / this.stageWidth;
    this.blockColors = blockColors;
    this.snakeHead = new Block(
      this.randomPos(this.stageWidth),
      this.randomPos(this.stageHeight),
      this.size,
      this.blockColors.head
    );
    this.food = new Block(
      this.randomPos(this.stageWidth),
      this.randomPos(this.stageHeight),
      this.size,
      this.blockColors.food
    );
    this.snakeTails = [];
    this.velocityX = 0;
    this.velocityY = 0;
    this.tailLength = 0;
    this.score = 0;
    this.isStart = false;
    this.isVimMode = false;

    window.addEventListener("resize", this.resize.bind(this));

    if (this.isVimMode) {
      window.addEventListener("keydown", this.keyDownVim.bind(this));
    } else {
      window.addEventListener("keydown", this.keyDown.bind(this));
    }

    setInterval(this.animate.bind(this), 1000 / this.fps);
    this.resize();
  }

  keyDown(e) {
    if (
      e.keyCode === 37 ||
      e.keyCode === 38 ||
      e.keyCode === 39 ||
      e.keyCode === 40
    ) {
      this.isStart = true;
    }

    if (e.keyCode === 37 && this.velocityX !== 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    } else if (e.keyCode === 38 && this.velocityY !== 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    } else if (e.keyCode === 39 && this.velocityX !== -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    } else if (e.keyCode === 40 && this.velocityY !== -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    } else {
      e.preventDefault();
    }
  }

  keyDownVim(e) {
    if (
      e.keyCode === 72 ||
      e.keyCode === 75 ||
      e.keyCode === 76 ||
      e.keyCode === 74
    ) {
      this.isStart = true;
    }

    if (e.keyCode === 72 && this.velocityX !== 1) {
      this.velocityX = -1;
      this.velocityY = 0;
    } else if (e.keyCode === 75 && this.velocityY !== 1) {
      this.velocityX = 0;
      this.velocityY = -1;
    } else if (e.keyCode === 76 && this.velocityX !== -1) {
      this.velocityX = 1;
      this.velocityY = 0;
    } else if (e.keyCode === 74 && this.velocityY !== -1) {
      this.velocityX = 0;
      this.velocityY = 1;
    }
  }

  move() {
    this.snakeHead.x += this.velocityX;
    this.snakeHead.y += this.velocityY;
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.stageHeight =
      window.innerHeight / (this.canvas.width / this.stageWidth);
    this.size = window.innerWidth / this.stageWidth;
    this.snakeHead.size = this.size;
    this.snakeHead.width = this.size;
    this.snakeHead.height = this.size;

    this.food.size = this.size;
    this.food.width = this.size;
    this.food.height = this.size;

    for (let i = 0; i < this.snakeTails.length; i++) {
      this.snakeTails[i].size = this.size;
      this.snakeTails[i].width = this.size;
      this.snakeTails[i].height = this.size;
    }
  }

  randomPos(pos) {
    return Math.floor(Math.random() * pos - 1) + 1;
  }

  moveFood() {
    this.food.x = this.randomPos(this.stageWidth);
    this.food.y = this.randomPos(this.stageHeight);
  }

  resetSnake() {
    this.snakeTails = [];
    this.tailLength = 0;
    this.velocityX = 0;
    this.velocityY = 0;
    this.snakeHead.x = this.randomPos(this.stageWidth);
    this.snakeHead.y = this.randomPos(this.stageHeight);
  }

  eatChecker() {
    if (this.snakeHead.x === this.food.x && this.snakeHead.y === this.food.y) {
      this.moveFood();
      this.tailLength++;
      this.score++;
    }
  }

  dieChecker() {
    if (this.snakeHead.x < 0) {
      //this.snakeHead.x = this.stageWidth;
      this.restart();
      alert(`score : ${this.score}`);
    } else if (this.snakeHead.x > this.stageWidth) {
      //this.snakeHead.x = -1;
      this.restart();
      alert(`score : ${this.score}`);
    } else if (this.snakeHead.y < 0) {
      //this.snakeHead.y = this.stageHeight;
      this.restart();
      alert(`score : ${this.score}`);
    } else if (this.snakeHead.y > this.stageHeight) {
      //this.snakeHead.y = -1;
      this.restart();
      alert(`score : ${this.score}`);
    }
  }

  tailTouchChecker() {
    for (let i = 0; i < this.snakeTails.length; i++) {
      if (
        this.snakeHead.x === this.snakeTails[i].x &&
        this.snakeHead.y === this.snakeTails[i].y
      ) {
        alert(`score : ${this.score}`);
        this.restart();
      }
    }
  }

  createTail() {
    if (this.snakeTails.length > this.tailLength) {
      this.snakeTails.shift();
    }
    if (this.isStart) {
      this.snakeTails.push(
        new Block(
          this.snakeHead.x,
          this.snakeHead.y,
          this.size,
          this.blockColors.tail
        )
      );
    }
    for (let i = 0; i < this.snakeTails.length; i++) {
      this.snakeTails[i].draw(this.ctx);
    }
  }

  restart() {
    this.moveFood();
    this.resetSnake();
    this.isStart = false;
    this.score = 0;
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);
    this.food.draw(this.ctx);
    this.createTail();
    this.snakeHead.draw(this.ctx);
    this.dieChecker();
    this.move();
    this.eatChecker();
    this.tailTouchChecker();
  }
}

window.onload = () => {
  let stageWidth = 40;
  let backgroundColor = "black";
  let blockColors = {
    head: "yellow",
    food: "red",
    tail: "lime",
  };
  let fps = 8;

  new Game(stageWidth, backgroundColor, blockColors, fps);
};
