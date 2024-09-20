import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class KpsToken extends Item {
  public constructor() {
    super("kpsToken");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    const originalSpeed = player.stats.speed;
    const originalAtk = player.stats.attackDamage;
    player.setStats({
      ...player.stats,
      speed: originalSpeed + 400,
      attackDamage: originalAtk + 20,
    });
    player.scene.time.delayedCall(10000, () => {
      const modifiedSpeed = player.stats.speed;
      const modifiedAtk = player.stats.attackDamage;
      player.setStats({
        ...player.stats,
        speed: modifiedSpeed - 300,
        attackDamage: modifiedAtk - 20,
      });
    });
    player.setHealth((player.health += 80));
    player.updateHealthBar();
  }
}
