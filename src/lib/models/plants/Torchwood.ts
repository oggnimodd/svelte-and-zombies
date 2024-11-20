import BasePlant, { type PlantStats } from "./Plant";

export const TorchwoodStats: PlantStats = {
  id: "torchwood",
  name: "Torchwood",
  price: 175,
  health: 100,
};

export default class Torchwood extends BasePlant {
  constructor() {
    super(TorchwoodStats);
  }
}
