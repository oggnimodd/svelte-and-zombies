import PlantSelector from "../lib/models/game/PlantSelector.svelte";
import GatlingPea from "../lib/models/plants/GatlingPea";
import Peashooter from "../lib/models/plants/Peashooter";
import Repeater from "../lib/models/plants/Repeater";
import Sunflower from "../lib/models/plants/Sunflower";
import Tallnut from "../lib/models/plants/Tallnut";
import Wallnut from "../lib/models/plants/Wallnut";
import FirePea from "../lib/models/plants/FirePea";
import Torchwood from "../lib/models/plants/Torchwood";

export const plantSelector = new PlantSelector([
  new Sunflower(),
  new Peashooter(),
  new Wallnut(),
  new Tallnut(),
  new Repeater(),
  new GatlingPea(),
  new FirePea(),
  new Torchwood(),
]);
