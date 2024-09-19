import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');

        if (this.getRandomNumber() > 50) {
            this.load.image('kpsBackground', 'assets/backgrounds/kpsBackground.jpg');
        } else {
            this.load.image('kpsBackground', 'assets/backgrounds/kpsBackground2.jpg');
        }

        this.load.image('ground', 'assets/tiles/platform.png');
    }

    getRandomNumber(): number {
        return Math.floor(Math.random() * 100) + 1;
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
