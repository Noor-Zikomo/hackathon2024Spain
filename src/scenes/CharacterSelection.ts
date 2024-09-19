import { GameObjects, Scene } from "phaser";
import mapDataJSON from "../../public/assets/maps/layoutMaps.json";

const input: string = `<input type="text" name="nameField" placeholder="Player 1 Name" style="font-size: 20px" />`;

export class CharacterSelection extends Scene {
  constructor() {
    super("CharacterSelection");
  }

  getRandomMap(): {} {
    const mapData: {}[] = mapDataJSON;
    const mapNumber: number = Math.floor(Math.random() * mapData.length);
    return mapData[mapNumber];
  }

  background: GameObjects.Image;

  preload() {
    this.load.html("nameform", "assets/characterSelectInput.html");
  }

  create() {
    this.background = this.add.image(512, 384, "background");

    const player1Dom = this.add.dom(200, 300).createFromHTML(input);

    const player1Input: HTMLInputElement | null = player1Dom.getChildByName(
      "nameField",
    ) as HTMLInputElement | null;

    const player2Dom = this.add.dom(800, 300).createFromHTML(input);

    const player2Input: HTMLInputElement | null = player2Dom.getChildByName(
      "nameField",
    ) as HTMLInputElement | null;

    this.add
      .text(200, 600, "BACK", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("MainMenu"));

    this.add
      .text(800, 600, "START", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        const player1Name = player1Input?.value;
        const player2Name = player2Input?.value;
        if (player1Name && player2Name) {
          this.scene.start("Game", {
            player1Name,
            player2Name,
          });
        }
      });
  }
}
