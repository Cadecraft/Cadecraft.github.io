class InvMenu {
    // Constructor: menu name str, width of contents menu in blocks, array of contents [type, amt, optional_cost]
    constructor(inMenuName, inMenuLocx, inMenuLocy, inContentsWidth, inMenuMarginx = 24, inMenuMarginy = 24, inBgOpacity = 0.8, inContentsArr = [], inVisible = false) {
        // Defs: menu
        this.menuName = inMenuName;
        // Defs: contents
        this.contentsWidth = inContentsWidth;
        this.contentsArr = JSON.parse(JSON.stringify(inContentsArr)); // Copy
        this.contentsSelected = -1;
        // Defs: rendering
        this.visible = inVisible;
        this.bgOpacity = inBgOpacity;
        this.menuLocx = inMenuLocx; // Dist from window top left
        this.menuLocy = inMenuLocy;
        this.menuMarginx = inMenuMarginx;
        this.menuMarginy = inMenuMarginy;
        this.menuWidthPixels = 0
        this.menuHeightPixels = 0;
        this.updateMenuDimensions();
    }
    // Update menu width and height
    updateMenuDimensions() {
        this.menuWidthPixels = this.menuMarginx+this.contentsWidth*44+this.menuMarginx; // Left pad + content slots width + right pad
        this.menuHeightPixels = this.menuMarginy+this.getContentsArr2d().length*40+this.menuMarginy; // Top pad + content slots height + right pad
    }
    // Organize 1d contents into a 2d array format (for display)
    getContentsArr2d() {
        return this.make2d(this.contentsArr, this.contentsWidth);
    }
    // Set contents to a new 1d array
    setContentsArr(inContentsArr) {
        this.contentsArr = JSON.parse(JSON.stringify(inContentsArr)); // Copy
        this.updateMenuDimensions();
    }
    // Set whether visible (bool)
    setVisible(inVisible) {
        this.visible = inVisible;
    }
    // Toggle whether visible
    toggleVisible() {
        this.setVisible(!this.visible);
    }
    // Get whether visible (bool)
    getVisible() {
        return this.visible;
    }
    // Make 1d array into a 2d array format
    make2d(inarr, inwidth) {
        var res = [];
        for(let y = 0; y < Math.ceil(inarr.length/inwidth); y++) {
            res.push([]);
            for(let x = 0; x < inwidth; x++) {
                if(y*inwidth + x >= inarr.length) break;
                res[res.length-1].push(inarr[y*inwidth + x]);
            }
        }
        return res;
    }
    // Process click (toadd): if click is within x and y bounds of menu, determine which item clicked (returns whether click was processed)
    processClick(locx, locy) {
        // Determine x and y location from the top left of menu
        var localLocx = locx - this.menuLocx;
        var localLocy = locy - this.menuLocy;
        if(!this.visible) {
            // Invisible, so user cannot click
            console.log('Err: processClick failed; InvMenu "'+this.menuName+'" is invisible');
            return false;
        }
        if(localLocx < 0 || localLocy < 0 || localLocx > this.menuWidthPixels || localLocy > this.menuHeightPixels) {
            // Outside of menu area, so user cannot click
            return false;
        }
        // Determine whether clicked on block (toadd)
        var localLocxBlock = 0;
        var localLocyBlock = 0;
        // Determine whether clicked on button
        // Return true because click was processed
        return true;
    }
    // Click contents item (toadd): Process a click on a specific index of contents
    clickContentsItem(incontentsindex) {

    }
}