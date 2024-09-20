import { Scene, GameObjects } from "phaser";
import mapDataJSON from "../../public/assets/maps/layoutMaps.json";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  public constructor() {
    super("MainMenu");
  }
  getRandomMap(): {} {
    const mapData: {}[] = mapDataJSON;
    const mapNumber: number = Math.floor(Math.random() * mapData.length);
    return mapData[2];
  }

  create() {
    this.logo = this.add.image(512, 300, "logo");

    this.title = this.add
      .text(512, 460, "Mortal KPS placeholder", {
        fontFamily: "main-font",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const backgroundMusic = this.sound.add("backgroundMusicMenu", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();

    this.input.once("pointerdown", () => {
      this.scene.start("Game", { mapData: this.getRandomMap() });
    });
  }
}
