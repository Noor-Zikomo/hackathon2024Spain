import { Cameras, GameObjects, Physics, Scene } from "phaser";

export class GameTest extends Scene {
  camera: Cameras.Scene2D.Camera;
  background: GameObjects.Image;
  msg_text: GameObjects.Text;
  platform: Physics.Arcade.StaticGroup;
  info: GameObjects.Text;

  constructor() {
    super("GameTest");
  }

  preload(): void {
    this.load.image("star", "assets/star.png");
    this.load.image("ground", "assets/platform.png");
  }

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);
    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);

    this.platform = this.physics.add.staticGroup();
    this.platform.create(400, 568, "ground").setScale(2).refreshBody();

    this.time.addEvent({
      delay: 5000,
      callback: this.emitStar,
      callbackScope: this,
      loop: true,
    });
  }

  private emitStar(): void {
    let star: Phaser.Physics.Arcade.Image;
    const x = Phaser.Math.Between(25, 775);
    const y = 26;
    star = this.physics.add.image(x, y, "star");
    star.setDisplaySize(20, 20);
    star.setVelocity(0, 200);
    star.setInteractive();
    this.physics.add.collider(star, this.platform);
  }
}
