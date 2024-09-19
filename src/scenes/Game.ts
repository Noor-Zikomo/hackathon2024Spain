import { Scene } from "phaser";
import { Item } from "../items/Item";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("Game");
  }

  preload() {
    this.load.image("star", "assets/star.png");
  }

  handleMap() {
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(100, 800, "ground").setScale(1).refreshBody();
    this.platforms.create(300, 800, "ground").setScale(1).refreshBody(); // ground
    this.platforms.create(500, 800, "ground").setScale(1).refreshBody(); // ground
    this.platforms.create(700, 800, "ground").setScale(1).refreshBody(); // ground
    this.platforms.create(900, 800, "ground").setScale(1).refreshBody(); // ground
  }

  addItems() {
    const star = new Item("star");
    console.log(star.name);
    this.time.addEvent({
      delay: 5000,
      callback: () => star.emitItem(this.physics, this.platforms),
      callbackScope: this,
      loop: true,
    });
  }

  create() {
    this.camera = this.cameras.main;
    this.background = this.add.image(512, 384, "kpsBackground");
    this.handleMap();
    this.addItems();
  }
}
