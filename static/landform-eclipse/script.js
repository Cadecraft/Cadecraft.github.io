// LANDFORM ECLIPSE script

/*
TO ADD (also search: `toadd`~):
> Velocity correction veleq for time (?)
> Acceleration
> Settling down onto ground effect (falling y loc)--snap y location closer to the ground (floor/ceil)
> Respawn on fall too far
> Reduce air control
> Tightness of deceleration
> Characters! (+ animations) (import from liwol)
> Background blocks!
> Background on screen
> Mining distance limit
> Title menu
> Platform collision (tree leaves) (figure out from liwol)
> Plants erasing if block below is mined
> Renderer efficiency
> Prevent block placed inside player
> Music vol settings
> Sound effects (mining, breaking, walking, etc.)
> Pickaxe leveling/upgrading (and reset to default efficiency being 1) (Maybe use STACK AMT as level?)
> Specialized music per region (ex. don't play desert music in highlands)
> Biomes
> Cookies to save progress (ask for consent)
> Laser beam
> Water physics
> Lag on placing a block?
> World chunking!
> NPCs
> Enemies
> Inv management
> Render chunk (only loop through the blocks visible (i starts after 0))
> Circular lighting (remove corners)
> Water source generation (on destroy done, on place)
> Water physics

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
var dbg_fps = 0;
var dbg_totalframes = 0;
var dbg_fps_avg = 0;
var globalScale = 2.0;
var blockWidth = 16;
var generateWorld = true; // def: true (dbg: true/false)
var worldMap = [
    [2,2,2],
    [1,1,1],
    [1,1,1]
];
var worldStates = [];
var world_eventState = "normal";
var enemies = [];

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
                    'light': 5,
                    'state': 0
                });
            }
        }
        // Light lvls (update for states)
        updateBlockLightLvls();
    } catch(err) { console.log('err: loading map or loading world states'); }
    console.log('loading world: completed~!');
}
mapRegen(generateWorld);

// Load game defs: player character (mychar)
var mychar = new Player(200, 10); // 50, 10; 200, 10

// Load game defs: music/audios
var gameMusics = [];
for(let i = 0; i < MUSICS.length; i++) {
    // Create music
    try {
        var thismusic = new Audio('static/landform-eclipse/'+MUSICS[i]);
        thismusic.volume = MUSICS_VOL;
        thismusic.addEventListener('ended', function() {
            randomMusics();
        });
        gameMusics.push(thismusic);
    } catch(err) { console.log('err: loading sounds: music id='+i); }
}
// Audios - func
var hasMusicStarted = false; // User must first interact with document before sound can play
function playSoundOnce(soundin) {
    try {
        soundin.currentTime=0;
        soundin.play();
    } catch(err) { console.log('err: playSoundOnce() failed'); }
}
function randomMusics() {
    if(!hasMusicStarted) { hasMusicStarted = true; }
    var choseni = Math.floor(Math.random() * gameMusics.length);
    console.log('music: now playing: '+MUSICS[choseni]);
    var chosen = gameMusics[choseni];
    playSoundOnce(chosen);
}

// Load images to the html
var allimgs = {};
//var otherimgs = {};
console.log('loading images: loading...');
for(let i = BLOCKS_startsat; i < Object.keys(BLOCKS).length+BLOCKS_startsat; i++) {
    // Get src url
    var imgsrc = BLOCKS[i].img;
    if(imgsrc == 'none') { continue; }
    imgsrc = 'static/landform-eclipse/' + imgsrc;
    // Load img
    try {
        var imgelement = document.createElement('img');
        imgelement.src = imgsrc;
        imgelement.id = BLOCKS[i].img;
        document.getElementById('imgfiles').append(imgelement);
        allimgs[BLOCKS[i].img] = document.getElementById(BLOCKS[i].img);
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
        var imgelement = document.createElement('img');
        imgelement.src = imgsrc;
        imgelement.id = IMGS_OTHER[i];
        document.getElementById('imgfiles').append(imgelement);
        allimgs[IMGS_OTHER[i]] = document.getElementById(IMGS_OTHER[i]);
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
        'light': 5,
        'state': -1
    }; }
}
function setMapBlockState(locy, locx, key, val) {
    if(locy >= 0 && locy < worldStates.length && locx >= 0 && locx < worldStates[0].length) {
        worldStates[locy][locx][key] = val;
        return true;
    } else { return false; }
}
// Download file function
function download(filename, text) {
    console.log('Attempt to download: '+filename);
    // Create element
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,'+encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    // Activate and remove
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// WORLD FUNCTIONS
//
//

function tryDamageBlock(indmg) {
    // Get map block (air = void = 0)
    var thisblock = getMapBlock(worldMap, pointerybl, pointerxbl);
    var thisblockState = getMapBlockState(worldStates, pointerybl, pointerxbl);
    if(BLOCKS[thisblock].hardness > 0 && thisblockState.state != -1) { // determines if mineable
        // Deal damage to block
        worldStates[pointerybl][pointerxbl].dmg+=indmg;
        // Check that block health is in range
        if(worldStates[pointerybl][pointerxbl].dmg >= BLOCKS[thisblock].hp) {
            destroyBlock(pointerybl, pointerxbl);
        } else {
            // Nothing
        }
        return true;
    }
    else { return false; }
}

// Destroy block, drop items, trigger extra events if necessary (including light level changes) (toadd)
function destroyBlock(locy, locx) {
    var oldblock = getMapBlock(worldMap, locy, locx);
    var oldblockState = getMapBlockState(worldStates, locy, locx);
    worldMap[locy][locx] = 0;
    worldStates[locy][locx].dmg = 0;
    worldStates[locy][locx].state = 0;
    for(let i = 0; i < BLOCKS[oldblock].drops.length; i++) {
        mychar.invAddBlock(BLOCKS[oldblock].drops[i]);
        mychar.justMinedBlock = true;
    }
    // Update blocks nearby
    if(getMapBlock(worldMap, locy-1, locx) == 3) { // destroy tall grass (toadd checks)
        destroyBlock(locy-1, locx);
    }
    if(getMapBlock(worldMap, locy-1, locx) == 20 || getMapBlock(worldMap, locy-1, locx) == 19) { // if water exist above, allow down
        for(let i = 0; i < worldMap.length - locy; i++) {
            if(getMapBlock(worldMap, locy+i, locx) == 0 || getMapBlock(worldMap, locy+i, locx) == 19) {
                placeBlock(locy+i, locx, 20);
            } else { break };
        }
    }
    if(oldblock == 19) { // if water source, remove, and make below water block a source // (old): destroy water generated below
        if(getMapBlock(worldMap, locy+1, locx) == 20) {
            placeBlock(locy+1, locx, 19);
        }
        /*for(let i = 0; i < worldMap.length - locy - 1; i++) {
            if(getMapBlock(worldMap, locy+i+1, locx) == 20) {
                destroyBlock(locy+i+1, locx);
            } else { break };
        }*/
    }
    // Light lvl change: 1) was/is now block a light source? if so, for all blocks within 8 away, recalc lvl and store
    updateBlockLightLvls(locy-7, 15, locx-7, 15);
    return true;
}
// Place block
function placeBlock(locy, locx, blockid) {
    worldMap[locy][locx] = blockid;
    worldStates[locy][locx].dmg = 0;
    worldStates[locy][locx].state = 0;
    // Update light lvls
    updateBlockLightLvls(locy-7, 15, locx-7, 15);
    if(blockid == 19) { // if water source, generate water below
        for(let i = 0; i < worldMap.length - locy - 1; i++) {
            if(getMapBlock(worldMap, locy+i+1, locx) == 0 || getMapBlock(worldMap, locy+i+1, locx) == 19) {
                placeBlock(locy+i+1, locx, 20);
            } else { break };
        }
        if(getMapBlock(worldMap, locy-1, locx) == 20 || getMapBlock(worldMap, locy-1, locx) == 19) { // if water exist above, merge in
            worldMap[locy][locx] = 20;
        }
    }
}

