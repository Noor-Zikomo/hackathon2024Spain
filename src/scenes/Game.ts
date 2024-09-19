import { Scene } from "phaser";
import { GameConfig, MapConfig, PlatformConfig } from "../types.ts";
import { Coffee } from "../items/Coffee.ts";
import { Beer } from "../items/Beer.ts";
import { Snack } from "../items/Snack.ts";
import { KpsToken } from "../items/Kps.ts";
import { Item } from "../items/Item.ts";
import Character, { PlayerID } from "../models/character/Character.ts";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  mapData: MapConfig;
  player1: Character;
  player2: Character;

  constructor() {
    super("Game");
  }

  public create(data: GameConfig) {
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

  public update() {
    this.player1.update();
    this.player2.update();
  }

  private handleMap() {
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    const data: MapConfig = this.mapData;
    this.load.image(data.id, "assets/backgrounds/" + data.id + ".jpg");
    this.background = this.add.image(512, 382, data.id);
    this.platformsGenerate(data.config);
  }

  private platformsGenerate(platformConfig: PlatformConfig[]) {
    this.platforms = this.physics.add.staticGroup();
    platformConfig.forEach((platformConfig: PlatformConfig) => {
      this.platforms
        .create(platformConfig.x, platformConfig.y, platformConfig.key)
        .setScale(platformConfig.scale);
    });
  }

  private addItems() {
    const randomNumber = Math.floor(Math.random() * (15 - 5 + 1)) + 5;
    this.time.addEvent({
      delay: randomNumber * 1000,
      callback: () => this.emitRandomItem(),
      callbackScope: this,
      loop: true,
    });
  }

  private emitRandomItem() {
    let randomItem: Item;
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    if (randomNumber < 10) {
      randomItem = new KpsToken();
    } else if (randomNumber < 30) {
      randomItem = new Beer();
    } else if (randomNumber < 60) {
      randomItem = new Snack();
    } else {
      randomItem = new Coffee();
    }

    randomItem.emitItem(this.physics, this.platforms);
  }

  private createPlayers() {
    this.player1 = new Character(
      PlayerID.Player1,
      "Player 1",
      this.physics.add.sprite(100, 450, "dude"),
      {},
      this,
    );

    this.player2 = new Character(
      PlayerID.Player2,
      "Player 2",
      this.physics.add.sprite(-100, 450, "dude"),
      {},
      this,
    );
  }

  private setupHealthBars() {
    this.player1.updateHealthBar();
    this.player2.updateHealthBar();
  }

  private reduceHealth(player: Character) {
    if (player.stats.health > 0) {
      player.setHealth((player.stats.health -= 10));
      player.updateHealthBar();
    }
  }
}
