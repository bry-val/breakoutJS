// DEFINE A CANVAS BY THE HTML ID OF CANVAS ELEMENT
const canvas = document.getElementById("myCanvas");
const gameOverText = document.getElementById("gameOverlay");

// creates a "CanvasRenderingContext2D" object represnting a 2d rendering context 
const ctx = canvas.getContext("2d");

// DRAW SHAPE CODE BELOW

// ctx.beginPath();
// ctx.rect(20, 40, 100, 100);
// ctx.fillStyle = "#FF0000";
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 60, 0, Math.PI * 2);
// ctx.strokeStyle = "rgba(0, 0, 255, 1)";
// ctx.stroke();
// ctx.closePath();

// starting position of ball
let x = canvas.width /2;
let y = canvas.height - 30;

// speed variables
let dx = 2;
let dy = -2;

let ballRadius = 10;

// size of paddle
const paddleHeight = 10;
const paddleWidth = 75;

// paddle starting position center of canvas
let paddleX = (canvas.width - paddleWidth) / 2;

// input initializing booleans
let rightPressed = false;
let leftPressed = false; 

// BRICK CONSTANTS
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

// score tracking
let score = 1;

// lives counter
let lives = 3;

// brick matrix
const bricks = [];
for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//color array
// color changer
const colorArray = [
    "#FF5733",
    "#270071",
    "#425140",
    "#822549",
    "#27BBEE",
    "#9B078B",
]
var random = 0;


function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill()
                ctx.closePath();
            }
        }
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    // ctx.fillStyle = ;
    ctx.fillStyle = colorArray[random];
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function movePaddle() {
    if (rightPressed) {
        paddleX = Math.min(paddleX + 5, canvas.width - paddleWidth);
    } else if (leftPressed) {
        paddleX = Math.max(paddleX - 5, 0);
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 8, 20); 
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Lives: ${lives}`, canvas.width - 65, 20); 
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    drawBricks();
    drawBall();
    if (x + dx < ballRadius || x + dx > (canvas.width - ballRadius)) {
        dx = -dx;
    }
    
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > (canvas.height - ballRadius)) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                document.location.reload();
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }
    }

    movePaddle();

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

// input event listener
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMouseHandler, false);

function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
    }
}
function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
    }
}
function mouseMouseHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 +  (paddleWidth / 2 ) && relativeX < canvas.width - (paddleWidth / 2)) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];

            if (b.status === 1) {
            if (
                x > b.x - ballRadius && 
                x < b.x + brickWidth + ballRadius && 
                y > b.y && 
                y < b.y + brickHeight
            ) {
                dy = -dy;
                b.status = 0;
                score+= Math.floor(score ** 1.01);
                random = (Math.floor(Math.random() * colorArray.length))
                if (score >= 45548) {
                    alert(`You win. Your score was ${score}`);
                    document.location.reload();
                }
                }
            }
        }
    }
}

draw();