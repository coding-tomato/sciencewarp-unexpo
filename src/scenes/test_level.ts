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
    private firstCollide: Phaser.Physics.Arcade.Collider;

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

        //this.cameras.main.setBounds(0, 0, 100*16, 50*16, true);
        
        // Player
        this.player = new Player({
            scene: this,
            x: 5*16,
            y: 47*16,
            key: "moran"
        });
    
        const teslaMapData = new Phaser.Tilemaps.MapData({ name: 'tesla'});
        this.mapManager = new MapHelper(this, teslaMapData, 'tesla_tileset', 'tileset');

        this.player = this.mapManager.createPlayer('Player', 'p_respawn');
        
        this.nobo = this.mapManager.createObjects('pointer', 'enemy', Coil);

        let allSprites = this.nobo;
        allSprites.push(this.player);

        this.mapManager.setStaticLayers(['Ground'], allSprites);
        this.player.setFuelHUD();

        this.firstCollide = this.physics.add.overlap(this.player, this.nobo, this.hurt, null, this);

        this.cameras.main.startFollow(this.player);

        this.scene.launch('DialogBox');

        //////// 
        ///// EVENTS /////////

        this.events.on('attack', () => {
            
            this.time.delayedCall(1500, () => {
                this.firstCollide = this.physics.add.overlap(this.player, this.nobo, this.hurt, null, this);
            }, [], this);

            this.tweens.add({
                targets: this.player,
                alpha: 0.1,
                duration: 50,
                repeat: 15,
                yoyo: true,
                onComplete: () => {
                    this.player.setAlpha(1, 1, 1, 1);
                }
            });
        });
    }

    public update(time: number, delta: number): void {

        // Make Player and Coils interact
        


        this.player.update(delta);


        this.nobo.forEach( element => {
            element.update(delta);
        })
        
    }

    private hurt(element1: any, element2: any) {
        this.physics.world.removeCollider(this.firstCollide);
 
        this.events.emit('attack', 3400);
       
    }
} 