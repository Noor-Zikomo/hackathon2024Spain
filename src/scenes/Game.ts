import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    platforms: Phaser.Physics.Arcade.StaticGroup;

    constructor ()
    {
        super('Game');
    }

    handleMap ()
    {
        // Create platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(100, 800, 'ground').setScale(1).refreshBody();
        this.platforms.create(300, 800, 'ground').setScale(1).refreshBody(); // ground
        this.platforms.create(500, 800, 'ground').setScale(1).refreshBody(); // ground
        this.platforms.create(700, 800, 'ground').setScale(1).refreshBody(); // ground
        this.platforms.create(900, 800, 'ground').setScale(1).refreshBody(); // ground
    }

    create ()
    {
        this.camera = this.cameras.main;

        this.background = this.add.image(512, 384, 'kpsBackground');
        this.handleMap();
    }
}
