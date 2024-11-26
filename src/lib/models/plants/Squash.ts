import BasePlant, { type PlantStats } from "./Plant";
import type { PlantedPlant } from "../game/PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import EventEmitter from "../EventEmitter";
import { CELL_WIDTH } from "../../constants/sizes";
import { soundManager } from "../game/SoundManager.svelte";

export const SquashStats: PlantStats = {
  id: "squash",
  name: "Squash",
  price: 50,
  health: 100,
  damage: 1800,
  buyCooldown: 7000,
};

export default class Squash extends BasePlant {
  // Configuration constants
  private readonly TRIGGER_RADIUS = CELL_WIDTH * 1.2; // Radius to detect zombies
  private readonly JUMP_DURATION = 1000; // Time for jump animation in milliseconds
  private readonly SQUASH_DAMAGE = 1800; // Instant kill damage

  public isJumping: boolean = false;
  public isLanded: boolean = false;
  private jumpStartTime: number = 0;

  constructor() {
    super(SquashStats);
  }

  update(plantedPlant: PlantedPlant, gameTime: number, zombies: Zombie[]) {
    // If already landed, do nothing
    if (this.isLanded) {
      return;
    }

    // Get plant center coordinates
    const plantCenterX = plantedPlant.coordinates.x + CELL_WIDTH / 2;

    // Check for zombies in the same row within trigger radius (both front and back)
    const nearbyZombies = zombies.filter((zombie) => {
      if (zombie.row !== plantedPlant.cell.row) return false;
      const zombieCenterX = zombie.x + zombie.width / 2;
      const distance = Math.abs(zombieCenterX - plantCenterX);
      return distance <= this.TRIGGER_RADIUS;
    });

    // Start jumping if zombies are nearby and not already jumping
    if (nearbyZombies.length > 0 && !this.isJumping && !this.isLanded) {
      this.isJumping = true;
      this.jumpStartTime = gameTime;
    }

    // Check if jump animation is complete
    if (this.isJumping && !this.isLanded) {
      const elapsedTime = gameTime - this.jumpStartTime;
      if (elapsedTime >= this.JUMP_DURATION) {
        // If there are no nearby zombies, skip
        if (nearbyZombies.length === 0) return;

        // Find closest zombie regardless of direction
        const targetZombie = nearbyZombies.reduce((closest, current) => {
          const currentDistance = Math.abs(
            current.x + current.width / 2 - plantCenterX
          );
          const closestDistance = Math.abs(
            closest.x + closest.width / 2 - plantCenterX
          );
          return currentDistance < closestDistance ? current : closest;
        });

        // Damage the targeted zombie and adjacent zombies if there is a target
        if (targetZombie) {
          const targetX = targetZombie.x + targetZombie.width / 2;
          // Damage all zombies within a small radius of the target point
          zombies.forEach((zombie) => {
            if (zombie.row === plantedPlant.cell.row) {
              const zombieX = zombie.x + zombie.width / 2;
              const distance = Math.abs(zombieX - targetX);
              if (distance <= CELL_WIDTH / 2) {
                zombie.health -= this.SQUASH_DAMAGE;
              }
            }
          });
        }

        // Mark as landed
        this.isJumping = false;
        this.isLanded = true;

        soundManager.playSound("slap");

        // Emit event for removal
        EventEmitter.emit("squashLanded", plantedPlant.plantedId);
      }
    }
  }
}
