export default class Sun {
  sun: number = $state(100);

  constructor(sun: number) {
    this.sun = sun;
  }

  add(points: number) {
    this.sun += points;
  }

  subtract(points: number) {
    this.sun -= points;
  }

  get total() {
    return this.sun;
  }
}
