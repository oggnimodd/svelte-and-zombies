import BasePlant, { type PlantStats } from "./Plant.svelte";

export const TorchwoodStats: PlantStats = {
  id: "torchwood",
  name: "Torchwood",
  price: 175,
  health: 100,
  buyCooldown: 6000,
  description:
    "Makes shots pass through it burst into flames. Place shooters behind it for powered-up attacks.",
};

export default class Torchwood extends BasePlant {
  constructor() {
    super(TorchwoodStats);
  }
}
