// LANDFORM ECLIPSE script

/*
TO ADD (also search: `toadd`):
> Velocity correction veleq (?)
> Acceleration
> Settling down onto ground effect (falling y loc)--snap y location closer to the ground (floor/ceil)
> Respawn on fall too far
> Reduce air control
RECENT CHANGES
> None
*/

// DEFS
//
//

// Sys defs (REM init sequence pt 2)
var morningStar = '[unsuccessful]';

// Morning star: testing
morningStar = '[successful]';
// Print to console: welcome message
console.log('\n\n\n');
console.log('===============');
console.log('Welcome to Landform Eclipse by Cadecraft! Please don\'t cheat...');
console.log('-');
console.log('  Landform Eclipse>LOGGED [REM init sequence]');
console.log('  recentVersion>'+recentVersion);
console.log('  editDate>'+editDate);
console.log('  morningStar>'+morningStar);
console.log('-');
console.log('Are you a *developer*? `dbgm=true;`');
console.log('Found any *bugs*? Please report them~ https://discord.gg/wahdQHBs4Z');
console.log('===============');
//console.log('\n\n\n');
//console.log('===============');
// Update on-screen version
/* to add~ */

// Game defs
var dbgm = false; // Debug mode: allows flight, etc.
var globalScale = 2.0;
var blockWidth = 16;
var generateWorld = false;
var worldMap = [
    [2,2,2],
    [1,1,1],
    [1,1,1]
];
var worldStates = [];

// Load game defs: load/generate map and world states
console.log('loading world: loading...');
try {
    // Map (load from datas-maps.js file OR generate)
    if(generateWorld) {
        console.log('loading world: generating...');
        // (toadd)
    } else {
        console.log('loading world: fetching...');
        worldMap = maps["m-testing-2"];
    }
    console.log('loading world: world states...');
    // World states (generate)
    for(let y = 0; y < worldMap.length; y++) {
        worldStates.push([]);
        for(let x = 0; x < worldMap[0].length; x++) {
            worldStates[y].push({
                'dmg': 0,
                'state': 0
            });
        }
    }
} catch(err) { console.log('err: loading map or loading world states'); }
console.log('loading world: completed~!')

// Load game defs: player character (mychar)
var mychar = new Player(3, 2);

// Load game defs: music/audios

// Load images to the html
console.log('loading images: loading...');
for(let i = BLOCKS_startsat; i < Object.keys(BLOCKS).length+BLOCKS_startsat; i++) {
    // Get src url
    var imgsrc = BLOCKS[i].img;
    if(imgsrc == 'none') { continue; }
    imgsrc = 'static/landform-eclipse/' + imgsrc;
    // Load img
    try {
        const imgelement = document.createElement('img');
        imgelement.src = imgsrc;
        imgelement.id = BLOCKS[i].img;
        document.getElementById('imgfiles').append(imgelement);
    } catch(err) {
        console.log('err: loading images: block id='+i);
    }
}
console.log('loading images: completed~!');

// UTILITY FUNCTIONS
//
//

function screenToWorld(inscreenx, inscreeny) {
    var newx = (inscreenx-(window.innerWidth*0.5))/(blockWidth*globalScale);
    var newy = (inscreeny-(window.innerHeight*0.5))/(blockWidth*globalScale);
    newx += mychar.locx;
    newy += mychar.locy;
    return({
        'x': newx,
        'y': newy
    });
}
function worldToScreen(inworldx, inworldy) {
    var newx = ((inworldx-mychar.locx)*(blockWidth*globalScale))+(window.innerWidth*0.5);
    var newy = ((inworldy-mychar.locy)*(blockWidth*globalScale))+(window.innerWidth*0.5);
    return({
        'x': newx,
        'y': newy
    });
}
function getMapBlock(map, locy, locx) {
    if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
        return map[locy][locx];
    } else { return -1; }
}
function getMapBlockState(states, locy, locx) {
    if(locy >= 0 && locy < states.length && locx >= 0 && locx < states[0].length) {
        return states[locy][locx];
    } else { return {
        'dmg': 0,
        'state': -1
    }; }
}

// WORLD FUNCTIONS
//
//

