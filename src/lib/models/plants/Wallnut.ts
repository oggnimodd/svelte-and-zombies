import BasePlant, { type PlantStats } from "./Plant.svelte";

export const WallnutStats: PlantStats = {
  id: "wallnut",
  name: "Wallnut",
  price: 50,
  health: 180,
  buyCooldown: 5000,
  description:
    "A tough defensive plant that blocks zombies. Takes a lot of bites before breaking.",
};

export default class Wallnut extends BasePlant {
  constructor() {
    super(WallnutStats);
  }
}
