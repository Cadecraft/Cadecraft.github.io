// LANDFORM ECLIPSE script

/*
TO ADD (also search: `toadd`~):
> Velocity correction veleq for time (?)
> Acceleration
> Settling down onto ground effect (falling y loc)--snap y location closer to the ground (floor/ceil)
> Respawn on fall too far
> Reduce air control
> Tightness of deceleration
> Background blocks!
> Background on screen
> Plants erasing if block below is mined

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
console.log('  Landform Eclipse> LOGGED [REM init sequence]');
console.log('  recentVersion>    '+recentVersion);
console.log('  editDate>         '+editDate);
console.log('  morningStar>      '+morningStar);
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
var generateWorld = true; // def: true (dbg: true/false)
var worldMap = [
    [2,2,2],
    [1,1,1],
    [1,1,1]
];
var worldStates = [];

// Load game defs: load/generate map and world states
function mapRegen(inGenerateWorld) {
    console.log('loading world: loading...');
    try {
        // Map (load from datas-maps.js file OR generate)
        if(inGenerateWorld) {
            console.log('loading world: generating...');
            wgenMain();
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
    console.log('loading world: completed~!');
}
mapRegen(generateWorld);

// Load game defs: player character (mychar)
var mychar = new Player(50, 10);

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
for(let i = 0; i < IMGS_OTHER.length; i++) {
    // Get src url
    var imgsrc = IMGS_OTHER[i];
    if(imgsrc == 'none') { continue; }
    imgsrc = 'static/landform-eclipse/' + imgsrc;
    // Load img
    try {
        const imgelement = document.createElement('img');
        imgelement.src = imgsrc;
        imgelement.id = IMGS_OTHER[i];
        document.getElementById('imgfiles').append(imgelement);
    } catch(err) {
        console.log('err: loading images: img_other id='+i);
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
    if(BLOCKS[newblock].hardness > 0 && newblockState.state != -1) { // determines if mineable
        // Deal damage to block
        worldStates[pointerybl][pointerxbl].dmg++;
        // Check that block health is in range
        if(worldStates[pointerybl][pointerxbl].dmg >= BLOCKS[newblock].hp) {
            // Destroy block, drop items, trigger extra events if necessary
            worldMap[pointerybl][pointerxbl] = 0;
            worldStates[pointerybl][pointerxbl].dmg = 0;
            worldStates[pointerybl][pointerxbl].state = 0;
            for(let i = 0; i < BLOCKS[newblock].drops.length; i++) {
                mychar.invAddBlock(BLOCKS[newblock].drops[i]);
                mychar.justMinedBlock = true;
            }
        } else {
            // Nothing
        }
        return true;
    }
    else { return false; }
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

// Game interval settings
const gameInterval = 17;
setInterval(gameLoop, gameInterval);

// On first start game
function gameStart() {
    // Generate world map
    // Set player inv, defaults, etc.
}
gameStart(); // call

// Timers
var timers = {
    "timer_mining": 0
};

// Game loop
function gameLoop() {
    // Reduce timers
    for(let i = 0; i < Object.keys(timers).length; i++) {
        timers[Object.keys(timers)[i]] -= 17;
    }
    // Determine velocity equalization based on time passed (?) (toadd?)
    // Handle input if not dead
    updatePointerwr()
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
    for(let i = 0; i < 10; i++) {
        if(keys[''+i]) { inputs.push('inv'+i); }
    }

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
    for(let i = 0; i < 10; i++) {
        if(inputs.includes('inv'+i)) {
            if(i == 0) { mychar.inv_selected = 9; }
            else { mychar.inv_selected = i-1; }
        }
    }
    if(mousedown) {
        // Click
        // Based on item type in player inv (toadd~)
        if(mychar.invGetSelected()[0] == -100) {
            // Use item
        } else if(getMapBlock(worldMap, pointerybl, pointerxbl) == 0 && BLOCKS[mychar.invGetSelected()[0]].placeable) {
            // Place block if enabled
            if(!mychar.justMinedBlock) {
                worldMap[pointerybl][pointerxbl] = mychar.invGetSelected()[0];
                worldStates[pointerybl][pointerxbl].dmg = 0;
                worldStates[pointerybl][pointerxbl].state = 0;
                mychar.invReduceBlock(mychar.inv_selected);
                mychar.justPlacedBlock = true;
            }
        } else {
            // Dig block
            if(timers["timer_mining"] <= 0 && (/*mychar.invGetSelected()[0] == -1 || */mychar.invGetSelected()[0] == 8) && !mychar.justPlacedBlock) {
                // Try to dig block
                var blockDamaged = tryDamageBlock(1);
                if(blockDamaged) {
                    timers["timer_mining"] = mychar.cooldown_mining;
                }
            }
        }
    } else { mychar.justPlacedBlock = false; mychar.justMinedBlock = false; }
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
    ctx.globalAlpha = 1.0;
    // Clear canvas with sky
    //ctx.fillStyle = 'rgb(20, 25, 30)';
    ctx.fillStyle = '#54cbf0'; //'#60a3b5';
    ctx.fillRect(0, 0, c.width, c.height);
    // Background
    // Fake bg
    ctx.fillStyle = 'rgb(20, 25, 30)';
    var parallaxMedianY = (-8*mychar.locy) + (c.height/2);
    ctx.fillRect(0, parallaxMedianY, c.width, c.height-parallaxMedianY);

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
                // Determine location and whether is in view; cull outside (check that it works properly: toadd~)
                if(drawx > iwidth*-1 && drawx < window.innerWidth && drawy > iwidth*-1 && drawy < window.innerHeight) {
                    // Draw block
                    try {
                        var imgloaded = document.getElementById(BLOCKS[thisblock].img);
                        ctx.drawImage(imgloaded, 0, 0, 16, 16, Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                    } catch(err) {
                        console.log('err: rendering block: '+thisblock);
                    }
                    // Draw damage
                    try {
                        if(BLOCKS[thisblock].hp > 0 && getMapBlockState(worldStates, y, x).dmg > 0) {
                            var dmgamt = Math.round((getMapBlockState(worldStates, y, x).dmg/BLOCKS[thisblock].hp)*6-1);
                            if(dmgamt >= 0 && dmgamt <= 5) {
                                var imgloaded = document.getElementById('images/overlays/Dmg_'+dmgamt+'.png');
                                ctx.drawImage(imgloaded, 0, 0, 16, 16, Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                            }
                        }
                    } catch(err) {
                        console.log('err: rendering block dmg: '+thisblock);
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
    // (toadd~)

    // UI
    // Render inv bar
    var inv_boxwidth = 1;
    for(let i = 0; i < mychar.inv_menuwidth; i++) {
        // Box
        if(i == mychar.inv_selected) { ctx.globalAlpha = 1.0; }
        else { ctx.globalAlpha = 0.5; }
        var imgloaded = document.getElementById('images/ui/Invbox2.png');
        ctx.drawImage(imgloaded, 0, 0, 20, 20, 20+i*44, 20, 40, 40);
        ctx.globalAlpha = 1.0;
        // Contents
        if(mychar.inventory.length > i) {
            // Block img
            if(BLOCKS[mychar.inventory[i][0]].img != 'none') {
                var imgloaded2 = document.getElementById(BLOCKS[mychar.inventory[i][0]].img);
                ctx.drawImage(imgloaded2, 0, 0, 16, 16, 24+i*44, 24, blockWidth*2, blockWidth*2);
            }
            // Amount
            if(mychar.inventory[i][1] > 1) {
                var invamt = mychar.inventory[i][1];
                ctx.fillStyle = 'white';
                ctx.font = '14px Tahoma';
                ctx.globalAlpha = 0.8;
                ctx.fillText(''+invamt, 24+i*44, 57);
            }
        }
    }
    ctx.globalAlpha = 1.0;
    // Render dbg messages
    if(dbgm) {
        ctx.fillStyle = 'black';
        ctx.font = '14px Courier New';
        ctx.globalAlpha = 1.0;
        ctx.fillText('DBG: mychar.locx='+mychar.locx, window.innerWidth-200, 20);
    }
}

// WORLDGEN FUNCTIONS
//
//

// Worldgen main
function wgenMain() {
    // Worldgen defs
    //console.log('-');
    console.log('  gen: defs');
    var worldgen_simple = false; // def: false (dbg: true)
    const worldgen_width = 90;
    const worldgen_height = 50;
    const worldgen_horizonoffset = 10;
    const worldgen_heightoffsetmax = 6;
    const worldgen_rateGrass = 0.4;
    var worldgenMap_heights = []; // Main horizon height
    var worldgenMap_heights2 = []; // Dirt offset
    worldMap = [];
    // Worldgen type
    console.log('  gen: types');
    if(worldgen_simple) {
        // Worldgen simple (for testing; flat world)
        for(let y = 0; y < worldgen_height; y++) {
            worldMap.push([]);
            for(let x = 0; x < worldgen_width; x++) {
                // air=0-9;grass=10;dirt=11-12;stone=13+
                if(y < 9+worldgen_horizonoffset) worldMap[y].push(0);
                else if(y == 9+worldgen_horizonoffset) worldMap[y].push(0);
                else if(y==10+worldgen_horizonoffset) worldMap[y].push(2);
                else if(y < 13+worldgen_horizonoffset) worldMap[y].push(1);
                else if(y >= 13+worldgen_horizonoffset) worldMap[y].push(4);
            }
        }
    } else {
        // Worldgen normal
        // Generate biomes (toadd)
        // Generate topography (heights) (toadd)
        var lastHeight = 0;
        for(let x = 0; x < worldgen_width; x++) {
            var thisbiome = 0;
            var newHeight = lastHeight;
            // Generate new heights
            if(thisbiome == 0) {
                newHeight += Math.floor(Math.random()*3)-1; // Normal biome
            } else if(thisbiome == 1) {
                newHeight += Math.floor(Math.random()*5)-2; // Desert biome
            } else if(thisbiome == 12) {
                newHeight += Math.floor(Math.random()*10)-5; // RARE mesa biome
            }
            if(newHeight > worldgen_heightoffsetmax) newHeight = worldgen_heightoffsetmax;
            if(newHeight < -1*worldgen_heightoffsetmax) newHeight = -1*worldgen_heightoffsetmax;
            var newHeight2 = Math.floor(Math.random()*2);
            // Add
            worldgenMap_heights.push(newHeight);
            worldgenMap_heights2.push(newHeight2);
            lastHeight = newHeight;
        }
        // Generate blocks
        for(let y = 0; y < worldgen_height; y++) {
            worldMap.push([]);
            for(let x = 0; x < worldgen_width; x++) {
                // air=0-9;grass=10;dirt=11-12;stone=13+
                if(y < 9+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    worldMap[y].push(0); // Sky
                } else if(y == 9+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    if(Math.random() < worldgen_rateGrass) { worldMap[y].push(3); } // Tall grass
                    else { worldMap[y].push(0); }
                } else if(y==10+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    worldMap[y].push(2); // Grass
                } else if(y < 13+worldgen_horizonoffset+worldgenMap_heights[x]+worldgenMap_heights2[x]) {
                    worldMap[y].push(1); // Dirt
                } else if(y >= 13+worldgen_horizonoffset+worldgenMap_heights[x]+worldgenMap_heights2[x]) {
                    if(Math.random() < 0.2) worldMap[y].push(5); // Stone
                    else worldMap[y].push(4);
                }
            }
        }
        // Carve caves (toadd)
        // (toadd)
    }
    //console.log('-');
    console.log('loading world... generation complete');
}