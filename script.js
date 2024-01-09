const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")


let gameOver = false;
let appleX, appleY;
let snakeX = 5, snakeY = 10;
let snakeBody = []
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;

// Getting a high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeApplePosition = () => {
    appleX = Math.floor(Math.random() * 30) + 1;
    appleY = Math.floor(Math.random() * 30) + 1;
}

const changeDirection = (e) => {
    console.log(e);
    // Changing direction of the snake while making sure the player cannot switch to the opposite direction
    if (e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
    initGame();
}

controls.forEach(key => {
    // Calling changeDirection on each key click and passing key dataset value as an object
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
})

// If gameOver, the player is prompted to refresh the page to restart
const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay.");
    location.reload();
}

const initGame = () => {
    if(gameOver) return handleGameOver();

    let htmlMarkup = `<div class="apple" style="grid-area: ${appleY} / ${appleX}"></div>`;

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Shifting forward the values of the elements in the snake body one by one
        // "Moving the body of the snake" (except its head which is already moving)
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    // Updating snake position after movement input
    snakeX += velocityX;
    snakeY += velocityY;

    // Checking if snake's head is within borders
    // If snake's head hits any border, gameOver becomes true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Changing apple position after snake eats it, and elongating snake body
    if(snakeX === appleX && snakeY === appleY) {
        changeApplePosition();
        snakeBody.push([appleX, appleY]);

        // Increment score by one when snake eats an apple
        score++;
        scoreElement.innerText = `Score: ${score}`;

        // Updating score on the board and high score if needed
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;

        // gameOver if the head touches the body
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    playBoard.innerHTML = htmlMarkup;
}


changeApplePosition();
// Speed of snake
setIntervalId = setInterval(initGame, 125);
document.addEventListener("keydown", changeDirection);