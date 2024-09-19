import { Scene, GameObjects } from "phaser";
import mapDataJSON from "../../public/assets/maps/layoutMaps.json";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  getRandomMap(): {} {
    const mapData: {}[] = mapDataJSON;
    const mapNumber: number = Math.floor(Math.random() * mapData.length);
    return mapData[mapNumber];
  }

  create() {
    this.logo = this.add.image(512, 300, "logo");

    this.title = this.add
      .text(512, 460, "Main Menu", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.load.image("ground", "assets/tiles/platform.png");

    console.log("creates", this.getRandomMap());

    this.input.once("pointerdown", () => {
      this.scene.start("Game", { mapData: this.getRandomMap() });
    });
  }
}
