import WallnutZombie from "../zombies/WallnutZombie.svelte";
import type PlantManager from "./PlantManager.svelte";
import type Zombie from "../zombies/Zombie.svelte";
import {
  CELL_WIDTH,
  NUM_ROWS,
  NUM_COLS,
  YARD_WIDTH,
  YARD_HEIGHT,
  ZOMBIE_SPAWN_AREA_WIDTH,
} from "../../constants/sizes";
import { getCellCoordinates } from "../../utils/getCellCoordinates";
import EventEmitter from "../EventEmitter";
import NormalZombie from "../zombies/NormalZombie.svelte";
import ConeHeadZombie from "../zombies/ConeHeadZombie.svelte";
import BucketHeadZombie from "../zombies/BucketHeadZombie.svelte";
import QuadTree from "../../algo/QuadTree";
import {
  createPlantBounds,
  createZombieBounds,
} from "../../utils/createEntityBounds";
import type { PlantedPlant } from "./PlantManager.svelte";
import FootballZombie from "../zombies/FootballZombie.svelte";
import FlagZombie from "../zombies/FlagZombie.svelte";
import { gameTime } from "./GameTime.svelte";
import { soundManager } from "./SoundManager.svelte";

export type ZombieTypes =
  | typeof NormalZombie
  | typeof ConeHeadZombie
  | typeof BucketHeadZombie
  | typeof FootballZombie
  | typeof FlagZombie
  | typeof WallnutZombie;

interface WaveConfig {
  zombieCount: number;
  spawnInterval: number;
  maxSimultaneousSpawnCount?: number;
  zombieTypes: Array<{
    type: ZombieTypes;
    weight: number;
  }>;
}

export default class ZombieManager {
  zombies: Zombie[] = $state([]);
  private plantManager: PlantManager;
  private timeSinceLastSpawn: number = 0;
  private spawnInterval: number = 3000;
  private quadTree: QuadTree;

  // Wave Management
  currentWave: number = $state(0);
  private isWaveActive: boolean = false;
  private zombiesSpawnedInWave: number = 0;
  private waveDelay: number = 5000; // Added delay between waves
  private timeUntilNextWave: number = 0; // Added to handle wave transitions

  // First Wave Delay
  private isFirstWaveStarted: boolean = false;
  private firstWaveDelay: number = 8000; // 5 seconds delay before the first wave

  readonly waveConfigs: WaveConfig[] = [
    {
      zombieCount: 4,
      spawnInterval: 8000,
      zombieTypes: [{ type: NormalZombie, weight: 1 }],
    },
    {
      zombieCount: 15,
      spawnInterval: 2800,
      zombieTypes: [
        { type: NormalZombie, weight: 7 },
        { type: ConeHeadZombie, weight: 3 },
      ],
      maxSimultaneousSpawnCount: 2,
    },
    {
      zombieCount: 20,
      spawnInterval: 2500,
      zombieTypes: [
        { type: NormalZombie, weight: 3 },
        { type: ConeHeadZombie, weight: 5 },
        { type: BucketHeadZombie, weight: 10 },
      ],
      maxSimultaneousSpawnCount: 4,
    },
    {
      zombieCount: 40,
      spawnInterval: 1800,
      zombieTypes: [
        { type: NormalZombie, weight: 3 },
        { type: ConeHeadZombie, weight: 5 },
        { type: BucketHeadZombie, weight: 10 },
        { type: FootballZombie, weight: 7 },
        { type: WallnutZombie, weight: 1 },
      ],
      maxSimultaneousSpawnCount: 5,
    },
    {
      zombieCount: 50,
      spawnInterval: 2400,
      zombieTypes: [
        { type: NormalZombie, weight: 1 },
        { type: ConeHeadZombie, weight: 1 },
        { type: BucketHeadZombie, weight: 7 },
        { type: FootballZombie, weight: 10 },
        { type: WallnutZombie, weight: 4 },
      ],
      maxSimultaneousSpawnCount: 6,
    },
  ];

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
    this.quadTree.clear();

