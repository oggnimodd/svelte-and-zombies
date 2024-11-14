import BasePlant from "./Plant";

export default class Torchwood extends BasePlant {
  constructor() {
    super({
      id: "torchwood",
      name: "Torchwood",
      price: 175,
      health: 100,
    });
  }
}
