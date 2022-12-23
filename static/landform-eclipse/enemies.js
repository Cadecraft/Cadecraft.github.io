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
    }
    // Attack overload
    attack() {
        // attack: pincers (melee)
    }
}