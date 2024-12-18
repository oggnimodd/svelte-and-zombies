import BasePlant, { type PlantStats } from "./Plant.svelte";

export const TorchwoodStats: PlantStats = {
  id: "torchwood",
  name: "Torchwood",
  price: 175,
  health: 100,
  buyCooldown: 6000,
};

export default class Torchwood extends BasePlant {
  constructor() {
    super(TorchwoodStats);
  }
}
