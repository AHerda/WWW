const PUZZLE_DIFFICULTY = 3;
const PUZZLE_HOVER_TINT = "#000000";

var _canvas;
var _stage;

var _img = new Image();
_img.src = "ukladanka.jpg";

var _pieces;
var _puzzleWidth;
var _puzzleHeight;
var _pieceWidth;
var _pieceHeight;
var _currentPiece;
var _currentDropPiece;

var _mouse;

window.onload = init;

function init() {
    _img.addEventListener('load', onImage, false);
}

function onImage() {
    _pieceWidth = Math.floor(_img.width / PUZZLE_DIFFICULTY);
    _pieceHeight = Math.floor(_img.height / PUZZLE_DIFFICULTY);
    _puzzleWidth = _pieceWidth * PUZZLE_DIFFICULTY;
    _puzzleHeight = _pieceHeight * PUZZLE_DIFFICULTY;
    setCanvas();
    initPuzzle();
}

function setCanvas() {
    _canvas = document.querySelector("#ukladanka");
    _stage = _canvas.getContext("2d");
    _canvas.width = _puzzleWidth;
    _canvas.height = _puzzleHeight;
    _canvas.style.border = "5px solid black";
}

function initPuzzle() {
    _pieces = [];
    _mouse = {x: 0, y: 0};
    _currentPiece = null;
    _currentDropPiece = null;
    _stage.drawImage(_img, 0, 0, _puzzleWidth, _puzzleHeight, 0, 0, _puzzleWidth, _puzzleHeight);
    createTitle("costam costam idk jeszcze");
    buildPieces();
}

function createTitle(msg) {
    _stage.fillStyle = "#19A7CE";
    _stage.globalAlpha = .4;
    _stage.fillRect(100, _puzzleHeight - 40, _puzzleWidth - 200, 40);
    _stage.fillStyle = "#F6F1F1";
    _stage.globalAlpha = 1;
    _stage.textAlign = "center";
    _stage.textBaseline = "middle";
    _stage.font = "20px Arial";
    _stage.fillText(msg, _puzzleWidth / 2, _puzzleHeight - 20);
}

function buildPieces() {
    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    
    for(i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; i++) {
        piece = {};
        piece.sx = xPos;
        piece.sy = yPos;
        piece.value = i;
        _pieces.push(piece);
        xPos += _pieceWidth;
        if(xPos >= _puzzleWidth) {
            xPos = 0;
            yPos += _pieceHeight;
        }
    }

    document.onmousedown = shufflePuzzle;
}

function shufflePuzzle() {
    _pieces = shuffleArray(_pieces);
	_stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
	let xPos = 0;
	let yPos = 0;
	for (const piece of _pieces) {
		piece.xPos = xPos;
		piece.yPos = yPos;
		_stage.drawImage(
			_img,
			piece.sx,
			piece.sy,
			_pieceWidth,
			_pieceHeight,
			xPos,
			yPos,
			_pieceWidth,
			_pieceHeight
		);
		_stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
		xPos += _pieceWidth;
		if (xPos >= _puzzleWidth) {
			xPos = 0;
			yPos += _pieceHeight;
		}
	}
	document.onmousedown = onPuzzleClick;
}

function shufflePuzzle2() {
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);

    var i;
    var piece;
    var xPos = 0;
    var yPos = 0;
    
    do {
        _pieces = shuffleArray(_pieces);
    } while(!solvable());
    
    for(i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        piece.xPos = xPos;
        piece.yPos = yPos;
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, xPos, yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(xPos, yPos, _pieceWidth, _pieceHeight);
        xPos += _pieceWidth;

        if(xPos >= _puzzleWidth) {
            xPos = 0;
            yPos += _pieceHeight;
        }
    }

    document.onmousedown = onPuzzleClick;
}

