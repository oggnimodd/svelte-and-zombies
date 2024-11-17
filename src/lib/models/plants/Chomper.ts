import BasePlant from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../../constants/sizes";

export default class Chomper extends BasePlant {
  private chewingPlants = new Set<string>();
  private chewStartTimes: { [key: string]: number } = {};
  private readonly CHEW_DURATION = 5000; // 2 seconds for chewing animation
  private readonly RANGE = CELL_WIDTH;

  constructor() {
    super({
      id: "chomper",
      name: "Chomper",
      price: 150,
      health: 100,
      damage: 1000,
    });

    // Cleanup when plant is removed
    EventEmitter.on("plantRemoved", (plantedId: string) => {
      this.cleanupPlant(plantedId);
    });
  }

  private cleanupPlant(plantedId: string) {
    this.chewingPlants.delete(plantedId);
    delete this.chewStartTimes[plantedId];
  }

  isChewing(plantedId: string): boolean {
    return this.chewingPlants.has(plantedId);
  }

  chomp(plantedPlant: PlantedPlant, gameTime: number, zombies: Zombie[]) {
    const plantId = plantedPlant.plantedId;

    // Check if currently chewing
    if (this.isChewing(plantId)) {
      const elapsedTime = gameTime - this.chewStartTimes[plantId];
      if (elapsedTime >= this.CHEW_DURATION) {
        this.chewingPlants.delete(plantId); // Finish chewing
      }
      return;
    }

    const plantCenterX = plantedPlant.coordinates.x + CELL_WIDTH / 2;
    const chompableZombies = zombies.filter((zombie) => {
      return (
        zombie.row === plantedPlant.cell.row &&
        Math.abs(zombie.x + zombie.width / 2 - plantCenterX) <= this.RANGE
      );
    });

    // If there are no chompable zombies, skip
    if (!chompableZombies.length) return;

    if (chompableZombies.length > 0) {
      const targetZombie = chompableZombies.reduce((closest, current) =>
        Math.abs(current.x - plantCenterX) < Math.abs(closest.x - plantCenterX)
          ? current
          : closest
      );

      if (targetZombie) {
        targetZombie.health -= this.damage; // Apply damage
        this.chewingPlants.add(plantId); // Start chewing
        this.chewStartTimes[plantId] = gameTime;
      }
    }
  }
}
