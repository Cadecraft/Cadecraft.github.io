// LANDFORM ECLIPSE script

// Inherited entity scripts (enemies)

// Crab
class Crab extends Entity {
    resetValsEntity() {
        // Entity defs
        this.name = "Crab";
        this.descr = "A red crustacean. Its smooth shell gleams; its claws glint.";
        this.drops = [33];
        this.hpmax = 100;
        this.friendly = false;
        this.textures = [
            "images/entities/enemy_crab_idle"
        ];
        this.moveStyle = 1;
        // Overrides (optional)
        this.phys_accel = 0.030; // originally 0.034
    }
    // Attack override
    attack() {
        // attack: pincers (melee)
    }
}
// Monkey
class Monkey extends Entity {
    resetValsEntity() {
        // Entity defs
        this.name = "Monkey Strider";
        this.descr = "A marsupial-like animal which inhabits the highlands and mountains.";
        this.drops = [14];
        this.hpmax = 200;
        this.friendly = true;
        this.textures = [
            "images/entities/enemy_strider_idle"
        ];
        this.moveStyle = 2;
        // Overrides (optional)
        this.phys_jumpvel = 0.44; // originally 0.33
    }
    // Attack override
    attack() {
        // attack: claw leap (melee)
    }
}
// Slug
class Slug extends Entity {
    resetValsEntity() {
        // Entity defs
        this.name = "Cave Slug";
        this.descr = "A slug found deep in the caverns below the highlands.";
        this.drops = [31, 32];
        this.hpmax = 80;
        this.friendly = true;
        this.textures = [
            "images/entities/enemy_slug_idle"
        ];
        this.moveStyle = 1;
        // Overrides (optional)
        this.phys_jumpvel = 0.29;
        this.phys_velxmax = 0.04;
        this.updateTargetIntervalDefault = 1000;
    }
    // Attack override
    attack() {
        // attack: slime (melee)
    }
}

// From string data
const ENTITY_CLASSES_FROM_STRING = {
    "Crab": Crab,
    "Monkey": Monkey,
    "Slug": Slug
}