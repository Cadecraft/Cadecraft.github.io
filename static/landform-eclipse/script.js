// LANDFORM ECLIPSE script

/*
TO ADD (also search: `toadd`~):
> Velocity correction veleq for time (?)
> Acceleration
> Settling down onto ground effect (falling y loc)--snap y location closer to the ground (floor/ceil)
> RESPAWN on fall too far
> Reduce air control
> Tightness of deceleration
> Worldgen: structure gen
> Worldgen: more biomes
> Characters! (+ animations) (import from liwol)
  - New characters: Iona, Horatio
> Background blocks!
> Background on screen: mountains, desert, etc.
> Background on screen: clouds
> Mining distance limit
> Title menu
> Improve existing scuffed platform collision?
> Platform: snap slightly down into it (so no standing above tree leaves)
> Renderer efficiency
> Prevent block placed inside player (next)
> Music vol settings
> Sound effects (mining, breaking, walking, etc.)
> Pickaxe mining radius range
> Multiple pickaxes
> Specialized music per region (ex. don't play desert music in highlands)
> Cookies to save progress (ask for consent)
> TOS?
> Laser beam
> Day night / eclipse cycle
> Lag on placing a block?
> World chunking
> NO LIGHT IN CAVES
> NPCs
  - Shell Trader (plus turtle enemy)
> Entity health
> Entity logic
> Entity attacking
> Tree shape diversity (acacia)
> Torches in caves
> Cave animals (spawn with cave bg wall)
> Render chunk (only loop through the blocks visible (i starts after 0))
> Circular lighting (remove corners)
> Water source generation (on destroy done, on place)
> Water physics
> Place blocks on top to destroy grass
> Prevent grass/(contains "groundPlant" key) from being placed midair
> BG blocks ? (/cave bg)
> Refactor worldMap and its functions (getMapBlock, etc.) into WorldMap class (obj called 'wmap') ?
> Worldgen smoothen cliffs
> Dmg messages turn green when all enemies are dead??
> Entity physics efficiency ?
> Render efficiency
> Projectile: check for collision halfway between applying velocity to prevent teleporting through
> DROPS: Entity drops on death (such as crab leg) (use spawnFloatingItem)
> Artifacts
> Show player holding items
> Gun pickup drops
> Random name on items, like pick or gun: use syntax "Gun: {}", "Slothful Shooter"
> Projectile imgs
> Entity piggy back jump off each other ?
> Title screen: show bar w/ trebuchet ms like in promo_Landform.psd
> More soundtracks (Tierra del Fuego, Datura)
> Bosses
> Enemy hit knockback, gore ? (esp. on crit)
> Bg: per biome (add more)
> Bg: improve desert bg
> Bg: clouds
> Inv: merge inv hotbar with the rest of inv menu?
> Inv: allow combining/merging items of same type (and calc stack excess)
> Inv: throwing out item as drop
> 1. Weapon items for player (start inv with default)
> 3. UI panel for NPC prchasing
> 4. Player weapons/tools/items should use NEGATIVE numbers for IDs, create separate data object

> Legendary weapon ideas
  - import from LiWOl (including morning star, dune slicer, etc.)
  - guitargun (bocchi the glock)

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
var dbg_fps_graph = [0];
var totalMsElapsed = 0; // ms elapsed since the loop started (used for rendering sin waves, etc.)
var globalScale = 2.0;
var blockWidth = 16;
var generateWorld = true; // def: true (dbg: true/false)
var worldMap = [
    [2,2,2],
    [1,1,1],
    [1,1,1]
];
var worldMap_biomes = []; // Will be initialized
var worldMap_heights = [];
var worldStates = [];
var world_eventState = "normal";
var veleq = 1;
var display_skipFrames = true;
var entities = [];
var projectiles = [];
var floatingItems = [];
var ui_messages = [/*{
    loc: 0, // Location (0=top left)
    color: 0, // Color (0=white)
    msg: "Game started...", // Message
    duration: 2000 // Duration in ms (fades out last 1000ms)
}*/];
const ui_maxMessages = 6;
var ui_invMenus = [];
const ui_invItemWidth = 44; // Constant
var ui_dmgMessages = [/*{
    locx: 0,
    locy: 0,
    color: "#ffffff",
    msg: "2",
    duration: 1000 // Duration in ms (fades out the last 700ms)
}*/];

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
var mychar = new Player(280, 10); // 50, 200 (if world width is 500), 280 (world width is 700)

