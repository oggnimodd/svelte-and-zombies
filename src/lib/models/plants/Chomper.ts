import BasePlant, { type PlantStats } from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import { CELL_WIDTH } from "../../constants/sizes";
import { soundManager } from "../game/SoundManager.svelte";

export const ChomperStats: PlantStats = {
  id: "chomper",
  name: "Chomper",
  price: 150,
  health: 100,
  damage: 1000,
};

export default class Chomper extends BasePlant {
  private readonly CHEW_DURATION = 5000; // 5 seconds for chewing animation
  private readonly RANGE = CELL_WIDTH;

  private isChewing: boolean = false;
  private chewStartTime: number = 0;

  constructor() {
    super(ChomperStats);
  }

  update(plantedPlant: PlantedPlant, gameTime: number, zombies: Zombie[]) {
    const plantId = plantedPlant.plantedId;

    // Check if currently chewing
    if (this.isChewing) {
      const elapsedTime = gameTime - this.chewStartTime;
      if (elapsedTime >= this.CHEW_DURATION) {
        this.isChewing = false; // Finish chewing
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
        this.isChewing = true; // Start chewing
        soundManager.playSound("chomper");
        this.chewStartTime = gameTime;
      }
    }
  }
}
