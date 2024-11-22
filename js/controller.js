document.body.onkeydown = function( e ) {
    if (!gamePaused && !gameRunning){
        var keys = {
        80: 'pause',
        27: 'start'}
        }
    else if (gamePaused || !gameRunning){
        var keys = {
        80: 'pause',}
        }
    else{
    var keys = {
        80: 'pause',
        27: 'start',
        37: 'left',
        39: 'right',
        40: 'down',
        38: 'rotate',
        32: 'drop'
    };}
    if ( typeof keys[ e.keyCode ] != 'undefined' ) {
        keyPress( keys[ e.keyCode ] );
        render();
    }
};