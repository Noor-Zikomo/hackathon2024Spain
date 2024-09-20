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
    scene: Phaser.Scene,
  ): void {
    const x = Phaser.Math.Between(25, 775);
    const y = 26;
    this.item = physics.add.image(x, y, this.name);
    this.item.setDisplaySize(30, 30);
    this.item.setVelocity(0, 1);
    this.item.setInteractive();
    physics.add.collider(this.item, platforms);
    physics.add.collider(
      this.item,
      player.playerSprite,
      () => this.onCollision(this.item, player),
      undefined,
      scene,
    );
  }

  protected onCollision(item: Phaser.Physics.Arcade.Image, _player: Character) {
    item.disableBody(true, true);
  }
}
