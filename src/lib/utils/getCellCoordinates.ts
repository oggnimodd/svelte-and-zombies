import { CELL_WIDTH } from "../constants/sizes";

export function getCellCoordinates(
  row: number,
  col: number
): { x: number; y: number } {
  const x = col * CELL_WIDTH;
  const y = row * CELL_WIDTH;
  return { x, y };
}
