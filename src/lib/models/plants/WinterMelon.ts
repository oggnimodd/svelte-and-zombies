import { type PlantStats } from "./Plant";
import Watermelon from "./Watermelon";

export const WinterMelonStats: PlantStats = {
  id: "wintermelon",
  name: "Winter Melon",
  price: 400,
  health: 100,
  damage: 80,
  cooldown: 2000,
  range: Infinity,
};

export default class WinterMelon extends Watermelon {
  constructor() {
    super({
      ...WinterMelonStats,
      ice: true,
    });
  }
}
