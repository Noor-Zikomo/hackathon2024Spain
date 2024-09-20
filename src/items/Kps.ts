import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";
import configuration from "../configuration.json";

export class KpsToken extends Item {
  public constructor() {
    super("kpsToken");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    const originalSpeed = player.stats.speed;
    const originalAtk = player.stats.attackDamage;
    let statsWereModified: boolean = false;
    if (player.stats.speed < configuration["player"]["maxSpeed"]) {
      player.setStats({
        ...player.stats,
        speed: originalSpeed + configuration["kps"]["speedBoost"],
        attackDamage: originalAtk + configuration["kps"]["atkBoost"],
      });
      statsWereModified = true;
    }
    player.scene.time.delayedCall(configuration["kps"]["delay"], () => {
      const modifiedSpeed = player.stats.speed;
      const modifiedAtk = player.stats.attackDamage;
      if (statsWereModified) {
        player.setStats({
          ...player.stats,
          speed: modifiedSpeed - configuration["coffee"]["speedBoost"],
          attackDamage: modifiedAtk - configuration["kps"]["atkBoost"],
        });
      }
    });
    player.setHealth((player.health += configuration["kps"]["heal"]));
    if (player.health > configuration["player"]["maxHealth"]) {
      player.setHealth(configuration["player"]["maxHealth"]);
    }
    player.updateHealthBar();
  }
}
