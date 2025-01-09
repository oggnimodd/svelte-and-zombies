import uuid from "short-uuid";
import { YARD_HEIGHT, YARD_WIDTH, CELL_WIDTH } from "../../constants/sizes";
import { gameTime } from "./GameTime.svelte";

export interface FallingSun {
  id: string;
  x: number;
  y: number;
  targetY: number;
  value: number;
  spawnTime: number;
  isFallingFromSky?: boolean;
}

// TODO: change this to 100
const INITIAL_TOTAL_SUN = 100000;

export default class SunManager {
  totalSun: number = $state(INITIAL_TOTAL_SUN);
  // Displayed suns
  suns: FallingSun[] = $state([]);
  sunCounterDivRef: HTMLDivElement | null = $state(null);

  // These properties are for the sun spawned from the top of the yard
  private readonly spawnInterval = 10000; // 10 seconds
  private readonly sunValue = 25;
  private lastSpawnTime = 0;

  constructor() {
    this.totalSun = INITIAL_TOTAL_SUN;
  }

  setTotalSun(totalSun: number) {
    this.totalSun = totalSun;
  }

  addSun(sun: number) {
    this.totalSun += sun;
  }

  subtractSun(sun: number) {
    this.totalSun -= sun;
  }

  get total() {
    return this.totalSun;
  }

  update(gameTime: number) {
    const skyDroppedSuns = this.suns.filter((sun) => sun.y === -50);
    if (
      skyDroppedSuns.length === 0 &&
      gameTime - this.lastSpawnTime >= this.spawnInterval
    ) {
      this.spawnRandomSun();
      this.lastSpawnTime = gameTime;
    }

    this.suns = this.suns.filter((sun) => gameTime - sun.spawnTime < 15000);
  }

  spawnRandomSun() {
    const middleThirdStart = YARD_WIDTH / 3;
    const middleThirdEnd = (YARD_WIDTH * 2) / 3;
    const x =
      Math.random() * (middleThirdEnd - middleThirdStart) + middleThirdStart;
    const targetY = Math.random() * (YARD_HEIGHT - 100) + 50;

    this.suns.push({
      id: uuid.generate(),
      x,
      y: -50,
      targetY,
      value: this.sunValue,
      spawnTime: gameTime.get(),
      isFallingFromSky: true,
    });
  }

  spawnSunFromFlower(baseX: number, baseY: number) {
    const randomOffsetX = (Math.random() - 0.5) * (CELL_WIDTH * 0.5);
    const randomOffsetY = (Math.random() - 0.5) * (CELL_WIDTH * 0.5);

    const x = baseX + randomOffsetX;
    const y = baseY + randomOffsetY;

    const startY = y - 20;
    const targetY = y + 30;

    this.suns.push({
      id: uuid.generate(),
      x,
      y: startY,
      targetY,
      value: this.sunValue,
      spawnTime: gameTime.get(),
    });
  }

  collectSun(id: string) {
    const sun = this.suns.find((s) => s.id === id);
    if (sun) {
      // Add to total sun
      this.addSun(sun.value);

      // Remove from the displayed available suns
      this.suns = this.suns.filter((s) => s.id !== id);
    }
  }

  reset() {
    this.suns = [];
    this.totalSun = INITIAL_TOTAL_SUN;
    this.lastSpawnTime = 0;
  }
}
