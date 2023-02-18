class InvMenu {
    // Constructor: menu name str, width of contents menu in blocks, array of contents [type, amt, optional_cost], is visible by default, should update player inv
    constructor(inMenuName, inMenuLocx, inMenuLocy, inContentsWidth, inMenuMarginx = 24, inMenuMarginy = 24, inBgOpacity = 0.8, inContentsArr = [], inVisible = false, inBoundToPlayer = false) {
        // Defs: menu
        this.menuName = inMenuName;
        // Defs: contents
        this.contentsWidth = inContentsWidth; // Width of contents menu in blocks
        this.contentsArr = JSON.parse(JSON.stringify(inContentsArr)); // Copy
        this.contentsSelected = -1; // -1 = nothing selected
        // Defs: rendering
        this.visible = inVisible;
        this.bgOpacity = inBgOpacity;
        this.menuLocx = inMenuLocx; // Dist from window top left
        this.menuLocy = inMenuLocy;
        this.menuMarginx = inMenuMarginx;
        this.menuMarginy = inMenuMarginy;
        this.menuWidthPixels = 0
        this.menuHeightPixels = 0;
        this.boundToPlayer = true; // If bound to player, update player inv
        this.updateMenuDimensions();
    }
    // Update menu width and height
    updateMenuDimensions() {
        this.menuWidthPixels = this.menuMarginx+this.contentsWidth*ui_invItemWidth+this.menuMarginx; // Left pad + content slots width + right pad
        this.menuHeightPixels = this.menuMarginy+this.getContentsArr2d().length*ui_invItemWidth+this.menuMarginy; // Top pad + content slots height + right pad
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
        // If now invisible, reset selected
        if(!this.visible) {
            this.contentsSelected = -1;
        }
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
        if(localLocx < 0 || localLocy < -1*this.menuLocy || localLocx > this.menuWidthPixels || localLocy > this.menuHeightPixels) {
            // Outside of menu area, so user cannot click
            return false;
        }
        // Determine whether clicked on block (toadd)
        var localLocxBlock = Math.floor((localLocx - this.menuMarginx)/ui_invItemWidth);
        var localLocyBlock = Math.floor((localLocy - this.menuMarginy)/ui_invItemWidth);
        if(localLocyBlock < 0) localLocyBlock = 0; // allow clicking above for hotbar
        var clickedOnContentsIndex = localLocyBlock * this.contentsWidth + localLocxBlock;
        if(clickedOnContentsIndex >= 0 && clickedOnContentsIndex < this.contentsArr.length) {
            this.clickContentsItem(clickedOnContentsIndex);
        }
        // Determine whether clicked on button
        // Return true because click was processed
        return true;
    }
    // Click contents item: Process a click on a specific index of contents
    clickContentsItem(inContentsIndex) {
        // Check valid
        if(inContentsIndex < 0 || inContentsIndex >= this.contentsArr.length) {
            return false; // Invalid
        }
        // Select or move/swap (toadd)
        if(this.contentsSelected == -1) {
            // Nothing currently selected: select new item
            this.contentsSelected = inContentsIndex;
        }
        else if(this.contentsSelected == inContentsIndex) {
            // Same item currently selected: deselect it (This must go before voic check to allow desel void)
            this.contentsSelected = -1;
        }
        else if(this.contentsArr[this.contentsSelected][0] == -1) {
            // Void currently selected: select new item
            this.contentsSelected = inContentsIndex;
        }
        else {
            // Something else currently selected: swap items then deselect anything
            var oldItemSelected = this.contentsArr[this.contentsSelected];
            this.contentsArr[this.contentsSelected] = this.contentsArr[inContentsIndex];
            this.contentsArr[inContentsIndex] = oldItemSelected;
            this.contentsSelected = -1;
        }
        // Msg if new item selected
        if(this.contentsSelected != -1 && this.contentsArr[this.contentsSelected][0] != -1 && this.boundToPlayer) {
            ui_addMessage(BLOCKS[this.contentsArr[this.contentsSelected][0]].iname, 2000, 0, 0, true);
        }
        // Updates
        if(this.boundToPlayer) {
            mychar.inventory = JSON.parse(JSON.stringify(this.contentsArr));
        }
        return true;
    }
}