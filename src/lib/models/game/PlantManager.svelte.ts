import { getCellCoordinates } from "../../../utils/getCellCoordinates";
import Plant, { type PlantStats } from "../plants/Plant";
import { generate } from "short-uuid";
import EventEmitter from "../EventEmitter";
import { gameTime } from "./GameTime.svelte";
import Sunflower from "../plants/Sunflower";
import Peashooter from "../plants/Peashooter";
import Wallnut from "../plants/Wallnut";
import Tallnut from "../plants/Tallnut";
import Repeater from "../plants/Repeater";
import GatlingPea from "../plants/GatlingPea";
import FirePea from "../plants/FirePea";
import Torchwood from "../plants/Torchwood";
import Watermelon from "../plants/Watermelon";
import IcePea from "../plants/IcePea";
import WinterMelon from "../plants/WinterMelon";
import Cabbage from "../plants/Cabbage";
import Threepeater from "../plants/Threepeater";
import Kernelpult from "../plants/Kernelpult";
import SplitPea from "../plants/SplitPea";
import Starfruit from "../plants/Starfruit";
import Chilli from "../plants/Chilli";
import Cherry from "../plants/Cherry";
import Potato from "../plants/Potato";
import Spikeweed from "../plants/Spikeweed";
import Squash from "../plants/Squash";
import Chomper from "../plants/Chomper";

interface PlantedPlantCell {
  row: number;
  col: number;
}

export interface PlantedPlant {
  plantedId: string;
  plant: Plant;
  currentHealth: number;
  cell: PlantedPlantCell;
  coordinates: { x: number; y: number };
  plantedTime: number;
}

type PlantedPlants = PlantedPlant[];
type AvailablePlantStats = PlantStats[];

export default class PlantManager {
  plantedPlants: PlantedPlants = $state([]);
  availablePlants: AvailablePlantStats = $state([]);

  constructor(availablePlants: AvailablePlantStats) {
    this.availablePlants = availablePlants;
    EventEmitter.on("chilliExploded", this.remove.bind(this));
    EventEmitter.on("cherryExploded", this.remove.bind(this));
    EventEmitter.on("potatoExploded", this.remove.bind(this));
    EventEmitter.on("squashLanded", this.remove.bind(this));
  }

  // TODO: clean
  plantBuilder(plantStats: PlantStats) {
    switch (plantStats.id) {
      case "sunflower":
        return new Sunflower();
      case "peashooter":
        return new Peashooter();
      case "wallnut":
        return new Wallnut();
      case "tallnut":
        return new Tallnut();
      case "repeater":
        return new Repeater();
      case "gatling-pea":
        return new GatlingPea();
      case "firepea":
        return new FirePea();
      case "torchwood":
        return new Torchwood();
      case "watermelon":
        return new Watermelon();
      case "ice-pea":
        return new IcePea();
      case "wintermelon":
        return new WinterMelon();
      case "cabbage":
        return new Cabbage();
      case "threepeater":
        return new Threepeater();
      case "kernelpult":
        return new Kernelpult();
      case "splitpea":
        return new SplitPea();
      case "starfruit":
        return new Starfruit();
      case "chilli":
        return new Chilli();
      case "cherry":
        return new Cherry();
      case "potato":
        return new Potato();
      case "spikeweed":
        return new Spikeweed();
      case "squash":
        return new Squash();
      case "chomper":
        return new Chomper();
      default:
        return new Sunflower();
    }
  }

  plant(plantStats: PlantStats, cell: { row: number; col: number }) {
    const plantedId = generate();
    const coordinates = getCellCoordinates(cell.row, cell.col);
    const plant = this.plantBuilder(plantStats);
    const plantedPlant = {
      plantedId,
      plant,
      currentHealth: plant.health,
      cell,
      coordinates,
      plantedTime: gameTime.get(),
    };
    this.plantedPlants = [...this.plantedPlants, plantedPlant];
    EventEmitter.emit("plantAdded", plantedPlant);
    return plantedPlant;
  }

  remove(plantedId: string) {
    const filteredPlantedPlants = this.plantedPlants.filter(
      (plantedPlant) => plantedPlant.plantedId !== plantedId
    );
    this.plantedPlants = filteredPlantedPlants;
    EventEmitter.emit("plantRemoved", plantedId);

    // Consider adding logic to explicitly destroy the plant instance here if needed (e.g., unsubscribing from events)
    const removedPlant = this.plantedPlants.find(
      (plant) => plant.plantedId === plantedId
    );
    if (removedPlant) {
      // Example cleanup:
      // EventEmitter.off("someEvent", removedPlant.plant.someCleanupMethod);
    }
  }

  getPlantById(plantedId: string) {
    return this.plantedPlants.find(
      (plantedPlant) => plantedPlant.plantedId === plantedId
    );
  }

  getPlantsInRow(row: number): PlantedPlant[] {
    return this.plantedPlants.filter((plant) => plant.cell.row === row);
  }
}
