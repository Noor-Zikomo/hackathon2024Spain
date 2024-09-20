import { Scene } from "phaser";

export class GameOver extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  gameover_text: Phaser.GameObjects.Text;

  constructor() {
    super("GameOver");
  }

  create({ winner }: Data) {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0xff0000);

    this.background = this.add
      .image(512, 384, "gameOver")
      .setDisplaySize(1024, 768);

    const winnerMusic = this.sound.add("backgroundMusicWinner", {
      volume: 0.2,
    });
    winnerMusic.play();

    this.gameover_text = this.add.text(512, 384, winner + " wins", {
      fontFamily: "main-font",
      fontSize: 64,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
    this.gameover_text.setOrigin(0.5);

    this.add
      .text(512, 600, "PLAY AGAIN", {
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
        winnerMusic.destroy();
        this.scene.start("StartScreen");
      });
  }
}

type Data = {
  winner: string;
};
