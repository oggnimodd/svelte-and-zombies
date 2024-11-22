import type PlantManager from "./PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import {
  CELL_WIDTH,
  NUM_ROWS,
  NUM_COLS,
  YARD_WIDTH,
  YARD_HEIGHT,
} from "../../constants/sizes";
import { getCellCoordinates } from "../../utils/getCellCoordinates";
import EventEmitter from "../EventEmitter";
import NormalZombie from "../zombies/NormalZombie.svelte";
import QuadTree from "../../algo/QuadTree";
import {
  createPlantBounds,
  createZombieBounds,
} from "../../utils/createEntityBounds";
import type { PlantedPlant } from "./PlantManager.svelte";

export default class ZombieManager {
  zombies: Zombie[] = $state([]);
  private plantManager: PlantManager;
  private timeSinceLastSpawn: number = 0;
  private spawnInterval: number = 3000;
  private quadTree: QuadTree;

  constructor(plantManager: PlantManager) {
    this.plantManager = plantManager;
    EventEmitter.on("plantRemoved", this.handlePlantRemoved.bind(this));

    // Initialize QuadTree with yard bounds
    this.quadTree = new QuadTree(
      { x: 0, y: 0, width: YARD_WIDTH + 200, height: YARD_HEIGHT },
      4 // capacity per node
    );
  }

  private updateQuadTree() {
    // Clear and rebuild quadtree
    this.quadTree.clear();

    // Insert all plants
    for (const plant of this.plantManager.plantedPlants) {
      this.quadTree.insert(createPlantBounds(plant));
    }

    // Insert all zombies
    for (const zombie of this.zombies) {
      this.quadTree.insert(createZombieBounds(zombie));
    }
  }

  private checkCollisions(zombie: Zombie): PlantedPlant | null {
    const zombieBounds = createZombieBounds(zombie);
    const searchArea = {
      x: zombieBounds.x - CELL_WIDTH / 2,
      y: zombieBounds.y - CELL_WIDTH / 2,
      width: zombieBounds.width + CELL_WIDTH,
      height: zombieBounds.height + CELL_WIDTH,
    };

    const potentialCollisions = this.quadTree.query(searchArea);

    // Filter for plants only (they have plantedId) and check if they're in the same row
    const plantCollisions = potentialCollisions.filter((entity) => {
      const plant = this.plantManager.getPlantById(entity.id);
      return (
        plant &&
        plant.cell.row === zombie.row &&
        this.checkDetailedCollision(zombieBounds, entity) &&
        // There are spesific plants we want to ignore
        // For example in the original pvz the zombies can't attack spikeweed
        // TODO: Separate this check into a different method
        plant.plant.id !== "spikeweed"
      );
    });

    if (plantCollisions.length === 0) return null;

    // Sort by x position to get leftmost plant
    plantCollisions.sort((a, b) => a.x - b.x);
    const collidedPlantId = plantCollisions[0].id;
    return this.plantManager.getPlantById(collidedPlantId) || null;
  }

  // Add this helper method for detailed collision checking
  private checkDetailedCollision(
    zombieBounds: ReturnType<typeof createZombieBounds>,
    plantBounds: ReturnType<typeof createPlantBounds>
  ): boolean {
    return (
      zombieBounds.x < plantBounds.x + plantBounds.width &&
      zombieBounds.x + zombieBounds.width > plantBounds.x
    );
  }
  spawnZombie() {
    const randomRow = Math.floor(Math.random() * NUM_ROWS);
    const coordinates = getCellCoordinates(randomRow, NUM_COLS);
    const zombie = new NormalZombie({
      row: randomRow,
      x: YARD_WIDTH + 100,
      y: coordinates.y + (CELL_WIDTH - CELL_WIDTH / 1.5) / 2,
    });
    this.zombies = [...this.zombies, zombie];
  }

  private handlePlantRemoved(plantedId: string) {
    this.zombies = this.zombies.map((zombie) => {
      if (zombie.attackingPlantId === plantedId) {
        zombie.isAttacking = false;
        zombie.attackingPlantId = null;
        zombie.lastAttackTime = 0;
        zombie.stopEatingSound();
      }
      return zombie;
    });
  }

  updateZombies(deltaTime: number) {
    this.timeSinceLastSpawn += deltaTime;
    if (this.timeSinceLastSpawn >= this.spawnInterval) {
      this.spawnZombie();
      this.timeSinceLastSpawn = 0;
    }

    // Update QuadTree
    this.updateQuadTree();

    const currentTime = performance.now();
    this.zombies = this.zombies.filter((zombie) => {
      if (zombie.x < -50) return false;

      // Handle ongoing attacks
      if (zombie.isAttacking && zombie.attackingPlantId) {
        const attackedPlant = this.plantManager.getPlantById(
          zombie.attackingPlantId
        );
        if (!attackedPlant) {
          zombie.isAttacking = false;
          zombie.attackingPlantId = null;
          zombie.lastAttackTime = 0;
          zombie.stopEatingSound();
        } else {
          if (zombie.attack(attackedPlant, currentTime)) {
            if (attackedPlant.currentHealth <= 0) {
              this.plantManager.remove(attackedPlant.plantedId);
              zombie.isAttacking = false;
              zombie.attackingPlantId = null;
              zombie.lastAttackTime = 0;
              zombie.stopEatingSound();
            }
          }
        }
      }

      // Move and check for new collisions
      if (!zombie.isAttacking) {
        zombie.move(deltaTime);

        const collidedPlant = this.checkCollisions(zombie);
        if (collidedPlant) {
          zombie.isAttacking = true;
          zombie.attackingPlantId = collidedPlant.plantedId;
          if (zombie.attack(collidedPlant, currentTime)) {
            if (collidedPlant.currentHealth <= 0) {
              this.plantManager.remove(collidedPlant.plantedId);
              zombie.isAttacking = false;
              zombie.attackingPlantId = null;
              zombie.lastAttackTime = 0;
              zombie.stopEatingSound();
            }
          }
        }
      }
      return true;
    });
  }

  reset() {
    this.zombies = [];
    this.timeSinceLastSpawn = 0;
    this.quadTree.clear();
  }
}
