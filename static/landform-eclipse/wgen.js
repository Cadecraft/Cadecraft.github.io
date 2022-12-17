// LANDFORM ECLIPSE script

// Worldgen functions
// Worldgen main
function wgenMain() {
    // Worldgen defs
    //console.log('-');
    console.log('  gen: defs');
    var worldgen_simple = false; // def: false (dbg: true)
    const worldgen_width = 500; // 90, 150, 500 (normal)
    const worldgen_height = 90; // 50, 90
    const worldgen_horizonoffset = 22; // 22
    const worldgen_heightoffsetmax = 10; // 6, 10
    const worldgen_rateGrass = 0.4; // 0.4
    const worldgen_rateTrees = 0.05; // 0.05
    const worldgen_totalBiomes = 6;
    const worldgen_biomesOrder = [4,1,0,2,3,5];
    var worldgenMap_biomes = [];
    var worldgenMap_heights = []; // Main horizon height
    var worldgenMap_heights2 = []; // Dirt offset
    var worldgenMap_features = []; // Features such as trees, etc.
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
        //  Desert: sand, mesa, cactus, caves, oasis
        //  Highlands: karst, small villages, blue, trees
        //  Plains: wheat, lakes, big villages, expansive, flat
        //  Mountains: tall, ice and snow, caves, crystals
        //  Rbeach: arctic ocean, ice and snow, igloo
        // Generate topography (heights and features)
        for(let x = 0; x < worldgen_width; x++) {
            var biomeProgress = Math.floor(x/worldgen_width * worldgen_totalBiomes);
            worldgenMap_biomes.push(worldgen_biomesOrder[biomeProgress]);
        }
        var lastHeight = 0;
        for(let x = 0; x < worldgen_width; x++) {
            var thisbiome = worldgenMap_biomes[x];
            var newHeight = lastHeight;
            var newFeature = "";
            // Generate new heights
            if(thisbiome == 0) {
                newHeight += Math.floor(Math.random()*3)-1; // Normal biome
            }
            else if(thisbiome == 1) {
                newHeight += Math.floor(Math.random()*5)-2; // Desert biome
            }
            else if(thisbiome == 12) {
                newHeight += Math.floor(Math.random()*10)-5; // RARE mesa biome
            }
            if(newHeight > worldgen_heightoffsetmax) newHeight = worldgen_heightoffsetmax;
            if(newHeight < -1*worldgen_heightoffsetmax) newHeight = -1*worldgen_heightoffsetmax;
            var newHeight2 = Math.floor(Math.random()*2);
            // Generate new features
            if(thisbiome == 0) {
                if(Math.random() < worldgen_rateTrees && x < worldgen_width-6 && x > 5) { newFeature = "tree"; }
                else if(Math.random() < worldgen_rateGrass) { newFeature = "tall grass"; }
            }
            // Add
            worldgenMap_heights.push(newHeight);
            worldgenMap_heights2.push(newHeight2);
            worldgenMap_features.push(newFeature);
            lastHeight = newHeight;
        }
        // Generate blocks
        for(let y = 0; y < worldgen_height; y++) {
            worldMap.push([]);
            for(let x = 0; x < worldgen_width; x++) {
                // air=0-9;grass=10;dirt=11-12;stone=13+
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
                    else { worldMap[y].push(0); }
                }
                else if(y==10+worldgen_horizonoffset+worldgenMap_heights[x]) {
                    if(worldgenMap_features[x] == "tree") { worldMap[y].push(1); }
                    else { worldMap[y].push(2); } // Grass
                }
                else if(y < 13+worldgen_horizonoffset+worldgenMap_heights[x]+worldgenMap_heights2[x]) {
                    worldMap[y].push(1); // Dirt
                }
                else if(y >= 13+worldgen_horizonoffset+worldgenMap_heights[x]+worldgenMap_heights2[x]) {
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