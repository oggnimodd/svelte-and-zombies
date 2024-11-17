import type Zombie from "../zombies/Zombie.svelte";
import { YARD_WIDTH, CELL_WIDTH, YARD_HEIGHT } from "../../../constants/sizes";
import QuadTree from "../../algo/QuadTree";
import Projectile from "../projectiles/Projectile.svelte";
import type { PlantedPlant } from "./PlantManager.svelte";
import WatermelonProjectile from "../projectiles/WatermelonProjectile";

export default class ProjectileManager {
  projectiles: Projectile[] = $state([]);
  private quadTree: QuadTree;

  constructor() {
    this.quadTree = new QuadTree(
      {
        x: 0,
        y: 0,
        width: YARD_WIDTH + 200,
        height: YARD_HEIGHT,
      },
      4
    );
  }

  addProjectile(projectile: Projectile) {
    this.projectiles = [...this.projectiles, projectile];
  }

  private updateQuadTree() {
    this.quadTree.clear();
    for (const projectile of this.projectiles) {
      this.quadTree.insert({
        id: projectile.id,
        x: projectile.x,
        y: projectile.y,
        width: projectile.width,
        height: projectile.height,
      });
    }
  }

  checkCollisions(
    zombies: Zombie[]
  ): { projectileId: string; zombieId: string }[] {
    this.updateQuadTree();
    const collisions: { projectileId: string; zombieId: string }[] = [];

    // Only process zombies that have projectiles in their row
    const activeRows = new Set(this.projectiles.map((p) => p.row));
    const relevantZombies = zombies.filter((z) => activeRows.has(z.row));

    for (const zombie of relevantZombies) {
      // Get projectiles in this row
      const rowProjectiles = this.projectiles.filter(
        (p) =>
          p.row === zombie.row &&
          (!(p instanceof WatermelonProjectile) || p.isReadyForCollision())
      );

      for (const projectile of rowProjectiles) {
        if (this.checkDetailedCollision(projectile, zombie)) {
          collisions.push({
            projectileId: projectile.id,
            zombieId: zombie.name + "_" + zombie.row + "_" + zombie.x,
          });
        }
      }
    }

    return collisions;
  }

  private checkDetailedCollision(
    projectile: Projectile,
    zombie: Zombie
  ): boolean {
    // Use a narrower collision box around the zombie's center
    const zombieCenterX = zombie.x + zombie.width / 2;
    const zombieCenterY = zombie.y + zombie.height / 2;

    return (
      projectile.x < zombieCenterX + CELL_WIDTH / 4 &&
      projectile.x + projectile.width > zombieCenterX - CELL_WIDTH / 4 &&
      projectile.y < zombieCenterY + CELL_WIDTH / 4 &&
      projectile.y + projectile.height > zombieCenterY - CELL_WIDTH / 4
    );
  }

  update(deltaTime: number, zombies: Zombie[], plants: PlantedPlant[]) {
    // Update projectile positions first
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.move(deltaTime);
      this.checkTorchwoodInteraction(projectile, plants);

      // Remove if outside bounds and if it's a landed watermelon
      if (
        projectile instanceof WatermelonProjectile &&
        (projectile as any).hasLanded
      ) {
        return false;
      }
      return projectile.x < YARD_WIDTH + 200 && projectile.x > -50;
    });

    // Check collisions and apply damage
    const collisions = this.checkCollisions(zombies);

    // Create a Set of projectiles to remove to avoid duplicate removals
    const projectilesToRemove = new Set<string>();

    for (const collision of collisions) {
      const projectile = this.projectiles.find(
        (p) => p.id === collision.projectileId && !projectilesToRemove.has(p.id)
      );
      const zombie = zombies.find(
        (z) => z.name + "_" + z.row + "_" + z.x === collision.zombieId
      );

      if (projectile && zombie) {
        zombie.health -= projectile.damage;

        // Handle freeze effect
        if (projectile.stats.freezeDuration) {
          zombie.freeze(projectile.stats.freezeDuration);
        }

        // Handle stun effect
        if (projectile.stats.stunDuration) {
          zombie.stun(projectile.stats.stunDuration);
        }

        // Handle splash damage for special projectiles
        if (projectile instanceof WatermelonProjectile) {
          this.handleMelonSplash(projectile, zombie, zombies);
        }

        projectilesToRemove.add(projectile.id);
      }
    }

    // Remove hit projectiles at the end
    this.projectiles = this.projectiles.filter(
      (p) => !projectilesToRemove.has(p.id)
    );
  }

  private checkTorchwoodInteraction(
    projectile: Projectile,
    plants: PlantedPlant[]
  ) {
    if (projectile.type !== "pea") return;

    const torchwoods = plants.filter(
      (p) => p.plant.id === "torchwood" && p.cell.row === projectile.row
    );

    for (const torchwood of torchwoods) {
      const torchwoodCenter = torchwood.coordinates.x + CELL_WIDTH / 2;
      const projectileCenter = projectile.x + projectile.width / 2;

      // Check if projectile just passed through torchwood
      if (
        projectileCenter > torchwoodCenter - 5 &&
        projectileCenter < torchwoodCenter + 5
      ) {
        projectile.transformToFirePea();
        break;
      }
    }
  }

  private handleMelonSplash(
    projectile: WatermelonProjectile,
    hitZombie: Zombie,
    zombies: Zombie[]
  ) {
    const impactX = hitZombie.x + hitZombie.width / 2;

    // Only check zombies in the same row
    const rowZombies = zombies.filter((z) => z.row === hitZombie.row);

    for (const zombie of rowZombies) {
      if (zombie === hitZombie) continue;

      const zombieX = zombie.x + zombie.width / 2;
      const distance = Math.abs(zombieX - impactX); // Only care about horizontal distance

      const splashDamage = projectile.getSplashDamage(distance);
      if (splashDamage > 0) {
        zombie.health -= splashDamage;

        if (projectile.stats.freezeDuration) {
          zombie.freeze(projectile.stats.freezeDuration);
        }
      }
    }
  }
}
