import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  public init() {
    //  We loaded this image in our Boot Scene, so we can display it here
    this.add.image(window.innerWidth, window.innerHeight, "background");

    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on("progress", (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + 460 * progress;
    });
  }

  public preload() {
    //  Load the assets for the game - Replace with your own assets
    this.load.setPath("assets");

    this.load.image("logo", "logo.png");
    this.load.audio("backgroundMusicMenu", "audio/background-music-menu.mp3");
    this.load.audio("backgroundMusicFight", "audio/background-music-fight.mp3");
      this.load.spritesheet("dude", "dude.png", {
          frameWidth: 32,
          frameHeight: 48,
      });
      this.load.image("background", "sky.png");
    this.load.css("fontStyles", "fonts/fonts.css");
    this.load.image("star", "/items/star.png");
    this.load.image("coffee", "/items/coffee.png");
    this.load.image("kpsToken", "/items/kps.png");
    this.load.image("snack", "food/43.png");
    this.load.image("beer", "food/6.png");
    this.load.image("kpsBackground", "kpsBackground.jpg");
  }

  public create() {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.

    //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
    this.scene.start("MainMenu");
  }
}
