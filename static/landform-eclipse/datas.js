// LANDFORM ECLIPSE datas

// Generally consts which do not change

// Sys defs (REM init sequence pt1)
const recentVersion = '0.0.1';
const editDate = '2022/9/24';

// Other images info
const IMGS_OTHER = [
    'images/overlays/Dmg_0.png',
    'images/overlays/Dmg_1.png',
    'images/overlays/Dmg_2.png',
    'images/overlays/Dmg_3.png',
    'images/overlays/Dmg_4.png',
    'images/overlays/Dmg_5.png'
]

// Blocks info
const BLOCKS_startsat = -1;
const BLOCKS = {
    '-1': {
        iname: 'Void',
        img: 'none',
        placeable: false,
        collision: 'none',
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
        hp: -1, // Block health: -1 = unmineable
        drops: [], // Block IDs to drop
    },
    1: {
        iname: 'Dirt',
        idescr: 'The soil of this world is soft and fertile, even in the dry highlands.',
        irarity: 0,
        img: 'images/blocks/Block_Dirt.png',
        placeable: true,
        collision: 'solid',
        hp: 10,
        drops: [1]
    },
    2: {
        iname: 'Grass',
        idescr: 'A vibrant blue carpet covers this land, waving softly in the breeze.',
        irarity: 0,
        img: 'images/blocks/Block_Grass_Enchanted_2.png',
        placeable: true,
        collision: 'solid',
        hp: 10,
        drops: [2]
    },
    3: {
        iname: 'Tall Grass',
        idescr: 'A clump of tall grass, a few drops of dew clinging to its stalks.',
        irarity: 0,
        img: 'images/blocks/Block_Plant_Grass_Enchanted.png',
        placeable: true,
        collision: 'none',
        hp: 1,
        drops: [3]
    },
    4: {
        iname: 'Stone',
        idescr: 'Smooth, cool slate from the highlands.',
        irarity: 0,
        img: 'images/blocks/Block_Stone.png',
        placeable: true,
        collision: 'solid',
        hp: 20,
        drops: [4]
    },
    5: {
        iname: 'Cobblestone',
        idescr: 'Rough, cracked stone from the highlands: it has weathered many storms.',
        irarity: 0,
        img: 'images/blocks/Block_Stone_Cobble.png',
        placeable: true,
        collision: 'solid',
        hp: 20,
        drops: [5]
    },
    6: {
        iname: 'Mossy Cobblestone',
        idescr: 'Thin blue veins of moss and lichen form a forest among the canyons of this old stone block.',
        irarity: 0,
        img: 'images/blocks/Block_Stone_Cobble_Moss.png',
        placeable: true,
        collision: 'solid',
        hp: 20,
        drops: [6]
    }
};