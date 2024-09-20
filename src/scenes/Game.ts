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

    const backgroundMusic = this.sound.add("backgroundMusicFight", {
      volume: 0.5,
      loop: true,
    });
    backgroundMusic.play();

    this.add
      .text(800, 600, "END", {
        fontFamily: "Arial Black",
        fontSize: 38,
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8,
        align: "center",
      })
      .setOrigin(0.5)
      .setInteractive()
      .on("pointerdown", () => {
        backgroundMusic.destroy();
        this.scene.start("GameOver", { winner: playerData.player2Name });
      });

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

    this.physics.add.collider(
      this.player1.playerSprite,
      this.player2.playerSprite,
    );
  }

  private setupHealthBars() {
    this.player1.updateHealthBar();
    this.player2.updateHealthBar();
  }

  private reduceHealth(player: Character) {
    if (player.health > 0) {
      player.setHealth((player.health -= 10));
      player.updateHealthBar();
    }
  }
}
