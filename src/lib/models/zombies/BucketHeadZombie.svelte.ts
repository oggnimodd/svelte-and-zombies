import Zombie, { type ZombieConfig } from "./Zombie.svelte";

export default class BucketHeadZombie extends Zombie {
  constructor(zombieConfig: Partial<ZombieConfig>) {
    super({
      name: "Bucket Head Zombie",
      health: 600,
      damage: 8,
      speed: 0.5,
      row: zombieConfig.row || 0,
      image: "bucket-head-zombie.png",
      description: "A zombie with a bucket on its head, it has higher health.",
      ...zombieConfig,
    });
  }
}
