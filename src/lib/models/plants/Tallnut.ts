import BasePlant, { type PlantStats } from "./Plant.svelte";

export const TallnutStats: PlantStats = {
  id: "tallnut",
  name: "Tallnut",
  price: 50,
  health: 400,
  buyCooldown: 5000,
  description:
    "An extra tough wall that blocks both regular and jumping zombies. Higher health than wallnut.",
};

export default class Tallnut extends BasePlant {
  constructor() {
    super(TallnutStats);
  }
}
