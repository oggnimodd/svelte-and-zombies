import { type PlantStats } from "./Plant";
import Watermelon from "./Watermelon";

export const WinterMelonStats: PlantStats = {
  id: "wintermelon",
  name: "Winter Melon",
  price: 400,
  health: 100,
  damage: 80,
  shootCooldown: 2000,
  range: Infinity,
  buyCooldown: 7000,
};

export default class WinterMelon extends Watermelon {
  constructor() {
    super({
      ...WinterMelonStats,
      ice: true,
    });
  }
}