function tryDamageBlock(indmg) {
    // Get map block (air = void = 0)
    var newblock = getMapBlock(worldMap, pointerybl, pointerxbl);
    var newblockState = getMapBlockState(worldStates, pointerybl, pointerxbl);
    if(BLOCKS[newblock].hp > 0 && newblockState.state != -1) { // determines if mineable
        // Deal damage to block
        worldStates[pointerybl][pointerxbl].dmg++;
        // Check that block health is in range
        if(worldStates[pointerybl][pointerxbl].dmg >= BLOCKS[newblock].hp) {
            // Destroy block and drop if necessary
            worldMap[pointerybl][pointerxbl] = 0;
        } else {
            // Nothing
        }
    }
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

var gameInterval = 17;
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
    // Determine velocity equalization based on time passed (?) (toadd?)
    // Handle input if not dead
    gameInput();
    // Apply char physics
    mychar.applyPhysics(worldMap);
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
    if(keys[' '] || keys['w']) { inputs.push('jump'); }

    // Use controls
    if(inputs.includes('left')) {
        // Move left
        mychar.addVel(mychar.phys_accel*-1, 0);
    }
    if(inputs.includes('right')) {
        // Move right
        mychar.addVel(mychar.phys_accel, 0);
    }
    if(inputs.includes('down')) {
        // Crouch
    }
    if(inputs.includes('jump')) {
        // Jump
        mychar.jump(1);
    }
    if(mousedown) {
        // Click
        // Based on item type in player inv (toadd~)
        if(false) {
            // use item
        } else {
            // Is timer done? (toadd~)
            // Try to dig block
            tryDamageBlock(1);
        }
    }
}

// Render
function render() {
    // Set global scale if screen width has changed?
    // Defs
    var iwidth=blockWidth*globalScale;
    var offsetx = mychar.locx*-1 + (window.innerWidth*0.5)/iwidth;
    var offsety = mychar.locy*-1 + (window.innerHeight*0.5)/iwidth;
    var thistime = new Date();
    // Get canvas
    var c = document.getElementById('gamecanvas');
    var ctx = c.getContext('2d');
    // Canvas size
    ctx.canvas.width = window.innerWidth-8;
    ctx.canvas.height = window.innerHeight-8;
    // Canvas defs
    ctx.imageSmoothingEnabled = false;
    // Clear canvas with sky/bg
    ctx.fillStyle = 'rgb(20, 25, 30)';
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.globalAlpha = 1.0;

    // WORLD
    // Render blocks
    for(let y = 0; y < worldMap.length; y++) {
        for(let x = 0; x < worldMap[0].length; x++) {
            // Each block:
            var thisblock = worldMap[y][x];
            var drawx = (x+offsetx)*iwidth;
                var drawy = (y+offsety)*iwidth;
            if(BLOCKS[thisblock].img == 'none') {
                // Do not draw
            } else {
                // Determine location and whether is in view; cull outside (toadd)
                if(drawx > iwidth*-1 && drawx < window.innerWidth && drawy > iwidth*-1 && drawy < window.innerHeight) {
                    // Draw
                    try {
                        var imgloaded = document.getElementById(BLOCKS[thisblock].img);
                        //ctx.fillStyle = 'rgb(200, 0, 0)';
                        ctx.drawImage(imgloaded, 0, 0, 16, 16, Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                        //ctx.fillRect(drawx, drawy, Math.ceil(iwidth), Math.ceil(iwidth));
                    } catch(err) {
                        console.log('err: rendering block: '+thisblock);
                    }
                }
            }
            // Dbg: is highlighted?
            if(((mychar.dbg_highl_bl1[1] == x && mychar.dbg_highl_bl1[0] == y)
                || (mychar.dbg_highl_bl2[1] == x && mychar.dbg_highl_bl2[0] == y))
                && mychar.dbg_highl_enable) {
                // Highlight~
                var drawx = (x+offsetx)*iwidth;
                var drawy = (y+offsety)*iwidth;
                ctx.fillStyle = 'rgb(0, 255, 255)';
                ctx.globalAlpha = 0.5;
                ctx.fillRect(Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                ctx.globalAlpha = 1.0;
            }
        }
    }

    // CHARACTERS
    // Render player
    var drawx = (mychar.locx+offsetx)*iwidth;
    var drawy = (mychar.locy+offsety)*iwidth;
    try {
        ctx.fillStyle = 'rgb(0, 200, 0)';
        ctx.fillRect(drawx, drawy, Math.ceil(iwidth), Math.ceil(iwidth));
        ctx.fillStyle = 'rgb(0, 100, 0)';
        ctx.fillRect(drawx, drawy-iwidth, Math.ceil(iwidth), Math.ceil(iwidth));
    } catch(err) {
        console.log('err: rendering PLAYER');
    }

    // FX
}