function shuffleArray(o){
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
function getInvCount() {
    let inv_count = 0;
    for (let i = 0; i < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY - 1; i++) {
        for (let j = i + 1; j < PUZZLE_DIFFICULTY * PUZZLE_DIFFICULTY; j++) {
            if (_pieces[j] && _pieces[i] && _pieces[i].value > _pieces[j].value) {
                inv_count++;
            }
        }
    }
    return inv_count;
}
function findXPosition() {
    for (let i = PUZZLE_DIFFICULTY - 1; i >= 0; i--) {
        for (let j = PUZZLE_DIFFICULTY - 1; j >= 0; j--) {
            if (_pieces[i * PUZZLE_DIFFICULTY + j].value == 0) {
                return PUZZLE_DIFFICULTY - i;
            }
        }
    }
}
function solvable() {
    let invCount = getInvCount();

    if (PUZZLE_DIFFICULTY & 1) {
        return !(invCount & 1);
    }
    else {
        let pos = findXPosition();
        if (pos & 1) {
            return !(invCount & 1);
        }
        else {
            return invCount & 1;
        }
    }
}


function onPuzzleClick(e) {
    if(e.layerX || e.layerX == 0) {
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }

    _currentPiece = checkPieceClicked();

    if(_currentPiece != null) {
        _stage.clearRect(_currentPiece.xPos, _currentPiece.yPos, _pieceWidth, _pieceHeight);
        _stage.save();
        _stage.globalAlpha = .9;
        _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
        _stage.restore();

        document.onmousemove = updatePuzzle;
        document.onmouseup = pieceDropped;
    }
}

function checkPieceClicked() {
    var i;
    var piece;

    for(i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {
            return null;
        }
        else {
            return piece;
        }
    }
}

function updatePuzzle(e) {
    _currentDropPiece = null;

    if(e.layerX || e.layerX == 0) {
        _mouse.x = e.layerX - _canvas.offsetLeft;
        _mouse.y = e.layerY - _canvas.offsetTop;
    }
    else if(e.offsetX || e.offsetX == 0) {
        _mouse.x = e.offsetX - _canvas.offsetLeft;
        _mouse.y = e.offsetY - _canvas.offsetTop;
    }
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);

    var i;
    var piece;
    for(i = 0; i < _pieces.length; i++) {
        piece = _pieces[i];
        if(piece === _currentPiece) {
            continue;
        }

        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        if(_currentDropPiece == null) {
            if(_mouse.x < piece.xPos || _mouse.x > (piece.xPos + _pieceWidth) || _mouse.y < piece.yPos || _mouse.y > (piece.yPos + _pieceHeight)) {

            }
            else {
                _currentDropPiece = piece;
                _stage.save();
                _stage.globalAlpha = .4;
                _stage.fillStyle = PUZZLE_HOVER_TINT;
                _stage.fillRect(_currentDropPiece.xPos, _currentDropPiece.yPos, _pieceWidth, _pieceHeight);
                _stage.restore();
            }
        }
    }

    _stage.save();
    _stage.globalAlpha = .6;
    _stage.drawImage(_img, _currentPiece.sx, _currentPiece.sy, _pieceWidth, _pieceHeight, _mouse.x - (_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
    _stage.restore();
    _stage.strokeRect(_mouse.x -(_pieceWidth / 2), _mouse.y - (_pieceHeight / 2), _pieceWidth, _pieceHeight);
}

function pieceDropped(e) {
    document.onmousemove = null;
    document.onmouseup = null;

    if(_currentDropPiece != null) {
        var temp = {xPos: _currentPiece.xPos, yPos: _currentPiece.yPos};
        _currentPiece.xPos = _currentDropPiece.xPos;
        _currentPiece.yPos = _currentDropPiece.yPos;
        _currentDropPiece.xPos = temp.xPos;
        _currentDropPiece.yPos = temp.yPos;
    }

    resetPuzzleAndCheckWin();
}

function resetPuzzleAndCheckWin() {
    _stage.clearRect(0, 0, _puzzleWidth, _puzzleHeight);
    var gameWin = true;
    for(const piece of _pieces) {
        _stage.drawImage(_img, piece.sx, piece.sy, _pieceWidth, _pieceHeight, piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);
        _stage.strokeRect(piece.xPos, piece.yPos, _pieceWidth, _pieceHeight);

        if(piece.xPos != piece.sx || piece.yPos != piece.sy) {
            gameWin = false;
        }
    }

    if(gameWin) {
        setTimeout(gameOver, 1000);
    }
}

function gameOver() {
    document.onmousedown = null;
    document.onmousemove = null;
    document.onmouseup = null;
    init();
}