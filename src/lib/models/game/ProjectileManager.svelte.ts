import type Zombie from "../zombies/Zombie.svelte";
import { YARD_WIDTH, CELL_WIDTH, YARD_HEIGHT } from "../../constants/sizes";
import QuadTree from "../../algo/QuadTree";
import Projectile from "../../models/projectiles/Projectile.svelte";
import PeaProjectile from "../../models/projectiles/PeaProjectile";
import type { PlantedPlant } from "./PlantManager.svelte";
import WatermelonProjectile from "../../models/projectiles/WatermelonProjectile";
import { SvelteMap } from "svelte/reactivity";
import { soundManager } from "./SoundManager.svelte";
import { ProjectileTypes } from "../projectiles/ProjectileTypes";

export default class ProjectileManager {
  // Use Map for efficient projectile management
  projectiles: Map<string, Projectile> = new SvelteMap();
  private quadTree: QuadTree;
  private zombieCache: Map<number, Zombie[]> = new Map();
  private projectileCache: Map<number, Projectile[]> = new Map();

  constructor() {
    // Initialize QuadTree with optimized parameters
    this.quadTree = new QuadTree(
      { x: 0, y: 0, width: YARD_WIDTH + 200, height: YARD_HEIGHT },
      8 // Increased capacity to reduce subdivisions
    );
  }

  // Efficient method to add projectiles
  addProjectile(projectiles: Projectile | Projectile[]) {
    if (Array.isArray(projectiles)) {
      for (const projectile of projectiles) {
        this.projectiles.set(projectile.id, projectile);
      }
    } else {
      this.projectiles.set(projectiles.id, projectiles);
    }
  }

  // Update QuadTree with current projectiles
  private updateQuadTree() {
    this.quadTree.clear();

    for (const projectile of this.projectiles.values()) {
      this.quadTree.insert({
        id: projectile.id,
        x: projectile.x,
        y: projectile.y,
        width: projectile.width,
        height: projectile.height,
      });
    }
  }

  // Detect collisions between projectiles and zombies
  checkCollisions(zombies: Zombie[]): Set<string> {
    this.updateQuadTree();

    // Clear previous caches
    this.zombieCache.clear();
    this.projectileCache.clear();

    // Organize zombies by row
    for (const zombie of zombies) {
      if (!this.zombieCache.has(zombie.row)) {
        this.zombieCache.set(zombie.row, []);
      }
      this.zombieCache.get(zombie.row)!.push(zombie);
    }

    // Organize projectiles by row
    for (const projectile of this.projectiles.values()) {
      if (!this.projectileCache.has(projectile.row)) {
        this.projectileCache.set(projectile.row, []);
      }
      this.projectileCache.get(projectile.row)!.push(projectile);
    }

    const collisions = new Set<string>();

    // Check collisions for each row
    for (const [row, rowZombies] of this.zombieCache.entries()) {
      const rowProjectiles = this.projectileCache.get(row) || [];

      for (let i = 0; i < rowZombies.length; i++) {
        const zombie = rowZombies[i];

        for (let j = 0; j < rowProjectiles.length; j++) {
          const projectile = rowProjectiles[j];

          // Skip watermelon projectiles not ready for collision
          if (
            projectile instanceof WatermelonProjectile &&
            !projectile.isReadyForCollision()
          ) {
            continue;
          }

          // Perform collision check
          if (this.checkDetailedCollision(projectile, zombie)) {
            collisions.add(
              `${projectile.id}:${zombie.name}_${zombie.row}_${zombie.x}`
            );
          }
        }
      }
    }

    return collisions;
  }

  // Detailed collision detection method
  private checkDetailedCollision(
    projectile: Projectile,
    zombie: Zombie
  ): boolean {
    const zombieCenterX = zombie.x + zombie.width / 2;
    const zombieCenterY = zombie.y + zombie.height / 2;

    return (
      projectile.x < zombieCenterX + CELL_WIDTH / 4 &&
      projectile.x + projectile.width > zombieCenterX - CELL_WIDTH / 4 &&
      projectile.y < zombieCenterY + CELL_WIDTH / 4 &&
      projectile.y + projectile.height > zombieCenterY - CELL_WIDTH / 4
    );
  }

