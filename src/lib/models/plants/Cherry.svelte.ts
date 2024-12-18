import BasePlant, { type PlantStats } from "./Plant.svelte";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../constants/sizes";
import { soundManager } from "../game/SoundManager.svelte";
import type { CircularExplosionParams } from "../game/ExplosionManager.svelte";

export const CherryStats: PlantStats = {
  id: "cherry",
  name: "Cherry",
  price: 150,
  health: 100,
  damage: 1800,
  buyCooldown: 5000,
};

export default class Cherry extends BasePlant {
  private readonly INFLATE_DURATION = 1000; // 1 second for inflation animation
  isExploding: boolean = $state(false);
  private isExploded: boolean = false;
  private explosionStartTime: number = 0;

  constructor() {
    super(CherryStats);
  }

  update(plantedPlant: PlantedPlant, gameTime: number, zombies: Zombie[]) {
    const plantId = plantedPlant.plantedId;

    // Start exploding animation if not already exploding or exploded
    if (!this.isExploding && !this.isExploded) {
      this.isExploding = true;
      this.explosionStartTime = gameTime;
    }

    // Check if inflation time is complete
    if (this.isExploding && !this.isExploded) {
      const elapsedTime = gameTime - this.explosionStartTime;

      if (elapsedTime >= this.INFLATE_DURATION) {
        // Emit event to display explosion
        EventEmitter.emit("addCircularExplosion", {
          col: plantedPlant.cell.col,
          row: plantedPlant.cell.row,
        } satisfies CircularExplosionParams);

        // Get zombies in current and adjacent rows
        const currentRow = plantedPlant.cell.row;
        const affectedZombies = zombies.filter((zombie) => {
          return Math.abs(zombie.row - currentRow) <= 1;
        });

        // Damage all zombies in range
        affectedZombies.forEach((zombie) => {
          const zombieDistance = Math.abs(
            zombie.x +
              zombie.width / 2 -
              (plantedPlant.coordinates.x + CELL_WIDTH / 2)
          );

          if (zombieDistance <= CELL_WIDTH * 2) {
            zombie.health -= this.damage;
          }
        });

        // Mark as exploded
        this.isExploding = false;
        this.isExploded = true;

        soundManager.playSound("explosion");

        // Emit the cherry exploded event
        EventEmitter.emit("cherryExploded", plantId);
      }
    }
  }
}
