import type PlantManager from "./PlantManager.svelte";
import ZombieManager from "./ZombieManager.svelte";
import ProjectileManager from "./ProjectileManager.svelte";
import Peashooter from "../plants/Peashooter";
import type Projectile from "../projectiles/Projectile.svelte";
import Repeater from "../plants/Repeater";
import GatlingPea from "../plants/GatlingPea";
import FirePea from "../plants/FirePea";
import Watermelon from "../plants/Watermelon";
import IcePea from "../plants/IcePea";
import WinterMelon from "../plants/WinterMelon";
import { gameTime } from "./GameTime.svelte";
import Chilli from "../plants/Chilli";
import Cherry from "../plants/Cherry";
import Cabbage from "../plants/Cabbage";
import Potato from "../plants/Potato";
import Threepeater from "../plants/Threepeater";
import Spikeweed from "../plants/Spikeweed";
import { NUM_ROWS } from "../../constants/sizes";
import Kernelpult from "../plants/Kernelpult";
import Squash from "../plants/Squash";
import Chomper from "../plants/Chomper";
import SplitPea from "../plants/SplitPea";
import Starfruit from "../plants/Starfruit";
import SunManager from "./SunManager.svelte";
import EventEmitter from "../EventEmitter";
import Sunflower from "../plants/Sunflower";
import { soundManager } from "./SoundManager.svelte";

export class GameLoop {
  lastFrameTime: number = 0;
  isRunning: boolean = $state(false);
  isPaused: boolean = $state(false);
  deltaTime: number = 0;
  fps: number = $state(0);
  private readonly MAX_DELTA = 1000 / 30;

  zombieManager: ZombieManager;
  plantManager: PlantManager;
  projectileManager: ProjectileManager;
  sunManager: SunManager;

  constructor(plantManager: PlantManager) {
    this.plantManager = plantManager;
    this.zombieManager = new ZombieManager(plantManager);
    this.projectileManager = new ProjectileManager();
    this.sunManager = new SunManager(100);

    // TODO: make sunmanager available globally
    EventEmitter.on("produceSun", ({ x, y }) => {
      this.sunManager.spawnSunFromFlower(x, y);
    });
  }

  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop() {
    // Reset game state
    gameTime.set(0);
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    this.isPaused = false; // Make sure pause state is reset

    // Reset all managers
    this.zombieManager.reset();
    this.projectileManager.reset();
    this.plantManager.reset();
    this.sunManager.reset();

    // Stop background music
    soundManager.stopBackgroundMusic();
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning) {
      // Don't resume if the game was stopped
      return;
    }
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
    gameTime.set(gameTime.get() + this.deltaTime);

    // Update game state
    this.update(this.deltaTime, gameTime.get());

    // Calculate FPS
    this.fps = Math.round(1000 / this.deltaTime);

