import { Item } from "./Item.ts";
import Character from "../models/character/Character.ts";
import configuration from "../configuration.json";

export class Snack extends Item {
  public constructor() {
    super("snack");
  }

  public onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    super.onCollision(item, player);
    player.setHealth((player.health += configuration["snack"]["heal"]));
    if (player.health > configuration["player"]["maxHealth"]) {
      player.setHealth(configuration["player"]["maxHealth"]);
    }
    player.updateHealthBar();
  }
}
