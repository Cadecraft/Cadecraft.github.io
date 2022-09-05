// LANDFORM ECLIPSE script

/*
TO ADD:
> None
RECENT CHANGES
> None
*/

// DEFS
//
//

// Sys defs (REM init sequence)
const recentVersion = '0.0.1';
const editDate = '2022/9/5';
var morningStar = '[unsuccessful]';

// Morning star: testing
morningStar = '[successful]';
// Print to console: welcome message
console.log('===============');
console.log('Welcome to Landform Eclipse by Cadecraft! Please don\'t cheat...');
console.log('-');
console.log('  Landform Eclipse>LOGGED [REM init sequence]');
console.log('  recentVersion>'+recentVersion);
console.log('  editDate>'+editDate);
console.log('  morningStar>'+morningStar);
console.log('-');
console.log('Are you a *developer*? `dbgm=true;`');
console.log('===============');
// Update on-screen version
/* to add~ */

// Game defs
var dbgm = false; // Debug mode: allows flight, etc.
var globalScale = 2.0;
var blockWidth = 18;
var worldMap = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [2,2,2,2,2]
]

// Game def objects: music/audios

// Load images to the html

// UTILITY FUNCTIONS
//
//

function screenToWorld(inscreenx, inscreeny) {
    var newx = (inscreenx-(window.innerWidth*0.5))/(blockWidth*globalScale);
    var newy = (inscreeny-(window.innerHeight*0.5))/(blockWidth*globalScale);
    //newx += mychar.locx;
    //newy += mychar.locy;
    return({
        'x': newx,
        'y': newy
    });
}
function worldToScreen(inworldx, inworldy) {
    var newx = ((inworldx/*-mychar.locx*/)*(blockWidth*globalScale))+(window.innerWidth*0.5);
    var newy = ((inworldx/*-mychar.locx*/)*(blockWidth*globalScale))+(window.innerWidth*0.5);
    return({
        'x': newx,
        'y': newy
    });
}

// INPUT
//
//

var keys = {};
var mousedown = false;
var mouseclicktick = false;
var pointerx; // Screen position
var pointery;
var pointerxwr; // World position (in blocks)
var pointerywr;
var pointerxbl; // Rounded to nearest block
var pointerybl;
// Get cursor position
document.onmousemove = function(event) {
    // Update locations
    pointerx = event.pageX;
    pointery = event.pageY;
    updatePointerwr();
}
// Mouse down
document.onmousedown = function(event) {
    // Reupdate
    pointerx = event.pageX;
    pointery = event.pageY;
    updatePointerwr();
    // Set value
    mousedown = true;
    mouseclicktick = true;
    // If in game, call function
    /*if(mylocation != 'lobby') {
        gameInputClick();
    }*/
}
// Mouse up
document.onmouseup = function(event) {
    mousedown = false;
}
function updatePointerwr() {
    pointerxwr = screenToWorld(pointerx, pointery).x;
    pointerywr = screenToWorld(pointerx, pointery).y;
    pointerxbl = Math.round(pointerxwr-0.5);
    pointerybl = Math.round(pointerywr-0.5);
}
// Input checks (key down)
document.addEventListener('keydown',
    function(e) {
        var l = e.key.toLowerCase();
        keys[l] = true;
        /*if(['Space', 'ArrowUp', 'ArrowDown'].indexOf(e.code) > -1) {
            e.preventDefault();
        }*/
    }, false
);
document.addEventListener('keyup',
    function(e) {
        var l = e.key.toLowerCase();
        keys[l] = false;
    }, false
);

// GAME FUNCTIONS
//
//

const gameInterval = 20;
setInterval(gameLoop, gameInterval);

// On first start game
function gameStart() {
    // Generate world map
    // Set player inv, defaults, etc.
}
gameStart(); // call

// Game loop
function gameLoop() {
    // Reduce timers
    // Handle input if not dead
    gameInput();
    // Apply char physics
    // Apply entity physics
    // Apply projectiles velocity
    // Check collision (projectiles and items) if not dead
    
    // Render
    render();
}

// Game input
function gameInput() {
    var inputs = [];
    // Get inputs based on control layout
    var wasesc = keys['escape'];
    if(keys['a']) { inputs.push('left'); }
    if(keys['d']) { inputs.push('right'); }
    if(keys['s']) { inputs.push('down'); }
    if(keys[' '] || keys['w']) { inputs.push('jump'); keys[' ']=false; keys['w'] = false; }

    // Use controls
    if(inputs.includes('left')) {
        // Move left
    }
    if(inputs.includes('right')) {
        // Move right
    }
    if(inputs.includes('down')) {
        // Crouch
    }
    if(inputs.includes('jump')) {
        // Jump
    }
    if(mousedown) {
        // Click
    }
}

// Render
function render() {
    // Set global scale if screen width has changed?
    // Defs
    var iwidth=blockWidth*globalScale;
    var offsetx = 0/*mychar.locx*/*-1 + (window.innerWidth*0.5)/iwidth;
    var offsety = 0/*mychar.locy*/*-1 + (window.innerHeight*0.5)/iwidth;
    var thistime = new Date();
    // Get canvas
    var c = document.getElementById('gamecanvas');
    var ctx = c.getContext('2d');
    // Canvas size
    ctx.canvas.width = window.innerWidth-20;
    ctx.canvas.height = window.innerHeight-20;
    // Canvas defs
    ctx.imageSmoothingEnabled = false;
    // Clear canvas with sky/bg
    ctx.fillStyle = 'rgb(20, 20, 255)';
    ctx.fillRect(0, 0, c.width, c.height);

    // Render blocks
    for(let y = 0; y < worldMap.length; y++) {
        for(let x = 0; x < worldMap[0].length; x++) {
            // Each block:
            var thisblock = worldMap[y][x];
            if(thisblock == 0) {

            } else {
                // Determine location and whether is in view; cull outside (toadd)
                var drawx = (x+offsetx)*iwidth;
                var drawy = (y+offsety)*iwidth;
                if(drawx > iwidth*-1 && drawx < window.innerWidth && drawy > iwidth*-1 && drawy < window.innerHeight) {
                    // Draw
                    try {
                        ctx.fillStyle = 'rgb(200, 0, 0)';
                        ctx.fillRect(drawx, drawy, Math.ceil(iwidth), Math.ceil(iwidth));
                    }
                    catch(err) {
                        console.log('Err rendering block: '+thisblock);
                    }
                }
            }
        }
    }
}