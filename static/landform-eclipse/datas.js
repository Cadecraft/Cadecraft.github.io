// LANDFORM ECLIPSE datas

// Generally consts which do not change

// Sys defs (REM init sequence pt1)
const recentVersion = '0.0.9';
const editDate = '2022/1/1';
const createdDate = '2022/9/5';

// Other images info
const IMGS_ENTITY = [
    'images/entities/enemy_crab_idle_0.png',
    'images/entities/enemy_crab_idleright_0.png',
    'images/entities/enemy_strider_idle_0.png',
    'images/entities/enemy_strider_idleright_0.png'
]
const IMGS_OTHER = [
    'images/overlays/Dmg_0.png',
    'images/overlays/Dmg_1.png',
    'images/overlays/Dmg_2.png',
    'images/overlays/Dmg_3.png',
    'images/overlays/Dmg_4.png',
    'images/overlays/Dmg_5.png',
    'images/ui/Cursor.png',
    'images/ui/Invbox.png',
    'images/ui/Invbox2.png',
    'images/ui/Invbox2_Select.png',
    'images/bg/bg_main_highlands.png',
    'images/bg/bg_main_highlands_dark_fade.png',
    'images/bg/bg_main_desert_dark_fade.png',
    'images/bg/bg_main_plains_dark_fade.png'
]

// Audios info
const MUSICS = [
    'sounds/S_01_Caverns.mp3', // Caverns
    'sounds/S_04_10000.mp3', // Isekai 10000
    'sounds/S_05_Desert.mp3', // Desert
    'sounds/S_06_FullDive.mp3', // FULL DIVE
    'sounds/S_13_Backroad.mp3', // Backroad
    'sounds/S_16_Tteokguk.mp3', // Tteokguk
    'sounds/S_19_Plain.mp3' // Plain
]
const MUSICS_VOL = 0.25;

// Misc info
const BGS_BYBIOME = [
    'images/bg/bg_main_highlands_dark_fade.png',
    'images/bg/bg_main_desert_dark_fade.png',
    'images/bg/bg_main_plains_dark_fade.png'
]

