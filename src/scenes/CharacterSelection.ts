import { GameObjects, Scene } from "phaser";
import mapDataJSON from "../../public/assets/maps/layoutMaps.json";
import { Music } from "./MainMenu.ts";

const input1: string = `<input type="text" name="nameField" placeholder="Player 1 Name" style="font-size: 20px" />`;
const input2: string = `<input type="text" name="nameField" placeholder="Player 2 Name" style="font-size: 20px" />`;

type Data = { music: Music };

export class CharacterSelection extends Scene {
  constructor() {
    super("CharacterSelection");
  }

  music: Music;

  getRandomMap(): {} {
    const mapData: {}[] = mapDataJSON;
    const mapNumber: number = Math.floor(Math.random() * mapData.length);
    return mapData[mapNumber];
  }

  background: GameObjects.Image;

  create({ music }: Data) {
    this.music = music;
    this.background = this.add.image(512, 384, "background");

    const player1Dom = this.add.dom(200, 100).createFromHTML(input1);

    const player1Input: HTMLInputElement | null = player1Dom.getChildByName(
      "nameField",
    ) as HTMLInputElement | null;

    const player2Dom = this.add.dom(800, 100).createFromHTML(input2);
    let selectedBackround: number = 0;

    const bg1 = this.add
      .image(200, 350, "kpsBackground")
      .setDisplaySize(200, 200).on('pointerover', () => {
          bg1.
        });

    const bg2 = this.add
      .image(500, 350, "kpsBackground2")
      .setDisplaySize(200, 200);

    const bg3 = this.add
      .image(800, 350, "kpsBackground")
      .setDisplaySize(200, 200);

    const player2Input: HTMLInputElement | null = player2Dom.getChildByName(
      "nameField",
    ) as HTMLInputElement | null;

    this.add
      .text(200, 600, "BACK", {
        fontFamily: "main-font",
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
            mapData: this.getRandomMap(),
            playerData: { player1Name, player2Name },
          });
        }
      });
  }
}
