// LANDFORM ECLIPSE script

/*
TO ADD:
> None
RECENT CHANGES
> None
*/

// Sys defs (REM init sequence)
const recentVersion = '0.0.1';
const editDate = '2022/9/5';
var morningStar = '[unsuccessful]';

// Morning star: testing
morningStar = '[successful]';
// Print to console: welcome message
console.log('===============');
console.log('Welcome to Landform Eclipse! Please don\'t cheat...');
console.log('\n  Landform Eclipse>LOGGED [REM init sequence]');
console.log('  recentVersion>'+recentVersion);
console.log('  editDate>'+editDate);
console.log('  morningStar>'+morningStar);
console.log('\nAre you a *developer*? `dbgm=true;`');
console.log('===============');
// Update on-screen version
/* to add~ */

// Game defs
var dbgm = false; // Debug mode: allows flight, etc.
var worldMap = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [2,2,2,2,2]
]

// Game def objects: music/audios

// Load images to the html