  // Update projectiles and handle collisions
  update(deltaTime: number, zombies: Zombie[], plants: PlantedPlant[]) {
    const remainingProjectiles: Projectile[] = [];

    // Move and filter projectiles
    for (const projectile of this.projectiles.values()) {
      projectile.move(deltaTime);
      this.checkTorchwoodInteraction(projectile, plants);

      // Check if projectile is within game bounds
      const isWithinBounds =
        projectile.x < YARD_WIDTH + 200 &&
        projectile.x > -50 &&
        projectile.y < YARD_HEIGHT &&
        projectile.y > -200;

      if (isWithinBounds) {
        remainingProjectiles.push(projectile);
      }
    }

    // Rebuild projectiles map
    this.projectiles.clear();
    for (const projectile of remainingProjectiles) {
      this.projectiles.set(projectile.id, projectile);
    }

    // Process collisions
    const collisions = this.checkCollisions(zombies);

    // Handle each collision
    for (const collisionKey of collisions) {
      const [projectileId, zombieKey] = collisionKey.split(":");
      const projectile = this.projectiles.get(projectileId);
      const zombie = zombies.find(
        (z) => `${z.name}_${z.row}_${z.x}` === zombieKey
      );

      if (projectile && zombie) {
        this.handleProjectileHit(projectile, zombie, zombies);

        switch (projectile.type) {
          case ProjectileTypes.CABBAGE.type:
            soundManager.playSound("splat");
            break;
          case ProjectileTypes.FIRE_PEA.type:
            soundManager.playSound("impact");
          default:
            soundManager.playSound("hit");
            break;
        }
      }
    }
  }

  // Handle projectile hitting a zombie
  private handleProjectileHit(
    projectile: Projectile,
    zombie: Zombie,
    zombies: Zombie[]
  ) {
    zombie.health -= projectile.damage;

    if (projectile.stats.freezeDuration) {
      zombie.freeze(projectile.stats.freezeDuration);
    }

    if (projectile.stats.stunDuration) {
      zombie.stun(projectile.stats.stunDuration);
    }

    if (projectile instanceof WatermelonProjectile) {
      this.handleMelonSplash(projectile, zombie, zombies);
    }

    // Remove the projectile
    this.projectiles.delete(projectile.id);
  }

  // Check interaction with Torchwood plant
  private checkTorchwoodInteraction(
    projectile: Projectile,
    plants: PlantedPlant[]
  ) {
    if (!(projectile instanceof PeaProjectile) || projectile.isFirePea) return;

    const torchwoods = plants.filter(
      (p) => p.plant.id === "torchwood" && p.cell.row === projectile.row
    );

    for (const torchwood of torchwoods) {
      const torchwoodCenter = torchwood.coordinates.x + CELL_WIDTH / 2;
      const projectileCenter = projectile.x + projectile.width / 2;

      if (
        projectileCenter > torchwoodCenter - 5 &&
        projectileCenter < torchwoodCenter + 5
      ) {
        (projectile as PeaProjectile).transformToFirePea();
        break;
      }
    }
  }

  // Handle splash damage for watermelon projectiles
  private handleMelonSplash(
    projectile: WatermelonProjectile,
    hitZombie: Zombie,
    zombies: Zombie[]
  ) {
    const impactX = hitZombie.x + hitZombie.width / 2;
    const rowZombies = zombies.filter((z) => z.row === hitZombie.row);

    for (const zombie of rowZombies) {
      if (zombie === hitZombie) continue;

      const zombieX = zombie.x + zombie.width / 2;
      const distance = Math.abs(zombieX - impactX);
      const splashDamage = projectile.getSplashDamage(distance);

      if (splashDamage > 0) {
        zombie.health -= splashDamage;

        if (projectile.stats.freezeDuration) {
          zombie.freeze(projectile.stats.freezeDuration);
        }
      }
    }
  }

  reset() {
    this.zombieCache.clear();
    this.projectileCache.clear();
    this.quadTree.clear();
    this.projectiles = new SvelteMap();
  }
}
