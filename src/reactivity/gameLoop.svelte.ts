import { GameLoop } from "../lib/models/game/GameLoop.svelte";
import { plantManager } from "./plantManager.svelte";

export const gameLoop = new GameLoop(plantManager);