function getBlockLightLvl(locy, locx) {
    // ADD closest x
    var greatestLightLvl = 0;
    for(let y = -7; y < 7+1; y++) {
        for(let x = -7; x < 7+1; x++) {
            // If block is touching any nearby air (and is light out) OR is near torch:
            resultBlock = getMapBlock(worldMap, locy+y, locx+x);
            if( (resultBlock == 0 && world_eventState != "eclipse") || resultBlock == 14 || resultBlock == 13 ) {
                if(x > -3 && x < 3 && y > -3 && y < 3) {
                    return 5; // Since 5 is the greatest, no need to continue
                } else if(x > -5 && x < 5 && y > -5 && y < 5) {
                    if(greatestLightLvl < 4) greatestLightLvl = 4;
                } else { if(greatestLightLvl < 3) greatestLightLvl = 3; }
            }
        }
    }
    // Not touching any air
    return greatestLightLvl;
}

function updateBlockLightLvls(y_start=0, y_len=-1, x_start=0, x_len=-1) {
    var y_len2 = y_len;
    var x_len2 = x_len;
    if(y_len == -1) y_len2 = worldMap.length; // -1 = use full map
    if(x_len == -1) x_len2 = worldMap[0].length;
    for(let y = 0+y_start; y < y_start+y_len2; y++) {
        for(let x = 0+x_start; x < x_start+x_len2; x++) {
            setMapBlockState(y, x, 'light', getBlockLightLvl(y, x));
        }
    }
    return true;
}

