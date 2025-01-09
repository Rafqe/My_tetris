let COLS = 10, ROWS = 40;
let board = [];
let lose;
let interval;
let score = 0;
let level = 1;
let speed = 600;
let lastLevel = level;
let intervalRender;
let current, next; // current and next moving shapes
let currentX, currentY; // position of current shape
let freezed; // is current shape settled on the board?
let gameRunning = false; // True if the game is running
let gamePaused = false;
window.addEventListener('resize', () => {
    const canvas = document.querySelector('canvas');
    const newHeight = window.innerHeight * 0.6; // Adjust height to 60% of the viewport height
    canvas.height = newHeight;
});
let shapes = [
    [ // I shape
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [ // L shape
        [0, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [ // J shape
        [0, 0, 0, 0],
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [ // O shape
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [ // Z shape
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ],
    [ // S shape
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ],
    [ // T shape
        [0, 0, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0]
    ]
];
let colors = [
    'rgba(165, 0, 33, 0.5)', 'rgba(0, 168, 107, 0.5)', 'rgba(165, 0, 33, 0.5)', 'rgba(0, 168, 107, 0.5)', 'rgba(165, 0, 33, 0.5)', 'rgba(0, 168, 107, 0.5)', 'rgba(165, 0, 33, 0.5)'
];

// Generate a new tetromino
function generateNewTetromino() {
    let id = Math.floor(Math.random() * shapes.length); // Randomly pick a shape
    let shape = shapes[id]; // Get the shape based on the random ID
    let tetromino = [];

    // Create a 4x4 grid with the selected shape
    for (let y = 0; y < 4; y++) {
        tetromino[y] = [];
        for (let x = 0; x < 4; x++) {
            tetromino[y][x] = shape[y] && shape[y][x] ? id + 1 : 0;
        }
    }
    return tetromino;
}

// Create the first shape and set the next shape
function newShape() {
    if (!next) {
        next = generateNewTetromino(); // Initialize next shape on first call
    }
    current = next; // Move next shape to current
    next = generateNewTetromino(); // Generate a new next shape

    freezed = false;
    currentX = 4;
    currentY = 18;
    renderNextTetromino(); // Show the next tetromino
}

// Initialize the board
function init() {
    for (let y = 0; y < ROWS; y++) {
        board[y] = [];
        for (let x = 0; x < COLS; x++) {
            board[y][x] = 0;
        }
    }
}
function getLevelAndSpeed() {
    // Track if the level has changed
    let previousLevel = level;
    
    if (score >= 15000) {
        level = 5;
        speed = 200; // Fastest speed
    } else if (score >= 8000) {
        level = 4;
        speed = 300;
    } else if (score >= 3000) {
        level = 3;
        speed = 400;
    } else if (score >= 1000) {
        level = 2;
        speed = 500;
    } else {
        level = 1;
        speed = 600; // Default speed for level 1
    }

    // If the level has increased, play the level-up sound
    if (level > previousLevel) {
        playLevelUpSound();
    }

    updateLevelDisplay(); // Update the level display
    return speed;
}
// Function to play the level-up sound
function playLevelUpSound() {
    const levelUpSound = document.getElementById('levelUpSound');
    levelUpSound.play(); // Play the sound
}
// keep the element moving down, creating new shapes and clearing lines
function tick() {
    if (valid(0, 1)) {
        currentY++;
    } else {
        freeze();
        valid(0, 1);
        clearLines();
        if (lose) {
            clearAllIntervals();
            document.getElementById('gameOverDisplay').innerText = 'Game Over';
            const loseSound = document.getElementById('loseSound');
            loseSound.play();
            return false;
        }
        newShape();
    }
    // Adjust speed based on the level
    clearInterval(interval); // Clear the old interval
    interval = setInterval(tick, getLevelAndSpeed()); // Set the new interval based on level
}

function updateLevelDisplay() {
    document.getElementById('levelDisplay').innerText = 'Level: ' + level;
}
// stop shape at its position and fix it to board
function freeze() {
    for ( let y = 0; y < 4; y++ ) {
        for ( let x = 0; x < 4; x++ ) {
            if ( current[ y ][ x ] ) {
                board[ y + currentY ][ x + currentX ] = current[ y ][ x ];
            }
        }
    }
    freezed = true;
}
// returns rotates the rotated shape 'current' perpendicularly anticlockwise
function rotate(current) {
    let newCurrent = [];

    // Perform 90-degree clockwise rotation
    for (let y = 0; y < 4; y++) {
        newCurrent[y] = [];
        for (let x = 0; x < 4; x++) {
            newCurrent[y][x] = current[3 - x][y];
        }
    }
    return newCurrent;
}
// check if any lines are filled and clear them
function clearLines() {
    let linesCleared = 0;
    for ( let y = ROWS - 1; y >= 0; y-- ) {
        let rowFilled = true;
        for ( let x = 0; x < COLS; x++ ) {
            if ( board[ y ][ x ] == 0 ) {
                rowFilled = false;
                break;
            }
        }
        if ( rowFilled ) {
            document.getElementById( 'clearsound' ).play();
            linesCleared++;
            for ( let yy = y; yy > 0; yy-- ) {
                for ( let x = 0; x < COLS; x++ ) {
                    board[ yy ][ x ] = board[ yy - 1 ][ x ];
                }
            }
            y++;
        }
    }
    if (linesCleared > 0) {
        // Update the score: scoring for clearing multiple lines
        let scoreIncrement = 0;
        switch (linesCleared) {
            case 1:
                scoreIncrement = 100*level;
                break;
            case 2:
                scoreIncrement = 300*level;
                break;
            case 3:
                scoreIncrement = 500*level;
                break;
            case 4:
                scoreIncrement = 800*level;
                break;
        }
        score += scoreIncrement; // Add the score increment based on lines cleared
        updateScoreDisplay(); // Update the score display on screen
        const cheers = [
            "./Models/cheeringCats/paku-cat.gif",
            "./Models/cheeringCats/1234.gif",
            "./Models/cheeringCats/boucheron.gif",
            "./Models/cheeringCats/catche2.gif",
            "./Models/cheeringCats/giphy.webp",
            "./Models/cheeringCats/giphy2.webp",
            "./Models/cheeringCats/1.gif",
            "./Models/cheeringCats/2.gif",
            "./Models/cheeringCats/3.gif",
            "./Models/cheeringCats/4.gif",
            "./Models/cheeringCats/5.gif",
            "./Models/cheeringCats/6.gif",
            "./Models/cheeringCats/7.gif",
            "./Models/cheeringCats/8.gif",
            "./Models/cheeringCats/9.gif",
            "./Models/cheeringCats/10.gif",
            "./Models/cheeringCats/11.gif",
            "./Models/cheeringCats/12.gif",
            "./Models/cheeringCats/13.gif",
        ];
        document.getElementById('cheerers').innerHTML = "<img src="+cheers[Math.floor(Math.random()*cheers.length)]+" width='180px' height='120px'>";
    }
}
function updateScoreDisplay() {
    document.getElementById('scoreDisplay').innerText = 'Score: ' + score;
}
function keyPress( key ) {
    switch ( key ) {
        case 'pause':
            if (document.getElementById("pausebutton").disabled == false){
                pauseResumeGameClicked()
            }
            break;
        case 'start':
            if (gameRunning == false){
                playButtonClicked()
            }
            break;
        case 'left':
            if ( valid( -1 ) ) {
                currentX--;
            }
            break;
        case 'right':
            if ( valid( 1 ) ) {
                currentX++;
            }
            break;
        case 'down':
            if ( valid( 0, 1 ) ) {
                currentY++;
            }
            break;
        case 'rotate':
            let rotated = rotate( current );
            if ( valid( 0, 0, rotated ) ) {
                current = rotated;
            }
            break;
        case 'drop':
            while( valid(0, 1) ) {
                currentY++;
            }
            tick();
            break;
    }
}
// checks if the resulting position of current shape will be feasible
function valid( offsetX, offsetY, newCurrent ) {
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    offsetX = currentX + offsetX;
    offsetY = currentY + offsetY;
    newCurrent = newCurrent || current;

    for ( let y = 0; y < 4; y++ ) {
        for ( let x = 0; x < 4; x++ ) {
            if ( newCurrent[ y ][ x ] ) {
                if ( typeof board[ y + offsetY ] == 'undefined'
                    || typeof board[ y + offsetY ][ x + offsetX ] == 'undefined'
                    || board[ y + offsetY ][ x + offsetX ]
                    || x + offsetX < 0
                    || y + offsetY >= ROWS
                    || x + offsetX >= COLS ) {
                        if ((offsetY == 20 && freezed)||(offsetY == 21 && freezed)) {
                            lose = true; // lose if the current shape is settled at the top most row
                            document.getElementById('playbutton').disabled = false;
                        } 
                        return false;
                }
            }
        }
    }
    return true;
}
document.getElementById("pausebutton").disabled = true;
function playButtonClicked() {
    if (!gameRunning) {
        newGame(); // Start a new game
        gameRunning = true;
        document.getElementById("playbutton").innerText = "Restart"; // Change button to "Stop"
        document.getElementById("pausebutton").disabled = false; // Pause button becomes accessible
    } 
    else if (gameRunning){
        document.getElementById("playbutton").innerText = "Start";
        document.getElementById("pausebutton").disabled = true;
        document.getElementById("pausebutton").innerText = "Pause";
        stopGame(); // Stop the game if it’s running
    }
}
function stopGame() {
    clearInterval(interval); // Pause the game loop
    clearInterval(intervalRender); // Pause the render loop
    gameRunning = false; // Mark the game as paused
    gamePaused = false;
}
function pauseGame() {
    clearInterval(interval); // Pause the game loop
    clearInterval(intervalRender); // Pause the render loop
    gamePaused = true; // Mark the game as paused
    document.getElementById("pausebutton").innerText = "Resume"; // Change button to "Resume"
}
function pauseResumeGameClicked() {
    if (gamePaused) {
        resumeGame(); // Resume the game if it’s paused
    }
    else if (gameRunning) {
        pauseGame(); // resume  game
    }
}
function resumeGame() {
    gamePaused = false; // Mark the game as not paused
    intervalRender = setInterval(render, 30); // Restart render loop
    interval = setInterval(tick, 600); // Restart game loop
    document.getElementById("pausebutton").innerText = "Pause"; // Change button to "Stop"
}
// Start a new game
function newGame() {
    clearAllIntervals();
    document.getElementById('backgroundsound').volume = 0.2; // Set the volume to 20%
    document.getElementById('backgroundsound').play();  
    intervalRender = setInterval(render, 30); // Game render loop
    interval = setInterval(tick, getLevelAndSpeed()); // Game tick loop, with dynamic speed
    init(); // Initialize the board
    newShape(); // Create the first shape
    document.getElementById('gameOverDisplay').innerText = ' '
    document.getElementById('cheerers').innerText =' '
    lose = false;
    score = 0; // Reset the score to 0
    level = 1;
    updateScoreDisplay();
    updateLevelDisplay();
}
// Helper function to clear all intervals
function clearAllIntervals() {
    clearInterval(interval);
    clearInterval(intervalRender);
}
