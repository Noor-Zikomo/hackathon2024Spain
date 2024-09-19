import { GameObjects, Scene } from "phaser";

type ControlsDisplay = {
  jump: string;
  left: string;
  right: string;
};

type ItemsDisplay = {
  icon: string;
  description: string;
};

const sideDistance: number = 150;

export class MainMenu extends Scene {
  background: GameObjects.Image;

  constructor() {
    super("MainMenu");
  }

  create() {
    const { width } = this.sys.canvas;

    this.background = this.add.image(512, 384, "background");

    this.add
      .text(512, 100, "MORTAL KPS", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    this.add
      .text(sideDistance + 150, 275, "CONTROLS", {
        fontFamily: "Arial Black",
        fontSize: 26,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const player1Controls: ControlsDisplay = {
      jump: "W",
      left: "A",
      right: "D",
    };
    this.displayControls(player1Controls, sideDistance);

    const player2Controls: ControlsDisplay = {
      jump: "↑",
      left: "←",
      right: "→",
    };
    this.displayControls(player2Controls, sideDistance + 200);

    this.add
      .text(width - sideDistance - 150, 275, "ITEMS", {
        fontFamily: "Arial Black",
        fontSize: 26,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5);

    const items: Array<ItemsDisplay> = [
      { icon: "Cafe", description: "Gives hp" },
    ];

    let initialItemsY: number = 350;

    items.forEach(({ icon, description }) => {
      this.printText(width - sideDistance - 250, initialItemsY, icon);
      this.printText(width - sideDistance - 50, initialItemsY, description);
    });

    this.add
      .text(512, 600, "PLAY", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => this.scene.start("CharacterSelection"));
  }

  private printText(positionX: number, positionY: number, value: string): void {
    this.add
      .text(positionX, positionY, value, {
        fontFamily: "Arial Black",
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
