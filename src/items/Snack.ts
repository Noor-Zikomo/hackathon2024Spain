import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class Snack extends Item {
  public constructor() {
    super("snack");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    player.setHealth((player.health += 50));
    if (player.health > 100) {
      player.setHealth(100);
    }
    player.updateHealthBar();
  }
}
