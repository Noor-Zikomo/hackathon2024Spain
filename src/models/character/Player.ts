import Character, { CharacterStats, Coordinates } from "./Character.ts";
import Keyboard = Phaser.Input.Keyboard;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import KeyboardPlugin = Phaser.Input.Keyboard.KeyboardPlugin;

export interface CursorOverrides {
  left: Keyboard.Key;
  right: Keyboard.Key;
  up: Keyboard.Key;
  down: Keyboard.Key;
  dash: Keyboard.Key;
  attack: Keyboard.Key;
}

export default class Player extends Character {
  private cursors: CursorKeys;
  private attackKey: Phaser.Input.Keyboard.Key;
  private readonly textureKey: string;

  constructor(
    scene: Phaser.Scene,
    id: number,
    name: string,
    stats: Partial<CharacterStats>,
    spawnPoint: Coordinates,
    texture: string,
    frame?: string | number,
    keysOverride?: CursorOverrides,
  ) {
    super(scene, id, name, stats, spawnPoint, texture, frame);
    this.textureKey = texture;
    this.cursors = this.generateCursorKeys(scene, keysOverride);
  }

  private generateCursorKeys(
    scene: Phaser.Scene,
    keysOverride?: CursorOverrides,
  ): Phaser.Types.Input.Keyboard.CursorKeys {
    let inputKeyword: KeyboardPlugin | null = scene.input.keyboard;

    if (!inputKeyword) {
      throw new Error("No keyboard plugin found in scene");
    }
    const defaultCursorKeys: CursorKeys = inputKeyword.createCursorKeys();

    return {
      down: keysOverride?.down ?? defaultCursorKeys.down,
      shift: keysOverride?.dash ?? defaultCursorKeys.shift,
      space: keysOverride?.attack ?? defaultCursorKeys.space,
      left: keysOverride?.left ?? defaultCursorKeys.left,
      right: keysOverride?.right ?? defaultCursorKeys.right,
      up: keysOverride?.up ?? defaultCursorKeys.up,
    };
  }

  public createAnimations(scene: Phaser.Scene): void {
    scene.anims.create({
      key: "left",
      frames: scene.anims.generateFrameNumbers(this.textureKey, {
        start: 0,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    scene.anims.create({
      key: "turn",
      frames: [{ key: this.textureKey, frame: 4 }],
      frameRate: 20,
    });

    scene.anims.create({
      key: "right",
      frames: scene.anims.generateFrameNumbers(this.textureKey, {
        start: 5,
        end: 8,
      }),
      frameRate: 10,
      repeat: -1,
    });
  }

  update(): void {
    if (this.cursors.left?.isDown) {
      this.moveLeft();
      this.anims.play("left", true);
    } else if (this.cursors.right?.isDown) {
      this.moveRight();
      this.anims.play("right", true);
    } else {
      this.setVelocityX(0);
      this.anims.play("turn");
    }

    if (this.cursors.up?.isDown) {
      this.jump();
    }

    if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      this.attack();
    }
  }
}
