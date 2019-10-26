import "phaser"

import Player from '../objects/player'

import Coil from '../objects/enemies/coil'
import Cannon from '../objects/enemies/cannon'
import Legs from '../objects/enemies/legs'
import Vroomba from '../objects/enemies/vroomba'

import MapHelper from '../helpers/mapHelper'

import Platform from '../objects/hazards/h_plat'
import Disappear from '../objects/hazards/h_diss'

import { Second, Entrance } from '../utils/text'

export default class TestLevel extends Phaser.Scene {
    private player: Player;
    private mapManager: MapHelper;
    private nobo: any[];
    private firstCollide: Phaser.Physics.Arcade.Collider;
    private plat: any;
    private colo: any;
    private colo2: any;
    private vroomba: any;

    constructor() {
        super({
            key: "TestLevel"
        })

        this.nobo = [];
    }

    public create(): void {
    
        const teslaMapData = new Phaser.Tilemaps.MapData({ name: 'tesla'});
        this.mapManager = new MapHelper(this, teslaMapData, 'tesla_tileset', 'tileset');

        this.player = this.mapManager.createPlayer('Player', 'p_respawn');
        
        this.nobo = this.mapManager.createObjects('pointer', 'enemy', Coil);

        this.nobo.push(this.player);

        const legs = new Legs({scene: this, x: 100, y: 200, texture: 'legs'});
        const vroomba = new Vroomba({ scene: this, x: 150, y: 750, texture: 'vroomba' })
        
        this.nobo.push(legs);
        this.nobo.push(vroomba);

        this.mapManager.setStaticLayers(['Ground'], this.nobo);
        this.player.setFuelHUD();

        this.firstCollide = this.physics.add.overlap(this.player, this.nobo, this.hurt, null, this);

        this.cameras.main.startFollow(this.player);

        // Launch scene Dialog Box
        this.scene.launch('DialogBox', {text: [Entrance]});
        ///////////////////////////////

        this.plat = new Platform({scene: this, x: 200, y: 100, texture: 'platform'});

        this.physics.add.collider(this.player, this.plat);

        const diss = new Disappear({scene: this, x: 300, y: 100, texture: 'platform'});
        
        this.physics.add.collider(this.player, diss, () => { 
            diss.disable();
        });

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

       this.colo = new Cannon({ scene: this, x: 300, y: 200, texture: 'cannon' });
       
       
    }

    public update(time: number, delta: number): void {

        // Make Player and Coils interact
        


        this.player.update(delta);

    
        this.nobo.forEach( element => {
            element.update(delta);
        });

        this.colo.update(); 
        
    }

    private hurt(element1: any, element2: any) {
        this.physics.world.removeCollider(this.firstCollide);
 
        this.events.emit('attack', 3400);
       
    }
} 
