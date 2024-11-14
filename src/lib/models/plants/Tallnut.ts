import BasePlant from "./Plant";

export default class Tallnut extends BasePlant {
  constructor() {
    super({
      id: "tallnut",
      name: "Tallnut",
      price: 50,
      health: 400,
    });
  }
}
