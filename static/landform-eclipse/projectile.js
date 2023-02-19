// LANDFORM ECLIPSE script

// Projectile script
class Projectile {
    // Constructor
    constructor(locx, locy, directionx, directiony, critRate = 0.1, type = "normal", dmgMult = 1, fromPlayer = true) {
        // Set defaults
        this.type = type;
        if(!Object.keys(PROJECTILE_TYPES).includes(this.type)) this.type = "normal";
        this.fromPlayer = fromPlayer;
        this.locx = locx;
        this.locy = locy;
        var direction_magnitude = Math.sqrt(Math.pow(directionx, 2) + Math.pow(directiony, 2));
        this.init_directionx = directionx / direction_magnitude;
        this.init_directiony = directiony / direction_magnitude;
        this.velx = this.init_directionx * PROJECTILE_TYPES[this.type].velinitial;
        this.vely = this.init_directiony * PROJECTILE_TYPES[this.type].velinitial;
        this.dmg = PROJECTILE_TYPES[this.type].baseDmg * dmgMult;
        this.critRate = critRate;
        this.gravity = PROJECTILE_TYPES[this.type].gravity;
        this.canPierce = PROJECTILE_TYPES[this.type].canPierce;
    }
    // Apply physics
    applyPhysics() {
        this.locx += this.velx * veleq;
        this.locy += this.vely * veleq;
        this.vely += this.gravity * veleq;
    }
    // Update when given map (returns true if should be deleted)
    update(map) {
        var blockx = Math.floor(this.locx);
        var blocky = Math.floor(this.locy);
        // Check if outside map
        if(blocky < 0 || blocky >= map.length || blockx < 0 || blockx >= map[0].length) {
            return true; // Destroy
        }
        // Check if inside solid block
        var block_touching = map[blocky][blockx];
        if(BLOCKS[block_touching].collision == "solid") {
            return true; // Destroy
        }
        // Depending on shooting party:
        if(this.fromPlayer) {
            // Check if touching an entity
            for(let i = 0; i < entities.length; i++) {
                if(Math.abs(this.locx - entities[i].locx) < 0.7 && Math.abs(this.locy - entities[i].locy) < 0.8) {
                    // Touching this entity
                    if(Math.random() < this.critRate) entities[i].takeDmg(this.dmg * 2, true);
                    else entities[i].takeDmg(this.dmg);
                    // Can pierce?
                    if(!this.canPierce) {
                        return true; // Destroy
                    }
                }
            }
        }
        else {
            // Check if touching a player
            if((this.locx - mychar.locx) < 0.5 && (this.locy - mychar.locy) < 0.8) {
                // Touching player
                // todo: player take dmg
                // Can pierce?
                if(!this.canPierce) {
                    return true; // Destroy
                }
            }
        }
    }
}