// Set world event state (and updates)
function setWorldEventState(newstate) {
    world_eventState = newstate;
    updateBlockLightLvls();
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
        var l = e.key.toLowerCase(); // All keys are lowercase
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
var lastDate = Date.now();
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
    // Determine fps
    if(dbgm) {
        var msElapsed = Date.now() - lastDate;
    lastDate = Date.now();
    dbg_fps = 1/(msElapsed/1000); // inverse of (seconds per frame)
    dbg_fps_avg = ((dbg_fps)+(dbg_fps_avg)*dbg_totalframes)/(dbg_totalframes+1)
    dbg_totalframes++;
    }
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
    render(dbgm);
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
    if(keys['v'] && keys['e']) { inputs.push('save'); keys['v']=false; keys['e']=false; }
    if(keys['arrowleft']) { inputs.push('invl'); keys['arrowleft']=false; } // All keys are lowercase
    if(keys['arrowright']) { inputs.push('invr'); keys['arrowright']=false; }
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
            // Select inventory based on number key
            if(i == 0) { mychar.invSetSelected(9); }
            else { mychar.invSetSelected(i-1); }
        }
    }
    if(inputs.includes('invl')) {
        // Select inventory: left 1 (decrement)
        console.log('e');
        mychar.invIncrementSelected(-1);
    }
    if(inputs.includes('invr')) {
        // Select inventory: right 1 (increment)
        mychar.invIncrementSelected(1);
    }
    if(mousedown) {
        // Click
        // Based on item type in player inv
        if(mychar.invGetSelected()[0] == -100) {
            // Use item (toadd~)
        }
        else if(getMapBlock(worldMap, pointerybl, pointerxbl) == 0 && BLOCKS[mychar.invGetSelected()[0]].placeable) {
            // Place block if enabled
            if(!mychar.justMinedBlock) {
                placeBlock(pointerybl, pointerxbl, mychar.invGetSelected()[0]);
                mychar.invReduceBlock(mychar.inv_selected);
                mychar.justPlacedBlock = true;
            }
        }
        else {
            // Dig block
            if(timers["timer_mining"] <= 0 && (/*mychar.invGetSelected()[0] == -1 || */mychar.invGetSelected()[0] == 8) && !mychar.justPlacedBlock) {
                // Try to dig block
                var blockDamaged = tryDamageBlock(mychar.miningefficiency);
                if(blockDamaged) {
                    timers["timer_mining"] = mychar.cooldown_mining;
                }
            }
        }
        // Random other click stuff
        if(!hasMusicStarted) randomMusics();
    }
    else { mychar.justPlacedBlock = false; mychar.justMinedBlock = false; }
    if(dbgm && inputs.includes('save')) {
        // Save world (only allowed in debug mode)
        download('landform_world.ccdata', JSON.stringify(worldMap));
    }
}