import { CELL_WIDTH } from "$lib/constants/sizes";

export interface ProjectileStats {
  type: string;
  speed: number;
  width: number;
  height: number;
  image: string;
  freezeDuration?: number;
  stunDuration?: number;
}

// Helper function to calculate dimensions based on CELL_WIDTH
const getDimension = (multiplier: number): number => multiplier * CELL_WIDTH;

export const ProjectileTypes = {
  PEA: {
    type: "pea",
    speed: 2.8,
    width: getDimension(0.25),
    height: getDimension(0.25),
    image: "/projectiles/pea.png",
  },
  FIRE_PEA: {
    type: "fire_pea",
    speed: 2.8,
    width: getDimension(0.5),
    height: getDimension(0.5),
    image: "/projectiles/firepea.png",
  },
  ICE_PEA: {
    type: "ice_pea",
    speed: 2.8,
    width: getDimension(0.25),
    height: getDimension(0.25),
    image: "/projectiles/icepea.png",
    freezeDuration: 2000,
  },
  WATERMELON: {
    type: "watermelon",
    speed: 10,
    width: getDimension(0.55),
    height: getDimension(0.55),
    image: "/projectiles/watermelon.png",
  },
  ICE_WATERMELON: {
    type: "ice_watermelon",
    speed: 10,
    width: getDimension(0.55),
    height: getDimension(0.55),
    image: "/projectiles/icewatermelon.png",
    freezeDuration: 3000,
  },
  CABBAGE: {
    type: "cabbage",
    speed: 10,
    width: getDimension(0.4),
    height: getDimension(0.4),
    image: "/projectiles/cabbage.png",
  },
  KERNEL: {
    type: "kernelpult",
    speed: 18,
    width: getDimension(0.35),
    height: getDimension(0.35),
    image: "/projectiles/kernelpult.png",
    stunDuration: 1500, // 1.5 seconds stun
  },
  STAR: {
    type: "star",
    speed: 2.3333,
    width: getDimension(0.3),
    height: getDimension(0.3),
    image: "/projectiles/star.png",
  },
  BOOMERANG: {
    type: "boomerang",
    speed: 2.5,
    width: getDimension(0.5),
    height: getDimension(0.5),
    image: "/projectiles/boomerang.png",
  },
} as const;

export type ProjectileType = keyof typeof ProjectileTypes;
