import { Scene } from "phaser";
import Player from "../models/character/Player";
import { Item } from "../items/Item";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  player1: Player;
  player2: Player;

  public constructor() {
    super("Game");
  }

  public preload() {
    this.load.image("star", "assets/star.png");
  }

  public create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);
    this.handleMap();
    this.addItems();
    this.createPlayers();
    this.setupHealthBars();

    const backgroundMusic = this.sound.add("backgroundMusicFight", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();

    this.time.addEvent({
      delay: 1000,
      callback: () => this.reduceHealth(this.player1),
      callbackScope: this,
      loop: true,
    });
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
