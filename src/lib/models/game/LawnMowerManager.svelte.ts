import QuadTree from "$lib/algo/QuadTree";
import { NUM_ROWS, YARD_HEIGHT, YARD_WIDTH } from "$lib/constants/sizes";
import { createZombieBounds } from "$lib/utils/createEntityBounds";
import LawnMower from "../lawnmower/LawnMower.svelte";
import type Zombie from "../zombies/Zombie.svelte";

export default class LawnMowerManager {
  private lawnMowers: LawnMower[] = $state([]);
  private quadTree: QuadTree;

  constructor() {
    // Initialize lawn mowers for each row
    for (let row = 0; row < NUM_ROWS; row++) {
      this.lawnMowers.push(new LawnMower({ row }));
    }

    // Initialize QuadTree with yard bounds
    this.quadTree = new QuadTree(
      { x: 0, y: 0, width: YARD_WIDTH + 200, height: YARD_HEIGHT },
      4 // capacity per node
    );
  }

  update(deltaTime: number, zombies: Zombie[]) {
    this.updateQuadTree(zombies);

    for (let i = this.lawnMowers.length - 1; i >= 0; i--) {
      const lawnMower = this.lawnMowers[i];
      if (lawnMower.isActivated) {
        lawnMower.move(deltaTime);
        zombies = this.handleCollisions(lawnMower, zombies);
        if (lawnMower.isOutOfBounds()) {
          this.lawnMowers.splice(i, 1); // Remove the lawn mower from the list
        }
      } else {
        const firstZombie = zombies
          .filter((zombie) => zombie.row === lawnMower.row)
          .find((zombie) => zombie.x <= 0);

        if (firstZombie) {
          // Removed the first zombie directly from the zombies array, if we are trying to remove it inside the collision handler, we will get a race condition
          zombies.splice(zombies.indexOf(firstZombie), 1);
          lawnMower.activate();
        }
      }
    }
    return zombies;
  }

  private updateQuadTree(zombies: Zombie[]) {
    this.quadTree.clear();
    for (const zombie of zombies) {
      this.quadTree.insert(createZombieBounds(zombie));
    }
  }

  private handleCollisions(lawnMower: LawnMower, zombies: Zombie[]): Zombie[] {
    const lawnMowerBounds = {
      x: lawnMower.x,
      y: lawnMower.y,
      width: lawnMower.width,
      height: lawnMower.height,
    };

    const searchArea = {
      x: lawnMowerBounds.x - lawnMower.width / 2,
      y: lawnMowerBounds.y - lawnMower.height / 2,
      width: lawnMowerBounds.width * 2,
      height: lawnMowerBounds.height * 2,
    };

    const potentialCollisions = this.quadTree.query(searchArea);
    const zombiesToRemove: Set<Zombie> = new Set();

    for (const collision of potentialCollisions) {
      const zombie = zombies.find(
        (z) => z.name + "_" + z.row + "_" + z.x === collision.id
      );
      if (zombie && this.checkDetailedCollision(lawnMowerBounds, collision)) {
        zombiesToRemove.add(zombie);
      }
    }

    // Remove collided zombies
    zombies = zombies.filter((zombie) => !zombiesToRemove.has(zombie));

    return zombies;
  }

  private checkDetailedCollision(
    lawnMowerBounds: { x: number; y: number; width: number; height: number },
    zombieBounds: { x: number; y: number; width: number; height: number }
  ): boolean {
    return (
      lawnMowerBounds.x < zombieBounds.x + zombieBounds.width &&
      lawnMowerBounds.x + lawnMowerBounds.width > zombieBounds.x &&
      lawnMowerBounds.y < zombieBounds.y + zombieBounds.height &&
      lawnMowerBounds.y + lawnMowerBounds.height > zombieBounds.y
    );
  }

  reset() {
    this.lawnMowers = [];
    for (let row = 0; row < NUM_ROWS; row++) {
      this.lawnMowers.push(new LawnMower({ row }));
    }
    this.quadTree.clear();
  }

  getLawnMowers() {
    return this.lawnMowers;
  }

  clearLawnMowers() {
    this.lawnMowers = [];
  }
}
