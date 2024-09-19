export enum PlayerID {
    Player1,
    Player2
}

interface Coordinates {
    x: number;
    y: number;
}

export const green = 0x00ff00;
export const yellow = 0xffff00;
export const red = 0xff0000;
export const white = 0xffffff;

export const healthBarCoordinates: Map<PlayerID, Coordinates> = new Map<PlayerID, Coordinates>()
healthBarCoordinates.set(PlayerID.Player1, {x: 50, y: 50})
healthBarCoordinates.set(PlayerID.Player2, {x: 780, y: 50})

export const playerNameCoordinates: Map<PlayerID, Coordinates> = new Map<PlayerID, Coordinates>()
playerNameCoordinates.set(PlayerID.Player1, {x: 50, y: 10})
playerNameCoordinates.set(PlayerID.Player2, {x: 780, y: 10})

export class Player
{
    private readonly maxHealth : number = 100;
    public id: PlayerID;
    public name : Phaser.GameObjects.Text;
    public health : number = 100;
    public healthBar : Phaser.GameObjects.Graphics;

    public constructor(id: PlayerID, factory: Phaser.GameObjects.GameObjectFactory, name: string) {
        this.id = id;
        const coordinates: Coordinates | undefined = playerNameCoordinates.get(id);
        if (coordinates) {
            this.name = factory.text(coordinates.x, coordinates.y, name, {
                fontFamily: 'Arial Black', fontSize: 25, color: '#ffffff',
                stroke: '#000000', strokeThickness: 8,
                align: 'center'
            });
        }

        this.healthBar = factory.graphics();
    }

    public setHealth(newHealth: number) {
        this.health = newHealth;
    }

    public updateHealthBar() {
        this.healthBar.clear();
        this.healthBar.lineStyle(4, white);
        const coordinates: Coordinates | undefined = healthBarCoordinates.get(this.id);
        if (coordinates) {
            const {x, y} = coordinates;
            this.healthBar.strokeRect(x, y, 200, 20);
            const newHealth = this.health / this.maxHealth;
            this.updateHealthBarColor(newHealth);
            this.healthBar.fillRect(x, y, (newHealth) * 200, 20);
        }
    }

    private updateHealthBarColor(health: number): void {
        if (health > 0.66) {
            this.healthBar.fillStyle(green);
        } else if (health > 0.33) {
            this.healthBar.fillStyle(yellow);
        } else {
            this.healthBar.fillStyle(red);
        }
    }
}
