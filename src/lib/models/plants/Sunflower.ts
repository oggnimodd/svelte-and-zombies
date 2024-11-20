import BasePlant, { type PlantStats } from "./Plant";

export const SunflowerStats: PlantStats = {
  id: "sunflower",
  name: "Sunflower",
  price: 50,
  health: 50,
};

export default class Sunflower extends BasePlant {
  constructor() {
    super(SunflowerStats);
  }
}
