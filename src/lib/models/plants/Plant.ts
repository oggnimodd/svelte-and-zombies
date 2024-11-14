// Plant.ts
export interface PlantStats {
  id: string;
  name: string;
  price: number;
  health: number;
  damage?: number;
  cooldown?: number;
  range?: number;
}

export default class BasePlant {
  id: string;
  name: string;
  price: number;
  health: number;
  damage: number;
  cooldown: number;
  range: number;

  constructor(stats: PlantStats) {
    this.id = stats.id;
    this.name = stats.name;
    this.price = stats.price;
    this.health = stats.health;
    this.damage = stats.damage ?? 0;
    this.cooldown = stats.cooldown ?? 0;
    this.range = stats.range ?? 0;
  }
}
