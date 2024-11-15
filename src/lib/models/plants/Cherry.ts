import BasePlant from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../../constants/sizes";

export default class Cherry extends BasePlant {
  private explodingPlants = new Set<string>();
  private explodedPlants = new Set<string>();
  private explosionStartTimes: { [key: string]: number } = {};
  private readonly INFLATE_DURATION = 1000; // 1 second for inflation animation

  constructor() {
    super({
      id: "cherry",
      name: "Cherry",
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

  explode(plantedPlant: PlantedPlant, gameTime: number, zombies: Zombie[]) {
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

          if (zombieDistance <= CELL_WIDTH * 1.5) {
            zombie.health -= this.damage;
          }
        });

        // Mark as exploded
        this.explodingPlants.delete(plantId);
        this.explodedPlants.add(plantId);

        // Emit the cherry exploded event
        EventEmitter.emit("cherryExploded", plantId);
      }
    }
  }
}
