import { GameObjects, Scene } from "phaser";
import mapDataJSON from "../../public/assets/maps/layoutMaps.json";
import { Music } from "./MainMenu.ts";

const input1: string = `<input type="text" name="nameField" placeholder="Player 1" value="Player 1" style="font-size: 20px" />`;
const input2: string = `<input type="text" name="nameField" placeholder="Player 2" value="Player 2" style="font-size: 20px" />`;
const mapSelectorPositionY: number = 450;

type Data = { music: Music };

export class CharacterSelection extends Scene {
  constructor() {
    super("CharacterSelection");
  }

  music: Music;
  selectedMap: number = 0;
  selectedMapBorder: GameObjects.Rectangle;

  getMap(): {} {
    const mapData: {}[] = mapDataJSON;
    return mapData[this.selectedMap];
  }

  background: GameObjects.Image;

  create({ music }: Data) {
    this.music = music;
    this.background = this.add.image(512, 384, "background");

    const player1Dom = this.add.dom(200, 100).createFromHTML(input1);

    const player1Input: HTMLInputElement | null = player1Dom.getChildByName(
      "nameField",
    ) as HTMLInputElement | null;

    this.add.image(200, 200, "character1");

    const player2Dom = this.add.dom(800, 100).createFromHTML(input2);

    const player2Input: HTMLInputElement | null = player2Dom.getChildByName(
      "nameField",
    ) as HTMLInputElement | null;
    this.add.image(800, 200, "character2");

    this.selectedMapBorder = this.add
      .rectangle(175, mapSelectorPositionY, 300, 200)
      .setStrokeStyle(4, 0);

    this.add
      .image(175, mapSelectorPositionY, "kpsBackground")
      .setDisplaySize(300, 200)
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedMap = 0;
        this.setSelectedMapBorder();
      });

    this.add
      .image(500, mapSelectorPositionY, "kpsBackground2")
      .setDisplaySize(300, 200)
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedMap = 1;
        this.setSelectedMapBorder();
      });

    this.add
      .image(825, mapSelectorPositionY, "kpsBackground3")
      .setDisplaySize(300, 200)
      .setInteractive()
      .on("pointerdown", () => {
        this.selectedMap = 2;
        this.setSelectedMapBorder();
      });

    this.add
      .text(150, 600, "BACK", {
        fontFamily: "main-font",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.music.destroy();
        this.scene.start("MainMenu");
      });

    this.add
      .text(850, 600, "START", {
        fontFamily: "main-font",
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
          this.music.destroy();
          this.scene.start("Game", {
            mapData: this.getMap(),
            playerData: { player1Name, player2Name },
          });
        } else {
          this.add
            .text(512, 600, "Enter players names", {
              fontFamily: "main-font",
              fontSize: 24,
              color: "#ff0000",
              stroke: "#000000",
              strokeThickness: 8,
              align: "center",
            })
            .setOrigin(0.5);
        }
      });
  }

  private setSelectedMapBorder() {
    switch (this.selectedMap) {
      case 0:
        this.selectedMapBorder.setPosition(175, mapSelectorPositionY);
        break;
      case 1:
        this.selectedMapBorder.setPosition(500, mapSelectorPositionY);
        break;
      case 2:
        this.selectedMapBorder.setPosition(825, mapSelectorPositionY);
        break;
    }
  }
}
