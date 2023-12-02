// Cadecraft: script (v3)

// Version info
const recentVersion = "3.1.0";
const editDate = "2023/12/2";

// Remove JS warning (if JS is not enabled this will still appear)
document.getElementById('jswarning').style.display = 'none';

// Navigation
const pageDivIds = [
    "home", "games", "music", "chrome-extensions", "misc-projects"
];
// Show a specific page
function showPage(pageId) {
    for (let i = 0; i < pageDivIds.length; i++) {
        let buttonClassName = document.getElementById('button_' + pageDivIds[i]).className;
        if (pageDivIds[i] == pageId) {
            // Show this page
            document.getElementById('pg_' + pageDivIds[i]).style.display = 'inline';
            if (!buttonClassName.includes('blue')) {
                document.getElementById('button_' + pageDivIds[i]).className += ' blue';
            }
        } else {
            // Do not show this page
            document.getElementById('pg_' + pageDivIds[i]).style.display = 'none';
            if (buttonClassName.includes('blue')) {
                document.getElementById('button_' + pageDivIds[i]).className = buttonClassName.replace("blue", "");
            }
        }
    }
}
// Add event listeners
for (let i = 0; i < pageDivIds.length; i++) {
    document.getElementById('button_' + pageDivIds[i]).addEventListener('click', function() {
        showPage(pageDivIds[i]);
    });
}