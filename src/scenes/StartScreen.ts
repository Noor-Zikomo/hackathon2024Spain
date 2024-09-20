import { GameObjects, Scene } from "phaser";

export type Music =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;

export class StartScreen extends Scene {
  background: GameObjects.Image;

  constructor() {
    super("StartScreen");
  }

  create() {
    this.background = this.add.image(512, 384, "main");
    const backgroundMusic: Music = this.sound.add("backgroundMusicMenu", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();

    this.add.rectangle(512, 400, 1024, 900).setFillStyle(0, 100);

    this.add
      .text(700, 300, "MORTAL", {
        fontFamily: "main-font",
        fontSize: 80,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(1);
    this.add
      .text(450, 250, "KPS", {
        fontFamily: "main-font",
        fontSize: 80,
        color: "#00a6ff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(-0.5);

    this.add
      .text(512, 500, "START", {
        fontFamily: "main-font",
        fontSize: 38,
        color: "#ff0000",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        this.scene.start("MainMenu", { music: backgroundMusic });
      });
  }
}
