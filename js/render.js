var canvas = document.getElementsByTagName('canvas')[0];
var ctx = canvas.getContext('2d');
var W = 300, H = 600;
var BLOCK_W = W / COLS, BLOCK_H = H / 20;

// Draw a single block at (x, y)
function drawBlock(x, y) {
    ctx.fillRect(BLOCK_W * x, BLOCK_H * (y - 20), BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * (y - 20), BLOCK_W - 1, BLOCK_H - 1);
}
// Render the next tetromino
function renderNextTetromino() {
    const canvas = document.getElementById('nextTetromino');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const BLOCK_SIZE = canvas.width / 4; // Each block is a quarter of the canvas width
    ctx.strokeStyle = 'white';

    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (next[y][x]) {
                ctx.fillStyle = colors[next[y][x] - 1];
                ctx.fillRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
                ctx.strokeRect(x * BLOCK_SIZE, y * BLOCK_SIZE, BLOCK_SIZE - 1, BLOCK_SIZE - 1);
            }
        }
    }
}
// Render the board and the current shape
function render() {
    ctx.clearRect(0, 0, W, H);

    ctx.strokeStyle = 'white';
    for (var x = 0; x < COLS; x++) {
        for (var y = 20; y < ROWS; y++) {
            if (board[y][x]) {
                ctx.fillStyle = colors[board[y][x] - 1];
                drawBlock(x, y);
            }
        }
    }
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'white';
    for (var y = 0; y < 4; y++) {
        for (var x = 0; x < 4; x++) {
            if (current[y][x]) {
                ctx.fillStyle = colors[current[y][x] - 1];
                drawBlock(currentX + x, currentY + y);
            }
        }
    }
}
