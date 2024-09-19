import Phaser from "phaser";
import CharacterMetrics from "./CharacterMetrics";

export enum PlayerID {
  Player1,
  Player2,
}

export enum AttackType {
  MELEE,
  RANGED,
}

export interface Coordinates {
  posX: number;
  posY: number;
}

export const COLORS = {
  green: 0x00ff00,
  yellow: 0xffff00,
  red: 0xff0000,
  white: 0xffffff,
};

export const healthBarCoordinates: Map<PlayerID, Coordinates> = new Map([
  [PlayerID.Player1, { posX: 50, posY: 50 }],
  [PlayerID.Player2, { posX: 780, posY: 50 }],
]);

export const playerNameCoordinates: Map<PlayerID, Coordinates> = new Map([
  [PlayerID.Player1, { posX: 50, posY: 10 }],
  [PlayerID.Player2, { posX: 780, posY: 10 }],
]);

const GRAVITY = 300;
const BOUNCE = 0.2;

export default class CharacterDisplay {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  public nameBar: Phaser.GameObjects.Text;
  public healthBar: Phaser.GameObjects.Graphics;
  private playerSprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;
  private metrics: CharacterMetrics;
  private id: PlayerID;
  private texture: string;
  private isDoubleJump: boolean = false;

  constructor(
    id: PlayerID,
    name: string,
    texture: string,
    spawnPoint: Coordinates,
    metrics: CharacterMetrics,
    scene: Phaser.Scene,
  ) {
    this.id = id;
    this.metrics = metrics;
    this.texture = texture;
    this.scene = scene;
    this.playerSprite = scene.physics.add.sprite(
      spawnPoint.posX,
      spawnPoint.posY,
      texture,
    );

    this.playerSprite
      .setBounce(BOUNCE)
      .setGravityY(GRAVITY)
      .setCollideWorldBounds(true)
      .setInteractive();

    this.createAnimations();
    this.generateHealthBar(name);
    this.cursors = this.generateCursorKeys();
  }

  public update(): void {
    if (this.cursors?.left?.isDown) {
      this.moveLeft();
      this.playerSprite.anims.play("left", true);
    } else if (this.cursors?.right?.isDown) {
      this.moveRight();
      this.playerSprite.anims.play("right", true);
    } else {
      this.playerSprite.setVelocityX(0);
      this.playerSprite.anims.play("turn");
    }

    if (this.cursors.up?.isDown) {
      this.jump();
    }
  }

  private generateHealthBar(name: string): void {
    const coordinates: Coordinates | undefined = playerNameCoordinates.get(
      this.id,
    );

    if (coordinates) {
      this.nameBar = this.scene.add.text(
        coordinates.posX,
        coordinates.posY,
        name,
        {
          fontFamily: "Arial Black",
          fontSize: "25px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        },
      );
    }

    this.healthBar = this.scene.add.graphics();
  }

  private generateCursorKeys(): Phaser.Types.Input.Keyboard.CursorKeys {
    const inputKeyboard: Phaser.Input.Keyboard.KeyboardPlugin | null =
      this.scene.input.keyboard;

    if (!inputKeyboard) {
      throw new Error("Input keyboard not found");
    }

    return inputKeyboard.createCursorKeys();
  }

  private createAnimations(): void {
    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers(this.texture, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: this.texture, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers(this.texture, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  protected moveLeft(): void {
    this.playerSprite.setVelocityX(-this.metrics.stats.speed);
  }

  protected moveRight(): void {
    this.playerSprite.setVelocityX(this.metrics.stats.speed);
  }

  protected jump(): void {
    if (this.playerSprite.body?.blocked.down) {
      this.isDoubleJump = true;
      this.playerSprite.setVelocityY(-400);
    } else if (this.isDoubleJump) {
      this.isDoubleJump = false;
      this.playerSprite.setVelocityY(-400);
    }
  }

  public updateHealthBar(): void {
    this.healthBar.clear();
    const coordinates: Coordinates | undefined = healthBarCoordinates.get(
      this.id,
    );

    if (coordinates) {
      const { posX, posY }: Coordinates = coordinates;
      this.healthBar.lineStyle(4, COLORS.white).strokeRect(posX, posY, 200, 20);
      const newHealth: number = this.metrics.getHealthPercentage() * 200;
      this.updateHealthBarColor(this.metrics.getHealthPercentage());
      this.healthBar.fillRect(posX, posY, newHealth, 20);
    }
  }

  private updateHealthBarColor(healthPercentage: number): void {
    this.healthBar.fillStyle(
      healthPercentage > 0.66
        ? COLORS.green
        : healthPercentage > 0.33
          ? COLORS.yellow
          : COLORS.red,
    );
  }
}