    // Continue the loop
    if (this.checkGameState()) {
      requestAnimationFrame(this.tick);
    }
  };

  private update(deltaTime: number, gameTime: number) {
    this.zombieManager.updateZombies(deltaTime);

    let allProjectiles: (Projectile | Projectile[] | null)[] = [];

    for (const plantedPlant of this.plantManager.plantedPlants) {
      if (plantedPlant.plant instanceof Peashooter) {
        const peashooter = plantedPlant.plant as Peashooter;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (zombiesInRow.length > 0 && peashooter.canShoot(gameTime)) {
          const projectile = peashooter.shoot(plantedPlant, gameTime);
          if (projectile) {
            allProjectiles.push(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof Repeater) {
        const repeater = plantedPlant.plant as Repeater;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (zombiesInRow.length > 0 && repeater.canShoot(gameTime)) {
          allProjectiles.push(repeater.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof GatlingPea) {
        const gatlingPea = plantedPlant.plant as GatlingPea;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (zombiesInRow.length > 0 && gatlingPea.canShoot(gameTime)) {
          allProjectiles.push(gatlingPea.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof FirePea) {
        const firePea = plantedPlant.plant as FirePea;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (zombiesInRow.length > 0 && firePea.canShoot(gameTime)) {
          allProjectiles.push(firePea.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof Watermelon) {
        const watermelon = plantedPlant.plant as Watermelon;
        if (watermelon.canShoot(gameTime)) {
          const projectile = watermelon.shoot(
            plantedPlant,
            gameTime,
            this.zombieManager.zombies
          );
          if (projectile) {
            allProjectiles.push(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof WinterMelon) {
        const wintermelon = plantedPlant.plant as WinterMelon;
        if (wintermelon.canShoot(gameTime)) {
          const projectile = wintermelon.shoot(
            plantedPlant,
            gameTime,
            this.zombieManager.zombies
          );
          if (projectile) {
            allProjectiles.push(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof Cabbage) {
        const cabbage = plantedPlant.plant as Cabbage;
        if (cabbage.canShoot(gameTime)) {
          const projectile = cabbage.shoot(
            plantedPlant,
            gameTime,
            this.zombieManager.zombies
          );
          if (projectile) {
            allProjectiles.push(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof IcePea) {
        const peashooter = plantedPlant.plant as IcePea;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (zombiesInRow.length > 0 && peashooter.canShoot(gameTime)) {
          const projectile = peashooter.shoot(plantedPlant, gameTime);
          if (projectile) {
            allProjectiles.push(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof Chilli) {
        const chilli = plantedPlant.plant as Chilli;
        // Explode immediately without checking for zombies
        chilli.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Cherry) {
        const cherry = plantedPlant.plant as Cherry;
        // Explode immediately without checking for zombies
        cherry.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Potato) {
        const potato = plantedPlant.plant as Potato;
        potato.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Threepeater) {
        const threepeater = plantedPlant.plant as Threepeater;
        // Check adjacent rows for zombies
        const adjacentRows = [-1, 0, 1]
          .map((offset) => plantedPlant.cell.row + offset)
          .filter((row) => row >= 0 && row < NUM_ROWS);

        const zombiesInRange = this.zombieManager.zombies.filter(
          (zombie) =>
            adjacentRows.includes(zombie.row) &&
            zombie.x > plantedPlant.coordinates.x
        );

        if (zombiesInRange.length > 0 && threepeater.canShoot(gameTime)) {
          allProjectiles.push(threepeater.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof Spikeweed) {
        const spikeweed = plantedPlant.plant as Spikeweed;
        spikeweed.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Kernelpult) {
        const kernelpult = plantedPlant.plant as Kernelpult;
        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) =>
            zombie.row === plantedPlant.cell.row &&
            zombie.x > plantedPlant.coordinates.x
        );
        if (zombiesInRow.length > 0 && kernelpult.canShoot(gameTime)) {
          const projectile = kernelpult.shoot(
            plantedPlant,
            gameTime,
            this.zombieManager.zombies
          );
          if (projectile) {
            allProjectiles.push(projectile);
          }
        }
      } else if (plantedPlant.plant instanceof Squash) {
        const squash = plantedPlant.plant as Squash;
        squash.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Chomper) {
        const chomper = plantedPlant.plant as Chomper;
        chomper.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof SplitPea) {
        const splitPea = plantedPlant.plant as SplitPea;

        const zombiesInRow = this.zombieManager.zombies.filter(
          (zombie) => zombie.row === plantedPlant.cell.row
        );

        // Here we don't need to check if zombies are on the right side since split pea will shoot on both sides
        if (zombiesInRow.length > 0 && splitPea.canShoot(gameTime)) {
          allProjectiles.push(splitPea.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof Starfruit) {
        const starfruit = plantedPlant.plant as Starfruit;

        if (
          starfruit.canShoot(gameTime) &&
          // Shoot when there are zombies on any row
          this.zombieManager.zombies.length > 0
        ) {
          allProjectiles.push(starfruit.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof Sunflower) {
        const sunflower = plantedPlant.plant as Sunflower;
        sunflower.update(plantedPlant, gameTime);
      }
    }

    // Flatten the array of projectiles and add them all at once
    const flattenedProjectiles = allProjectiles.flat();
    this.projectileManager.addProjectile(
      flattenedProjectiles.filter((projectile) => projectile !== null)
    );

    this.projectileManager.update(
      deltaTime,
      this.zombieManager.zombies,
      this.plantManager.plantedPlants
    );

    this.zombieManager.zombies = this.zombieManager.zombies.filter((zombie) => {
      if (zombie.health <= 0) {
        zombie.stopEatingSound(); // Add this line to stop sound when zombie dies
        return false;
      }
      return true;
    });

    this.sunManager.suns = this.sunManager.suns.map((sun) => {
      if (sun.y < sun.targetY) {
        const fallSpeed = 0.1;
        sun.y += deltaTime * fallSpeed;

        if (sun.y > sun.targetY) {
          sun.y = sun.targetY;
        }
      }
      return sun;
    });

    this.sunManager.update(gameTime);
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
