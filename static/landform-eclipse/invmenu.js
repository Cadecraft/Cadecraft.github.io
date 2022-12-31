class InvMenu {
    // Width of blocks menu, array of contents [type, amt, optional_cost]
    constructor(inmenuwidth, incontentsArr = []) {
        // Defs
        this.menuwidth = inmenuwidth;
        this.contentsArr = incontentsArr;
        this.menu_selected = 0;
        this.visible = false;
    }
    // Organize 1d contents into a 2d array format
    getContentsArr2d() {
        return this.make2d(this.contentsArr, this.menuwidth);
    }
    // Set contents to a new 1d array
    setContentsArr(incontentsArr) {
        this.contentsArr = incontentsArr;
    }
    // Set whether visible (bool)
    setVisible(inVisible) {
        visible = inVisible;
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
}