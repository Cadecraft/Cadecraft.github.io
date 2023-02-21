// LANDFORM ECLIPSE script

// Floating item script
class FloatingItem {
    // Constructor
    constructor(locx, locy, id, amt = 1, itemdata = { empty: true }, randOffset = true) {
        this.locx = locx;
        this.locy = locy;
        this.locyOffset = 0;
        this.vely = 0;
        this.id = id;
        this.amt = amt;
        this.itemdata = itemdata;
        this.phys_gravity = 0.023; // 0.023
        this.phys_velymax = 0.6; // 0.6
        if(randOffset) {
            // Apply random offset on the x
            this.locx += (Math.random()*0.6)-0.3
            this.locyOffset += (Math.random()*0.4)-0.2;
        }
    }
    // Apply physics
    applyPhysics(map) {
        if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+0.8), Math.floor(this.locx))].collision == 'solid') {
            this.vely = 0;
            return; // Landed: do not move
        }
        // Gravity
        this.vely += this.phys_gravity * veleq;
        if(this.vely > this.phys_velymax) { this.vely = this.phys_velymax; }
        // Apply
        this.locy += this.vely * veleq;
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return -1; }
    }
    // Update
    update() {
        // Check if touching player
        if(Math.abs(this.locx - mychar.locx) < 1 && Math.abs((this.locy - 0.2) - mychar.locy) < 1) {
            // Touching player
            // Give player items and delete
            mychar.invAddBlock(this.id, this.amt, this.itemdata);
            return true;
        }
        return false;
    }
}