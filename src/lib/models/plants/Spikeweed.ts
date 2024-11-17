import BasePlant from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../../constants/sizes";

export default class Spikeweed extends BasePlant {
  private lastAttackTime: { [key: string]: number } = {};
  private readonly ATTACK_COOLDOWN = 1000; // 1 second between attacks

  constructor() {
    super({
      id: "spikeweed",
      name: "Spikeweed",
      price: 100,
      health: 100,
      damage: 20,
      cooldown: 1000,
    });

    EventEmitter.on("plantRemoved", (plantedId: string) => {
      delete this.lastAttackTime[plantedId];
    });
  }

  canAttack(plantedId: string, currentTime: number): boolean {
    if (!this.lastAttackTime[plantedId]) {
      this.lastAttackTime[plantedId] = 0;
    }
    return currentTime - this.lastAttackTime[plantedId] >= this.ATTACK_COOLDOWN;
  }

  update(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): void {
    if (plantedPlant.currentHealth <= 0) return;

    const plantCenterX = plantedPlant.coordinates.x + CELL_WIDTH / 2;

    // Get zombies in the same row that are stepping on spikeweed
    const zombiesOnSpikeweed = zombies.filter((zombie) => {
      if (zombie.row !== plantedPlant.cell.row) return false;

      // Check if zombie's feet are on the spikeweed
      const zombieCenter = zombie.x + zombie.width / 2;
      const distance = Math.abs(zombieCenter - plantCenterX);

      return distance < CELL_WIDTH / 2;
    });

    // If there are zombies and cooldown has passed, attack
    if (
      zombiesOnSpikeweed.length > 0 &&
      this.canAttack(plantedPlant.plantedId, gameTime)
    ) {
      zombiesOnSpikeweed.forEach((zombie) => {
        zombie.health -= this.damage;
      });

      this.lastAttackTime[plantedPlant.plantedId] = gameTime;
      EventEmitter.emit("spikeweedAttack", plantedPlant.plantedId);
    }
  }
}
