import { Scene } from "phaser";
import { GameConfig, MapConfig, PlatformConfig } from "../types.ts";
import { Player, PlayerID } from "../items/Player.ts";
import { Coffee } from "../items/Coffee.ts";
import { Star } from "../items/Star.ts";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  mapData: MapConfig;
  player1: Player;
  player2: Player;

  constructor() {
    super("Game");
  }

  handleMap() {
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    const data: MapConfig = this.mapData;
    this.load.image(data.id, "assets/backgrounds/" + data.id + ".jpg");
    this.background = this.add.image(512, 382, data.id);
    this.platformsGenerate(data.config);
  }

  platformsGenerate(platformConfig: PlatformConfig[]) {
    this.platforms = this.physics.add.staticGroup();
    platformConfig.forEach((platformConfig: PlatformConfig) => {
      this.platforms
        .create(platformConfig.x, platformConfig.y, platformConfig.key)
        .setScale(platformConfig.scale);
    });
  }

  create(data: GameConfig) {
    this.mapData = data["mapData"];
    this.handleMap();

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
  private addItems() {
    this.time.addEvent({
      delay: 5000,
      callback: () => this.emitRandomItem(),
      callbackScope: this,
      loop: true,
    });
  }

  private emitRandomItem() {
    const items = [new Star(), new Coffee()];
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];
    randomItem.emitItem(this.physics, this.platforms);
  }

  private createPlayers() {
    this.player1 = new Player(PlayerID.Player1, this.add, "Player 1");
    this.player2 = new Player(PlayerID.Player2, this.add, "Player 2");
  }

  private setupHealthBars() {
    this.player1.updateHealthBar();
    this.player2.updateHealthBar();
  }

  private reduceHealth(player: Player) {
    if (player.health > 0) {
      player.setHealth((player.health -= 10));
      player.updateHealthBar();
    }
  }
}
