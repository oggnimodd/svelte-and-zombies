import { CELL_WIDTH } from "$lib/constants/sizes";
import uuid from "short-uuid";
import { gameTime } from "./GameTime.svelte";

export type ExplosionType = "circular" | "row" | "charred";

export interface Explosion {
  id: string;
  type: ExplosionType;
  x: number;
  y: number;
  duration: number;
  startTime: number;
}

export interface CircularExplosionParams {
  col: number;
  row: number;
  duration?: number;
}

export interface RowExplosionParams {
  row: number;
  duration?: number;
}

export interface CharredEffectParams {
  x: number;
  y: number;
  duration?: number;
}

export default class ExplosionManager {
  explosions: Explosion[] = $state([]);

  // Add a circular explosion
  addCircularExplosion(params: CircularExplosionParams) {
    const centerX = params.col * CELL_WIDTH + CELL_WIDTH / 2;
    const centerY = params.row * CELL_WIDTH + CELL_WIDTH / 2;

    const explosion: Explosion = {
      id: uuid.generate(),
      type: "circular",
      x: centerX,
      y: centerY,
      duration: params.duration ?? 500,
      startTime: gameTime.get(),
    };

    this.explosions.push(explosion);
  }

  // Add a row-based explosion
  addRowExplosion(params: RowExplosionParams) {
    const y = params.row * CELL_WIDTH + CELL_WIDTH / 2; // Center of the row
    this.explosions.push({
      id: uuid.generate(),
      type: "row",
      x: 0, // Start from the left side of the yard
      y,
      duration: params.duration ?? 500,
      startTime: gameTime.get(),
    });
  }

  addCharredEffect(params: CharredEffectParams) {
    this.explosions.push({
      id: uuid.generate(),
      type: "charred",
      x: params.x,
      y: params.y,
      duration: params.duration ?? 1200,
      startTime: gameTime.get(),
    });
  }

  // Update explosions (remove expired ones)
  update() {
    this.explosions = this.explosions.filter((explosion) => {
      const elapsedTime = gameTime.get() - explosion.startTime;
      return elapsedTime < explosion.duration;
    });
  }

  // Get all active explosions
  getExplosions() {
    return this.explosions;
  }

  // Reset the manager (clear all explosions)
  reset() {
    this.explosions = [];
  }
}
