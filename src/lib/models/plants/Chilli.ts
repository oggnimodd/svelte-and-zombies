import BasePlant from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";

export default class Chilli extends BasePlant {
  private explodingPlants = new Set<string>();
  private explodedPlants = new Set<string>();
  private explosionStartTimes: { [key: string]: number } = {};
  private readonly INFLATE_DURATION = 1000; // In seconds

  constructor() {
    super({
      id: "chilli",
      name: "Chilli",
      price: 150,
      health: 100,
      damage: 1800,
    });

    EventEmitter.on("plantRemoved", (plantedId: string) => {
      this.cleanupPlant(plantedId);
    });
  }

  private cleanupPlant(plantedId: string) {
    this.explodingPlants.delete(plantedId);
    this.explodedPlants.delete(plantedId);
    delete this.explosionStartTimes[plantedId];
  }

  isExploding(plantedId: string): boolean {
    return this.explodingPlants.has(plantedId);
  }

  isExploded(plantedId: string): boolean {
    return this.explodedPlants.has(plantedId);
  }

  explode(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): void {
    const plantId = plantedPlant.plantedId;

    // Start exploding animation if not already exploding or exploded
    if (
      !this.explodingPlants.has(plantId) &&
      !this.explodedPlants.has(plantId)
    ) {
      this.explodingPlants.add(plantId);
      this.explosionStartTimes[plantId] = gameTime;
    }

    // Check if inflation time is complete
    if (
      this.explodingPlants.has(plantId) &&
      !this.explodedPlants.has(plantId)
    ) {
      const elapsedTime = gameTime - this.explosionStartTimes[plantId];

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
        this.explodingPlants.delete(plantId);
        this.explodedPlants.add(plantId);

        // Emit the chilli exploded event so the plant manager can remove the plant
        EventEmitter.emit("chilliExploded", plantId);
      }
    }
  }
}
