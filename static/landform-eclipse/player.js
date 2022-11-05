// LANDFORM ECLIPSE script

// Player script
class Player {
    // Constructor/reset
    constructor(locx, locy) {
        // Reset values
        this.resetVals(locx, locy);
    }
    resetVals(locx, locy) {
        // Defs
        this.locx = locx;
        this.locy = locy;
        this.velx = 0;
        this.vely = 0;
        this.isFalling = true;
        // Cooldown defs
        this.cooldown_mining = 50;
        this.justPlacedBlock = false;
        this.justMinedBlock = false;
        // Physics defs
        this.phys_decel = 0.023; // 0.023
        this.phys_accel = 0.034; // 0.034
        this.phys_grav = 0.023;
        this.phys_velxmax = 0.145; // 0.14
        this.phys_velymax = 0.6;
        this.phys_xshrinkbias = 0.15;
        this.phys_yheightbias = 0.3;
        this.phys_jumpvel = 0.33; // 0.33
        // Inv defs
        this.inventory = [
            [8,1],[-1,0]
        ]; // [itemid,itemstackamt]
        this.inv_selected = 0;
        this.inv_maxstack = 64;
        this.inv_menuwidth = 10;
        // Dbg defs
        this.dbg_highl_enable = false; // false
        this.dbg_highl_bl1 = [0,0];
        this.dbg_highl_bl2 = [0,0];
    }
    // Inv funcs
    invAddBlock(inid, inamt=1) {
        // For each instance to add
        for(let i = 0; i < inamt; i++) {
            // Loop through inv and try to add
            var added = false;
            for(let j = 0; j < this.inventory.length; j++) {
                // find open slot OR same item not fully stacked
                if(this.inventory[j][1] >= this.inv_maxstack) {
                    continue;
                } else if(this.inventory[j][0] == inid) {
                    this.inventory[j][1]++; // Add
                    added = true;
                    break;
                } else if(this.inventory[j][0] == -1) {
                    this.inventory[j][0] = inid;
                    this.inventory[j][1] = 1;
                    added = true;
                    break;
                }
            }
            if(!added) {
                // Still not added; simply add to the end as a new stack
                this.inventory.push([inid, 1]);
                added = true;
            }
        }
        return 0;
    }
    invGetSelected() {
        // Get the item at selected index
        if(this.inv_selected < this.inventory.length) {
            return this.inventory[this.inv_selected];
        } else { return [-1,0]; }
    }
    invReduceBlock(inindex) {
        // Decrease amount in the stack
        if(inindex < this.inventory.length) {
            this.inventory[inindex][1]--;
            if(this.inventory[inindex][1] <= 0) {
                this.inventory[inindex][0] = -1;
            }
        }
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return -1; }
    }
    // Apply physics/vel
    applyPhysics(map) {
        // Gravity
        this.vely += this.phys_grav;
        if(this.vely > this.phys_velymax) { this.vely = this.phys_velymax; }
        if(this.vely < -1*this.phys_velymax) { this.vely = -1*this.phys_velymax; }

        // Apply X
        this.locx += this.velx;
        var direc = 1;
        //var direcadj = 0;
        if(this.velx < 0) { direc = 0;/* direcadj = 0;*/ }
        // Check valid X
        //this.dbg_highl_bl1 = [Math.floor(this.locy), Math.floor(this.locx)];
        //this.dbg_highl_bl2 = [Math.floor(this.locy+1), Math.floor(this.locx)];
        if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy), Math.floor(this.locx+direc))].collision == 'solid') { // map[Math.floor(this.locy)][Math.floor(this.locx+direc)+direcadj] != 0
            this.locx -= this.velx;
            this.velx = 0;
        }
        else if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1), Math.floor(this.locx+direc))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+direc)+direcadj] != 0
            this.locx -= this.velx;
            this.velx = 0;
        }

        // Apply Y
        this.locy += this.vely;
        // Check valid Y
        // Below
        if(this.vely > 0) {
            var wasFalling = this.isFalling;
            this.isFalling = true;
            if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+this.phys_xshrinkbias)] != 0
                //if(wasFalling) {
                    //this.locy -= this.vely;
                //}
                this.locy = Math.floor(this.locy+0.1)-0.1
                this.vely = 0;
                this.isFalling = false;
            }
            else if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+1-this.phys_xshrinkbias)] != 0
                //if(wasFalling) {
                    //this.locy -= this.vely;
                //}
                this.locy = Math.floor(this.locy+0.1)-0.1
                this.vely = 0;
                this.isFalling = false;
            }
        }
        // Above
        if(this.vely < 0) {
            this.isFalling = true;
            if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy-1+this.phys_yheightbias), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+this.phys_xshrinkbias)] != 0
                //this.locy -= this.vely;
                this.vely = 0;
            }
            if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy-1+this.phys_yheightbias), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+1-this.phys_xshrinkbias)] != 0
                //this.locy -= this.vely;
                this.vely = 0;
            }
        }

        // Deceleration
        if(this.velx > 0) {
            this.velx -= this.phys_decel;
            if(this.velx < 0) { this.velx = 0; }
        } else if(this.velx < -0) {
            this.velx += this.phys_decel;
            if(this.velx > 0) { this.velx = 0; }
        }
    }
    // Add vel
    addVel(velx, vely) {
        // Add
        this.velx += velx;
        this.vely += vely;
        // Check valid X and Y
        if(this.velx > this.phys_velxmax) { this.velx = this.phys_velxmax; }
        if(this.velx < -1*this.phys_velxmax) { this.velx = -1*this.phys_velxmax; }
        if(this.vely > this.phys_velymax) { this.vely = this.phys_velymax; }
        if(this.vely < -1*this.phys_velymax) { this.vely = -1*this.phys_velymax; }
    }
    // Jump
    jump(strengthMult) {
        if(!this.isFalling) {
            this.vely = strengthMult*-1*this.phys_jumpvel
        }
    }
}