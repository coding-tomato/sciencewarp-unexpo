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
        
        // Player
        this.player = new Player({
            scene: this,
            x: 5*16,
            y: 47*16,
            key: "moran"
        });

        

        const teslaMapData = new Phaser.Tilemaps.MapData({ name: 'tesla'});
        this.mapManager = new MapHelper(this, teslaMapData, 'tesla_tileset', 'tileset');


        // Create enemies from objects
        this.nobo = this.mapManager.createObjects('pointer', 'enemy');
        

        let allSprites = this.nobo;
        allSprites.push(this.player, this.Coil);

        this.mapManager.setStaticLayers(['Ground'], allSprites);
        this.player.setFuelHUD();

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