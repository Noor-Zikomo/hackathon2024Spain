import { Item } from "./Item.ts";

export class Star implements Item {
  readonly name: string;
  readonly image: string;

  public constructor() {
    this.name = "star";
  }

  public onCollision(player: any) {}
}
