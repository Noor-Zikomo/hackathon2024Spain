import { Item } from "./Item.ts";

export class Coffee implements Item {
  readonly name: string;
  readonly image: string;

  public constructor() {
    this.name = "coffee";
  }

  public onCollision(player: any) {
    player;
  }
}
