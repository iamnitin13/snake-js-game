const grid = document.querySelector(".grid-cells");
const myScore = document.querySelector("#my-score");
const startBtn = document.querySelector(".start-btn");
const highestScore = JSON.parse(localStorage.getItem("highScore")) || 0;

let currentSnake = [2, 1, 0];
let direction = 1;
let intervalTime = 200;
let interval = 0;
const width = 20;
let gameStarted = false;

for (let row = 0; row < width * width; row++) {
  const gridCell = document.createElement("div");
  gridCell.classList.add("cell");
  grid.appendChild(gridCell);
}

const cells = document.querySelectorAll(".grid-cells div");

// on document load create the board
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll("#higest-score b").innerHTML = highestScore;
  createBoard();
});

function createBoard() {
  cells[currentSnake[0]].innerHTML = "👀";
  currentSnake.forEach((i) => {
    cells[i].classList.add("snake");
  });
  foodPosition();
  clearInterval(interval);
  direction = 1;
}

function startGame() {
  interval = setInterval(gameLoop, intervalTime);
  startBtn.setAttribute("disabled", true);
  startBtn.style.pointerEvents = "none";
  gameStarted = true;
}

function gameLoop() {
  // remove tail and eye from head position
  cells[currentSnake[0]].innerText = "";
  const tail = currentSnake.pop();
  cells[tail].classList.remove("snake");
  currentSnake.unshift(currentSnake[0] + direction);
  // add eyes and change snake head position color
  cells[currentSnake[0]].classList.add("snake");
  cells[currentSnake[0]].innerText = "👀";
}

function foodPosition() {
  const randomPosition = getRandomValue(cells);
  cells[randomPosition].innerHTML = "🐸";
}

function getRandomValue(arr) {
  return Math.floor(Math.random() * arr.length);
}

function moveSnake(moves) {
  switch (moves) {
    case "ArrowRight":
      direction = 1;
      break;
    case "ArrowLeft":
      direction = -1;
      break;
    case "ArrowDown":
      direction = width;
      break;
    case "ArrowUp":
      direction = -width;
      break;
    default:
      break;
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
