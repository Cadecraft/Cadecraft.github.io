// LANDFORM ECLIPSE script

// Inherited entity scripts (enemies)
// Crab
class Crab extends Entity {
    resetValsEntity() {
        // Entity defs
        this.name = "Crab";
        this.descr = "A red crustacean. Its smooth shell gleams; its claws glint";
        this.drops = [14];
        this.hpmax = 100;
        this.friendly = false;
        this.textures = [
            "images/entities/enemy_crab_idle"
        ];
        this.moveStyle = 2;
        // Overrides (optional)
        this.phys_accel = 0.030; // originally 0.034
    }
    // Attack override
    attack() {
        // attack: pincers (melee)
    }
}
// Cow Beast (toadd)
class CowBeast extends Entity {
    resetValsEntity() {
        // Entity defs
        this.name = "Cow Beast";
        this.descr = "A cow-like animal from the plains which faces windward at all times; it produces milk";
        this.drops = [14];
        this.hpmax = 100;
        this.friendly = false;
        this.textures = [
            "images/entities/enemy_crab_idle"
        ];
        this.moveStyle = 2;
        // Overrides (optional)
        this.phys_accel = 0.030; // originally 0.034
    }
    // Attack override
    attack() {
        // attack: pincers (melee)
    }
}