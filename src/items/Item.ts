export interface Item {
  readonly name: string;
  readonly image: string;
  readonly addItem: () => void;
  readonly onCollision: (player: any) => void;
}
