import BasePlant, { type PlantStats } from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { soundManager } from "../game/SoundManager.svelte";

export const ChilliStats: PlantStats = {
  id: "chilli",
  name: "Chilli",
  price: 150,
  health: 100,
  damage: 1800,
  buyCooldown: 5000,
};

export default class Chilli extends BasePlant {
  private readonly INFLATE_DURATION = 1000; // In seconds
  private isExploding: boolean = false;
  private isExploded: boolean = false;
  private explosionStartTime: number = 0;

  constructor() {
    super(ChilliStats);
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
        // Get all zombies in the same row as the planted plant
        const rowZombies = zombies.filter(
          (zombie) => zombie.row === plantedPlant.cell.row
        );

        // Damage all zombies in the row
        rowZombies.forEach((zombie) => {
          zombie.health -= this.damage;
        });

        // Mark as exploded
        this.isExploding = false;
        this.isExploded = true;

        soundManager.playSound("explosion");

        // Emit the chilli exploded event so the plant manager can remove the plant
        EventEmitter.emit("chilliExploded", plantId);
      }
    }
  }
}
