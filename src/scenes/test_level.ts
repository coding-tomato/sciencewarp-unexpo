import "phaser";

import Player from '../objects/player'
import Coil from '../objects/enemies/coil'
import MapHelper from '../utils/mapHelper'

export default class TestLevel extends Phaser.Scene {
    private player: Player;
    private Coil: Coil
    private map: any[];
    private tileset: any[];
    private level: any[];
    private mapManager: MapHelper;

    constructor() {
        super({
            key: "TestLevel"
        })

        this.map = [];
        this.tileset = [];
        this.level = [];
    }
    public create(): void {
        
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

        this.mapManager = new MapHelper(this, new Phaser.Tilemaps.MapData({
            name: 'tesla'
        }));

        this.mapManager.setTilesetImage('tesla_tileset', 'tileset');
        this.mapManager.setStaticLayers(['Ground'], [this.player, this.Coil]);
        

        this.player.setFuelHUD();
        this.cameras.main.startFollow(this.player);

        this.mapManager.createObjects('coil');
    }

    public update(time: number, delta: number): void {
        this.player.update(delta);
        this.Coil.update(delta);
        
    }
} 