import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class Coffee extends Item {
  public constructor() {
    super("coffee");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    console.log("coffee");
    player.setHealth((player.health += 20));
    player.updateHealthBar();
  }
}
