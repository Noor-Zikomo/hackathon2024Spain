import { GameObjects, Scene } from "phaser";

type ControlsDisplay = {
  jump: string;
  left: string;
  right: string;
  attack: string;
};

type ItemsDisplay = {
  icon: string;
  description: string;
};

export type Music =
  | Phaser.Sound.NoAudioSound
  | Phaser.Sound.HTML5AudioSound
  | Phaser.Sound.WebAudioSound;

const sideDistance: number = 150;

export class MainMenu extends Scene {
  background: GameObjects.Image;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { width } = this.sys.canvas;

    this.background = this.add.image(512, 384, "background");
    const backgroundMusic: Music = this.sound.add("backgroundMusicMenu", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();

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
      .text(sideDistance + 150, 275, "CONTROLS", {
        fontFamily: "main-font",
        fontSize: 26,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const player1Controls: ControlsDisplay = {
      jump: "↑",
      left: "←",
      right: "→",
      attack: "↵",
    };

    this.displayControls(player1Controls, sideDistance);

    const player2Controls: ControlsDisplay = {
      jump: "W",
      left: "A",
      right: "D",
      attack: "R",
    };

    this.displayControls(player2Controls, sideDistance + 200);

    this.add
      .text(width - sideDistance - 150, 275, "ITEMS", {
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

    let initialItemsY: number = 350;

    items.forEach(({ icon, description }) => {
      this.add
        .image(width - sideDistance - 250, initialItemsY, icon)
        .setDisplaySize(30, 30);
      this.printText(width - sideDistance - 100, initialItemsY, description);

      initialItemsY += 50;
    });

    this.add
      .text(512, 600, "PLAY", {
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
    this.add
      .text(positionX, positionY, value, {
        fontFamily: "main-font",
        fontSize: 20,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);
  }

  private displayControls(controls: ControlsDisplay, positionX: number): void {
    let initialControlsY: number = 350;

    Object.entries(controls).forEach(
      ([key, controlValue]: [string, string]) => {
        this.printText(positionX, initialControlsY, controlValue);
        this.printText(positionX + 75, initialControlsY, key.toUpperCase());

        initialControlsY += 50;
      },
    );
  }
}
