import BasePlant from "./Plant";

export default class Sunflower extends BasePlant {
  constructor() {
    super({
      id: "sunflower",
      name: "Sunflower",
      price: 50,
      health: 50,
    });
  }
}
