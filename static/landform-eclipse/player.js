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
        this.facingRight = true;
        // Cooldown defs
        this.cooldown_mining = 50;
        this.miningefficiency = 2; // Dmg to deal: def=1
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
        this.inv_defaultLength = 40;
        var origInvlen = this.inventory.length; // Because of defaults like pick
        for(let i = 0; i < (this.inv_defaultLength-origInvlen); i++) {
            this.inventory.push([-1,0]); // Default void slot
        }
        // Dbg defs
        this.dbg_highl_enable = false; // false
        this.dbg_highl_bl1 = [0,0];
        this.dbg_highl_bl2 = [0,0];
    }
    // Inv funcs
    // Add inamt blocks of inid type to inv; returns false if cannot add
    invAddBlock(inid, inamt=1) {
        // Check that block exists
        if(inid >= Object.keys(BLOCKS).length) {
            console.log("Err: Block id "+inid+" does not exist; ids 0-"+(Object.keys(BLOCKS).length-1)+" exist");
            return false;
        };
        if(inamt <= 0) {
            console.log("Err: Amt of "+inamt+" cannot be added; requires 1+");
            return false;
        }
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
        this.invUpdateMenu();
        // Message
        ui_addMessage("+"+inamt+" "+BLOCKS[inid].iname);
        return true;
    }
    invUpdateMenu() {
        ui_invMenus[0].setContentsArr(this.inventory);
    }
    invGetSelected() {
        // Get the item at selected index
        if(this.inv_selected >= this.inventory.length) {
            return [-1,0];
        }
        return this.inventory[this.inv_selected];
    }
    invSetSelected(newinv_selected, toprint = true) {
        // Set the selected index
        this.inv_selected = newinv_selected;
        if(this.inv_selected > 9) this.inv_selected = (this.inv_selected % 9) - 1;
        else if(this.inv_selected < 0) this.inv_selected = 10+this.inv_selected;
        // Print
        if(toprint && this.invGetSelected()[0] != -1) {
            ui_addMessage(BLOCKS[this.invGetSelected()[0]].iname, 2000, 0, 0, true);
        }
    }
    invIncrementSelected(amt, toprint = true) {
        // Change the selected index
        this.invSetSelected(this.inv_selected + amt, toprint);
    }
    invReduceBlock(inindex) {
        // Decrease amount in the stack
        if(inindex < this.inventory.length) {
            this.inventory[inindex][1]--;
            if(this.inventory[inindex][1] <= 0) {
                this.inventory[inindex][0] = -1;
            }
        }
        this.invUpdateMenu();
        return true;
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return -1; }
    }
    // Get is in water
    isInWater() {
        var toCheck = [];
        toCheck.push(this.getMapBlock(map, Math.floor(this.locy), Math.floor(this.locx)));
        return false; // (toadd)
    }
    // Apply physics/vel
    applyPhysics(map) {
        // Get is in water

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
        if(this.vely > 0) { // Falling
            var wasFalling = this.isFalling;
            this.isFalling = true;
            if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'solid'/* || BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'platform'*/) { // map[Math.floor(this.locy+1)][Math.floor(this.locx+this.phys_xshrinkbias)] != 0
                //if(wasFalling) {
                    //this.locy -= this.vely;
                //}
                this.locy = Math.floor(this.locy+0.1)-0.1
                this.vely = 0;
                this.isFalling = false;
            }
            else if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'solid'/* || BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'platform'*/) { // map[Math.floor(this.locy+1)][Math.floor(this.locx+1-this.phys_xshrinkbias)] != 0
                //if(wasFalling) {
                    //this.locy -= this.vely;
                //}
                this.locy = Math.floor(this.locy+0.1)-0.1
                this.vely = 0;
                this.isFalling = false;
            }
        }
        // Above
        else if(this.vely < 0) { // Rising
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
        if(this.isFalling) { return; } // cannot jump if falling
        this.vely = strengthMult*-1*this.phys_jumpvel;
    }
}