"use strict";

class Block {
    constructor(x, y, sx, sy, w, h, value, img) {
        this.x = x;
        this.sx = sx;
        this.y = y;
        this.sy = sy;
        this.w = w;
        this.h = h;
        this.value = value;
        this.img = img;
    }

    draw() {
        if (this.value) {
            ctx.drawImage(
                img,
                this.sx * img.width / width,
                this.sy * img.height / height,
                this.w * img.width / width,
                this.h * img.height / height,
                this.x,
                this.y,
                this.w,
                this.h
            );
        }
    }

    collidePoint(x, y) {
        return (
            x > this.x &&
            x < this.x + this.w &&
            y > this.y &&
            y < this.y + this.h
        );
    }

    sendTo(position) {
        moving++;
        var pos = {
            x: position.x,
            y: position.y,
        }
        var vel = {
            x: (this.x - pos.x) / 10,
            y: (this.y - pos.y) / 10,
        }
        var self = this;
        var n = 0;
        var movement = () => {
            drawAll();
            self.x -= vel.x;
            self.y -= vel.y;
            if (n >= 10) {
                self.x = pos.x;
                self.y = pos.y;
                moving--;
            }
            else {
                setTimeout(movement, 15);
                n++;
            }
        };
        setTimeout(movement, 15);
    }
}

function shuffle(array) {
    for (var i = 0; i < array.length; ++i) {
        var newI = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[newI];
        array[newI] = temp;
    }
}

function isValidNeighbor(ind1, ind2) {
    var pos1 = toNested(ind1);
    var pos2 = toNested(ind2);
    var dist1 = Math.abs(pos1[0] - pos2[0]);
    var dist2 = Math.abs(pos1[1] - pos2[1]);

    if (dist1 + dist2 == 1) {
        return true;
    }
    return false;
}

function toNested(index) {
    return [ index % boardSize, Math.floor(index / boardSize) ];
}

function findZero() {
    for (var i = 0; i < board.length; ++i) {
        if (board[i].value === 0) {
            return i;
        }
    }
}

function win() {
    if (!moving) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#000";
        ctx.font = "50px Georgia";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`You won!`, width / 2, height / 2);
        
        setTimeout(() => {
            location.reload();
        }, 2500);
    }
    else {
        setTimeout(win, 150);
    }
}

function drawAll() {
    ctx.clearRect(0, 0, width, height);
    board.forEach(block => {
        block.draw();
    });
}

function update() {
    drawAll();

    if (checkWin()) {
        setTimeout(() => {
            canvas.removeEventListener("click", handleClick);
            setTimeout(win, 1000);
        }, 200);
    }
}

function checkWin() {
    var noZ = board.slice(0);
    noZ.splice(findZero(), 1);

    for (var i = 1; i < noZ.length; ++i) {
        if (noZ[i].value < noZ[i - 1].value) {
            return false;
        }
    }
    return true;
}

var img = new Image();
img.src = "./zdjecia/ukladanka.jpg";
const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");
//img.width = window.width * .9;
//img.height = img.width / img.naturalWidth * img.height;
canvas.width = Math.min(501, window.innerWidth * 0.9);
canvas.height = Math.min(668, canvas.width * 4 /3);
const width = canvas.width;
const height = canvas.height;
var boardSize;
var board;
var moving;

function init() {
    moving = 0;
    boardSize = parseInt(document.getElementById("size").value);

    if (boardSize < 2 || boardSize > 5 || isNaN(boardSize)) {
        boardSize = 4;
    }

    board = Array.from(Array(boardSize ** 2).keys());
    shuffle(board);

    for (var i = 0; i < board.length; i++) {
        var pos = toNested(i);
        var spos = toNested(board[i]);
        var w = width / boardSize;
        var h = height / boardSize;
        board[i] = new Block(pos[0] * w, pos[1] * h, spos[0] * w, spos[1] * h, w, h, board[i], img);
    }

    update();
}

function handleClick(e) {
    if (!moving) {
        var rect = canvas.getBoundingClientRect();
        for (var i = 0; i < board.length; ++i) {
            if (board[i].collidePoint(e.clientX - rect.x, e.clientY - rect.y)) {
                var zIndex = findZero();
                if (isValidNeighbor(i, zIndex)) {
                    var tempPos = {
                        x: board[i].x,
                        y: board[i].y,
                    };
                    board[i].sendTo(board[zIndex]);
                    board[zIndex].sendTo(tempPos);
                    var temp = board[i];
                    board[i] = board[zIndex];
                    board[zIndex] = temp;
                }
                break;
            }
        }
        update();
    }
}

canvas.addEventListener("click", handleClick);

document.getElementById("reset").onclick = init;
init();