const grid = document.querySelector(".grid-cells");
const myScore = document.querySelector("#my-score > b");
const highScore = document.querySelector("#highest-score > b");
const startBtn = document.querySelector(".start-btn");

let currentSnake = [2, 1, 0];
let direction = 1;
let intervalTime = 200;
let interval = 0;
let prevFoodPos = -1;
const width = 20;
let gameStarted = false;
let numCells = width * width;
let score = 0;
let topScore = JSON.parse(localStorage.getItem("highScore")) || 0;

for (let row = 0; row < numCells; row++) {
  const gridCell = document.createElement("div");
  gridCell.classList.add("cell");
  grid.appendChild(gridCell);
}

const cells = document.querySelectorAll(".grid-cells div");

// on document load create the board
document.addEventListener("DOMContentLoaded", function () {
  gameBoardSetup();
});

function gameBoardSetup() {
  currentSnake = [2, 1, 0];
  score = 0;
  currentSnake.forEach((i) => cells[i].classList.add("snake"));
  setFoodPosition();
  clearInterval(interval);
  direction = 1;
  gameStarted = false;
  myScore.textContent = score;
  highScore.textContent = topScore;
}

function startGame() {
  interval = setInterval(gameLoop, intervalTime);
  startBtn.setAttribute("disabled", true);
  startBtn.style.pointerEvents = "none";
  gameStarted = true;
}

function gameLoop() {
  if (detectCollison()) return;
  const tail = currentSnake.pop();
  cells[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  detectFoodEaten(tail);
  cells[currentSnake[0]].classList.add("snake");
}

function detectCollison() {
  if (
    (currentSnake[0] + width >= numCells && direction === width) || // hits bottom wall
    (currentSnake[0] % width === width - 1 && direction === 1) || // hits right wall
    (currentSnake[0] % width === 0 && direction === -1) || // hits left wall
    (currentSnake[0] - width < 0 && direction === -width) || // hits the top wall
    cells[currentSnake[0] + direction].classList.contains("snake") // hits itself
  ) {
    clearInterval(interval);
    setTimeout(() => reset(), 100);
    return true;
  }
}

function detectFoodEaten(tail) {
  if (cells[currentSnake[0]].classList.contains("food-item")) {
    cells[currentSnake[0]].classList.remove("food-item");
    cells[tail].classList.add("snake");
    currentSnake.push(tail);
    score++;
    myScore.textContent = score;
    if (score > +highScore.textContent) {
      highScore.textContent = score;
    }
    cells[prevFoodPos].textContent = "";
    clearInterval(interval);
    intervalTime -= 10;
    interval = setInterval(gameLoop, Math.max(intervalTime, 50));
    setFoodPosition();
  }
}

function reset() {
  const myscore = +myScore.textContent;
  alert(`Your Score is : ${myscore}`);
  startBtn.style.pointerEvents = "auto";
  startBtn.removeAttribute("disabled");
  cells[prevFoodPos].textContent = "";
  currentSnake.forEach((i) => cells[i].classList.remove("snake"));
  topScore = Math.max(myscore, topScore);
  localStorage.setItem("highScore", topScore);
  gameBoardSetup();
}

async function setFoodPosition() {
  const randomPosition = Math.floor(Math.random() * numCells);
  if (currentSnake.includes(randomPosition)) {
    await wait(100);
    setFoodPosition();
  } else {
    prevFoodPos = randomPosition;
    cells[randomPosition].textContent = "🐸";
    cells[randomPosition].classList.add("food-item");
  }
}

function wait(ms = 0) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function moveSnake(moveDirection) {
  let directionVal;
  if (moveDirection === "ArrowRight" && direction !== -1) {
    directionVal = 1;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowLeft" && direction !== 1) {
    directionVal = -1;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowUp" && direction !== width) {
    directionVal = -width;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
  if (moveDirection === "ArrowDown" && direction !== -width) {
    directionVal = width;
    if (currentSnake[0] + directionVal === currentSnake[1]) return;
    direction = directionVal;
  }
}

document.addEventListener("keydown", function (event) {
  if (
    !["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.key) ||
    !gameStarted
  ) {
    event.stopPropagation();
    return;
  }
  moveSnake(event.key);
});
