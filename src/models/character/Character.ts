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
  dash: Phaser.Input.Keyboard.Key;
}

export interface CharacterStats {
  readonly speed: number;
  readonly attackDamage: number;
}

export interface KnockBack {
  flipX: boolean;
  knockBackPower: number;
}

export const green = 0x00ff00;
export const yellow = 0xffff00;
export const red = 0xff0000;
export const white = 0xffffff;
export const MAX_HEALTH: number = 100;
export const COOLDOWN_ATTACK: number = 500;
export const KNOCK_BACK_POWER: number = 300;
const DOUBLE_JUMP_COOLDOWN: number = 400;
const JUMP_VELOCITY: number = -700;
const DOUBLE_JUMP_VELOCITY: number = -600;
const PLAYER_WEIGHT: number = 1000;
const BOUNCE: number = 0.2;
const DASH_VELOCITY: number = 800;
const DASH_DURATION: number = 200;
const DASH_COOLDOWN: number = 600;

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
  public isAttacking: boolean = false;
  public knockBack: KnockBack | undefined = undefined;
  public canAttack = true;
  public attackHitBox: Phaser.Physics.Arcade.Sprite;
  public lastFlipX: boolean;
  public scene: Phaser.Scene;
  private isJumping: boolean = false;
  private canDoubleJump: boolean = false;
  private jumpCooldown: boolean = false;
  private isDashing: boolean = false;
  private canDash: boolean = true;
  private isDead: boolean = false;

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
    this.playerSprite.setBounce(BOUNCE);
    this.playerSprite.setCollideWorldBounds(true);
    this.playerSprite.setGravityY(PLAYER_WEIGHT);
    this.playerSprite.setSize(35, 80);
    this.playerSprite.setOffset(45, 50);

    this.scene = scene;
    this.createAnimations();
    this.generateHealthBar(id, name);
    this.keys = this.generateCursorKeys();
    this.attackHitBox = this.scene.physics.add.sprite(
      this.playerSprite.x + 30,
      this.playerSprite.y,
      "",
    );
    this.attackHitBox.setBounce(0);
    this.attackHitBox.setVisible(false);
    this.attackHitBox.setCollideWorldBounds(true);
    // @ts-ignore
    this.attackHitBox.body!.allowGravity! = false;
  }

  public update(): void {
    const playerId = this.id;

    if (this.health <= 0 && !this.isDead) {
      this.playDeathAnimation();
      this.isDead = true;
      return;
    }

    if (!this.isDead) {
      if (this.keys.left.isDown && !this.isDashing) {
        this.moveLeft();
        this.lastFlipX = true;
        this.playerSprite.flipX = true;
        this.playerSprite.anims.play(`${playerId}-left`, true);
      } else if (this.keys.right.isDown && !this.isDashing) {
        this.moveRight();
        this.playerSprite.flipX = false;

        this.playerSprite.anims.play(`${playerId}-right`, true);
        this.lastFlipX = false;
      } else if (this.knockBack) {
        this.handleKnockBack(this.knockBack);
        this.playerSprite.anims.play(`${playerId}-hurt`, true);
      } else if (!this.isDashing) {
        this.playerSprite.setVelocityX(0);
        this.playerSprite.anims.play(`${playerId}-turn`);
      }

      if (
        this.keys.dash.isDown &&
        (this.keys.left.isDown || this.keys.right.isDown) &&
        !this.isDashing
      ) {
        if (this.keys.left.isDown) {
          this.performDash("left");
        } else if (this.keys.right.isDown) {
          this.performDash("right");
        }
      }

      if (this.keys.up.isDown && !this.jumpCooldown) {
        if (this.playerSprite.body?.blocked.down) {
          this.performJump(JUMP_VELOCITY);
          this.isJumping = true;
          this.canDoubleJump = true;
        } else if (this.isJumping && this.canDoubleJump) {
          this.performJump(DOUBLE_JUMP_VELOCITY);
          this.canDoubleJump = false;
        }
      }

      if (this.playerSprite.body?.blocked.down && !this.isJumping) {
        this.resetJumpFlags();
      }

      if (this.keys.attack.isDown && this.canAttack) {
        this.performAttack();
        this.playerSprite.anims.play(`${playerId}-attack`, true);
      }

      this.attackHitBox.x = this.playerSprite.x + (this.lastFlipX ? -40 : 30);
      this.attackHitBox.y = this.playerSprite.y;
    }
    this.attackHitBox.x = this.playerSprite.x + (this.lastFlipX ? -36 : 33);
    this.attackHitBox.y = this.playerSprite.y;
  }

  private performJump(velocityY: number): void {
    this.playerSprite.setVelocityY(velocityY);
    this.jumpCooldown = true;

    this.scene.time.delayedCall(DOUBLE_JUMP_COOLDOWN, () => {
      this.jumpCooldown = false;
    });
  }

  private resetJumpFlags(): void {
    this.isJumping = false;
    this.canDoubleJump = false;
    this.jumpCooldown = false;
  }

  private performDash(direction: "left" | "right"): void {
    if (!this.canDash) return;

    this.isDashing = true;
    this.canDash = false;

    const dashVelocity = direction === "left" ? -DASH_VELOCITY : DASH_VELOCITY;
    this.playerSprite.setVelocityX(dashVelocity);

    this.scene.time.delayedCall(DASH_DURATION, () => {
      this.isDashing = false;
    });

    this.scene.time.delayedCall(DASH_COOLDOWN, () => {
      this.canDash = true;
    });
  }

  private performAttack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  private playDeathAnimation(): void {
    this.playerSprite.anims.play(`${this.id}-dead`, true);
    this.playerSprite.setVelocity(0);
  }

  public attack(enemy: Character): void {
    if (this.isAttacking && enemy.health > 0 && this.canAttack) {
      this.scene.sound.add("attack", { volume: 2 }).play();
      this.canAttack = false;
      enemy.setHealth(enemy.health - 10);
      enemy.updateHealthBar();
      const enemySprite = enemy.playerSprite;
      enemySprite.setTint(0xff0000);
      enemy.knockBack = {
        flipX: this.lastFlipX,
        knockBackPower: KNOCK_BACK_POWER,
      };
      setTimeout(() => {
        this.canAttack = true;
        enemySprite.clearTint();
        enemy.knockBack = undefined;
      }, COOLDOWN_ATTACK);
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

    const player2Keys: Keys = inputKeyword.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      attack: Phaser.Input.Keyboard.KeyCodes.O,
      dash: Phaser.Input.Keyboard.KeyCodes.P,
    }) as Keys;
    const player1Keys: Keys = inputKeyword.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      attack: Phaser.Input.Keyboard.KeyCodes.C,
      dash: Phaser.Input.Keyboard.KeyCodes.V,
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
          fontFamily: "main-font",
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

  private handleKnockBack({ flipX, knockBackPower }: KnockBack): void {
    if (flipX) {
      this.playerSprite.setVelocityX(-knockBackPower);
    } else {
      this.playerSprite.setVelocityX(knockBackPower);
    }
  }

  public setStats(stats: Partial<CharacterStats>): void {
    this.stats = {
      speed: stats.speed ?? 200,
      attackDamage: stats.attackDamage ?? 10,
    };
  }

  private createAnimations(): void {
    const playerId = this.id;

    this.scene.anims.create({
      key: `${playerId}-left`,
      frames: this.scene.anims.generateFrameNumbers(`player${playerId}`, {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `${playerId}-turn`,
      frames: [{ key: `player${playerId}_idle`, frame: 4 }],
      frameRate: 20,
    });

    this.scene.anims.create({
      key: `${playerId}-right`,
      frames: this.scene.anims.generateFrameNumbers(`player${playerId}`, {
        start: 0,
        end: 9,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.scene.anims.create({
      key: `${playerId}-dead`,
      frames: this.scene.anims.generateFrameNumbers(`player${playerId}_dead`, {
        start: 0,
        end: 4,
      }),
      frameRate: 4,
      repeat: 0,
    });

    this.scene.anims.create({
      key: `${playerId}-attack`,
      frames: this.scene.anims.generateFrameNumbers(
        `player${playerId}_attack`,
        {
          start: 2,
          end: 3,
        },
      ),
      frameRate: 1,
      repeat: 0,
    });

    this.scene.anims.create({
      key: `${playerId}-hurt`,
      frames: this.scene.anims.generateFrameNumbers(`player${playerId}_hurt`, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }
}
