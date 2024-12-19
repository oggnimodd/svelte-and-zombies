import BasePlant, { type PlantStats } from "./Plant.svelte";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../constants/sizes";
import { soundManager } from "../game/SoundManager.svelte";
import type {
  CircularExplosionParams,
  CharredEffectParams,
} from "../game/ExplosionManager.svelte";
import { gameTime } from "../game/GameTime.svelte";

export const PotatoStats: PlantStats = {
  id: "potato",
  name: "Potato Mine",
  price: 25,
  health: 100,
  damage: 1000,
  buyCooldown: 4000,
};

export default class Potato extends BasePlant {
  // Configuration constants
  private readonly ACTIVATION_RADIUS = CELL_WIDTH * 1.05; // Radius to detect zombies
  private readonly ACTIVATION_DURATION = 4000; // Time to activate in milliseconds
  private readonly EXPLOSION_DAMAGE = 1800;

  isActivating: boolean = $state(true);
  isActivated: boolean = $state(false);
  isExploded: boolean = $state(false);
  private activationStartTime: number;

  constructor() {
    super(PotatoStats);
    this.activationStartTime = gameTime.get();
  }

  update(plantedPlant: PlantedPlant, gameTime: number, zombies: Zombie[]) {
    // If already exploded, do nothing
    if (this.isExploded) {
      return;
    }

    // Get plant center coordinates
    const plantCenterX = plantedPlant.coordinates.x + CELL_WIDTH / 2;
    const plantCenterY = plantedPlant.coordinates.y + CELL_WIDTH / 2;

    // Check activation state
    if (this.isActivating) {
      if (gameTime - this.activationStartTime >= this.ACTIVATION_DURATION) {
        this.isActivating = false;
        this.isActivated = true;
      }
    }

    // If activated, check for zombies
    if (this.isActivated) {
      const zombiesInRange = zombies.filter((zombie) => {
        if (zombie.row !== plantedPlant.cell.row) return false;
        const zombieCenterX = zombie.x + zombie.width / 2;
        const zombieCenterY = zombie.y + zombie.height / 2;
        const distance = Math.sqrt(
          Math.pow(zombieCenterX - plantCenterX, 2) +
            Math.pow(zombieCenterY - plantCenterY, 2)
        );
        return distance <= this.ACTIVATION_RADIUS;
      });

      if (zombiesInRange.length > 0) {
        //  Display circular explosion
        EventEmitter.emit("addCircularExplosion", {
          col: plantedPlant.cell.col,
          row: plantedPlant.cell.row,
        } satisfies CircularExplosionParams);

        // Explode!
        zombiesInRange.forEach((zombie) => {
          zombie.health -= this.EXPLOSION_DAMAGE;

          // Add charred effect at zombie's position
          EventEmitter.emit("addCharredEffect", {
            x: zombie.x,
            y: zombie.y,
          } satisfies CharredEffectParams);
        });

        this.isExploded = true;

        soundManager.playSound("explosion");
        EventEmitter.emit("potatoExploded", plantedPlant.plantedId);
      }
    }
  }
}
