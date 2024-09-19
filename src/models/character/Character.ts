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

export const healthBarCoordinates: Map<number, Coordinates> = new Map<
  number,
  Coordinates
>();
healthBarCoordinates.set(1, { posX: 50, posY: 50 });
healthBarCoordinates.set(2, { posX: 780, posY: 50 });

export const playerNameCoordinates: Map<number, Coordinates> = new Map<
  number,
  Coordinates
>();
playerNameCoordinates.set(1, { posX: 50, posY: 10 });
playerNameCoordinates.set(2, { posX: 780, posY: 10 });

export default class Character extends Phaser.Physics.Arcade.Sprite {
  private readonly maxHealth: number = 100;
  private id: number;
  public nameBar: Phaser.GameObjects.Text;
  public healthBar: Phaser.GameObjects.Graphics;
  public stats: CharacterStats;

  constructor(
    scene: Phaser.Scene,
    id: number,
    name: string,
    stats: Partial<CharacterStats>,
    { posX, posY }: Coordinates,
    texture: string,
    frame?: string | number,
  ) {
    super(scene, posX, posY, texture, frame);

    this.id = id;
    this.setStats(stats);
    this.createAnimations(scene);
    this.generateHealthBar(id, name);

    scene.physics.add.existing(this);
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

  private setStats(stats: Partial<CharacterStats>): void {
    this.stats = {
      health: stats.health ?? 100,
      speed: stats.speed ?? 200,
      attackDamage: stats.attackDamage ?? 10,
      attackType: stats.attackType ?? AtackType.MELEE,
      doubleJump: stats.doubleJump ?? false,
    };
  }

  public createAnimations(_scene: Phaser.Scene): void {
    // Placeholder for character-specific animations
  }

  protected moveLeft(): void {
    this.setVelocityX(-this.stats.speed);
  }

  protected moveRight(): void {
    this.setVelocityX(this.stats.speed);
  }

  protected jump(): void {
    console.log("Jump", this.stats.doubleJump);
    if (this.stats.doubleJump) {
      this.setVelocityY(-400);
    } else if (this.body?.blocked.down) {
      this.setVelocityY(-500);
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

  public powerUp(stats: CharacterStats, time: number, frame?: string): void {
    this.setStats(stats);

    if (frame) {
      this.setTexture(frame, frame);
    }

    this.scene.time.delayedCall(time, () => {
      this.setStats({});
    });
  }

  public takeDamage(amount: number): void {
    this.stats.health -= amount;
    if (this.stats.health <= 0) {
      this.die();
    }
  }

  private die(): void {
    this.setActive(false);
    this.setVisible(false);
  }

  update(): void {}

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
