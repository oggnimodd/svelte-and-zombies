import PlantSelector from "../lib/models/game/PlantSelector.svelte";
import { CabbageStats } from "../lib/models/plants/Cabbage";
import { CherryStats } from "../lib/models/plants/Cherry";
import { ChilliStats } from "../lib/models/plants/Chilli";
import { ChomperStats } from "../lib/models/plants/Chomper";
import { FirePeaStats } from "../lib/models/plants/FirePea";
import { GatlingPeaStats } from "../lib/models/plants/GatlingPea";
import { IcePeaStats } from "../lib/models/plants/IcePea";
import { KernelpultStats } from "../lib/models/plants/Kernelpult";
import { PeashooterStats } from "../lib/models/plants/Peashooter";
import { PotatoStats } from "../lib/models/plants/Potato";
import { RepeaterStats } from "../lib/models/plants/Repeater";
import { SpikeweedStats } from "../lib/models/plants/Spikeweed";
import { SplitPeaStats } from "../lib/models/plants/SplitPea";
import { SquashStats } from "../lib/models/plants/Squash";
import { StarfruitStats } from "../lib/models/plants/Starfruit";
import { SunflowerStats } from "../lib/models/plants/Sunflower";
import { TallnutStats } from "../lib/models/plants/Tallnut";
import { ThreepeaterStats } from "../lib/models/plants/Threepeater";
import { TorchwoodStats } from "../lib/models/plants/Torchwood";
import { WallnutStats } from "../lib/models/plants/Wallnut";
import { WatermelonStats } from "../lib/models/plants/Watermelon";
import { WinterMelonStats } from "../lib/models/plants/WinterMelon";

export const plantSelector = new PlantSelector([
  SunflowerStats,
  PeashooterStats,
  WallnutStats,
  TallnutStats,
  RepeaterStats,
  GatlingPeaStats,
  FirePeaStats,
  TorchwoodStats,
  WatermelonStats,
  IcePeaStats,
  WinterMelonStats,
  ChilliStats,
  CherryStats,
  CabbageStats,
  PotatoStats,
  ThreepeaterStats,
  SpikeweedStats,
  KernelpultStats,
  SquashStats,
  ChomperStats,
  SplitPeaStats,
  StarfruitStats,
]);
