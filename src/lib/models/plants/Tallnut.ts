import BasePlant, { type PlantStats } from "./Plant";

export const TallnutStats: PlantStats = {
  id: "tallnut",
  name: "Tallnut",
  price: 50,
  health: 400,
  buyCooldown: 5000,
};

export default class Tallnut extends BasePlant {
  constructor() {
    super(TallnutStats);
  }
}
