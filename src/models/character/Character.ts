import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;

export enum PlayerID {
  Player1,
  Player2,
}

export interface Coordinates {
  posX: number;
  posY: number;
}

export interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  attack: Phaser.Input.Keyboard.Key;
}

export interface CharacterStats {
  readonly speed: number;
  readonly attackDamage: number;
  readonly doubleJump: boolean;
}

export const green = 0x00ff00;
export const yellow = 0xffff00;
export const red = 0xff0000;
export const white = 0xffffff;
export const MAX_HEALTH: number = 100;

export const healthBarCoordinates: Map<PlayerID, Coordinates> = new Map<
  number,
  Coordinates
>();
healthBarCoordinates.set(PlayerID.Player1, { posX: 50, posY: 50 });
healthBarCoordinates.set(PlayerID.Player2, { posX: 780, posY: 50 });

export const playerNameCoordinates: Map<PlayerID, Coordinates> = new Map<
  number,
  Coordinates
>();
playerNameCoordinates.set(PlayerID.Player1, { posX: 50, posY: 10 });
playerNameCoordinates.set(PlayerID.Player2, { posX: 780, posY: 10 });

export default class Character {
  private readonly id: PlayerID;
  private keys: Keys;
  public nameBar: Phaser.GameObjects.Text;
  public healthBar: Phaser.GameObjects.Graphics;
  public health: number = MAX_HEALTH;
  public stats: CharacterStats;
  public playerSprite: Phaser.Physics.Arcade.Sprite;
  public isAttacking: boolean;
  public scene: Phaser.Scene;

  constructor(
    id: number,
    name: string,
    playerSprite: Phaser.Physics.Arcade.Sprite,
    stats: Partial<CharacterStats>,
    scene: Phaser.Scene,
  ) {
    this.id = id;
    this.setStats(stats);
    this.playerSprite = playerSprite;
    this.playerSprite.setBounce(0.2);
    this.playerSprite.setCollideWorldBounds(true);
    this.scene = scene;
    this.createAnimations();
    this.generateHealthBar(id, name);
    this.keys = this.generateCursorKeys();
  }

  public update(): void {
    if (this.keys.left.isDown) {
      this.moveLeft();
      this.playerSprite.anims.play("left", true);
    } else if (this.keys.right.isDown) {
      this.moveRight();
      this.playerSprite.anims.play("right", true);
    } else {
      this.playerSprite.setVelocityX(0);
      this.playerSprite.anims.play("turn");
    }

    if (this.keys.up.isDown) {
      this.jump();
    }

    if (this.keys.attack.isDown) {
      this.performAttack();
    }

    if (this.isAttacking) {
      this.playerSprite.setTint(0xff0000);
    } else {
      this.playerSprite.clearTint();
    }
  }

  private performAttack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 300);
  }

  public attack(enemy: Character): void {
    if (this.isAttacking && enemy.health > 0) {
      enemy.setHealth(enemy.health - 10);
      enemy.updateHealthBar();
      console.log("¡Enemigo golpeado!");
    }
  }

  public setHealth(newHealth: number) {
    this.health = newHealth;
  }

  public updateHealthBar() {
    this.healthBar.clear();
    this.healthBar.lineStyle(4, white);
    const coordinates: Coordinates | undefined = healthBarCoordinates.get(
      this.id,
    );
    if (coordinates) {
      const { posX, posY }: Coordinates = coordinates;
      this.healthBar.strokeRect(posX, posY, 200, 20);
      const newHealth: number = this.health / MAX_HEALTH;
      const currentHealth: number = newHealth > 0 ? newHealth : 0;
      this.updateHealthBarColor(currentHealth);
      this.healthBar.fillRect(posX, posY, currentHealth * 200, 20);
    }
  }

  private generateCursorKeys(): Keys {
    let inputKeyword: KeyboardPlugin | null = this.scene.input.keyboard;

    if (!inputKeyword) {
      throw new Error("No keyboard plugin found in scene");
    }

    const player1Keys: Keys = inputKeyword.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.SPACE,
    }) as Keys;
    const player2Keys: Keys = inputKeyword.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      attack: Phaser.Input.Keyboard.KeyCodes.R,
    }) as Keys;

    return this.id === PlayerID.Player1 ? player1Keys : player2Keys;
  }

  private generateHealthBar(id: number, name: string): void {
    const coordinates: Coordinates | undefined = playerNameCoordinates.get(id);

    if (coordinates) {
      this.nameBar = this.scene.add.text(
        coordinates.posX,
        coordinates.posY,
        name,
        {
          fontFamily: "Arial Black",
          fontSize: 25,
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 8,
          align: "center",
        },
      );
    }

    this.healthBar = this.scene.add.graphics();
  }

  private updateHealthBarColor(health: number): void {
    if (health > 0.66) {
      this.healthBar.fillStyle(green);
    } else if (health > 0.33) {
      this.healthBar.fillStyle(yellow);
    } else {
      this.healthBar.fillStyle(red);
    }
  }

  private moveLeft(): void {
    this.playerSprite.setVelocityX(-this.stats.speed);
  }

  private moveRight(): void {
    this.playerSprite.setVelocityX(this.stats.speed);
  }

  private jump(): void {
    if (this.stats.doubleJump) {
      this.playerSprite.setVelocityY(-400);
    } else if (this.playerSprite.body?.blocked.down) {
      this.playerSprite.setVelocityY(-500);
    }
  }

  public setStats(stats: Partial<CharacterStats>): void {
    this.stats = {
      speed: stats.speed ?? 200,
      attackDamage: stats.attackDamage ?? 10,
      doubleJump: stats.doubleJump ?? false,
    };
  }

  private createAnimations(): void {
    this.scene.anims.create({
      key: "left",
      frames: this.scene.anims.generateFrameNumbers("dude", {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: "turn",
      frames: [{ key: "dude", frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: "right",
      frames: this.scene.anims.generateFrameNumbers("dude", {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
