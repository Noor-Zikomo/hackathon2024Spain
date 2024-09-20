import { GameObjects, Scene } from "phaser";

type ControlsDisplay = {
  jump: string;
  left: string;
  right: string;
  attack: string;
  doubleJump: string;
  dash: string;
};

type ItemsDisplay = {
  icon: string;
  description: string;
};

export type Music =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;

const sideDistance: number = 50;

export class MainMenu extends Scene {
  background: GameObjects.Image;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { width } = this.sys.canvas;

    this.background = this.add.image(512, 384, "main");
    const backgroundMusic: Music = this.sound.add("backgroundMusicMenu", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();

    this.add.rectangle(512, 400, 1024, 900).setFillStyle(0, 100);

    this.add
      .text(512, 100, "MORTAL KPS", {
        fontFamily: "main-font",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(sideDistance + 250, 175, "CONTROLS", {
        fontFamily: "main-font",
        fontSize: 26,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.add.text(sideDistance, 225, "PLAYER 1", {
      fontFamily: "main-font",
      fontSize: 26,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });

    this.add.text(sideDistance + 300, 225, "PLAYER 2", {
      fontFamily: "main-font",
      fontSize: 26,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });

    const player1Controls: ControlsDisplay = {
      jump: "↑",
      left: "←",
      right: "→",
      attack: "o",
      doubleJump: "↑ ↑",
      dash: "P",
    };

    this.displayControls(player1Controls, sideDistance);

    const player2Controls: ControlsDisplay = {
      jump: "W",
      left: "A",
      right: "D",
      attack: "C",
      doubleJump: "W W",
      dash: "V",
    };

    this.displayControls(player2Controls, sideDistance + 300);

    this.add
      .text(width - sideDistance - 200, 175, "ITEMS", {
        fontFamily: "main-font",
        fontSize: 26,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const items: Array<ItemsDisplay> = [
      { icon: "coffee", description: "Speed up" },
      { icon: "kpsToken", description: "Power up" },
      { icon: "snack", description: "Gives hp" },
      { icon: "beer", description: "Gives strength" },
    ];

    let initialItemsY: number = 300;

    items.forEach(({ icon, description }) => {
      this.add
        .image(width - sideDistance - 300, initialItemsY, icon)
        .setDisplaySize(30, 30);
      this.printText(width - sideDistance - 200, initialItemsY, description);

      initialItemsY += 50;
    });

    this.add
      .text(512, 700, "PLAY", {
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
        this.scene.start("CharacterSelection", { music: backgroundMusic });
      });
  }

  private printText(positionX: number, positionY: number, value: string): void {
    this.add.text(positionX, positionY, value, {
      fontFamily: "main-font",
      fontSize: 20,
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8,
      align: "center",
    });
  }

  private displayControls(controls: ControlsDisplay, positionX: number): void {
    let initialControlsY: number = 300;

    Object.entries(controls).forEach(
      ([key, controlValue]: [string, string]) => {
        this.printText(positionX, initialControlsY, controlValue);
        this.printText(positionX + 75, initialControlsY, key.toUpperCase());

        initialControlsY += 50;
      },
    );
  }
}
