var board = [];
var score = 0;
var hasConflicted = new Array();

$(document).ready(function () {
    newGame();
});

function newGame() {
    //初始化棋盘
    init();
    //在随机两个格子中生成数字
    generateOneNum();
    generateOneNum();
}

function init() {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            var gridCell = $("#gird-cell-" + i + "-" + j);
            gridCell.css('top', getPosTop(i, j));
            gridCell.css('left', getPosLeft(i, j));
        }
    }

    for (var i = 0; i < 4; i++) {
        board[i] = new Array();
        hasConflicted[i] = new Array;
        for (var j = 0; j < 4; j++) {
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }

    }

    upDateBoardView();
}
function generateOneNum() {
    if (noSpace(board)) {
        return false;
    }
    //随机一个位置
    var randX = parseInt(Math.floor(Math.random() * 4));
    var randY = parseInt(Math.floor(Math.random() * 4));

    var times = 0;
    while (times < 50) {
        if (board[randX][randY] == 0)
            break;

        randX = parseInt(Math.floor(Math.random() * 4));
        randY = parseInt(Math.floor(Math.random() * 4));
        times++;
    }
    //人工生成一个位置
    if (times == 50) {
        for (var i = 0; i < 4; i++) {
            for (var j = 0; j < 4; j++) {
                if (board[i][j] == 0) {
                    randX = i;
                    randY = j;
                }
            }
        }
    }
    //随机一个数字
    var randNum = Math.random() < 0.5 ? 1 : 2;
    //在随机位置显示随机数
    board[randX][randY] = randNum;

    showNumWithAnimation(randX, randY, randNum);
    return true;
}
function upDateBoardView() {
    $(".number-cell").remove();
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            $("#grid-container").append('<div class="number-cell" id="number-cell-' + i + '-' + j + '"></div>');
            var theNumberCell = $("#number-cell-" + i + "-" + j);


            if (board[i][j] == 0) {
                theNumberCell.css('width', '0px');
                theNumberCell.css('height', '0px');
                theNumberCell.css('top', getPosTop(i, j) + 50);
                theNumberCell.css('left', getPosLeft(i, j) + 50);
            } else {
                theNumberCell.css('width', '100px');
                theNumberCell.css('height', '100px');
                theNumberCell.css('top', getPosTop(i, j));
                theNumberCell.css('left', getPosLeft(i, j));
                theNumberCell.css('background-color', getNumBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
}

function getPosTop(i, j) {
    return 20 + i * 120;
}

function getPosLeft(i, j) {
    return 20 + j * 120;
}
function getNumBackgroundColor(num) {
    switch (num) {
        case 1:
            return "#eee";
            break;
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#9c0";
            break;
        case 1024:
            return "#33b5e5";
            break;
        case 2048:
            return "#09c";
            break;
        case 4096:
            return "#a6c";
            break;
        case 8192:
            return "#93c";
            break;
    }
    return "black";
}

function getNumColor(num) {
    if (num <= 4) {
        return "#776e65";
    }
    return "white";
}

function noSpace(board) {
    for (var i = 0; i < 4; i++)
        for (var j = 0; j < 4; j++)
            if (board[i][j] == 0)
                return false;

    return true;
}
function showNumWithAnimation(i, j, randNum) {
    var numCell = $("#number-cell-" + i + "-" + j);
    numCell.css("background-color", getNumBackgroundColor(randNum));
    numCell.css('color', getNumColor(randNum));
    numCell.text(randNum);

    numCell.animate({
        width: '100px',
        height: '100px',
        top: getPosTop(i, j),
        left: getPosLeft(i, j)
    }, 100);
}

$(document).keydown(function (event) {
    switch (event.keyCode) {
        case 37:    //left
            if (moveLeft()) {
                generateOneNum();
                isGameOver();
            }
            break;
        case 38:    //up
            if (moveUp()) {
                generateOneNum();
                isGameOver();
            }
            break;
        case 39:    //right
            if (moveRight()) {
                generateOneNum();
                isGameOver();
            }
            break;
        case 40:    //down
            if (moveDown()) {
                generateOneNum();
                isGameOver();
            }
            break;
        default:    //default
            break;

    }
});
function moveLeft() {
    if (!canMoveLeft(board)) {
        return false;
    }
    //moveLeft
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < j; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        console.log('moveleft')
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        //hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(upDateBoardView, 200);
    return true;
}
function moveRight() {
    if (!canMoveRight(board)) {
        return false;
    }
    //moveRight
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                for (var k=j+1; k<4; k++) {
                    if (board[i][k] == 0 && noBlockHorizontal(i, k, j, board)) {
                        console.log('moveRight')
                        //move
                        showMoveAnimation(i, j, i, k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[i][k] == board[i][j] && noBlockHorizontal(i, k, j, board)) {
                        //move
                        showMoveAnimation(i, j, i, k);
                        //add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[i][k];
                        updateScore(score);

                        //hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(upDateBoardView, 200);
    return true;
}
function moveUp() {
    if (!canMoveUp(board)) {
        return false;
    }
    //moveUp
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = 0; k < i; k++) {
                    if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
                        console.log('moveUp')
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board)) {
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        //hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(upDateBoardView, 200);
    return true;
}
function moveDown() {
    if (!canMoveDown(board)) {
        return false;
    }
    //moveDown
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                for (var k = i; k < 4; k++) {
                    if (board[k][j] == 0 && noBlockVertical(k, i, j, board)) {
                        console.log('moveDown')
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    } else if (board[k][j] == board[i][j] && noBlockVertical(k, i, j, board)) {
                        console.log('moveDown2')
                        //move
                        showMoveAnimation(i, j, k, j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        //add score
                        score += board[k][j];
                        updateScore(score);

                        //hasConflicted[i][k] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout(upDateBoardView, 200);
    return true;
}

function canMoveLeft(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i][j - 1] == 0 || board[i][j - 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveRight(board) {
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 3; j++) {
            if (board[i][j] != 0) {
                if (board[i][j + 1] == 0 || board[i][j + 1] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveUp(board) {
    for (var i = 1; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i-1][j] == 0 || board[i-1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}
function canMoveDown(board) {
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 4; j++) {
            if (board[i][j] != 0) {
                if (board[i+1][j] == 0 || board[i+1][j] == board[i][j]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function noBlockHorizontal(row, col1, col2, board) {
    for (var i = col1 + 1; i < col2; i++) {
        if (board[row][i] != 0) {
            return false
        }
    }
    return true;
}
function noBlockVertical(row1,row2,col,board) {
    for (var i = row1 + 1; i < row2; i++) {
        if (board[i][col] != 0) {
            return false
        }
    }
    return true;
}

function showMoveAnimation(fromX, fromY, toX, toY) {
    var numCell = $("#number-cell-" + fromX + "-" + fromY);
    numCell.animate({
        top: getPosTop(toX, toY),
        left: getPosLeft(toX, toY)
    }, 200);
}
function isGameOver() {
    if (noSpace(board) && noMove(board)) {
        gameOver();
    }
}
function gameOver() {
    alert('Game Over!!');
}
function noMove(board) {
    if (canMoveLeft(board) || canMoveRight(board) || canMoveUp || canMoveDown(board)) {
        return false;
    }
    return true;
}
function updateScore(score) {
    $('#score').text(score);
}