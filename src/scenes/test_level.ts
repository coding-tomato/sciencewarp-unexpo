import "phaser";

import Player from '../objects/player'
import Coil from '../objects/enemies/coil'
import MapHelper from '../helpers/mapHelper'

export default class TestLevel extends Phaser.Scene {
    private player: Player;
    private Coil: Coil
    private map: any[];
    private tileset: any[];
    private level: any[];
    private mapManager: MapHelper;
    private nobo: any[];

    constructor() {
        super({
            key: "TestLevel"
        })

        this.map = [];
        this.tileset = [];
        this.level = [];
        this.nobo = [];
    }
    public create(): void {
        
        this.cameras.main.setBounds(0, 0, 100*16, 50*16, true);
        
        // Player
        this.player = new Player({
            scene: this,
            x: 5*16,
            y: 47*16,
            key: "moran"
        });

        //Enemy testing
        this.Coil = new Coil({
            scene: this,
            x: 25*16,
            y: 45*16,
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
        this.nobo = this.mapManager.createObjects(5);
        //this.mapManager.setStaticLayers(['Ground'], this.nobo);
        //this.mapManager.setStaticLayers(['Ground'], [this.player, this.Coil]);

        let allSprites = this.nobo;
        allSprites.push(this.player, this.Coil);
        this.mapManager.setStaticLayers(['Ground'], allSprites);
        

        this.player.setFuelHUD();

        this.mapManager.setStaticLayers(['Ground'], [this.player, this.Coil]);
        this.cameras.main.startFollow(this.player);

        
    }

    public update(time: number, delta: number): void {
        this.player.update(delta);
        this.Coil.update(delta);

        this.nobo.forEach( element => {
            element.update(delta);
        })
        
    }
} 