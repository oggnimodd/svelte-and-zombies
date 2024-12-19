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
import Cherry from "../plants/Cherry.svelte";
import Cabbage from "../plants/Cabbage";
import Threepeater from "../plants/Threepeater";
import Spikeweed from "../plants/Spikeweed";
import { NUM_ROWS } from "../../constants/sizes";
import Kernelpult from "../plants/Kernelpult";
import SplitPea from "../plants/SplitPea";
import Starfruit from "../plants/Starfruit";
import SunManager from "./SunManager.svelte";
import EventEmitter from "../EventEmitter";
import Sunflower from "../plants/Sunflower";
import { soundManager } from "./SoundManager.svelte";
import { plantSelector } from "$lib/reactivity/plantSelector.svelte";
import LawnMowerManager from "./LawnMowerManager.svelte";
import Squash from "../plants/Squash.svelte";
import Chomper from "../plants/Chomper.svelte";
import ExplosionManager, {
  type CharredEffectParams,
  type CircularExplosionParams,
  type RowExplosionParams,
} from "./ExplosionManager.svelte";
import Potato from "../plants/Potato.svelte";

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
  lawnMowerManager: LawnMowerManager;
  explosionManager: ExplosionManager;

  private isDelayingWin: boolean = false; // Flag to indicate delay before announcing win
  private winDelayAccumulator: number = 0; // Accumulator for the delay
  private readonly WIN_DELAY = 800; // 800ms delay before announcing the win

  constructor(plantManager: PlantManager) {
    this.plantManager = plantManager;
    this.zombieManager = new ZombieManager(plantManager);
    this.projectileManager = new ProjectileManager();
    this.sunManager = new SunManager();
    this.lawnMowerManager = new LawnMowerManager();
    this.explosionManager = new ExplosionManager();

    EventEmitter.on("produceSun", ({ x, y }) => {
      this.sunManager.spawnSunFromFlower(x, y);
    });

    EventEmitter.on("gameWon", () => {
      this.stop();
    });

    // Listen for explosion events
    EventEmitter.on(
      "addCircularExplosion",
      (params: CircularExplosionParams) => {
        this.explosionManager.addCircularExplosion(params);
      }
    );

    EventEmitter.on("addRowExplosion", (params: RowExplosionParams) => {
      this.explosionManager.addRowExplosion(params);
    });

    EventEmitter.on("addCharredEffect", (params: CharredEffectParams) => {
      this.explosionManager.addCharredEffect(params);
    });
  }

  start() {
    this.isRunning = true;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  stop() {
    gameTime.set(0);
    this.isRunning = false;
    this.lastFrameTime = 0;
    this.deltaTime = 0;
    this.fps = 0;
    this.isPaused = false;
    this.zombieManager.reset();
    this.projectileManager.reset();
    this.plantManager.reset();
    this.sunManager.reset();
    this.lawnMowerManager.reset();
    plantSelector.reset();
    soundManager.stopBackgroundMusic();
    this.zombieManager.zombies.forEach((zombie) => zombie.stopEatingSound());
    this.explosionManager.reset();

    this.isDelayingWin = false; // Reset the win delay flag
    this.winDelayAccumulator = 0; // Reset the delay accumulator
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning) {
      return;
    }
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    requestAnimationFrame(this.tick);
  }

  private tick = (currentTime: number = performance.now()) => {
    if (!this.isRunning || this.isPaused) return;
    this.deltaTime = Math.min(currentTime - this.lastFrameTime, this.MAX_DELTA);
    this.lastFrameTime = currentTime;
    gameTime.set(gameTime.get() + this.deltaTime);
    this.update(this.deltaTime, gameTime.get());
    this.fps = Math.round(1000 / this.deltaTime);
    if (this.checkGameState()) {
      requestAnimationFrame(this.tick);
    }
  };

  private update(deltaTime: number, gameTime: number) {
    this.zombieManager.updateZombies(deltaTime);
    let allProjectiles: (Projectile | Projectile[] | null)[] = [];
    for (const plantedPlant of this.plantManager.plantedPlants) {
      // Visual effect for hit plant
      // Reset plant's hit state if the hitEndTime has passed
      if (
        plantedPlant.plant.isHit &&
        gameTime > plantedPlant.plant.hitEndTime
      ) {
        plantedPlant.plant.isHit = false;
        plantedPlant.plant.hitEndTime = 0; // Reset hitEndTime as well
      }

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
        chilli.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Cherry) {
        const cherry = plantedPlant.plant as Cherry;
        cherry.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Potato) {
        const potato = plantedPlant.plant as Potato;
        potato.update(plantedPlant, gameTime, this.zombieManager.zombies);
      } else if (plantedPlant.plant instanceof Threepeater) {
        const threepeater = plantedPlant.plant as Threepeater;
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
        if (zombiesInRow.length > 0 && splitPea.canShoot(gameTime)) {
          allProjectiles.push(splitPea.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof Starfruit) {
        const starfruit = plantedPlant.plant as Starfruit;
        if (
          starfruit.canShoot(gameTime) &&
          this.zombieManager.zombies.length > 0
        ) {
          allProjectiles.push(starfruit.shoot(plantedPlant, gameTime));
        }
      } else if (plantedPlant.plant instanceof Sunflower) {
        const sunflower = plantedPlant.plant as Sunflower;
        sunflower.update(plantedPlant, gameTime);
      }
    }

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
        zombie.stopEatingSound();
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

    this.zombieManager.zombies = this.lawnMowerManager.update(
      deltaTime,
      this.zombieManager.zombies
    );

    this.explosionManager.update();
  }

  private checkGameState(): boolean {
    if (this.checkLoseCondition()) {
      soundManager.playSound("lose");
      soundManager.playSound("screaming");
      EventEmitter.emit("gameLost");
      this.stop();
      return false;
    }
    if (this.checkWinCondition()) {
      if (!this.isDelayingWin) {
        this.isDelayingWin = true;
        this.winDelayAccumulator = 0; // Reset the delay accumulator
      } else {
        // Accumulate the delay
        this.winDelayAccumulator += this.deltaTime;

        // If the delay has been reached, announce the win
        if (this.winDelayAccumulator >= this.WIN_DELAY) {
          soundManager.playSound("victory");
          EventEmitter.emit("gameWon");
          return false;
        }
      }
    }

    return true;
  }

  private checkLoseCondition() {
    for (const zombie of this.zombieManager.zombies) {
      // Check if zombie has reached the left side of the yard
      if (zombie.x <= 0) {
        const lawnMowerInRow = this.lawnMowerManager
          .getLawnMowers()
          .find((lawnMower) => lawnMower.row === zombie.row);

        // Check if lawnmower is no longer in the row
        if (!lawnMowerInRow) {
          return true; // Game Over condition met
        }
      }
    }
    return false; // No Game Over condition met
  }

  private checkWinCondition() {
    if (
      this.zombieManager.currentWave >= this.zombieManager.waveConfigs.length &&
      this.zombieManager.zombies.length === 0
    ) {
      return true;
    }
    return false;
  }
}
