import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";

export class Beer extends Item {
  public constructor() {
    super("beer");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    console.log("beer");
    player.setHealth((player.health += 20));
    player.updateHealthBar();
  }
}
