// LANDFORM ECLIPSE script

// Player script
class Player {
    // Constructor/reset
    constructor(locx, locy, character = "jeffrey") {
        // Reset values
        this.resetVals(locx, locy, character);
    }
    resetVals(locx, locy, character = "jeffrey") {
        // Defs
        this.locx = locx;
        this.locy = locy;
        this.velx = 0;
        this.vely = 0;
        this.isFalling = true;
        this.facingRight = true;
        this.crouched = false;
        this.inWater = false;
        this.hpmax = 100;
        this.hp = this.hpmax;
        this.character = character;
        // Cooldown defs
        this.justPlacedBlock = false;
        this.justMinedBlock = false;
        // Physics defs
        this.phys_decel = 0.023; // 0.023
        this.phys_accel = 0.034; // 0.034
        this.phys_grav = 0.023; // 0.023
        this.phys_velxmax = 0.145; // 0.145
        this.phys_velymax = 0.6; // 0.6
        this.phys_xshrinkbias = 0.15; // 0.15
        this.phys_yheightbias = 0.3; // 0.3
        this.phys_jumpvel = 0.33; // 0.33
        this.phys_waterslowfactorY = 0.4; // 0.4
        this.phys_waterslowfactorX = 0.6; // 0.6
        // Inv defs
        this.inventory = [
            [8, 1, { nameappend: "space mining standard", efficiency: 1.5, cooldowntime: 50 }], // Default pick
            [30, 1, { nameappend: "old blaster", dmgmult: 1.1, projectiletype: "blaster", cooldowntime: 200, critrate: 0.1 }] // Default blaster
        ]; // [itemid,itemstackamt,itemdata]
        this.inv_selected = 0;
        this.inv_maxstack = 64;
        this.inv_menuwidth = 10;
        this.inv_defaultLength = 40;
        var origInvlen = this.inventory.length; // Because of defaults like pick
        for(let i = 0; i < (this.inv_defaultLength-origInvlen); i++) {
            this.inventory.push([-1, 0, { empty: true }]); // Default void slot
        }
        // Texture defs
        this.currentTextureId = 0;
        this.currentTextureFrame = 0;
        this.targetLocx = this.locx;
        this.targetLocy = this.locy;
        // Dbg defs
        this.dbg_highl_bl1 = [0,0]; // Debug highlighting (x, y)
        this.dbg_highl_bl2 = [0,0];
    }
    // Inv funcs
    // Add inamt blocks of inid type to inv; returns false if cannot add
    invAddBlock(inid, inamt=1, initemdata = { empty: true }) {
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
                // find open slot OR same item not fully stacked (except for items that are only one per stack)
                if(this.inventory[j][1] >= this.inv_maxstack) {
                    continue;
                } else if(this.inventory[j][0] == inid && !('oneperstack' in BLOCKS[inid])) {
                    this.inventory[j][1]++; // Add
                    added = true;
                    break;
                } else if(this.inventory[j][0] == -1) {
                    this.inventory[j][0] = inid;
                    this.inventory[j][1] = 1;
                    this.inventory[j][2] = initemdata;
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
        ui_addMessage("+"+inamt+" "+this.formatInvItemName([inid, inamt, initemdata])); // BLOCKS[inid].iname);
        return true;
    }
    // Get current player texture filename based on animation state, direction
    getTextureFilename() {
        if(this.currentTextureId > CHARACTERS[this.character].textures.length || this.currentTextureId < 0) {
            console.log('Err: player texture id '+this.currentTextureId+' for character "'+this.character+'" is invalid');
            return "error.png";
        }
        var res = CHARACTERS[this.character].textures[this.currentTextureId]; // ex. images/entities/enemy_crab_idle
        if(this.facingRight) { res += "right"; } // ex. images/entities/enemy_crab_idleright
        res += "_" + this.currentTextureFrame + ".png"; // ex. images/entities/enemy_crab_idleright_0.png
        return res;
    }
    // Update main inventory menu
    invUpdateMenu() {
        ui_invMenus[0].setContentsArr(this.inventory);
    }
    // Get the item at selected index
    invGetSelected() {
        if(this.inv_selected >= this.inventory.length || this.inv_selected < 0) {
            return [-1,0, { empty: true }];
        }
        return this.inventory[this.inv_selected];
    }
    // Get the selected index
    invGetSelectedIndex() {
        return this.inv_selected;
    }
    // Set the selected index
    invSetSelected(newinv_selected, toprint = true) {
        this.inv_selected = newinv_selected;
        if(this.inv_selected > 9) this.inv_selected = (this.inv_selected % 9) - 1;
        else if(this.inv_selected < 0) this.inv_selected = 10+this.inv_selected;
        // Print
        if(toprint && this.invGetSelected()[0] != -1) {
            ui_addMessage(this.formatInvItemName(this.invGetSelected()), 2000, 0, 0, true);
        }
    }
    // Change the selected index
    invIncrementSelected(amt, toprint = true) {
        this.invSetSelected(this.inv_selected + amt, toprint);
    }
    // Decrease amount in the stack
    invReduceStack(inindex) {
        if(inindex >= this.inventory.length || inindex < 0) {
            return false; // Index out of range
        }
        this.inventory[inindex][1]--;
        if(this.inventory[inindex][1] <= 0) {
            // None left: clear
            this.inventory[inindex][0] = -1;
            this.inventory[inindex][2] = { empty: true };
        }
        this.invUpdateMenu();
        return true;
    }
    // Update the item data of an inventory item
    invUpdateItemData(inindex, keyToChange, newValue) {
        if(inindex >= this.inventory.length || inindex < 0) {
            return false; // Index out of range
        }
        this.inventory[inindex][2][keyToChange] = newValue;
        this.invUpdateMenu();
    }
    // Require the selected inventory item to have a certain key in its data
    invRequireSelectedContainsKey(inkey, defaultValue) {
        if(!(inkey in this.invGetSelected()[2])) {
            // Key does not exist here: add it with a default value
            this.invUpdateItemData(this.invGetSelectedIndex(), inkey, defaultValue);
        }
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return -1; }
    }
    // Get is in water
    isInWater(map) {
        var toCheck = [];
        toCheck.push(this.getMapBlock(map, Math.floor(this.locy-0.3), Math.floor(this.locx)));
        toCheck.push(this.getMapBlock(map, Math.floor(this.locy+1-0.3), Math.floor(this.locx)));
        toCheck.push(this.getMapBlock(map, Math.floor(this.locy-0.3), Math.floor(this.locx+1)));
        toCheck.push(this.getMapBlock(map, Math.floor(this.locy+1-0.3), Math.floor(this.locx+1)));
        //this.dbg_highl_bl1 = [Math.floor(this.locx+1), Math.floor(this.locy)];
        //this.dbg_highl_bl2 = [Math.floor(this.locx+1), Math.floor(this.locy+1)];
        for(let i = 0; i < toCheck.length; i++) {
            if(toCheck[i] == 20 || toCheck[i] == 19) {
                return true;
            }
        }
        return false; // (toadd)
    }
    // Apply physics/vel
    applyPhysics(map) {
        // Get is in water
        this.inWater = this.isInWater(map);

        // Gravity
        if(this.inWater) this.vely += this.phys_grav*this.phys_waterslowfactorY * veleq;
        else this.vely += this.phys_grav * veleq;
        this.addVel(0, 0); // to confirm limits of velocity

        // Apply X
        if(this.inWater) this.locx += this.velx*this.phys_waterslowfactorX;
        else this.locx += this.velx * veleq;
        var direc = 1;
        //var direcadj = 0;
        if(this.velx < 0) { direc = 0;/* direcadj = 0;*/ }
        // Check valid X
        //this.dbg_highl_bl1 = [Math.floor(this.locy), Math.floor(this.locx)];
        //this.dbg_highl_bl2 = [Math.floor(this.locy+1), Math.floor(this.locx)];
        if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy), Math.floor(this.locx+direc))].collision == 'solid') { // map[Math.floor(this.locy)][Math.floor(this.locx+direc)+direcadj] != 0
            this.locx -= this.velx * veleq;
            this.velx = 0;
        }
        else if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1), Math.floor(this.locx+direc))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+direc)+direcadj] != 0
            this.locx -= this.velx * veleq;
            this.velx = 0;
        }

        // Apply Y
        if(this.inWater) this.locy += this.vely*this.phys_waterslowfactorY;
        else this.locy += this.vely * veleq;
        // Check valid Y
        // Below
        if(this.vely > 0) { // Falling
            var wasFalling = this.isFalling;
            this.isFalling = true;
            if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'solid'
            || ((BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.11), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'platform')
            && this.locy >= Math.floor(this.locy+0.3) && !this.crouched)) {
                // Landed
                this.locy = Math.floor(this.locy+0.1)-0.01 // Math.floor(this.locy+0.1)-0.1 (or -0.03 or -0.01) (could cause float issues)
                this.vely = 0;
                this.isFalling = false;
                this.uncrouch();
            }
            else if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'solid'
            || ((BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.11), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'platform')
            && this.locy >= Math.floor(this.locy+0.3) && !this.crouched)) {
                // Landed
                this.locy = Math.floor(this.locy+0.1)-0.01 // Math.floor(this.locy+0.1)-0.1 (or -0.03 or -0.01) (could cause float issues)
                this.vely = 0;
                this.isFalling = false;
                this.uncrouch();
            }
            /*if(BLOCKS[this.getMapBlock(map, Math.floor(this.locy+1.1), Math.floor(this.locx+this.phys_xshrinkbias))].collision == 'solid') { // map[Math.floor(this.locy+1)][Math.floor(this.locx+this.phys_xshrinkbias)] != 0
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
            }*/
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
            this.velx -= this.phys_decel * veleq;
            if(this.velx < 0) { this.velx = 0; }
        } else if(this.velx < -0) {
            this.velx += this.phys_decel * veleq;
            if(this.velx > 0) { this.velx = 0; }
        }
    }
    // Add vel
    addVel(velx, vely) {
        // Add
        this.velx += velx * veleq;
        this.vely += vely * veleq;
        // Check valid X
        if(this.velx > this.phys_velxmax) { this.velx = this.phys_velxmax; }
        else if(this.velx < -1*this.phys_velxmax) { this.velx = -1*this.phys_velxmax; }
        // Check valid Y
        if(this.inWater) { // Water has more restrictive Y
            if(this.vely > this.phys_velymax*0.4) { this.vely = this.phys_velymax*0.4; }
            else if(this.vely < -1*this.phys_velymax*0.3) { this.vely = -1*this.phys_velymax*0.3; }
        } else {
            if(this.vely > this.phys_velymax) { this.vely = this.phys_velymax; }
            else if(this.vely < -1*this.phys_velymax) { this.vely = -1*this.phys_velymax; }
        }
    }
    // Jump
    jump(strengthMult) {
        if(this.inWater) {
            // Water swim
            this.addVel(0, strengthMult*-1*this.phys_jumpvel*0.1);
            return;
        } else {
            // Normal jump
            if(this.isFalling) { return; } // cannot jump if falling
            this.vely = strengthMult*-1*this.phys_jumpvel;
        }
    }
    // Crouch (if block below is platform, drop through)
    crouch() {
        if(BLOCKS[this.getMapBlock(worldMap, Math.floor(this.locy+1.11), Math.floor(this.locx-this.phys_xshrinkbias))].collision == 'platform'
        || BLOCKS[this.getMapBlock(worldMap, Math.floor(this.locy+1.11), Math.floor(this.locx+1-this.phys_xshrinkbias))].collision == 'platform') {
            // Platform below; drop through
            this.crouched = true;
        }
    }
    uncrouch() {
        this.crouched = false;
    }
    // ARTIFACTS: Calculate stats (some are additive to weapon stats)
    // todo: make accurate based on artifacts in inventory
    calculateStats() {
        return {
            critrate: 0.0
        };
    }
    // Format inv item name (given the [3] array for an inventory item)
    formatInvItemName(invItemArr) {
        if('nameappend' in invItemArr[2]) {
            return BLOCKS[invItemArr[0]].iname + ": " + invItemArr[2].nameappend;
        } else {
            return BLOCKS[invItemArr[0]].iname;
        }
    }

    // DBG: Inventory pack
    dbg_invAddPack(packName) {
        if(!dbgm) {
            console.log('err: Player::dbg_invAddPack() is only accessible in dbg mode (dbgm)');
            return;
        }
        if(packName == "building") {
            this.invAddBlock(11, 64*2); // Wood wall x2
            this.invAddBlock(10, 64); // Wood
            this.invAddBlock(5, 64); // Cobblestone
            this.invAddBlock(6, 64); // Mossy cobblestone
            this.invAddBlock(15, 64/2); // Roofs
            this.invAddBlock(16, 64/2);
            this.invAddBlock(17, 64/2);
            this.invAddBlock(18, 64/2);
        }
    }
    // DBG: Gas Gas Gas
    dbg_initialD() {
        if(!dbgm) {
            console.log('err: Player::dbg_initialD() is only accessible in dbg mode (dbgm)');
            return;
        }
        this.phys_accel = 0.3;
        this.phys_velxmax = 0.5;
    }
    // DBG: Op gun
    dbg_opGun() {
        if(!dbgm) {
            console.log('err: Player::dbg_opGun() is only accessible in dbg mode (dbgm)');
            return;
        }
        this.invAddBlock(30, 1, { nameappend: "One Punch Gun", dmgmult: 1.0, projectiletype: "decimbolt", cooldowntime: 0, critrate: 1 });
    }
    // DBG: Gravity gun
    dbg_gravGun() {
        if(!dbgm) {
            console.log('err: Player::dbg_gravGun() is only accessible in dbg mode (dbgm)');
            return;
        }
        this.invAddBlock(30, 1, { nameappend: "grav gun", descrappend: "shedding tears of pain", dmgmult: 1.0, projectiletype: "gravitractor", cooldowntime: 300, critrate: 1 });
    }
}