// Load game defs: UI menus
ui_invMenus.push(
    new InvMenu("Player Inventory", 20, 20+ui_invItemWidth+24, mychar.inv_menuwidth, 0, 0, 0, mychar.inventory, false) // Player inv: top left
);

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
for(let i = 0; i < IMGS_ENTITY.length; i++) {
    // Get src url
    var imgsrc = IMGS_ENTITY[i];
    if(imgsrc == 'none') { continue; }
    imgsrc = 'static/landform-eclipse/' + imgsrc;
    // Load img
    try {
        var imgelement = document.createElement('img');
        imgelement.src = imgsrc;
        imgelement.id = IMGS_ENTITY[i];
        document.getElementById('imgfiles').append(imgelement);
        allimgs[IMGS_ENTITY[i]] = document.getElementById(IMGS_ENTITY[i]);
    } catch(err) {
        console.log('err: loading images: img_other id='+i);
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

// UI FUNCTIONS
//
//

function ui_addMessage(inmsg, induration = 2000, inloc = 0, incolor = 0, clearall = false) {
    if(clearall || ui_invMenus[0].getVisible()) { ui_messages = []; } // If clearall or if inv menu is open (prevent overlap)
    ui_messages.push({
        loc: inloc, // Location (0=top left)
        color: incolor, // Color (0=white)
        msg: inmsg, // Message
        duration: induration // Duration in ms (fades out last 1000ms)
    });
    // If greater than the max, remove first one to clear space
    if(ui_messages.length > ui_maxMessages) {
        ui_messages.splice(0, 1);
    }
}
function ui_updateMessages() {
    // Update durations and remove if necessary
    var messageIdsToRemove = [];
    for(let i = 0; i < ui_messages.length; i++) {
        ui_messages[i].duration -= gameInterval;
        if(ui_messages[i].duration < 0) {
            messageIdsToRemove.push(i);
        }
    }
    for(let i = 0; i < messageIdsToRemove.length; i++) {
        ui_messages.splice(messageIdsToRemove[i]-i, 1);
    }
}
function ui_addDmgMessage(inmsg, inlocx, inlocy, incolor="#ffffff", induration=1000) {
    ui_dmgMessages.push({
        locx: inlocx,
        locy: inlocy,
        color: incolor,
        msg: inmsg,
        duration: induration // Duration in ms (fades out the last 700ms)
    });
}
function ui_updateDmgMessages() {
    // Update durations and remove if necessary
    var dmgMessageIdsToRemove = [];
    for(let i = 0; i < ui_dmgMessages.length; i++) {
        ui_dmgMessages[i].duration -= gameInterval;
        ui_dmgMessages[i].locy -= gameInterval * 0.006 * ((ui_dmgMessages[i].duration-400)/1000);
        if(ui_dmgMessages[i].duration < 0) {
            dmgMessageIdsToRemove.push(i);
        }
    }
    for(let i = 0; i < dmgMessageIdsToRemove.length; i++) {
        ui_dmgMessages.splice(dmgMessageIdsToRemove[i]-i, 1);
    }
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
        // Drop block as a floating item
        spawnFloatingItem(locx, locy, oldblock);
        //mychar.invAddBlock(BLOCKS[oldblock].drops[i]);
        mychar.justMinedBlock = true;
    }
    // Update blocks nearby
    var blockAbove = getMapBlock(worldMap, locy-1, locx);
    if(Object.keys(BLOCKS[blockAbove]).includes('groundPlant') /*blockAbove == 3 || blockAbove == 23 || blockAbove == 24*/) { // destroy tall grass/plants (toadd checks)
        destroyBlock(locy-1, locx);
    }
    if(blockAbove == 20 || blockAbove == 19) { // if water exist above, allow down
        for(let i = 0; i < worldMap.length - locy; i++) {
            if(BLOCKS[getMapBlock(worldMap, locy+i, locx)].destroyByWater) { // getMapBlock(worldMap, locy+i, locx) == 0 || getMapBlock(worldMap, locy+i, locx) == 19
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
            if(BLOCKS[getMapBlock(worldMap, locy+i+1, locx)].destroyByWater) { // getMapBlock(worldMap, locy+i+1, locx) == 0 || getMapBlock(worldMap, locy+i+1, locx) == 19
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

// Spawn projectile
function spawnProjectile(locx, locy, directionx, directiony, critrate = 0.1, type = "normal", dmgmult = 1, fromPlayer = true) {
    var newprojectile = new Projectile(
        locx, locy,
        directionx, directiony,
        critrate,
        type,
        dmgmult,
        fromPlayer
    );
    projectiles.push(newprojectile);
}

// Spawn floating item
function spawnFloatingItem(locx, locy, id, amt = 1, itemdata = { empty: true }) {
    var newfloatingItem = new FloatingItem(locx, locy, id, amt, itemdata);
    floatingItems.push(newfloatingItem);
}

// Spawn entity (inclass should be a reference to the entity)
function spawnEntity(InClass, inlocx, inlocy, inlvl) {
    //if(InClass ) // check whether InClass extends Entity (toadd)
    var newentity = new InClass(inlocx, inlocy, inlvl);
    entities.push(newentity);
}
// Spawn entities pass (has a chance of spawning an entity across the world, if the limit is not reached yet)
function spawnEntitiesPass() {
    if(entities.length >= max_entities_natural) {
        // Maximum number of naturally spawned entities reached
        return;
    }
    // Loop across the map
    for(let x = 0; x < worldMap[0].length; x++) {
        // Determine height and biomes
        var thisbiome = worldMap_biomes[x];
        var thisheight = worldMap_heights[x];

        // Based on biome, have chances:
        if(thisbiome < ENTITY_SPAWN_RATES.length && thisbiome >= 0) { // err: ENTITY_SPAWN_RATES is not defined?
            for(let i = 0; i < ENTITY_SPAWN_RATES[thisbiome].length; i++) {
                var thisSpawnClassName = ENTITY_SPAWN_RATES[thisbiome][i].spawnClassName;
                var thisSpawnClass = ENTITY_CLASSES_FROM_STRING[thisSpawnClassName];
                var thisSpawnChance = ENTITY_SPAWN_RATES[thisbiome][i].spawnChance;
                if(Math.random() < thisSpawnChance) {
                    // Spawn
                    spawnEntity(thisSpawnClass, x, thisheight - 3);
                }
            }
        }
    }
}
// Entity spawn timer
setInterval(function() {
    spawnEntitiesPass();
}, entities_spawn_interval_seconds * 1000);

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
    if(keys['i']) { inputs.push('invmenu'); keys['i']=false; } // Inv menu: open with i, or tab? (toadd)
    for(let i = 0; i < 10; i++) {
        if(keys[''+i]) { inputs.push('inv'+i); keys[''+i]=false; }
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
        // Crouch/drop
        mychar.crouch();
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
    if(inputs.includes('invmenu')) {
        // Open/close inventory menu
        ui_invMenus[0].toggleVisible();
    }
    if(mousedown) {
        // Click
        // Send click to menus
        var clickedOnMenu = false;
        for(let i = 0; i < ui_invMenus.length; i++) {
            if(!ui_invMenus[i].getVisible()) { continue; }
            var clickWasProcessed = ui_invMenus[i].processClick(pointerx, pointery);
            if(clickWasProcessed) {
                clickedOnMenu = true;
                mousedown = false;
                break;
            }
        }
        // If clicked on menu, do not click in world
        if(clickedOnMenu) {
            // Do nothing in world
        }
        // Click in world: based on item type in player inv
        else if("isitem" in BLOCKS[mychar.invGetSelected()[0]]) {
            var thisItemSlot = mychar.invGetSelected();
            // Is item: use
            if(BLOCKS[thisItemSlot[0]].itemtype == "pick") {
                // Pick: Dig block
                if(timers["timer_mining"] <= 0 && !mychar.justPlacedBlock) {
                    // Check that pick data is valid; if not, substitute defs
                    mychar.invRequireSelectedContainsKey('efficiency', picks_default_efficiency);
                    mychar.invRequireSelectedContainsKey('cooldowntime', picks_default_cooldowntime);
                    // Try to dig block
                    var blockDamaged = tryDamageBlock(thisItemSlot[2].efficiency);
                    if(blockDamaged) {
                        timers["timer_mining"] = thisItemSlot[2].cooldowntime;
                    }
                }
            } else if(BLOCKS[thisItemSlot[0]].itemtype == "gun") {
                // Gun: shoot projectile
                if(timers["timer_shooting"] <= 0) {
                    // Check that gun data is valid; if not, substitute defs
                    mychar.invRequireSelectedContainsKey('critrate', guns_default_critrate);
                    mychar.invRequireSelectedContainsKey('dmgmult', guns_default_dmgmult);
                    mychar.invRequireSelectedContainsKey('cooldowntime', guns_default_cooldowntime);
                    mychar.invRequireSelectedContainsKey('projectiletype', guns_default_projectiletype);
                    // Determine direction to mouse (will be normalized by projectile)
                    var directionx = pointerxwr - mychar.locx;
                    var directiony = pointerywr - mychar.locy;
                    // Spawn projectile
                    spawnProjectile(
                        mychar.locx, mychar.locy,
                        directionx, directiony,
                        mychar.calculateStats().critrate + thisItemSlot[2].critrate,
                        thisItemSlot[2].projectiletype,
                        thisItemSlot[2].dmgmult,
                        true
                    );
                    // Update cooldown
                    timers["timer_shooting"] = thisItemSlot[2].cooldowntime;
                }
            } else {
                // Use item other (toadd~)
            }
        }
        else if(getMapBlock(worldMap, pointerybl, pointerxbl) == 0 && BLOCKS[mychar.invGetSelected()[0]].placeable) {
            // Place block if enabled
            if(!mychar.justMinedBlock) {
                placeBlock(pointerybl, pointerxbl, mychar.invGetSelected()[0]);
                mychar.invReduceStack(mychar.inv_selected);
                mychar.justPlacedBlock = true;
            }
        }
        else {
            // None: block is not known
        }
        // Random other click stuff
        if(!hasMusicStarted) randomMusics(); // Sounds can only play when the user has clicked
    }
    else { mychar.justPlacedBlock = false; mychar.justMinedBlock = false; }
    if(dbgm && inputs.includes('save')) {
        // Save world (only allowed in debug mode)
        download('landform_world.ccdata', JSON.stringify(worldMap));
    }
}

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
    "timer_mining": 0,
    "timer_shooting": 0
};

// Game loop
function gameLoop() {
    // Determine fps
    totalMsElapsed+= gameInterval;
    var msElapsed = Date.now() - lastDate;
    lastDate = Date.now();
    if(dbgm) {
        dbg_fps = 1/(msElapsed/1000); // inverse of (seconds per frame)
        dbg_fps_avg = ((dbg_fps)+(dbg_fps_avg)*dbg_totalframes)/(dbg_totalframes+1)
        dbg_totalframes++;
        dbg_fps_graph.unshift(dbg_fps);
        if(dbg_fps_graph.length > 1000) {
            dbg_fps_graph.pop();
        }
    }
    // Reduce timers
    for(let i = 0; i < Object.keys(timers).length; i++) {
        timers[Object.keys(timers)[i]] -= 17;
    }
    // Frame rate compensation
    var msRatio = (msElapsed / gameInterval);
    // Determine velocity equalization based on time per frame (for consistent physics speed) (deprecated)
    veleq = 1; // = msRatio;
    // Determine whether to skip frame
    var skipRenderingThisFrame = false;
    if(display_skipFrames && msRatio > 1.5) skipRenderingThisFrame = true;
    // Handle input if not dead
    updatePointerwr()
    gameInput();
    // Apply char physics
    mychar.applyPhysics(worldMap);
    // Apply entity physics, update them, remove dead
    var entityIdsToRemove = [];
    for(let i = 0; i < entities.length; i++) {
        if(!entities[i].isAlive()) { // Is dead
            entityIdsToRemove.push(i);
            continue;
        }
        entities[i].updateTarget();
        entities[i].moveToTarget(worldMap);
        entities[i].applyPhysics(worldMap);
    }
    for(let i = 0; i < entityIdsToRemove.length; i++) {
        entities.splice(entityIdsToRemove[i]-i, 1);
    }
    // Apply projectile physics, update them, remove destroyed
    var projectileIdsToRemove = [];
    for(let i = 0; i < projectiles.length; i++) {
        projectiles[i].applyPhysics();
        var destroyed = projectiles[i].update(worldMap);
        if(destroyed) {
            projectileIdsToRemove.push(i);
            continue;
        }
    }
    for(let i = 0; i < projectileIdsToRemove.length; i++) {
        projectiles.splice(projectileIdsToRemove[i]-i, 1);
    }
    // Apply floating item physics, update them, remove destroyed
    var floatingItemIdsToRemove = [];
    for(let i = 0; i < floatingItems.length; i++) {
        floatingItems[i].applyPhysics(worldMap);
        var destroyed = floatingItems[i].update();
        if(destroyed) {
            floatingItemIdsToRemove.push(i);
            continue;
        }
    }
    for(let i = 0; i < floatingItemIdsToRemove.length; i++) {
        floatingItems.splice(floatingItemIdsToRemove[i]-i, 1);
    }
    
    // Render
    if(!skipRenderingThisFrame) {
        // Render
        render(dbgm);
    }
    else if(dbgm && dbg_fps_graph.length > 0) {
        // Skipped, and in debug mode, so display
        dbg_fps_graph[0] = 0;
    }
}

