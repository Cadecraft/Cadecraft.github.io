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
    var parallaxMedianY = (-8*mychar.locy) + (c.height/2);
    var thisbiome = worldMap_biomes[Math.floor(Math.max(0, Math.min(worldMap_biomes.length, mychar.locx)))]; // based on currently in biome (toadd: biome detection)
    var doesBiomeBgExist = thisbiome < BGS_BYBIOME.length && thisbiome >= 0 && Object.keys(allimgs).includes(BGS_BYBIOME[thisbiome]);
    if(!doesBiomeBgExist) {
        // Fake flat bg because img does not exist
        ctx.globalAlpha = 1.0;
        ctx.fillStyle = horizonColor;
        ctx.fillRect(0, parallaxMedianY, c.width, c.height-parallaxMedianY);
    } else {
        // Img scrolling bg
        ctx.globalAlpha = 1; // 1, 0.7
        var thisimg = allimgs[BGS_BYBIOME[thisbiome]];
        for(let i = 0; i < 10; i++) {
            var drawx = i*thisimg.naturalWidth*4;
            if(drawx > window.innerWidth) { break; } // Off screen
            ctx.drawImage(thisimg, 0, 0, thisimg.naturalWidth, thisimg.naturalHeight, drawx, parallaxMedianY, thisimg.naturalWidth * 4, thisimg.naturalHeight * 4);
        }
    }
    ctx.globalAlpha = 1.0;

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
            if(indbgm && ((mychar.dbg_highl_bl1[0] == x && mychar.dbg_highl_bl1[1] == y)
                || (mychar.dbg_highl_bl2[0] == x && mychar.dbg_highl_bl2[1] == y))) {
                // Highlight~
                var drawx = (x+offsetx)*iwidth;
                var drawy = (y+offsety)*iwidth;
                ctx.fillStyle = 'rgb(255, 84, 147)'; // 'rgb(0, 255, 255)' , rgb(255, 84, 124)
                ctx.globalAlpha = 0.5;
                ctx.fillRect(Math.floor(drawx), Math.floor(drawy), Math.ceil(iwidth), Math.ceil(iwidth));
                ctx.globalAlpha = 1.0;
            }
        }
    }
    ctx.globalAlpha = 1.0;

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
    // Render entities
    for(let i = 0; i < entities.length; i++) {
        var thisentity = entities[i];
        // Render
        var edrawx = (thisentity.locx+offsetx)*iwidth// - toDrawImg.naturalWidth; // - toDrawImg.naturalWidth
        var edrawy = (thisentity.locy+offsety)*iwidth// - toDrawImg.naturalHeight;
        if(!(edrawx > iwidth*-1 && edrawx < window.innerWidth && edrawy > iwidth*-1 && edrawy < window.innerHeight)) {
            continue; // Entity not visible
        }
        var toDrawImg = allimgs[thisentity.getTextureFilename()];
        ctx.drawImage(toDrawImg, 0, 0, toDrawImg.naturalWidth, toDrawImg.naturalHeight, Math.floor(edrawx), Math.floor(edrawy), Math.floor(toDrawImg.naturalWidth*globalScale), Math.floor(toDrawImg.naturalHeight*globalScale));
        // hp bar + stats (if has taken dmg)
        if(thisentity.hp < thisentity.hpmax) {
            const hpbar_width = 60;
            const hpbar_height = 6;
            ctx.globalAlpha = 0.7;
            ctx.fillStyle = 'rgb(0, 0, 0)';
            ctx.fillRect(edrawx - 6, edrawy - 20, hpbar_width * (1), hpbar_height);
            ctx.fillStyle = 'rgb(200, 0, 0)';
            ctx.fillRect(edrawx - 6, edrawy - 20, hpbar_width * (thisentity.hp / thisentity.hpmax), hpbar_height);
            ctx.fillStyle = 'rgb(255, 255, 255)';
            ctx.font = '11px Tahoma';
            ctx.fillText("["+thisentity.lvl+"] "+thisentity.name, edrawx - 6, edrawy - 27);
        }
    }

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
        ctx.drawImage(allimgs[boxFile], 0, 0, 20, 20, 20+i*ui_invItemWidth, 20, 40, 40);
        ctx.globalAlpha = 1.0;
        // Contents
        if(mychar.inventory.length <= i) { continue; } // Player inv is not populated with blocks this far
        // Contents: block img
        var thisblockdata = mychar.inventory[i];
        if(thisblockdata[0] >= Object.keys(BLOCKS).length) { continue; } // Error: block ID does not exist
        if(BLOCKS[thisblockdata[0]].img != 'none') {
            //var imgloaded2 = document.getElementById(BLOCKS[thisblockdata[0]].img);
            ctx.drawImage(allimgs[BLOCKS[thisblockdata[0]].img], 0, 0, 16, 16, 24+i*ui_invItemWidth, 24, blockWidth*2, blockWidth*2);
        }
        // Contents: amount
        if(thisblockdata[1] > 1) {
            var invamt = thisblockdata[1];
            ctx.fillStyle = 'white';
            ctx.font = '14px Tahoma';
            ctx.globalAlpha = 0.8;
            ctx.fillText(''+invamt, 24+i*ui_invItemWidth, 57);
        }
    }
    ctx.globalAlpha = 1.0;
    // Render ui_messages
    ctx.font = '12px Tahoma';
    ui_updateMessages();
    for(let i = 0; i < ui_messages.length; i++) {
        var thismsg = ui_messages[ui_messages.length - i - 1];
        ctx.globalAlpha = Math.min(thismsg.duration/1000.0, 1)*0.8;
        // Render (toadd)
        ctx.fillStyle = 'black';
        ctx.fillRect(20, 20+ui_invItemWidth+(i)*24, 150, 20);
        ctx.fillStyle = 'white';
        ctx.fillText(thismsg.msg, 23, 35+ui_invItemWidth+(i)*24);
    }
    ctx.globalAlpha = 1.0;
    // Render inv menus (if visible)
    for(let i = 0; i < ui_invMenus.length; i++) {
        var thismenu = ui_invMenus[i];
        if(!thismenu.visible) { continue; } // Invisible: do not render
        // Bg
        ctx.fillStyle = 'black';
        ctx.globalAlpha = thismenu.bgOpacity; // 0.2, 0.8
        ctx.fillRect(thismenu.menuLocx, thismenu.menuLocy, thismenu.menuWidthPixels, thismenu.menuHeightPixels);
        // Each block (render in the same style as inv bar)
        var thismenuContents = thismenu.getContentsArr2d();
        if(thismenuContents.length <= 0) { continue; } // No items
        for(let y = 0; y < thismenuContents.length; y++) {
            for(let x = 0; x < thismenuContents[y].length; x++) {
                // Box
                var boxFile = 'images/ui/Invbox2.png';
                if(y*thismenu.contentsWidth+x == thismenu.contentsSelected) {
                    ctx.globalAlpha = 1.0;
                    boxFile = 'images/ui/Invbox2_Select.png';
                } else { ctx.globalAlpha = 0.5; }
                ctx.drawImage(allimgs[boxFile], 0, 0, 20, 20, thismenu.menuLocx+thismenu.menuMarginx+x*ui_invItemWidth, thismenu.menuLocy+thismenu.menuMarginy+y*ui_invItemWidth, 40, 40);
                ctx.globalAlpha = 1.0;
                // Contents
                // Contents: block img
                var thisblockdata = thismenuContents[y][x];
                if(thisblockdata[0] >= Object.keys(BLOCKS).length) { continue; } // Error: block ID does not exist
                if(BLOCKS[thisblockdata[0]].img != 'none') {
                    ctx.drawImage(allimgs[BLOCKS[thisblockdata[0]].img], 0, 0, 16, 16, thismenu.menuLocx+thismenu.menuMarginx+4+x*ui_invItemWidth, thismenu.menuLocy+thismenu.menuMarginy+4+y*ui_invItemWidth, blockWidth*2, blockWidth*2);
                }
                // Contents: amount
                if(thisblockdata[1] > 1) {
                    var invamt = thisblockdata[1];
                    ctx.fillStyle = 'white';
                    ctx.font = '14px Tahoma';
                    ctx.globalAlpha = 0.8;
                    ctx.fillText(''+invamt, thismenu.menuLocx+thismenu.menuMarginx+4+x*ui_invItemWidth, thismenu.menuLocy+thismenu.menuMarginy+4+33+y*ui_invItemWidth);
                }
            }
        }
    }
    ctx.globalAlpha = 1.0;
    // Render dbg info
    if(dbgm) {
        // Dbg messages
        ctx.fillStyle = 'black';
        ctx.font = '14px Courier New';
        ctx.globalAlpha = 1.0;
        ctx.fillText('     DEGUG MENU', window.innerWidth-250, 20);
        dbgmren(ctx, 2, 'mychar.locx= '+roundpretty(mychar.locx));
        dbgmren(ctx, 3, 'mychar.locy= '+roundpretty(mychar.locy));
        dbgmren(ctx, 4, 'pointerxbl = '+roundpretty(pointerxbl));
        dbgmren(ctx, 5, 'pointerybl = '+roundpretty(pointerybl));
        dbgmren(ctx, 6, 'pointer_bl = type '+getMapBlock(worldMap, pointerybl, pointerxbl));
        dbgmren(ctx, 7, 'biome      = '+worldMap_biomes[Math.min(worldMap_biomes.length, Math.max(Math.floor(mychar.locx), 0))])
        dbgmren(ctx, 8, 'fps        = '+roundpretty(dbg_fps));
        dbgmren(ctx, 9, 'fps_avg    = '+roundpretty(dbg_fps_avg));
        // Dbg fps graph (to the left)
        ctx.fillStyle = 'black';
        ctx.fillRect(window.innerWidth-600, 20, 2, 70);
        for(let i = 0; i < Math.min(dbg_fps_graph.length, 500); i++) {
            var thisfps = dbg_fps_graph[i];
            if(thisfps < 56) { ctx.fillStyle = 'red'; }
            else if(thisfps > 64) { ctx.fillStyle = 'green'; }
            else { ctx.fillStyle = 'black'; }
            ctx.globalAlpha = 1-(i/500);
            ctx.fillRect(window.innerWidth-600 + i, 20 + (70-thisfps), 2, 2);
        }
    }
    ctx.globalAlpha = 1.0;
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