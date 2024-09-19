import ArcadeColliderType = Phaser.Types.Physics.Arcade.ArcadeColliderType;
import ArcadePhysics = Phaser.Physics.Arcade.ArcadePhysics;

export class Item {
  name: string;
  item: Phaser.Physics.Arcade.Image;

  public constructor(name: string) {
    this.name = name;
  }

  public emitItem(physics: ArcadePhysics, collider: ArcadeColliderType): void {
    const x = Phaser.Math.Between(25, 775);
    const y = 26;
    console.log(this.name);
    this.item = physics.add.image(x, y, this.name);
    this.item.setDisplaySize(20, 20);
    this.item.setVelocity(0, 200);
    this.item.setInteractive();
    physics.add.collider(this.item, collider);
    console.log("hola");
    console.log(this.item);
  }

  public onCollision() {
    this.item.destroy();
  }
}
