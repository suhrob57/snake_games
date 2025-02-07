const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const resetButton = document.getElementById("resetButton");
const pauseButton = document.getElementById("pauseButton");

// Mobil tugmalar
const upButton = document.getElementById("upButton");
const downButton = document.getElementById("downButton");
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake, direction, food, score, gameInterval, lastDirection, isPaused = false;
let gameOver = false;

function initializeGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "RIGHT";
    lastDirection = "RIGHT";
    food = generateFood();
    score = 0;
    resetButton.style.display = "none";
    isPaused = false;
    gameOver = false;
    pauseButton.textContent = "Pause";
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, 120);
}

document.addEventListener("keydown", changeDirection);
upButton.addEventListener("click", () => changeDirection({ keyCode: 38 }));
downButton.addEventListener("click", () => changeDirection({ keyCode: 40 }));
leftButton.addEventListener("click", () => changeDirection({ keyCode: 37 }));
rightButton.addEventListener("click", () => changeDirection({ keyCode: 39 }));
pauseButton.addEventListener("click", togglePause);

function changeDirection(event) {
    if (isPaused || gameOver) return;
    const key = event.keyCode;
    if (key === 37 && direction !== "RIGHT") direction = "LEFT";
    else if (key === 38 && direction !== "DOWN") direction = "UP";
    else if (key === 39 && direction !== "LEFT") direction = "RIGHT";
    else if (key === 40 && direction !== "UP") direction = "DOWN";
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box,
    };
}

function drawApple(x, y) {
    let gradient = ctx.createRadialGradient(x + box / 2, y + box / 2, 5, x + box / 2, y + box / 2, box / 2);
    gradient.addColorStop(0, "lightcoral");
    gradient.addColorStop(1, "red");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x + box / 2, y + box / 2, box / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "brown";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x + box / 2, y + box / 4);
    ctx.lineTo(x + box / 2, y);
    ctx.stroke();

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.ellipse(x + box / 2 + 5, y + 3, 6, 4, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
}

function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
}

function drawSnake() {
    for (let i = 0; i < snake.length; i++) {
        let segment = snake[i];
        ctx.fillStyle = i === 0 ? "limegreen" : "green";
        ctx.beginPath();
        ctx.arc(segment.x + box / 2, segment.y + box / 2, box / 2, 0, Math.PI * 2);
        ctx.fill();

        if (i === 0) {
            ctx.fillStyle = "white";
            let eyeOffsetX = 5, eyeOffsetY = 5;

            if (direction === "LEFT") eyeOffsetX = -5;
            if (direction === "UP") eyeOffsetY = -5;
            if (direction === "DOWN") eyeOffsetY = 5;
            if (direction === "RIGHT") eyeOffsetX = 5;

            ctx.beginPath();
            ctx.arc(segment.x + box / 2 + eyeOffsetX, segment.y + box / 3 + eyeOffsetY, 3, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.arc(segment.x + box / 2 + eyeOffsetX, segment.y + (2 * box) / 3 + eyeOffsetY, 3, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function draw() {
    if (isPaused || gameOver) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawApple(food.x, food.y);
    drawSnake();

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === "LEFT") snakeX -= box;
    if (direction === "UP") snakeY -= box;
    if (direction === "RIGHT") snakeX += box;
    if (direction === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        food = generateFood();
    } else {
        snake.pop();
    }

    const newHead = { x: snakeX, y: snakeY };

    if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y) ||
        snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height) {
        clearInterval(gameInterval);
        resetButton.style.display = "block";
        gameOver = true;
        drawGameOver();
        return;
    }

    snake.unshift(newHead);
    lastDirection = direction;
}

function togglePause() {
    if (gameOver) return;
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "Resume" : "Pause";
}

function resetGame() {
    initializeGame();
}

initializeGame();
