import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import { CursorOverrides } from "./Player.ts";
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;

export enum PlayerID {
  Player1,
  Player2,
}

export enum AtackType {
  MELEE,
  RANGED,
}

export interface Coordinates {
  posX: number;
  posY: number;
}

export interface CharacterStats {
  health: number;
  readonly speed: number;
  readonly attackDamage: number;
  readonly attackType: AtackType;
  readonly doubleJump: boolean;
}

export const green = 0x00ff00;
export const yellow = 0xffff00;
export const red = 0xff0000;
export const white = 0xffffff;

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
  private readonly maxHealth: number = 100;
  private cursors: CursorKeys;
  private id: PlayerID;
  public nameBar: Phaser.GameObjects.Text;
  public healthBar: Phaser.GameObjects.Graphics;
  public stats: CharacterStats;
  public playerSprite: Phaser.Physics.Arcade.Sprite;
  private scene: Phaser.Scene;

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

  private generateCursorKeys(
    keysOverride?: CursorOverrides,
  ): Phaser.Types.Input.Keyboard.CursorKeys {
    let inputKeyword: KeyboardPlugin | null = this.scene.input.keyboard;

    if (!inputKeyword) {
      throw new Error("No keyboard plugin found in scene");
    }
    const defaultCursorKeys: CursorKeys = inputKeyword.createCursorKeys();

    return {
      down: keysOverride?.down ?? defaultCursorKeys.down,
      shift: keysOverride?.dash ?? defaultCursorKeys.shift,
      space: keysOverride?.attack ?? defaultCursorKeys.space,
      left: keysOverride?.left ?? defaultCursorKeys.left,
      right: keysOverride?.right ?? defaultCursorKeys.right,
      up: keysOverride?.up ?? defaultCursorKeys.up,
    };
  }

  private setStats(stats: Partial<CharacterStats>): void {
    this.stats = {
      health: stats.health ?? 100,
      speed: stats.speed ?? 200,
      attackDamage: stats.attackDamage ?? 10,
      attackType: stats.attackType ?? AtackType.MELEE,
      doubleJump: stats.doubleJump ?? false,
    };
  }

  public createAnimations(): void {
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

  protected moveLeft(): void {
    this.playerSprite.setVelocityX(-this.stats.speed);
  }

  protected moveRight(): void {
    this.playerSprite.setVelocityX(this.stats.speed);
  }

  protected jump(): void {
    console.log("Jump", this.stats.doubleJump);
    if (this.stats.doubleJump) {
      this.playerSprite.setVelocityY(-400);
    } else if (this.playerSprite.body?.blocked.down) {
      this.playerSprite.setVelocityY(-500);
    }
  }

  protected attack(): void {
    console.log("Attack", this.stats.attackType);
    if (this.stats.attackType === AtackType.MELEE) {
      this.meleeAttack();
    } else {
      this.rangedAttack();
    }
  }

  private meleeAttack(): void {
    console.log("Melee attack", this.stats.attackDamage);
  }

  private rangedAttack(): void {
    console.log("Ranged attack", this.stats.attackDamage);
  }

  // public powerUp(stats: CharacterStats, time: number, frame?: string): void {
  //   this.setStats(stats);
  //
  //   if (frame) {
  //     this.setTexture(frame, frame);
  //   }
  //
  //   this.scene.time.delayedCall(time, () => {
  //     this.setStats({});
  //   });
  // }

  // public takeDamage(amount: number): void {
  //   this.stats.health -= amount;
  //   if (this.stats.health <= 0) {
  //     this.die();
  //   }
  // }

  // private die(): void {
  //   this.setActive(false);
  //   this.setVisible(false);
  // }

  public setHealth(newHealth: number) {
    this.stats.health = newHealth;
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
      const newHealth: number = this.stats.health / this.maxHealth;
      this.updateHealthBarColor(newHealth);
      this.healthBar.fillRect(posX, posY, newHealth * 200, 20);
    }
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
}
