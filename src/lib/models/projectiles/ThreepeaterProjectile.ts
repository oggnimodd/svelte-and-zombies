import { CELL_WIDTH, NUM_COLS } from "../../constants/sizes";
import type { ProjectileStats } from "./ProjectileTypes";
import type BasePlant from "../plants/Plant";
import PeaProjectile from "./PeaProjectile";

interface ThreepeaterProjectileProps {
  id: string;
  stats: ProjectileStats;
  x: number;
  y: number;
  sourceRow: number;
  targetRow: number;
  sourcePlant: BasePlant;
}

class ThreepeaterProjectile extends PeaProjectile {
  private readonly targetRow: number;
  private readonly diagonalSpeed: number = 6; // Speed for diagonal movement
  private readonly verticalDistance: number;
  private hasReachedRow: boolean = false;

  constructor({
    id,
    stats,
    x,
    y,
    sourceRow,
    targetRow,
    sourcePlant,
  }: ThreepeaterProjectileProps) {
    super({ id, stats, x, y, row: sourceRow, sourcePlant });
    this.targetRow = targetRow;
    this.verticalDistance = (targetRow - sourceRow) * CELL_WIDTH;
  }

  move(deltaTime: number) {
    const delta = deltaTime / 1000; // Convert to seconds

    const normalizationFactor = CELL_WIDTH; // Normalization factor

    if (!this.hasReachedRow && this.targetRow !== this.row) {
      // Normalized vertical movement
      const verticalMove =
        this.speed *
        normalizationFactor *
        delta *
        Math.sign(this.verticalDistance);
      const targetY =
        this.targetRow * CELL_WIDTH + (CELL_WIDTH - this.height) / 2;

      this.y += verticalMove;

      // Check if we've reached or passed the target row
      if (
        (verticalMove > 0 && this.y >= targetY) ||
        (verticalMove < 0 && this.y <= targetY)
      ) {
        this.y = targetY;
        this.hasReachedRow = true;
        this.row = this.targetRow;
      }

      // Normalized horizontal movement (reduced while diagonal)
      this.x += this.speed * normalizationFactor * delta * 0.8;
    } else {
      // Normalized horizontal movement
      this.x += this.speed * normalizationFactor * delta;
    }
  }
}

export default ThreepeaterProjectile;
