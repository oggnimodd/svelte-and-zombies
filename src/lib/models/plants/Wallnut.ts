import BasePlant from "./Plant";

export default class Wallnut extends BasePlant {
  constructor() {
    super({
      id: "wallnut",
      name: "Wallnut",
      price: 50,
      health: 180,
    });
  }
}
