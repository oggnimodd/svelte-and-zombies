import PlantManager from "../lib/models/game/PlantManager.svelte";
import { plantSelector } from "./plantSelector.svelte";

export const plantManager = new PlantManager(plantSelector.plants);
