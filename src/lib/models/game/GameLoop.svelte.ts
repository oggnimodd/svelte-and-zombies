import type PlantManager from "./PlantManager.svelte";
import ZombieManager from "./ZombieManager.svelte";
import ProjectileManager from "./ProjectileManager.svelte";
import Peashooter from "../plants/Peashooter";
import type Projectile from "../projectiles/Projectile.svelte";
import Repeater from "../plants/Repeater";
import GatlingPea from "../plants/GatlingPea";
import FirePea from "../plants/FirePea";
import Watermelon from "../plants/Watermelon";

export class GameLoop {
  lastFrameTime: number = 0;
  isRunning: boolean = $state(false);
  isPaused: boolean = $state(false);
  deltaTime: number = 0;
  fps: number = $state(0);
  gameTime: number = 0; // Add game clock
  private readonly MAX_DELTA = 1000 / 60; // Cap at ~60fps for smoother performance

  zombieManager: ZombieManager;
  plantManager: PlantManager;
  projectileManager: ProjectileManager;

  constructor(plantManager: PlantManager) {
    this.plantManager = plantManager;
    this.zombieManager = new ZombieManager(plantManager);
    this.projectileManager = new ProjectileManager();
  }

  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop() {
    this.isRunning = false;
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  private tick = (currentTime: number = performance.now()) => {
    if (!this.isRunning || this.isPaused) return;

    // Calculate deltaTime
    this.deltaTime = Math.min(currentTime - this.lastFrameTime, this.MAX_DELTA);
    this.lastFrameTime = currentTime;

    // Update game clock
    this.gameTime += this.deltaTime;

    // Update game state
    this.update(this.deltaTime, this.gameTime);

    // Calculate FPS
    this.fps = Math.round(1000 / this.deltaTime);

    // Continue the loop
    if (this.checkGameState()) {
      requestAnimationFrame(this.tick);
    }
  };

  private update(deltaTime: number, gameTime: number) {
    this.zombieManager.updateZombies(deltaTime);

    for (const plantedPlant of this.plantManager.plantedPlants) {
      let projectiles: Projectile[] | null = null;

      if (plantedPlant.plant instanceof Peashooter) {
        const peashooter = plantedPlant.plant as Peashooter;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (
          zombiesInRow.length > 0 &&
          peashooter.canShoot(plantedPlant.plantedId, gameTime)
        ) {
          const projectile = peashooter.shoot(plantedPlant, gameTime);
          if (projectile) {
            this.projectileManager.addProjectile(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof Repeater) {
        const repeater = plantedPlant.plant as Repeater;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (
          zombiesInRow.length > 0 &&
          repeater.canShoot(plantedPlant.plantedId, gameTime)
        ) {
          projectiles = repeater.shoot(plantedPlant, gameTime);
        }
      } else if (plantedPlant.plant instanceof GatlingPea) {
        const gatlingPea = plantedPlant.plant as GatlingPea;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (
          zombiesInRow.length > 0 &&
          gatlingPea.canShoot(plantedPlant.plantedId, gameTime)
        ) {
          projectiles = gatlingPea.shoot(plantedPlant, gameTime);
        }
      } else if (plantedPlant.plant instanceof FirePea) {
        const firePea = plantedPlant.plant as FirePea;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (
          zombiesInRow.length > 0 &&
          firePea.canShoot(plantedPlant.plantedId, gameTime)
        ) {
          projectiles = firePea.shoot(plantedPlant, gameTime);
        }
      } else if (plantedPlant.plant instanceof Watermelon) {
        const watermelon = plantedPlant.plant as Watermelon;
        if (watermelon.canShoot(plantedPlant.plantedId, gameTime)) {
          const projectile = watermelon.shoot(
            plantedPlant,
            gameTime,
            this.zombieManager.zombies
          );
          if (projectile) {
            this.projectileManager.addProjectile(projectile);
          }
        }
      }

      if (projectiles) {
        for (const projectile of projectiles) {
          this.projectileManager.addProjectile(projectile);
        }
      }
    }

    this.projectileManager.update(
      deltaTime,
      this.zombieManager.zombies,
      this.plantManager.plantedPlants
    );

    this.zombieManager.zombies = this.zombieManager.zombies.filter(
      (zombie) => zombie.health > 0
    );
  }

  private checkGameState(): boolean {
    if (this.checkLoseCondition()) {
      this.stop();
      queueMicrotask(() => alert("Game Over! The zombies ate your brains! 🧠"));
      return false;
    }
    if (this.checkWinCondition()) {
      this.stop();
      queueMicrotask(() => alert("You won! All zombies defeated! 🌻"));
      return false;
    }
    return true;
  }

  private checkLoseCondition() {
    // return this.zombieManager.zombies.some((zombie) => zombie.x <= 0);
    return false;
  }

  private checkWinCondition() {
    // For now, just return false - we'll implement wave system later
    return false;
  }
}
