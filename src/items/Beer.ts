import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class Beer extends Item {
  public constructor() {
    super("beer");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    const originalAtk = player.stats.attackDamage;
    player.setStats({
      ...player.stats,
      attackDamage: originalAtk + 10,
    });
    player.scene.time.delayedCall(10000, () => {
      const modifiedAtk = player.stats.attackDamage;
      player.setStats({
        ...player.stats,
        attackDamage: modifiedAtk - 10,
      });
    });
  }
}
