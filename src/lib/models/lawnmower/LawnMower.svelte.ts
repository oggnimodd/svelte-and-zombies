import { soundManager } from "../game/SoundManager.svelte";
import {
  CELL_WIDTH,
  YARD_BOUNDARY_OFFSET,
  YARD_WIDTH,
} from "$lib/constants/sizes";

export interface LawnMowerConfig {
  row: number;
}

export default class LawnMower {
  row: number;
  x: number = $state(-CELL_WIDTH);
  y: number;
  isActivated: boolean = false;
  speed: number = 2.8;
  width: number = CELL_WIDTH;
  height: number = CELL_WIDTH;

  constructor(config: LawnMowerConfig) {
    this.row = config.row;
    this.y = config.row * CELL_WIDTH;
  }

  activate() {
    if (!this.isActivated) {
      this.isActivated = true;
      soundManager.playSound("lawnmower");
    }
  }

  move(deltaTime: number) {
    if (this.isActivated) {
      this.x += this.speed * (deltaTime / 1000) * CELL_WIDTH;
    }
  }

  isOutOfBounds() {
    return this.x > YARD_WIDTH + YARD_BOUNDARY_OFFSET;
  }
}
