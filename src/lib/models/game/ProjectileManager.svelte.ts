import type Zombie from "../zombies/Zombie.svelte";
import { YARD_WIDTH, CELL_WIDTH, YARD_HEIGHT } from "../../../constants/sizes";
import QuadTree from "../../algo/QuadTree";
import Projectile from "../projectiles/Projectile.svelte";
import type { PlantedPlant } from "./PlantManager.svelte";

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

    for (const zombie of zombies) {
      // Center the search area around the exact center of the zombie
      const searchArea = {
        x: zombie.x + zombie.width / 2 - CELL_WIDTH / 4, // Half of CELL_WIDTH for tighter center
        y: zombie.y + zombie.height / 2 - CELL_WIDTH / 4,
        width: CELL_WIDTH / 2, // Narrower hit width for central hit detection
        height: CELL_WIDTH / 2, // Narrower hit height
      };

      const potentialCollisions = this.quadTree.query(searchArea);

      for (const collision of potentialCollisions) {
        const projectile = this.projectiles.find((p) => p.id === collision.id);
        if (projectile && projectile.row === zombie.row) {
          // Ensure we are checking collision precisely around the center
          if (this.checkDetailedCollision(projectile, zombie)) {
            collisions.push({
              projectileId: projectile.id,
              zombieId: zombie.name + "_" + zombie.row + "_" + zombie.x,
            });
          }
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
      return projectile.x < YARD_WIDTH + 200;
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
}
