import { Scene } from "phaser";
import { GameConfig, MapConfig, PlatformConfig } from "../types.ts";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  platforms: Phaser.Physics.Arcade.StaticGroup;
  mapData: MapConfig;

  constructor() {
    super("Game");
  }

  handleMap() {
    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    const data: MapConfig = this.mapData;
    this.load.image(data.id, "assets/backgrounds/" + data.id + ".jpg");
    this.background = this.add.image(512, 382, data.id);
    this.platformsGenerate(data.config);
  }

  platformsGenerate(platformConfig: PlatformConfig[]) {
    this.platforms = this.physics.add.staticGroup();
    platformConfig.forEach((platformConfig: PlatformConfig) => {
      this.platforms
        .create(platformConfig.x, platformConfig.y, platformConfig.key)
        .setScale(platformConfig.scale);
    });
  }

  create(data: GameConfig) {
    this.mapData = data["mapData"];
    this.handleMap();

    this.camera = this.cameras.main;
  }
}
