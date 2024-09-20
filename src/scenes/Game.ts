import { Scene } from "phaser";
import { GameConfig, MapConfig, PlatformConfig, PlayerData } from "../types.ts";
import { Coffee } from "../items/Coffee.ts";
import { Beer } from "../items/Beer.ts";
import { Snack } from "../items/Snack.ts";
import { KpsToken } from "../items/Kps.ts";
import { Item } from "../items/Item.ts";
import Character, { PlayerID } from "../models/character/Character.ts";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  backgroundMusic:
    | Phaser.Sound.NoAudioSound
    | Phaser.Sound.HTML5AudioSound
    | Phaser.Sound.WebAudioSound;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  mapData: MapConfig;
  player1: Character;
  player2: Character;

  public constructor() {
    super("Game");
  }

  public create({ mapData, playerData }: GameConfig) {
    this.mapData = mapData;
    this.handleMap();
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);
    this.addItems();
    this.createPlayers(playerData);
    this.setupHealthBars();
    this.backgroundMusic = this.sound.add("backgroundMusicFight", {
      volume: 0.5,
      loop: true,
    });
    this.backgroundMusic.play();
  }

  public update() {
    this.player1.update();
    this.player2.update();
    const isDeadPlayer1 = this.player1.health <= 0;
    const isDeadPlayer2 = this.player2.health <= 0;

    if (isDeadPlayer1 || isDeadPlayer2) {
      const winnerName: string = isDeadPlayer1
        ? this.player2.nameBar.text
        : this.player1.nameBar.text;
      this.backgroundMusic.destroy();
      this.scene.start("GameOver", { winner: winnerName });
    }
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

    randomItem.emitItem(this.physics, this.platforms, this.player1);
  }

  private createPlayers({ player1Name, player2Name }: PlayerData) {
    this.player1 = new Character(
      PlayerID.Player1,
      player1Name,
      this.physics.add.sprite(100, 450, "dude"),
      {},
      this,
    );

    this.player2 = new Character(
      PlayerID.Player2,
      player2Name,
      this.physics.add.sprite(90, 450, "dude"),
      {},
      this,
    );

    const playerSprite1 = this.player1.playerSprite;
    const playerSprite2 = this.player2.playerSprite;

    this.physics.add.collider(playerSprite1, playerSprite2);

    this.physics.add.overlap(
      playerSprite1,
      playerSprite2,
      () => this.player1.attack(this.player2),
      undefined,
      this,
    );

    this.physics.add.overlap(
      playerSprite2,
      playerSprite1,
      () => this.player2.attack(this.player1),
      undefined,
      this,
    );
  }

  private setupHealthBars() {
    this.player1.updateHealthBar();
    this.player2.updateHealthBar();
  }
}
