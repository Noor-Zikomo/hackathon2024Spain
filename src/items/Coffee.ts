import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";
import configuration from "../configuration.json";

export class Coffee extends Item {
  public constructor() {
    super("coffee");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    const originalSpeed = player.stats.speed;
    player.setStats({
      ...player.stats,
      speed: originalSpeed + configuration["coffee"]["speedBoost"],
    });
    player.scene.time.delayedCall(configuration["coffee"]["delay"], () => {
      const modifiedSpeed = player.stats.speed;
      if (player.stats.speed > configuration["player"]["maxSpeed"]) {
        player.setStats({
          ...player.stats,
          speed: modifiedSpeed - configuration["coffee"]["speedBoost"],
        });
      }
    });
  }
}