    for (const plant of this.plantManager.plantedPlants) {
      this.quadTree.insert(createPlantBounds(plant));
    }

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
    const plantCollisions = potentialCollisions.filter((entity) => {
      const plant = this.plantManager.getPlantById(entity.id);
      return (
        plant &&
        plant.cell.row === zombie.row &&
        this.checkDetailedCollision(zombieBounds, entity) &&
        plant.plant.id !== "spikeweed"
      );
    });

    if (plantCollisions.length === 0) return null;

    plantCollisions.sort((a, b) => a.x - b.x);
    const collidedPlantId = plantCollisions[0].id;
    return this.plantManager.getPlantById(collidedPlantId) || null;
  }

  private checkDetailedCollision(
    zombieBounds: ReturnType<typeof createZombieBounds>,
    plantBounds: ReturnType<typeof createPlantBounds>
  ): boolean {
    return (
      zombieBounds.x < plantBounds.x + plantBounds.width &&
      zombieBounds.x + zombieBounds.width > plantBounds.x
    );
  }

  private selectZombieType() {
    if (this.currentWave >= this.waveConfigs.length) return NormalZombie;
    const config = this.waveConfigs[this.currentWave];
    const totalWeight = config.zombieTypes.reduce(
      (sum, type) => sum + type.weight,
      0
    );
    let random = Math.random() * totalWeight;
    for (const zombieType of config.zombieTypes) {
      random -= zombieType.weight;
      if (random <= 0) {
        return zombieType.type;
      }
    }
    return config.zombieTypes[0].type;
  }

  private spawnZombies() {
    const currentWaveConfig = this.waveConfigs[this.currentWave];
    const remainingZombies =
      currentWaveConfig.zombieCount - this.zombiesSpawnedInWave;

    // Determine simultaneous spawn count with default of 1
    const simultaneousSpawnCount = Math.min(
      Math.floor(
        Math.random() * (currentWaveConfig.maxSimultaneousSpawnCount ?? 1)
      ) + 1,
      remainingZombies
    );

    // Ensure first zombie in waves 2+ is always a Flag Zombie
    const firstZombieType =
      this.currentWave > 0 && this.zombiesSpawnedInWave === 0
        ? FlagZombie
        : null;

    for (let i = 0; i < simultaneousSpawnCount; i++) {
      let ZombieType: WaveConfig["zombieTypes"][0]["type"];

      if (firstZombieType && i === 0) {
        ZombieType = firstZombieType;
      } else {
        ZombieType = this.selectZombieType();
      }

      const randomRow = Math.floor(Math.random() * NUM_ROWS);
      const coordinates = getCellCoordinates(randomRow, NUM_COLS);
      const zombie = new ZombieType({
        row: randomRow,
        x:
          YARD_WIDTH +
          ZOMBIE_SPAWN_AREA_WIDTH -
          Math.random() * (ZOMBIE_SPAWN_AREA_WIDTH / 2), // Add slight variation in spawn x position
        y: coordinates.y + (CELL_WIDTH - CELL_WIDTH / 1.5) / 2,
      });
      this.zombies = [...this.zombies, zombie];
      this.zombiesSpawnedInWave++;
    }
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

  startNextWave() {
    this.isWaveActive = true;
    this.zombiesSpawnedInWave = 0;
    this.spawnInterval = this.waveConfigs[this.currentWave].spawnInterval;
    this.timeSinceLastSpawn = 0;

    // Play zombie-flag sound when a wave starts
    soundManager.playSound("zombie-flag");

    // Play "sirene" sound on final wave start
    if (this.currentWave === this.waveConfigs.length - 1) {
      soundManager.playSound("siren");
    }

    EventEmitter.emit("waveStarted", this.currentWave);
  }

  updateZombies(deltaTime: number) {
    this.updateQuadTree();

    if (!this.isWaveActive) {
      if (this.timeUntilNextWave > 0) {
        this.timeUntilNextWave -= deltaTime;
        if (this.timeUntilNextWave <= 0) {
          this.startNextWave();
        }
      } else if (!this.isFirstWaveStarted) {
        this.firstWaveDelay -= deltaTime;
        if (this.firstWaveDelay <= 0) {
          this.isFirstWaveStarted = true;
          this.startNextWave();
        }
        return;
      }
    }

    if (this.isWaveActive) {
      this.timeSinceLastSpawn += deltaTime;
      if (this.currentWave < this.waveConfigs.length) {
        const currentWaveConfig = this.waveConfigs[this.currentWave];
        if (
          this.timeSinceLastSpawn >= this.spawnInterval &&
          this.zombiesSpawnedInWave < currentWaveConfig.zombieCount
        ) {
          this.timeSinceLastSpawn = 0;
          this.spawnZombies();
        }
      }
    }

    const currentTime = gameTime.get();
    this.zombies = this.zombies.filter((zombie) => {
      if (zombie.x < -50) return false;
      if (zombie.isAttacking && zombie.attackingPlantId) {
        const attackedPlant = this.plantManager.getPlantById(
          zombie.attackingPlantId
        );
        if (!attackedPlant) {
          zombie.isAttacking = false;
          zombie.attackingPlantId = null;
          zombie.lastAttackTime = 0;
          zombie.stopEatingSound();
        } else if (zombie.attack(attackedPlant, currentTime)) {
          if (attackedPlant.plant.health <= 0) {
            this.plantManager.remove(attackedPlant.plantedId);
            zombie.isAttacking = false;
            zombie.attackingPlantId = null;
            zombie.lastAttackTime = 0;
            zombie.stopEatingSound();
          }
        }
      }
      if (!zombie.isAttacking) {
        zombie.move(deltaTime);
        const collidedPlant = this.checkCollisions(zombie);
        if (collidedPlant) {
          zombie.isAttacking = true;
          zombie.attackingPlantId = collidedPlant.plantedId;
          if (zombie.attack(collidedPlant, currentTime)) {
            if (collidedPlant.plant.health <= 0) {
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

    // Only transition to next wave when ALL zombies are cleared AND all zombies have been spawned
    if (
      this.zombiesSpawnedInWave >=
        this.waveConfigs[this.currentWave]?.zombieCount &&
      this.zombies.length === 0
    ) {
      this.isWaveActive = false;
      this.currentWave++;
      EventEmitter.emit("waveCompleted", this.currentWave);
      this.timeUntilNextWave = this.waveDelay;
    }
  }

  getCurrentWaveInfo() {
    if (this.currentWave >= this.waveConfigs.length) {
      return {
        wave: this.waveConfigs.length,
        totalWaves: this.waveConfigs.length,
        zombiesSpawned: 0,
        totalZombies: 0,
        zombiesAlive: 0,
      };
    }
    return {
      wave: this.currentWave + 1,
      totalWaves: this.waveConfigs.length,
      zombiesSpawned: this.zombiesSpawnedInWave,
      totalZombies: this.waveConfigs[this.currentWave].zombieCount,
      zombiesAlive: this.zombies.length,
    };
  }

  reset() {
    // Stop all zombie eating sounds
    this.zombies.forEach((zombie) => {
      zombie.isAttacking = false;
      zombie.attackingPlantId = null;
      zombie.stopEatingSound();
    });

    this.zombies = [];
    this.currentWave = 0;
    this.isWaveActive = false;
    this.zombiesSpawnedInWave = 0;
    this.timeSinceLastSpawn = 0;
    this.timeUntilNextWave = 0;
    this.quadTree.clear();
    this.isFirstWaveStarted = false;
    this.firstWaveDelay = 8000;

    soundManager.stopSound("zombie-flag");
    soundManager.stopSound("siren");
  }

  getTotalWave() {
    return this.waveConfigs.length;
  }
}

export const zombieTypes: Array<ZombieTypes> = [
  NormalZombie,
  ConeHeadZombie,
  BucketHeadZombie,
  FootballZombie,
  FlagZombie,
  WallnutZombie,
];
