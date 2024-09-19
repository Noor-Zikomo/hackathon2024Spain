import { AttackType } from "./CharacterDisplay";

export interface CharacterStats {
  readonly speed: number;
  readonly maxHealth: number;
  readonly attackDamage: number;
  readonly attackType: AttackType;
  readonly doubleJump: boolean;
}

export default class CharacterMetrics {
  public health: number;
  public stats: CharacterStats;

  constructor(initialStats: Partial<CharacterStats>) {
    this.stats = this.setStats(initialStats);
    this.maxHealth = 100;
  }

  private setStats(stats: Partial<CharacterStats>): CharacterStats {
    return {
      health: stats.health ?? 100,
      speed: stats.speed ?? 200,
      attackDamage: stats.attackDamage ?? 10,
      attackType: stats.attackType ?? AttackType.MELEE,
      doubleJump: stats.doubleJump ?? false,
    };
  }

  public setHealth(newHealth: number): void {
    this.stats.health = newHealth;
  }

  public getHealthPercentage(): number {
    return this.stats.health / this.maxHealth;
  }

  public attack(): void {
    console.log("Attack", this.stats.attackType);
    if (this.stats.attackType === AttackType.MELEE) {
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
}
