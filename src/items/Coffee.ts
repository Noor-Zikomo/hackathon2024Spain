import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class Coffee extends Item {
  public constructor() {
    super("coffee");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    const originalSpeed = player.stats.speed;
    player.setStats({ ...player.stats, speed: originalSpeed + 300 });
    player.scene.time.delayedCall(10000, () => {
      const modifiedSpeed = player.stats.speed;
      player.setStats({ ...player.stats, speed: modifiedSpeed - 300 });
    });
  }
}
