import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";
import configuration from "../../src/configuration.json";

export class Beer extends Item {
  public constructor() {
    super("beer");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    const originalAtk = player.stats.attackDamage;
    player.setStats({
      ...player.stats,
      attackDamage: originalAtk + configuration["beer"]["atkBoost"],
    });
    player.scene.time.delayedCall(configuration["beer"]["delay"], () => {
      const modifiedAtk = player.stats.attackDamage;
      player.setStats({
        ...player.stats,
        attackDamage: modifiedAtk - configuration["beer"]["atkBoost"],
      });
    });
  }
}
