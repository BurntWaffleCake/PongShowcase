"use strict";
const src = document.getElementById("source");
if (!src)
    throw "Source Not Found";
const ctx = src.getContext("2d");
if (!ctx)
    throw "Source Canvas Context Not Found";
// Config
const initSpeed = 200;
const roundPauseTime = 5000;
const gravity = 500;
const defaultPaddleHeight = 200;
const longPaddleHeight = 275;
const shortPaddleHeight = 100;
// Class Declarations
class Ball {
    constructor(radius = 50, color = "rgb(255,0,0)") {
        this.color = color;
        this.radius = radius;
        this.x = 0;
        this.y = 0;
        this.velX = -300;
        this.velY = 300;
        this.accX = 0;
        this.accY = 0;
    }
    render(ctx, dt, t) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }
    tick(ctx, dt, t) {
        dt = dt / 1000;
        this.velX = this.velX + this.accX * dt;
        this.velY = this.velY + this.accY * dt;
        this.x = this.x + this.velX * dt + 0.5 * this.accX * dt ** 2;
        this.y = this.y + this.velY * dt + 0.5 * this.accY * dt ** 2;
        this.checkBounds(ctx);
        this.checkLeft(ctx, playerA);
        this.checkRight(ctx, playerB);
    }
    checkBounds(ctx) {
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velY = -this.velY;
        }
        if (this.y + this.radius > ctx.canvas.height) {
            this.y = ctx.canvas.height - this.radius;
            this.velY = -this.velY;
        }
    }
    checkRight(ctx, paddle) {
        const xLowerBound = paddle.x - paddle.width / 2 - this.radius;
        const xUpperBound = paddle.x + paddle.width / 2 - this.radius;
        const yLowerBound = paddle.y - paddle.height / 2 + this.radius / 2;
        const yUpperBound = paddle.y + paddle.height / 2 + this.radius / 2;
        if (this.x > xLowerBound && this.x < xUpperBound && this.y >= yLowerBound && this.y <= yUpperBound) {
            this.velX = -1 * Math.abs(this.velX);
            this.x = paddle.x - paddle.width / 2 - this.radius;
        }
    }
    checkLeft(ctx, paddle) {
        const xLowerBound = paddle.x - paddle.width / 2 + this.radius;
        const xUpperBound = paddle.x + paddle.width / 2 + this.radius;
        const yLowerBound = paddle.y - paddle.height / 2 + this.radius / 2;
        const yUpperBound = paddle.y + paddle.height / 2 + this.radius / 2;
        if (this.x > xLowerBound && this.x < xUpperBound && this.y >= yLowerBound && this.y <= yUpperBound) {
            this.velX = Math.abs(this.velX);
            this.x = paddle.x + paddle.width / 2 + this.radius;
        }
    }
}
class Paddle {
    constructor(width = 20, height = defaultPaddleHeight, speed = 750, color = "rgb(255,255,255)") {
        this.x = 0;
        this.y = 0;
        this.height = height;
        this.width = width;
        this.speed = speed;
        this.color = color;
    }
    moveUp(dt) {
        if (!ctx)
            return;
        this.y -= (this.speed * dt) / 1000;
        if (this.y - this.height / 2 < 0) {
            this.y = this.height / 2;
        }
    }
    moveDown(dt) {
        if (!ctx)
            return;
        this.y += (this.speed * dt) / 1000;
        if (this.y + this.height / 2 > ctx.canvas.height) {
            this.y = ctx.canvas.height - this.height / 2;
        }
    }
    render(ctx, dt, t) {
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.restore();
    }
}
// States
var wkeydown = false;
var skeydown = false;
var arrowupkeydown = false;
var arrowdownkeydown = false;
var playerAScore = 0;
var playerBScore = 0;
var paused = true;
var timePassed = 0;
// Input
window.addEventListener("keydown", (ev) => {
    if (ev.key == "w") {
        wkeydown = true;
    }
    else if (ev.key == "s") {
        skeydown = true;
    }
    else if (ev.key == "ArrowUp") {
        arrowupkeydown = true;
    }
    else if (ev.key == "ArrowDown") {
        arrowdownkeydown = true;
    }
});
window.addEventListener("keyup", (ev) => {
    if (ev.key == "w") {
        wkeydown = false;
    }
    else if (ev.key == "s") {
        skeydown = false;
    }
    else if (ev.key == "ArrowUp") {
        arrowupkeydown = false;
    }
    else if (ev.key == "ArrowDown") {
        arrowdownkeydown = false;
    }
});
const plusOrMinus = () => {
    return Math.random() < 0.5 ? -1 : 1;
};
var countDown = 0;
function start() {
    setTimeout(() => {
        paused = false;
        ball.velX = plusOrMinus() * initSpeed;
        ball.velY = plusOrMinus() * initSpeed;
    }, roundPauseTime);
    console.log("starting");
    countDown = 5;
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            countDown = 5 - i;
        }, i * 1000);
    }
}
function reset(ctx) {
    paused = true;
    timePassed = 0;
    playerA.x = inset;
    playerB.x = ctx.canvas.width - inset;
    playerA.y = ctx.canvas.height / 2;
    playerB.y = ctx.canvas.height / 2;
    ball.x = ctx.canvas.width / 2;
    ball.y = ctx.canvas.height / 2;
    ball.velX = 0;
    ball.velY = 0;
    start();
}
// Calculation Step
function calculate(ctx, dt, t) {
    if (paused)
        return;
    timePassed += dt;
    if (wkeydown && !skeydown) {
        playerA.moveUp(dt);
    }
    else if (skeydown) {
        playerA.moveDown(dt);
    }
    if (arrowupkeydown && !arrowdownkeydown) {
        playerB.moveUp(dt);
    }
    else if (arrowdownkeydown) {
        playerB.moveDown(dt);
    }
    let mag = Math.sqrt(ball.velX ** 2 + ball.velY ** 2);
    ball.velX += ((ball.velX / mag) * Math.pow(timePassed, 0.6)) / 1000;
    ball.velY += ((ball.velY / mag) * Math.pow(timePassed, 0.6)) / 1000;
    ball.tick(ctx, dt, t);
    if (ball.x + ball.radius >= ctx.canvas.width) {
        playerAScore += 1;
        reset(ctx);
    }
    else if (ball.x - ball.radius <= 0) {
        playerBScore += 1;
        reset(ctx);
    }
}
// Render Step
function clearCanvas(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
function drawCountDown(ctx, number) {
    ctx.save();
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.strokeStyle = "rgb(0,0,0)";
    ctx.lineWidth = 8;
    ctx.strokeText(String(number), ctx.canvas.width / 2, ctx.canvas.height / 2 - 150);
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.fillText(String(number), ctx.canvas.width / 2, ctx.canvas.height / 2 - 150);
    ctx.restore();
}
function drawBoundary(ctx) {
    ctx.save();
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.setLineDash([5, 15]);
    ctx.moveTo(ctx.canvas.width / 2, 0);
    ctx.lineTo(ctx.canvas.width / 2, ctx.canvas.height);
    ctx.stroke();
    ctx.restore();
}
function drawScore(ctx) {
    ctx.save();
    ctx.font = "50px Arial";
    ctx.fillStyle = "rgb(255,255,255)";
    ctx.textAlign = "right";
    ctx.fillText(String(playerAScore), ctx.canvas.width / 2 - 40, 50);
    ctx.textAlign = "left";
    ctx.fillText(String(playerBScore), ctx.canvas.width / 2 + 40, 50);
    ctx.restore();
}
function render(ctx, dt, t) {
    if (!ctx)
        return;
    clearCanvas(ctx);
    drawBoundary(ctx);
    drawScore(ctx);
    if (countDown > 0) {
        drawCountDown(ctx, countDown);
    }
    playerA.render(ctx, dt, t);
    playerB.render(ctx, dt, t);
    ball.render(ctx, dt, t);
}
// Called Every Frame
var previousTime = 0; // milliseconds
function loop(time) {
    if (!ctx)
        return;
    console.log("running");
    const dt = time - previousTime;
    const dt_seconds = dt / 1000;
    const fps = 1 / dt_seconds;
    calculate(ctx, dt, time);
    render(ctx, dt, time);
    previousTime = time;
    window.requestAnimationFrame(loop);
}
// Initialize Game
const playerA = new Paddle(); // left
const playerB = new Paddle(); // right
const ball = new Ball();
const inset = 50;
function init() {
    if (!ctx)
        return;
    console.log("Initializing");
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    if (gravity_mode.checked) {
        ball.accY = gravity;
    }
    else {
        ball.accY = 0;
    }
    if (short_paddle.checked) {
        playerA.height = shortPaddleHeight;
        playerB.height = shortPaddleHeight;
    }
    else {
        playerA.height = defaultPaddleHeight;
        playerB.height = defaultPaddleHeight;
    }
    if (long_paddle.checked) {
        playerA.height = longPaddleHeight;
        playerB.height = longPaddleHeight;
    }
    else {
        playerA.height = defaultPaddleHeight;
        playerB.height = defaultPaddleHeight;
    }
    reset(ctx);
    window.requestAnimationFrame(loop);
}
document.addEventListener("DOMContentLoaded", () => {
    console.log("loaded!");
    init();
});
// Options
const gravity_mode = document.getElementById("gravity_mode");
if (gravity_mode) {
    gravity_mode.addEventListener("input", (event) => {
        if (gravity_mode.checked) {
            ball.accY = gravity;
        }
        else {
            ball.accY = 0;
        }
    });
}
const short_paddle = document.getElementById("short_paddle");
if (short_paddle) {
    short_paddle.addEventListener("input", (event) => {
        if (short_paddle.checked) {
            playerA.height = shortPaddleHeight;
            playerB.height = shortPaddleHeight;
        }
        else {
            playerA.height = defaultPaddleHeight;
            playerB.height = defaultPaddleHeight;
        }
    });
}
const long_paddle = document.getElementById("long_paddle");
if (long_paddle) {
    long_paddle.addEventListener("input", (event) => {
        if (long_paddle.checked) {
            playerA.height = longPaddleHeight;
            playerB.height = longPaddleHeight;
        }
        else {
            playerA.height = defaultPaddleHeight;
            playerB.height = defaultPaddleHeight;
        }
    });
}