// Blocks info
const BLOCKS_startsat = -1;
const BLOCKS = {
    '-1': {
        iname: 'Void',
        img: 'none',
        placeable: false,
        collision: 'none',
        hardness: -1,
        hp: -1,
        drops: []
    },
    0: {
        iname: 'Air', // Inv name
        idescr: 'Nothing to see here~ [unobtainable]', // Inv descr
        irarity: 0, // Rarity 0-4
        img: 'none', // `none` or static/landform-eclipse/<img>
        placeable: false, // Can be placed in the world
        collision: 'none', // Collision with entities
        hardness: -1,
        hp: -1, // Block health: -1 = unmineable
        drops: [], // Block IDs to drop
        destroyByWater: true // Can be flooded if water source placed above
    },
    1: {
        iname: 'Dirt',
        idescr: 'The soil of this world is soft and fertile, even in the dry highlands.',
        irarity: 0,
        img: 'images/blocks/Block_Dirt.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 10,
        drops: [1],
        destroyByWater: false
    },
    2: {
        iname: 'Grass',
        idescr: 'A vibrant blue carpet covers this land, waving softly in the breeze.',
        irarity: 0,
        img: 'images/blocks/Block_Grass_Enchanted_2.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 10,
        drops: [2],
        destroyByWater: false
    },
    3: {
        iname: 'Tall Grass',
        idescr: 'A clump of tall grass, a few drops of dew clinging to its stalks.',
        irarity: 0,
        img: 'images/blocks/Block_Plant_Grass_Enchanted.png',
        placeable: true,
        collision: 'none',
        hardness: 1,
        hp: 1,
        drops: [3],
        destroyByWater: true,
        groundPlant: true // If this key exists, cannot exist in midair
    },
    4: {
        iname: 'Stone',
        idescr: 'Smooth, cool slate from the highlands.',
        irarity: 0,
        img: 'images/blocks/Block_Stone.png',
        placeable: true,
        collision: 'solid',
        hardness: 2,
        hp: 20,
        drops: [4],
        destroyByWater: false
    },
    5: {
        iname: 'Cobblestone',
        idescr: 'Rough, cracked stone from the highlands: it has weathered many storms.',
        irarity: 0,
        img: 'images/blocks/Block_Stone_Cobble.png',
        placeable: true,
        collision: 'solid',
        hardness: 2,
        hp: 20,
        drops: [5],
        destroyByWater: false
    },
    6: {
        iname: 'Mossy Cobblestone',
        idescr: 'Thin blue veins of moss and lichen form a forest among the canyons of this old stone block.',
        irarity: 0,
        img: 'images/blocks/Block_Stone_Cobble_Moss.png',
        placeable: true,
        collision: 'solid',
        hardness: 2,
        hp: 20,
        drops: [6],
        destroyByWater: false
    },
    7: {
        iname: 'Bedrock',
        idescr: 'A solid foundation in this world. It can never be erased.',
        irarity: 4,
        img: 'images/blocks/Block_Stone_Bedrock.png',
        placeable: false,
        collision: 'solid',
        hardness: -1,
        hp: -1,
        drops: [],
        destroyByWater: false
    },
    8: {
        iname: 'Pick',
        idescr: 'A pickaxe',
        irarity: 1,
        img: 'images/items/item_pick.png',
        placeable: false,
        collision: 'item',
        hardness: -1,
        hp: -1,
        drops: [],
        destroyByWater: false
    },
    9: {
        iname: "Snow",
        idescr: "Soft but cold. It has a powdery consistency and melts upon your hand.",
        irarity: 0,
        img: 'images/blocks/Block_Grass_Snow.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 10,
        drops: [9],
        destroyByWater: false
    },
    10: {
        iname: "Wood",
        idescr: "A firm block of wood. It makes a solid sound when you hit it.",
        irarity: 0,
        img: 'images/blocks/Block_Wood.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 15,
        drops: [10],
        destroyByWater: false
    },
    11: {
        iname: "Wood Wall",
        idescr: "A wooden wall.",
        irarity: 0,
        img: 'images/blocks/Block_Wood_bg.png',
        placeable: true,
        collision: 'none',
        hardness: 1,
        hp: 15,
        drops: [11],
        destroyByWater: false
    },
    12: {
        iname: "Highland Leaves",
        idescr: "These leaves are rigid and covered in a thin layer of frost.",
        irarity: 0,
        img: 'images/blocks/Block_Leaves_Grasslands_2.png',
        placeable: true,
        collision: 'platform',
        hardness: 1,
        hp: 4,
        drops: [12],
        destroyByWater: false
    },
    13: {
        iname: "Wall Torch",
        idescr: "Mounted to the wall, its flickering glow warmly lights up the space.",
        irarity: 1,
        img: 'images/blocks/Block_Torch_bg.png',
        placeable: true,
        collision: 'none',
        hardness: 2,
        hp: 20,
        drops: [13],
        destroyByWater: false
    },
    14: {
        iname: "Torch",
        idescr: "Its flickering glow warmly lights up the space.",
        irarity: 1,
        img: 'images/blocks/Block_Torch.png',
        placeable: true,
        collision: 'none',
        hardness: 1,
        hp: 4,
        drops: [14],
        destroyByWater: true
    },
    15: {
        iname: "Blue Tile Roof",
        idescr: "A roof made out of tiles with a pleasant blue color.",
        irarity: 2,
        img: 'images/blocks/Block_TileRoofBlue_Shadowed.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 15,
        drops: [15],
        destroyByWater: false
    },
    16: {
        iname: "Blue Tile Roof Top",
        idescr: "A roof made out of tiles with a pleasant blue color.",
        irarity: 2,
        img: 'images/blocks/Block_TileRoofBlue_Top.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 15,
        drops: [16],
        destroyByWater: false
    },
    17: {
        iname: "Blue Tile Roof Top (Left)",
        idescr: "A roof made out of tiles with a pleasant blue color.",
        irarity: 2,
        img: 'images/blocks/Block_TileRoofBlue_Top_Left.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 15,
        drops: [17],
        destroyByWater: false
    },
    18: {
        iname: "Blue Tile Roof Top (Right)",
        idescr: "A roof made out of tiles with a pleasant blue color.",
        irarity: 2,
        img: 'images/blocks/Block_TileRoofBlue_Top_Right.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 15,
        drops: [18],
        destroyByWater: false
    },
    19: {
        iname: "Water (source)",
        idescr: "Water flows endlessly on this world, propelled downwards until reaching a solid surface.",
        irarity: 0,
        img: 'images/blocks/Block_Water2_Source.png',
        placeable: true,
        collision: 'water',
        hardness: 1,
        hp: 1,
        drops: [19],
        destroyByWater: true
    },
    20: {
        iname: "Water",
        idescr: "A generated block formed by the pouring of water. [unobtainable]",
        irarity: 0,
        img: 'images/blocks/Block_Water2.png',
        placeable: true, // false
        collision: 'water',
        hardness: -1,
        hp: -1,
        drops: [],
        destroyByWater: true
    },
    21: {
        iname: "Sand",
        idescr: "Fine red sand from the desert, infused with iron oxide.",
        irarity: 0,
        img: 'images/blocks/Block_Sand2.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 10,
        drops: [21],
        destroyByWater: false
    },
    22: {
        iname: "Top Sand",
        idescr: "Fine red sand from the desert, infused with iron oxide. Its surface is smoothened by the wind.",
        irarity: 0,
        img: 'images/blocks/Block_Sand2_Top.png', // Block_Sand2_Top.png
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 10,
        drops: [22],
        destroyByWater: false
    },
    23: {
        iname: "Dune Cacti",
        idescr: "A thin, spindly cacti. It does not need much water to live in these parched dunes.",
        irarity: 1,
        img: 'images/blocks/Block_Plant_DuneCacti.png',
        placeable: true,
        collision: 'none',
        hardness: 1,
        hp: 1,
        drops: [23],
        destroyByWater: true,
        groundPlant: true
    },
    24: {
        iname: "Dune Lily",
        idescr: "A strange artifact of this world's watery past.",
        irarity: 1,
        img: 'images/blocks/Block_Plant_DuneLily.png',
        placeable: true,
        collision: 'platform',
        hardness: 1,
        hp: 1,
        drops: [24],
        destroyByWater: true,
        groundPlant: true
    },
    25: {
        iname: "Sandclay",
        idescr: "Hardened, packed clay found in the desert.",
        irarity: 0,
        img: 'images/blocks/Block_SandclayBlock.png',
        placeable: true,
        collision: 'solid',
        hardness: 2,
        hp: 15,
        drops: [25],
        destroyByWater: false
    },
    26: {
        iname: 'Plains Grass',
        idescr: 'The grass here is dark, dry, and rough.',
        irarity: 0,
        img: 'images/blocks/Block_Grass_Plains.png',
        placeable: true,
        collision: 'solid',
        hardness: 1,
        hp: 10,
        drops: [26],
        destroyByWater: false
    },
    27: {
        iname: 'Tall Plains Grass',
        idescr: 'A clump of tall grass on the plains.',
        irarity: 0,
        img: 'images/blocks/Block_Plant_Grass_Plains.png',
        placeable: true,
        collision: 'none',
        hardness: 1,
        hp: 1,
        drops: [27],
        destroyByWater: true,
        groundPlant: true
    },
    28: {
        iname: 'Hay Bale',
        idescr: 'Stringy hay is used to feed the animals on the plains.',
        irarity: 0,
        img: 'images/blocks/Block_HayBale.png',
        placeable: true,
        collision: 'platform',
        hardness: 1,
        hp: 6,
        drops: [28],
        destroyByWater: true,
        groundPlant: true
    }
};

