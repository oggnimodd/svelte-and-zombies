import isMobile from "is-mobile";

export const YARD_WIDTH = isMobile() ? 300 : 1000;
export const NUM_ROWS = 5;
export const NUM_COLS = 9;

// The cells should be squares
export const CELL_WIDTH = YARD_WIDTH / NUM_COLS;
export const YARD_HEIGHT = CELL_WIDTH * NUM_ROWS;
