// LANDFORM ECLIPSE datas

// Generally consts which do not change

// Sys defs (REM init sequence pt1)
const recentVersion = '0.0.4';
const editDate = '2022/11/24';
const createdDate = '2022/9/5';

// Other images info
const IMGS_OTHER = [
    'images/overlays/Dmg_0.png',
    'images/overlays/Dmg_1.png',
    'images/overlays/Dmg_2.png',
    'images/overlays/Dmg_3.png',
    'images/overlays/Dmg_4.png',
    'images/overlays/Dmg_5.png',
    'images/ui/Cursor.png',
    'images/ui/Invbox.png',
    'images/ui/Invbox2.png'
]

// Audios info
const MUSICS = [
    'sounds/S_01_Caverns.mp3', // Caverns
    'sounds/S_04_10000.mp3', // Isekai 10000
    'sounds/S_05_Desert.mp3', // Desert
    'sounds/S_06_FullDive.mp3' // FULL DIVE
]
const MUSICS_VOL = 0.25;

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
        drops: [1]
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
        drops: [2]
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
        drops: [3]
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
        drops: [4]
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
        drops: [5]
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
        drops: [6]
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
        drops: []
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
        drops: []
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
        drops: [9]
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
        drops: [10]
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
        drops: [11]
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
        drops: [12]
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
        drops: [13]
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
        drops: [14]
    }
};