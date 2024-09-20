import ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;
import ArcadePhysics = Phaser.Physics.Arcade.ArcadePhysics;
import Character from "../models/character/Character.ts";

export class Item {
  name: string;
  item: Phaser.Physics.Arcade.Image;

  public constructor(name: string) {
    this.name = name;
  }

  public emitItem(
    physics: ArcadePhysics,
    platforms: ArcadeColliderType,
    player: Character,
  ): void {
    const x = Phaser.Math.Between(25, 775);
    const y = 26;
    this.item = physics.add.image(x, y, this.name);
    this.item.setDisplaySize(30, 30);
    this.item.setVelocity(0, 1);
    this.item.setInteractive();
    console.log("emits item for", player);
    console.log("physiscs", physics);
    physics.add.collider(this.item, platforms);
    physics.add.collider(
      player.playerSprite,
      this.item,
      () => this.onCollision(this.item, player),
      undefined,
      player.scene,
    );
  }

  protected onCollision(item: Phaser.Physics.Arcade.Image, player: Character) {
    console.log("item", item, "player", player);
    const powerUpSound = player.scene.sound.add("powerUp", { volume: 2 });
    powerUpSound.play();
    item.disableBody(true, true);
  }
}
