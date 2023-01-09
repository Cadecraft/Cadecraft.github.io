// LANDFORM ECLIPSE script

// Worldgen functions
// Worldgen main
function wgenMain() {
    // Worldgen defs
    //console.log('-');
    console.log('  gen: defs');
    var worldgen_simple = false; // def: false (dbg: true)
    var worldgenMap_biomes = [];
    var worldgenMap_heights = []; // Main horizon height
    var worldgenMap_heights2 = []; // Dirt offset
    var worldgenMap_features = []; // Features such as trees, etc.
    var worldgenMap_structures = []; // Structures such as houses, etc. { type, locx, locy }
    var worldgenMap_waters = []; // Water levels (-1 = none)
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
        // Biomes (l->r): 4 Lbeach, 1 desert, 0 highlands, 2 plains, 3 mountains, 5 Rbeach
        // Per biome:
        //  Lbeach: ocean, sand, clams, palms, islands(?)
        //  Desert: sand, mesa, cactus, caves, oasis(?), lilies
        //  Highlands: karst, small villages, blue, trees
        //  Plains: wheat, lakes, big villages, expansive, flat, tree "leaf" type = green
        //  Mountains: tall, ice and snow, caves, crystals, tree "leaf" type = sakura
        //  Rbeach: arctic ocean, ice and snow, igloo
        // Generate topography (heights and features)
        for(let x = 0; x < worldgen_width; x++) {
            var biomeProgress = Math.floor(x/worldgen_width * worldgen_totalBiomes);
            worldgenMap_biomes.push(worldgen_biomesOrder[biomeProgress]);
            worldMap_biomes.push(worldgen_biomesOrder[biomeProgress]);
        }
        var lastHeight = 0;
        var lastBiome = 4;
        var blocksSinceNewBiome = 0;
        for(let x = 0; x < worldgen_width; x++) {
            var thisbiome = worldgenMap_biomes[x];
            if(thisbiome != lastBiome) { lastBiome = thisbiome; blocksSinceNewBiome = 0; }
            blocksSinceNewBiome++;
            var newHeight = lastHeight;
            var newFeature = "";
            var newWater = -1;
            // Biome transition: height resets to 0 over time
            if(blocksSinceNewBiome <= 4) {
                newHeight = Math.floor(lastHeight/1.5); // /1.5 -- seeking asymptote of 0
            }
            // Generate new heights
            if(thisbiome == 0) {
                newHeight += Math.floor(Math.random()*3)-1; // Normal (highlands) biome
            }
            else if(thisbiome == 1) {
                newHeight += Math.floor(Math.random()*2.65)-(1); // Desert biome
            }
            else if(thisbiome == 12) {
                newHeight += Math.floor(Math.random()*10)-5; // RARE mesa biome
            }
            else if(thisbiome == 2) {
                if(Math.random() < 0.3) { newHeight += Math.floor(Math.random()*3)-1; } // Plains biome is flatter
            }
            if(newHeight > worldgen_heightoffsetmax) newHeight = worldgen_heightoffsetmax;
            if(newHeight < -1*worldgen_heightoffsetmax) newHeight = -1*worldgen_heightoffsetmax;
            var newHeight2 = Math.floor(Math.random()*2);
            // Generate new features
            if(thisbiome == 0) { // Normal (highlands) biome
                if(Math.random() < worldgen_rateTrees && x < worldgen_width-6 && x > 5) { newFeature = "tree"; }
                else if(Math.random() < worldgen_rateGrass) { newFeature = "tall grass"; }
                if(newHeight > worldgen_heightoffsetmax - worldgen_waterLevel) { // Water spawn at low levels
                    newWater = worldgen_heightoffsetmax - worldgen_waterLevel;
                }
            } else if(thisbiome == 1) { // Desert biome
                if(Math.random() < worldgen_rateTrees && x < worldgen_width-6 && x > 5) { newFeature = "dune lily"; }
                else if(Math.random() < worldgen_rateGrass) { newFeature = "dune cacti"; }
            } else if(thisbiome == 2) { // Plains biome
                if(Math.random() < worldgen_rateTrees && x < worldgen_width-6 && x > 5) { newFeature  = "hay bale"; }
                else if(Math.random() < worldgen_rateGrass + 0.2) { newFeature = "tall plains grass"; }
            }
            // Generate new structures?
            if(thisbiome == 2) { // Plains biome
                if(Math.random() < 0.01) {
                    worldgenMap_structures.push({ type: "plains house", locx: x, locy: newHeight });
                }
            }
            // Add
            worldgenMap_heights.push(newHeight);
            worldgenMap_heights2.push(newHeight2);
            worldgenMap_features.push(newFeature);
            worldgenMap_waters.push(newWater);
            // Updates
            lastHeight = newHeight;
        }
        // Generate blocks
        for(let y = 0; y < worldgen_height; y++) {
            worldMap.push([]);
            for(let x = 0; x < worldgen_width; x++) {
                var thisbiome = worldgenMap_biomes[x];
                // air=0-9;grass=10;dirt=11-12;stone=13+
                /*if(y >= worldgenMap_waters[x]+worldgen_horizonoffset) {
                    worldMap[y].push(19); // Water source
                } else*/
                if(y < 9+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    worldMap[y].push(0); // Sky
                }
                else if(y == 9+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    // Features (1 block above ground)
                    if(worldgenMap_features[x] == "tall grass") { worldMap[y].push(3); }
                    else if(worldgenMap_features[x] == "tree") {
                        worldMap[y].push(11);
                        let treeHeight = Math.floor(Math.random()*4)+2;
                        for(let i = 0; i < treeHeight; i++) { worldMap[y-i-1][x] = 11; }
                        for(let i = 0; i < 5; i++) { worldMap[y-treeHeight-1][x+i-2] = 12; }
                    }
                    else if(worldgenMap_features[x] == "dune cacti") { worldMap[y].push(23); }
                    else if(worldgenMap_features[x] == "dune lily") {
                        worldMap[y].push(24);
                        let lilyHeight = Math.floor(Math.random()*3);
                        for(let i = 0; i < lilyHeight; i++) { worldMap[y-i-1][x] = 24; }
                    }
                    else if(worldgenMap_features[x] == "tall plains grass") { worldMap[y].push(27); }
                    else if(worldgenMap_features[x] == "hay bale") { worldMap[y].push(28); }
                    else { worldMap[y].push(0); }
                }
                else if(y==10+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    if(worldgenMap_features[x] == "tree") { worldMap[y].push(1); } // Dirt below tree
                    else { // Grass / any biome toppings
                        if(thisbiome == 1) { // Desert - top sand or sandclay
                            if(Math.random() < 0.1) {
                                worldMap[y].push(25);
                            } else {
                                worldMap[y].push(22);
                            }
                        }
                        else if(thisbiome == 2) { worldMap[y].push(26); } // Plains - plains grass
                        else { worldMap[y].push(2); }
                    } 
                }
                else if(y < 13+worldgen_horizonoffset+worldgenMap_heights[x]+worldgenMap_heights2[x]) {
                    // Dirt
                    if(thisbiome == 1) { worldMap[y].push(21); } // Desert - sand
                    else { worldMap[y].push(1); }
                }
                else if(y == worldgen_height - 1) {
                    worldMap[y].push(7); // Lowest layer: bedrock
                }
                else if(y >= 13+worldgen_horizonoffset+worldgenMap_heights[x]+worldgenMap_heights2[x]) {
                    if(thisbiome == 0 && Math.random() < 0.1) { worldMap[y].push(6); } // Mossy
                    else if(Math.random() < 0.2) worldMap[y].push(5); // Stone
                    else worldMap[y].push(4);
                }
            }
        }
        // Add waters
        for(let x = 0; x < worldgen_width; x++) {
            if(worldgenMap_waters[x] != -1 && (BLOCKS[ worldMap[worldgenMap_waters[x] + worldgen_horizonoffset + 10][x] ].destroyByWater) ) { // Water source here if existing block is destroyable by water
                worldMap[ worldgenMap_waters[x] + worldgen_horizonoffset + 10][x] = 19;
            }
        }
        // Carve caves (toadd)
        // (toadd)
        // Generate structures (toadd)
        for(let i = 0; i < worldgenMap_structures.length; i++) {
            // Structure info
            var thisStructure = worldgenMap_structures[i];
            if(!Object.keys(WGEN_STRUCTURES).includes(worldgenMap_structures[i].type)) {
                console.log('Err: wgen: cannot generate structure "'+worldgenMap_structures[i].type+'"; does not exist in WGEN_STRUCTURES');
                continue;
            }
            var thisStructureMap = WGEN_STRUCTURES[worldgenMap_structures[i].type];
            for(let y = 0; y < thisStructureMap.length; y++) {
                var nOffset = 0; // (todo) remove or fix the n looping?
                for(let x = 0; x < thisStructureMap[y].length; x++) {
                    // Add each block if on map
                    var toAddY = thisStructure.locy + y + worldgen_horizonoffset + 10 - thisStructureMap.length + 3;
                    var toAddX = thisStructure.locx + x;
                    if(toAddY >= worldMap.length || toAddY < 0) { continue; } // Off the map
                    if(toAddX >= worldMap[0].length || toAddX < 0) { continue; }
                    var thisBlock = thisStructureMap[y][x - nOffset];
                    if(thisBlock == -2) { // -2 = repeat the column directly left n times
                        //nOffset ++;
                        thisBlock = thisStructureMap[y][x-1];
                    }
                    if(thisBlock == -3) { continue; } // -3 = do not override (check after -2 decision)
                    worldMap[toAddY][toAddX] = thisBlock;
                }
            }
        }
        // Generate waters (after sources added)
        for(let y = 0; y < worldgen_height; y++) {
            for(let x = 0; x < worldgen_width; x++) {
                if(worldMap[y][x] == 19) {
                    for(let i = 0; i < worldgen_height - y - 1; i++) {
                        if(BLOCKS[getMapBlock(worldMap, y+i+1, x)].destroyByWater) { // getMapBlock(worldMap, locy+i+1, locx) == 0 || getMapBlock(worldMap, locy+i+1, locx) == 19
                            worldMap[y+i+1][x] = 20;
                        } else {
                            worldMap[y+i+1][x] = 1; // Below water should always be dirt
                            break
                        };
                    }
                }
            }
        }

        // DBG
        console.log(worldgenMap_waters);
    }
    //console.log('-');
    console.log('loading world... generation complete');
}