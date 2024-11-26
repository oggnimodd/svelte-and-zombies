import BasePlant from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../constants/sizes";
import { soundManager } from "../game/SoundManager.svelte";

export const SpikeweedStats = {
  id: "spikeweed",
  name: "Spikeweed",
  price: 100,
  health: 100,
  damage: 20,
  cooldown: 1000,
  buyCooldown: 5000,
};

export default class Spikeweed extends BasePlant {
  constructor() {
    super(SpikeweedStats);
  }

  canAttack(gameTime: number) {
    return this.canShoot(gameTime);
  }

  update(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): void {
    if (plantedPlant.currentHealth <= 0 || !this.canAttack(gameTime)) return;

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
    if (zombiesOnSpikeweed.length > 0) {
      zombiesOnSpikeweed.forEach((zombie) => {
        zombie.health -= this.damage;
      });

      this.resetLastShotTime(gameTime);
      soundManager.playSound("weed");
      EventEmitter.emit("spikeweedAttack", plantedPlant.plantedId);
    }
  }
}
