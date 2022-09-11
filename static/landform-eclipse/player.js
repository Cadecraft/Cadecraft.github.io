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
        // Physics defs
        this.phys_decel = 0.03;
        this.phys_accel = 0.08;
        this.phys_grav = 0.023;
        this.phys_velxmax = 0.1;
        this.phys_velymax = 0.6;
        this.phys_xshrinkbias = 0.15;
        this.phys_jumpvel = 0.4; // 0.4
        // Dbg defs
        this.dbg_highl_enable = false; // false
        this.dbg_highl_bl1 = [0,0];
        this.dbg_highl_bl2 = [0,0];
    }
    // Get map block
    getMapBlock(map, locy, locx) {
        if(locy >= 0 && locy < map.length && locx >= 0 && locx < map[0].length) {
            return map[locy][locx];
        } else { return 0; }
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
        if(this.getMapBlock(map, Math.floor(this.locy), Math.floor(this.locx+direc)) != 0) { // map[Math.floor(this.locy)][Math.floor(this.locx+direc)+direcadj] != 0
            this.locx -= this.velx;
            this.velx = 0;
        }
        if(this.getMapBlock(map, Math.floor(this.locy+1), Math.floor(this.locx+direc)) != 0) { // map[Math.floor(this.locy+1)][Math.floor(this.locx+direc)+direcadj] != 0
            this.locx -= this.velx;
            this.velx = 0;
        }

        // Apply Y
        this.locy += this.vely;
        // Check valid Y
        // Below
        if(this.vely > 0) {
            if(this.getMapBlock(map, Math.floor(this.locy+1), Math.floor(this.locx+this.phys_xshrinkbias)) != 0) { // map[Math.floor(this.locy+1)][Math.floor(this.locx+this.phys_xshrinkbias)] != 0
                this.locy -= this.vely;
                this.vely = 0;
            }
            if(this.getMapBlock(map, Math.floor(this.locy+1), Math.floor(this.locx+1-this.phys_xshrinkbias)) != 0) { // map[Math.floor(this.locy+1)][Math.floor(this.locx+1-this.phys_xshrinkbias)] != 0
                this.locy -= this.vely;
                this.vely = 0;
            }
        }
        // Above (toadd)

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
        this.vely = strengthMult*-1*this.phys_jumpvel
    }
}