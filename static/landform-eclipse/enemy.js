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
        this.updateTargetTimer = 0;
        this.updateTargetIntervalDefault = 2000; // ms
        this.updateTargetIntervalRandom = 500; // variation of the interval
        this.playerDetectionRadius = 10; // blocks
        this.resetValsEntity();
        this.hp = this.hpmax;
        this.updateTargetInterval = this.updateTargetIntervalDefault;
        this.updateTargetTimer = this.updateTargetInterval; // instantly trigger navigation check
        this.currentTextureId = 0;
        this.currentTextureFrame = 0;
        this.targetLocx = this.locx;
        this.targetLocy = this.locy;
    }
    resetValsEntity() { // Will be overridden
        // Entity defs
        this.name = "Default Entity"; // Name
        this.descr = "A default entity (should not exist in-game)."; // Descr
        this.drops = [14]; // Drop items
        this.hpmax = 100; // Max HP
        this.friendly = false; // !friendly = attacks player
        this.textures = [ // do not append frame numbers, 'right', or '.png'
            "images/entities/enemy_crab_idle"
        ];
        this.moveStyle = 1; // Determines movement type:
        /* moveStyle | movement type
        0            l/r blind
        1            l/r with jump when wall found
        2            l/r with constant jump
        3            advanced pathfinding (unfinished: do not use) (toadd)
        */
    }
    // Attack function (override)
    attack() { // Will be overridden
        // attack
    }
    // Movement function
    moveTo(inlocx, inlocy) {
        // Check that location exists
        if(inlocx < 0 || inlocy < 0 || inlocx > worldMap[0].length || inlocy > worldMap.length) {
            console.log('Err: entity '+this.name+' cannot moveTo ('+inlocx+', '+inlocy+'), which is off the map');
            return false;
        }
        if(this.moveStyle < 0 || this.moveStyle > 2) {
            console.log('Err: entity '+this.name+' moveStyle of '+this.moveStyle+' is invalid; requires 0-2')
            return false;
        }
        // Move differently based on moveStyle
        switch(this.moveStyle) {
        case 0:
            // move l/r blind
            if(inlocx < this.locx - 0.5) {
                this.addVel(this.phys_accel * -1, 0); this.facingRight = false;
            }
            if(inlocx > this.locx + 0.5) {
                this.addVel(this.phys_accel * 1, 0); this.facingRight = true;
            }
            break;
        case 1:
            // move l/r with jump when wall found
            if(inlocx < this.locx - 0.5) {
                this.addVel(this.phys_accel * -1, 0); this.facingRight = false;
            }
            if(inlocx > this.locx + 0.5) {
                this.addVel(this.phys_accel * 1, 0); this.facingRight = true;
            }
            // (toadd)
            this.jump(1);
            break;
        case 2:
            // move l/r with constant jump
            if(inlocx < this.locx - 0.5) {
                this.addVel(this.phys_accel * -1, 0); this.facingRight = false;
            }
            if(inlocx > this.locx + 0.5) {
                this.addVel(this.phys_accel * 1, 0); this.facingRight = true;
            }
            this.jump(1);
            break;
        }
    }
    // Move to target
    moveToTarget() {
        this.moveTo(this.targetLocx, this.targetLocy);
    }
    // Update target function
    updateTarget() {
        // Check if choose specific target (depending on if friendly and dist to target):
        var distToPlayer = Math.sqrt((mychar.locx - this.locx)**2 + (mychar.locy - this.locy)**2); // change to raycast? (toadd)(?)
        if(!this.friendly && distToPlayer < this.playerDetectionRadius) {
            // Hostile and sees player
            this.targetLocx = mychar.locx;
            this.targetLocy = mychar.locy;
            return;
        }
        else {
            // Friendly or does not see player: random walk
        }
        // Did not choose specific target: random walk (if timer)
        this.updateTargetTimer += gameInterval;
        if(this.updateTargetTimer >= this.updateTargetInterval) {
            // Timer: update target
            this.updateTargetTimer = 0;
            this.updateTargetInterval = this.updateTargetIntervalDefault + (Math.random()*(this.updateTargetIntervalRandom*2)-this.updateTargetIntervalRandom);
            this.targetLocx = Math.floor(Math.random() * worldMap[0].length);
            this.targetLocy = 1; //Math.random() * worldMap.length;
        }
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
    // Check is alive
    isAlive() {
        if(this.hp <= 0) {
            return false; // hp below zero: dead
        } else if(this.locy > worldMap.length) {
            return false; // fallen off map: dead
        }
        // not dead
        return true;
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
        if(this.isFalling) { return; } // cannot jump if falling
        this.vely = strengthMult*-1*this.phys_jumpvel;
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return -1; }
    }
}