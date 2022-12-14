//const socket = io.connect('http://localhost:5500'); // Set to IP address or URL along with script
//const socket = io.connect('https://cadecraft.herokuapp.com');

//const messageForm = document.getElementById('send-container');
//const messageInput = document.getElementById('message-input');

// Remove JS warning (if JS is not enabled this will still appear)
document.getElementById('jswarning').style.display = 'none';

// Defs
var username = '';

// Navigation
function hideall() {
    document.getElementById('pg_home').style.display = 'none';
    document.getElementById('pg_webgames').style.display = 'none';
    document.getElementById('pg_ungames').style.display = 'none';
    document.getElementById('pg_music').style.display = 'none';
    document.getElementById('pg_extensions').style.display = 'none';
    document.getElementById('b_home').removeAttribute('disabled');
    document.getElementById('b_webgames').removeAttribute('disabled');
    document.getElementById('b_ungames').removeAttribute('disabled');
    document.getElementById('b_music').removeAttribute('disabled');
    document.getElementById('b_extensions').removeAttribute('disabled');
}
function showpg(pgname) {
    document.getElementById('pg_'+pgname).style.display = 'inline';
    document.getElementById('b_'+pgname).setAttribute('disabled', '');
}
function to_home() {
    hideall();
    showpg('home');
}
function to_webgames() {
    hideall();
    showpg('webgames');
}
function to_ungames() {
    hideall();
    showpg('ungames');
}
function to_music() {
    hideall();
    showpg('music');
}
function to_extensions() {
    hideall();
    showpg('extensions');
}