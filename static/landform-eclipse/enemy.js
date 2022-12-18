// LANDFORM ECLIPSE script

// Enemy script
class Enemy {
    // Constructor/reset
    constructor(locx, locy, lvl) {
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
        // Physics defs
        this.phys_decel = 0.023; // 0.023
        this.phys_accel = 0.034; // 0.034
        this.phys_grav = 0.023;
        this.phys_velxmax = 0.145; // 0.14
        this.phys_velymax = 0.6;
        this.phys_xshrinkbias = 0.15;
        this.phys_yheightbias = 0.3;
        this.phys_jumpvel = 0.33; // 0.33
        // Enemy defs
        this.lvl = lvl;
        this.resetValsEnemy();
    }
    resetValsEnemy() { // Will be overridden
        // Enemy defs
        this.name = "Default Enemy";
        this.drops = [14, 14];
    }
}

// Inheritance
class Crab extends Enemy {
    resetValsEnemy() {
        this.name = "Crab";
        this.drops = [14, 14];
    }
}