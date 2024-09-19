import { Scene } from "phaser";
import Player from "../models/character/Player";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player1: Player;
  player2: Player;

  public constructor() {
    super("Game");
  }

  public handleMap() {
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(100, 800, "ground").setScale(1).refreshBody();
    this.platforms.create(300, 800, "ground").setScale(1).refreshBody(); // ground
    this.platforms.create(500, 800, "ground").setScale(1).refreshBody(); // ground
    this.platforms.create(700, 800, "ground").setScale(1).refreshBody(); // ground
    this.platforms.create(900, 800, "ground").setScale(1).refreshBody(); // ground
  }

  public create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);
    this.handleMap();
    this.createPlayers();
    this.setupHealthBars();

    const backgroundMusic = this.sound.add("backgroundMusicFight", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();
  }

  private createPlayers() {
    this.player1 = new Player(
      this,
      1,
      "TESTNAME",
      {},
      { posX: 100, posY: 100 },
      "player1",
    );
  }

  private setupHealthBars() {
    this.player1.updateHealthBar();
  }
}
