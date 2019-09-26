import "phaser";

import Player from '../objects/player'

export default class TeslaLevel extends Phaser.Scene {
    private player: Player;
    private map: any[];
    private tileset: any[];
    private level: any[];

    constructor() {
        super({
            key: "TeslaLevel"
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
        
        this.cameras.main.setBounds(0, 0, 80*36, 36*36, true);
        
        // Player
        this.player = new Player({
            scene: this,
            x: 121,
            y: 490,
            key: "moran"
        });      
        
        this.physics.add.collider(this.player, this.level[0]);


        
        this.cameras.main.startFollow(this.player);
    }

    public update(time: number, delta: number): void {
        this.player.update(delta);

        
        
        
    }
} 