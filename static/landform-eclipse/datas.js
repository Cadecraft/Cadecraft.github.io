// LANDFORM ECLIPSE datas

// Generally consts which do not change

// Blocks info
const BLOCKS = {
    0: {
        iname: 'Air', // Inv name
        idescr: 'Nothing to see here~ [unobtainable]', // Inv descr
        irarity: 0, // Rarity 0-4
        img: 'none', // `none` or static/landform-eclipse/<img>
        placeable: false, // Can be placed in the world
        collision: 'none', // Collision with entities
        hp: 1, // Block health
        drops: [], // Block IDs to drop
    },
    1: {
        iname: 'Dirt',
        indescr: 'The soil of this world is soft and fertile, even in the dry highlands.',
        irarity: 0,
        img: 'images/blocks/Block_Dirt.png',
        placeable: true,
        collision: 'solid',
        hp: 10,
        drops: [1]
    },
    2: {
        inname: 'Grass',
        indescr: 'A vibrant blue carpet covers this land, waving softly in the breeze.',
        inrarity: 0,
        img: 'images/blocks/Block_Grass_Enchanted_2.png',
        placeable: true,
        collision: 'solid',
        hp: 10,
        drops: [2]
    }
};