// World gen consts
const worldgen_width = 700; // 90, 150, 700 (normal)
const worldgen_height = 90; // 50, 90
const worldgen_horizonoffset = 22; // 22
const worldgen_heightoffsetmax = 10; // 6, 10
const worldgen_rateGrass = 0.4; // 0.4
const worldgen_rateTrees = 0.05; // 0.05
const worldgen_totalBiomes = 6;
const worldgen_biomesOrder = [4,1,0,2,3,5];
const worldgen_waterLevel = 3; // 3 // Higher value = water at a higher level

// Block maps for structure (-2 = repeat the column directly left n times; -3 = do not override block)
const WGEN_STRUCTURES = {
    "plains house": [
        [17, 16, 16, -2, 16, -2, 16, 16, 18],
        [-3,  5,  13, -2, 13, -2, 13, 5,  -3],
        [-3,  11, 11, -2, 11, -2, 11, 11, -3],
        [0,  11, 11, -2, 11, -2, 11, 11, 0],
        [0,  11, 11, -2, 11, -2, 11, 11, 0],
        [1,  5,  5,  -2, 5,  -2, 1,  5,  1],
        [1,  5,  1,  -2, 1,  -2, 5,  1,  1],
        [-3, -3, 5,  -2, 5,  -2, -3, -3, -3]
    ]
}