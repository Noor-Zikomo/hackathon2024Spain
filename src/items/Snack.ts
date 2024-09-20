import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class Snack extends Item {
  public constructor() {
    super("snack");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    console.log("snack");
    player.setHealth((player.health += 20));
    player.updateHealthBar();
  }
}
