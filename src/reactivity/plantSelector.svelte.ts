import PlantSelector from "../lib/models/game/PlantSelector.svelte";
import GatlingPea from "../lib/models/plants/GatlingPea";
import Peashooter from "../lib/models/plants/Peashooter";
import Repeater from "../lib/models/plants/Repeater";
import Sunflower from "../lib/models/plants/Sunflower";
import Tallnut from "../lib/models/plants/Tallnut";
import Wallnut from "../lib/models/plants/Wallnut";
import FirePea from "../lib/models/plants/FirePea";
import Torchwood from "../lib/models/plants/Torchwood";
import Watermelon from "../lib/models/plants/Watermelon";
import IcePea from "../lib/models/plants/IcePea";
import WinterMelon from "../lib/models/plants/WinterMelon";
import Chilli from "../lib/models/plants/Chilli";
import Cherry from "../lib/models/plants/Cherry";
import Cabbage from "../lib/models/plants/Cabbage";
import Potato from "../lib/models/plants/Potato";
import Threepeater from "../lib/models/plants/Threepeater";
import Spikeweed from "../lib/models/plants/Spikeweed";

export const plantSelector = new PlantSelector([
  new Sunflower(),
  new Peashooter(),
  new Wallnut(),
  new Tallnut(),
  new Repeater(),
  new GatlingPea(),
  new FirePea(),
  new Torchwood(),
  new Watermelon(),
  new IcePea(),
  new WinterMelon(),
  new Chilli(),
  new Cherry(),
  new Cabbage(),
  new Potato(),
  new Threepeater(),
  new Spikeweed(),
]);
