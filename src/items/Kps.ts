import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class KpsToken extends Item {
  public constructor() {
    super("kpsToken");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    console.log("kps");
    player.setHealth((player.health += 20));
    player.updateHealthBar();
  }
}
