// LANDFORM ECLIPSE script

// Render
function render(indbgm = false) {
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
    // Clear canvas with sky (determine sky color)
    var skyColor = '#54cbf0';
    var horizonColor = '#14191e';
    if(world_eventState == 'normal') {
        skyColor = '#54cbf0'; // Azure
        horizonColor = '#14191e'; // Slate
    }
    else if(world_eventState == 'eclipse') {
        skyColor = '#1f0d11'; // Dark red
        horizonColor = '#0d1114'; // Dark slate
    }
    //ctx.fillStyle = 'rgb(20, 25, 30)';
    ctx.fillStyle = skyColor; //'#60a3b5';
    ctx.fillRect(0, 0, c.width, c.height);
    // Background
    // Fake bg
    ctx.fillStyle = horizonColor;
    var parallaxMedianY = (-8*mychar.locy) + (c.height/2);
    ctx.fillRect(0, parallaxMedianY, c.width, c.height-parallaxMedianY);

    // WORLD
    // Render blocks
    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
    var winWidthBlockHalf = c.width / iwidth - 2; // only render what is visible
    var winHeightBlockHalf = c.height / iwidth - 2; // - 2 (for both)
    for(let y = clamp(Math.floor(mychar.locy - winHeightBlockHalf), 0, worldMap.length);
        y < clamp(Math.floor(mychar.locy + winHeightBlockHalf), 0, worldMap.length); y++) { // let y = 0; y < worldMap.length; y++
        for(let x = clamp(Math.floor(mychar.locx - winWidthBlockHalf), 0, worldMap[0].length);
            x < clamp(Math.floor(mychar.locx + winWidthBlockHalf), 0, worldMap[0].length); x++) { // let x = 0; x < worldMap[0].length; x++
            // Each block:
            var thisblock = worldMap[y][x];
            if(thisblock >= Object.keys(BLOCKS).length) { continue }; // Error: do not render block
            if(BLOCKS[thisblock].img == 'none') {
                // Do not draw
            } else {
                var drawx = (x+offsetx)*iwidth;
                var drawy = (y+offsety)*iwidth;
                // Determine location and whether is in view; cull outside (no longer needed with new loop conditions)
                //if(drawx > iwidth*-1 && drawx < window.innerWidth && drawy > iwidth*-1 && drawy < window.innerHeight) {
                // Determine light level (if 0, do not draw; just draw black)
                var lightLvl = getMapBlockState(worldStates, y, x).light; //getBlockLightLvl(y, x);
                if(lightLvl == 0) {
                    ctx.fillStyle = 'rgb(0, 0, 0)';
                    ctx.fillRect(Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                    continue;
                }
                // Draw block
                try {
                    //var imgloaded = document.getElementById(BLOCKS[thisblock].img);
                    ctx.drawImage(allimgs[BLOCKS[thisblock].img], 0, 0, 16, 16, Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                } catch(err) { console.log('err: rendering block: '+thisblock+': '+err); }
                // Draw damage
                try {
                    if(BLOCKS[thisblock].hp > 0 && getMapBlockState(worldStates, y, x).dmg > 0) {
                        var dmgamt = Math.round((getMapBlockState(worldStates, y, x).dmg/BLOCKS[thisblock].hp)*6-1);
                        if(dmgamt >= 0 && dmgamt <= 5) {
                            //var imgloaded = document.getElementById('images/overlays/Dmg_'+dmgamt+'.png');
                            ctx.drawImage(allimgs['images/overlays/Dmg_'+dmgamt+'.png'], 0, 0, 16, 16, Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                        }
                    }
                } catch(err) { console.log('err: rendering block dmg: '+thisblock); }
                // Draw light level
                if(lightLvl < 5) {
                    ctx.fillStyle = 'rgb(0, 0, 0)';
                    if(lightLvl == 4) ctx.globalAlpha = 0.2;
                    else if(lightLvl == 3) ctx.globalAlpha = 0.5;
                    ctx.fillRect(Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                    ctx.globalAlpha = 1;
                }
                //}
            }
            // Dbg: is highlighted?
            if(indbgm && ((mychar.dbg_highl_bl1[1] == x && mychar.dbg_highl_bl1[0] == y)
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
    } catch(err) { console.log('err: rendering PLAYER'); }

    // FX
    // (toadd~)

    // UI
    // Render inv bar
    var inv_boxwidth = 1;
    for(let i = 0; i < mychar.inv_menuwidth; i++) {
        // Box
        var boxFile = 'images/ui/Invbox2.png';
        if(i == mychar.inv_selected) {
            ctx.globalAlpha = 1.0;
            boxFile = 'images/ui/Invbox2_Select.png';
        } else { ctx.globalAlpha = 0.5; }
        ctx.drawImage(allimgs[boxFile], 0, 0, 20, 20, 20+i*44, 20, 40, 40);
        ctx.globalAlpha = 1.0;
        // Contents
        if(mychar.inventory.length > i) {
            // Block img
            if(mychar.inventory[i][0] >= Object.keys(BLOCKS).length) { continue }; // Error: do not render block
            if(BLOCKS[mychar.inventory[i][0]].img != 'none') {
                //var imgloaded2 = document.getElementById(BLOCKS[mychar.inventory[i][0]].img);
                ctx.drawImage(allimgs[BLOCKS[mychar.inventory[i][0]].img], 0, 0, 16, 16, 24+i*44, 24, blockWidth*2, blockWidth*2);
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
        ctx.fillText('     DEGUG MENU', window.innerWidth-250, 20);
        dbgmren(ctx, 2, 'mychar.locx= '+roundpretty(mychar.locx));
        dbgmren(ctx, 3, 'mychar.locy= '+roundpretty(mychar.locy));
        dbgmren(ctx, 4, 'pointerxbl = '+roundpretty(pointerxbl));
        dbgmren(ctx, 5, 'pointerybl = '+roundpretty(pointerybl));
        dbgmren(ctx, 6, 'pointer_bl = type '+getMapBlock(worldMap, pointerybl, pointerxbl));
        dbgmren(ctx, 7, 'fps        = '+roundpretty(dbg_fps));
        dbgmren(ctx, 8, 'fps_avg    = '+roundpretty(dbg_fps_avg));
    }
}

// Dbg message renderer
function dbgmren(ctx, order, msg) {
    const vertSpacing = 20;
    const rightOffset = 250;
    ctx.fillText('DBG: '+msg, window.innerWidth-rightOffset, vertSpacing*order);
}
function roundpretty(innum) {
    return ""+(Math.round(innum*100)/100);
}