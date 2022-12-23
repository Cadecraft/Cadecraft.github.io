// LANDFORM ECLIPSE script

// Entity script
class Entity {
    // Constructor/reset
    constructor(inlocx, inlocy, inlvl=1) {
        var locx = inlocx;
        var locy = inlocy;
        var lvl = inlvl;
        // Confirm correct values
        if(locx < 0) locx = 0;
        if(locy < 0) locy = 0;
        if(lvl <= 0) lvl = 0;
        // Reset values
        this.resetVals(locx, locy, lvl);
    }
    resetVals(locx, locy, lvl) {
        // Defs
        this.locx = locx;
        this.locy = locy;
        this.velx = 0;
        this.vely = 0;
        this.isFalling = true;
        this.facingRight = true;
        // Physics defs
        this.phys_decel = 0.023; // 0.023
        this.phys_accel = 0.034; // 0.034
        this.phys_grav = 0.023;
        this.phys_velxmax = 0.145; // 0.14
        this.phys_velymax = 0.6;
        this.phys_xshrinkbias = 0.15;
        this.phys_yheightbias = 0.3;
        this.phys_jumpvel = 0.33; // 0.33
        // Entity defs
        this.lvl = lvl;
        this.resetValsEntity();
        this.hp = this.hpmax;
        this.currentTextureId = 0;
        this.currentTextureFrame = 0;
    }
    resetValsEntity() { // Will be overridden
        // Entity defs
        this.name = "Default Entity";
        this.descr = "A default entity (should not exist in-game).";
        this.drops = [14];
        this.hpmax = 100;
        this.friendly = false;
        this.textures = [
            "images/entities/enemy_crab_idle"
        ];
    }
    // Attack function
    attack() { // Will be overridden
        // attack
    }
    // Get entity texture filename based on animation state, direction
    getTextureFilename() {
        if(this.currentTextureId > this.textures.length || this.currentTextureId < 0) {
            console.log('Err: entity texture id '+this.currentTextureId+' for '+this.name+' is invalid');
            return "error.png";
        }
        var res = this.textures[this.currentTextureId]; // ex. images/entities/enemy_crab_idle
        if(this.facingRight) { res += "right"; } // ex. images/entities/enemy_crab_idleright
        res += "_" + this.currentTextureFrame + ".png"; // ex. images/entities/enemy_crab_idleright_0.png
        return res;
    }
    // Apply physics/vel (FROM player.js)
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
        if(!this.isFalling) {
            this.vely = strengthMult*-1*this.phys_jumpvel
        }
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return -1; }
    }
}