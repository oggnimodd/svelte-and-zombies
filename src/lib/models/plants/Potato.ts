import BasePlant from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../../constants/sizes";

export default class Potato extends BasePlant {
  private activatingPotatoes = new Set<string>();
  private activatedPotatoes = new Set<string>();
  private activationStartTimes: { [key: string]: number } = {};

  // Configuration constants
  private readonly ACTIVATION_RADIUS = CELL_WIDTH * 1.2; // Radius to detect zombies
  private readonly ACTIVATION_DURATION = 6000; // Time to activate in milliseconds
  private readonly EXPLOSION_DAMAGE = 1800;

  constructor() {
    super({
      id: "potato",
      name: "Potato Mine",
      price: 25,
      health: 100,
      damage: 1000,
    });

    // Cleanup when plant is removed
    EventEmitter.on("plantRemoved", (plantedId: string) => {
      this.cleanupPlant(plantedId);
    });
  }

  private cleanupPlant(plantedId: string) {
    this.activatingPotatoes.delete(plantedId);
    this.activatedPotatoes.delete(plantedId);
    delete this.activationStartTimes[plantedId];
  }

  isActivating(plantedId: string): boolean {
    return this.activatingPotatoes.has(plantedId);
  }

  isActivated(plantedId: string): boolean {
    return this.activatedPotatoes.has(plantedId);
  }

  // Check for nearby zombies and handle activation/explosion
  update(
    plantedPlant: PlantedPlant,
    gameTime: number,
    zombies: Zombie[]
  ): void {
    const plantId = plantedPlant.plantedId;

    // Skip if already activated
    if (this.activatedPotatoes.has(plantId)) {
      return;
    }

    // Get plant center coordinates
    const plantCenterX = plantedPlant.coordinates.x + CELL_WIDTH / 2;
    const plantCenterY = plantedPlant.coordinates.y + CELL_WIDTH / 2;

    // Check for zombies in same row within activation radius
    const nearbyZombies = zombies.filter((zombie) => {
      if (zombie.row !== plantedPlant.cell.row) return false;

      const zombieCenterX = zombie.x + zombie.width / 2;
      const zombieCenterY = zombie.y + zombie.height / 2;

      const distance = Math.sqrt(
        Math.pow(zombieCenterX - plantCenterX, 2) +
          Math.pow(zombieCenterY - plantCenterY, 2)
      );

      return distance <= this.ACTIVATION_RADIUS;
    });

    // Start activation if zombies nearby and not already activating
    if (
      nearbyZombies.length > 0 &&
      !this.activatingPotatoes.has(plantId) &&
      !this.activatedPotatoes.has(plantId)
    ) {
      this.activatingPotatoes.add(plantId);
      this.activationStartTimes[plantId] = gameTime;
    }

    // Check if activation time is complete
    if (
      this.activatingPotatoes.has(plantId) &&
      !this.activatedPotatoes.has(plantId)
    ) {
      const elapsedTime = gameTime - this.activationStartTimes[plantId];

      if (elapsedTime >= this.ACTIVATION_DURATION) {
        // Get zombies in explosion range
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

        // Damage all zombies in range
        zombiesInRange.forEach((zombie) => {
          zombie.health -= this.EXPLOSION_DAMAGE;
        });

        // Mark as activated
        this.activatingPotatoes.delete(plantId);
        this.activatedPotatoes.add(plantId);

        // Emit event for explosion
        EventEmitter.emit("potatoExploded", plantId);
      }
    }
  }
}
