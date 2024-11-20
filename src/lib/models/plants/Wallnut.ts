import BasePlant, { type PlantStats } from "./Plant";

export const WallnutStats: PlantStats = {
  id: "wallnut",
  name: "Wallnut",
  price: 50,
  health: 180,
};

export default class Wallnut extends BasePlant {
  constructor() {
    super(WallnutStats);
  }
}
