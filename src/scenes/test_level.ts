import "phaser";

import Player from '../objects/player'
import Coil from '../objects/enemies/coil'

export default class TestLevel extends Phaser.Scene {
    private player: Player;
    private Coil: Coil
    private map: any[];
    private tileset: any[];
    private level: any[];

    constructor() {
        super({
            key: "TestLevel"
        })

        this.map = [];
        this.tileset = [];
        this.level = [];
    }
    public create(): void {
        // Map
        this.map[0] = this.add.tilemap('tesla');

        this.tileset[0] = this.map[0].addTilesetImage('tesla_tileset', 'tileset');

        this.level[0] = this.map[0].createStaticLayer('Ground', this.tileset[0]);

        this.level[0].setCollisionByProperty({ collides: true });
        
        this.cameras.main.setBounds(0, 0, 80*16, 36*36, true);
        
        // Player
        this.player = new Player({
            scene: this,
            x: 300,
            y: 490,
            key: "moran"
        });

        //Enemy testing
        this.Coil = new Coil({
            scene: this,
            x: 350,
            y: 490,
            direction: {
                x: 1,
                y: 0
            },
            key: "coil"
        })
        

        this.player.setFuelHUD();
        this.physics.add.collider(this.player, this.level[0]);
        this.physics.add.collider(this.Coil, this.level[0]);
        this.cameras.main.startFollow(this.player);
    }

    public update(time: number, delta: number): void {
        this.player.update(delta);
        this.Coil.update(delta);
        
    }
} 