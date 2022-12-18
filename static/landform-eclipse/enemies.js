// LANDFORM ECLIPSE script

// Inherited enemy scripts
class Crab extends Enemy {
    resetValsEnemy() {
        // Enemy defs
        this.name = "Crab";
        this.descr = "A red crustacean. Its smooth shell gleams; its claws glint";
        this.drops = [14];
        this.hpmax = 100;
    }
    // Attack overload
    attack() {
        // attack: pincers (melee)
    }
}