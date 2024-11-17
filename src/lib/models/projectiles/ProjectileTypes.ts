export interface ProjectileStats {
  type: string;
  speed: number;
  width: number;
  height: number;
  image: string;
  freezeDuration?: number;
  stunDuration?: number;
}

export const ProjectileTypes = {
  PEA: {
    type: "pea",
    speed: 5,
    width: 20,
    height: 20,
    image: "/projectiles/pea.png",
  },
  FIRE_PEA: {
    type: "fire_pea",
    speed: 5,
    width: 30,
    height: 30,
    image: "/projectiles/firepea.png",
  },
  ICE_PEA: {
    type: "ice_pea",
    speed: 5,
    width: 20,
    height: 20,
    image: "/projectiles/icepea.png",
    freezeDuration: 2000,
  },
  WATERMELON: {
    type: "watermelon",
    speed: 1.5,
    width: 50,
    height: 50,
    image: "/projectiles/watermelon.png",
  },
  ICE_WATERMELON: {
    type: "ice_watermelon",
    speed: 1.5,
    width: 50,
    height: 50,
    image: "/projectiles/icewatermelon.png",
    freezeDuration: 3000,
  },
  CABBAGE: {
    type: "cabbage",
    speed: 2.5,
    width: 35,
    height: 35,
    image: "/projectiles/cabbage.png",
  },
  KERNEL: {
    type: "kernelpult",
    speed: 2.5,
    width: 30,
    height: 30,
    image: "/projectiles/kernelpult.png",
    stunDuration: 1500, // 1.5 seconds stun
  },
} as const;
