import BasePlant, { type PlantStats } from "./Plant.svelte";
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
  private readonly TRIGGER_RADIUS = CELL_WIDTH * 1.2; // Radius to detect zombies
  private readonly JUMP_DURATION = 1000; // Time for jump animation in milliseconds
  private readonly SQUASH_DAMAGE = 1800; // Instant kill damage
  public isJumping: boolean = $state(false);
  public isLanded: boolean = $state(false);
  public jumpDirection: "left" | "right" | null = $state(null);

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

    if (this.isJumping && !this.isLanded) {
      const elapsedTime = gameTime - this.jumpStartTime;
      if (elapsedTime >= this.JUMP_DURATION) {
        // Find nearby zombies after jump
        const nearbyZombies = zombies.filter((zombie) => {
          if (zombie.row !== plantedPlant.cell.row) return false;
          const zombieCenterX = zombie.x + zombie.width / 2;
          const distance = Math.abs(zombieCenterX - plantCenterX);
          return distance <= this.TRIGGER_RADIUS;
        });

        // Find closest zombie regardless of direction (if any)
        let targetZombie: Zombie | null = null;
        if (nearbyZombies.length > 0) {
          targetZombie = nearbyZombies.reduce((closest, current) => {
            const currentDistance = Math.abs(
              current.x + current.width / 2 - plantCenterX
            );
            const closestDistance = Math.abs(
              closest.x + closest.width / 2 - plantCenterX
            );
            return currentDistance < closestDistance ? current : closest;
          });
        }

        // Damage all zombies near the targeted point
        if (targetZombie) {
          const targetX = targetZombie.x + targetZombie.width / 2;
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

        this.isJumping = false;
        this.isLanded = true;
        soundManager.playSound("slap");
        // Emit event for removal
        EventEmitter.emit("squashLanded", plantedPlant.plantedId);
      }
    } else {
      // Squash is not jumping and hasn't landed yet
      const nearbyZombies = zombies.filter((zombie) => {
        if (zombie.row !== plantedPlant.cell.row) return false;
        const zombieCenterX = zombie.x + zombie.width / 2;
        const distance = Math.abs(zombieCenterX - plantCenterX);
        return distance <= this.TRIGGER_RADIUS;
      });

      if (nearbyZombies.length > 0 && !this.isJumping && !this.isLanded) {
        // Determine jump direction based on zombie's relative position
        const closestZombie = nearbyZombies.reduce((closest, current) => {
          const currentDistance = Math.abs(
            current.x + current.width / 2 - plantCenterX
          );
          const closestDistance = Math.abs(
            closest.x + closest.width / 2 - plantCenterX
          );
          return currentDistance < closestDistance ? current : closest;
        });

        this.jumpDirection = closestZombie.x < plantCenterX ? "left" : "right";
        this.isJumping = true;
        this.jumpStartTime = gameTime;

        soundManager.playSound("hmm");
      }
    }
  }
}
