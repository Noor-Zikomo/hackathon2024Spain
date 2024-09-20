import { Scene } from "phaser";

export class Boot extends Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
    //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

    this.load.image("background", "assets/bg.png");
    this.load.image("kpsBackground", "assets/backgrounds/kpsBackground.jpg");
    this.load.image("kpsBackground2", "assets/backgrounds/kpsBackground2.jpg");
    this.load.image("kpsBackground3", "assets/backgrounds/kpsBackground3.png");
    this.load.image("platform", "assets/tiles/platform.png");
    this.load.image("platform2", "assets/tiles/platform2.png");
    this.load.image("platform3", "assets/tiles/platform3.png");
    this.load.image("platform4", "assets/tiles/platform4.png");
    this.load.image("platform5", "assets/tiles/platform5.png");
    this.load.image("platform6", "assets/tiles/platform6.png");
    this.load.image("platform7", "assets/tiles/platform7.png");
    this.load.image("platform8", "assets/tiles/platform8.png");
    this.load.image("platform9", "assets/tiles/platform9.png");
  }

  create() {
    this.scene.start("Preloader");
  }
}
