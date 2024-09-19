import { Scene } from "phaser";
import { Player, PlayerID } from "../items/Player.ts";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  player1: Player;
  player2: Player;

  constructor() {
    super("Game");
  }

  handleMap() {}

  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x00ff00);

    this.background = this.add.image(512, 384, "background");
    this.background.setAlpha(0.5);
    this.handleMap();
    this.createPlayers();
    this.setupHealthBars();

    this.time.addEvent({
      delay: 1000,
      callback: () => this.reduceHealth(this.player1),
      callbackScope: this,
      loop: true,
    });
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
