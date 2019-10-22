import "phaser";
import { reset, isObjectNear, shoot } from '../../utils/libmon';

enum State {
    Moving,
    Attacking,
}

const MAX_DIS =         50;         // Maximum movement in Y
const VELOCITY =        50;         // Velocity
const RESTING_TIME =    300;        // Time to hop from Resting to Moving
const PROJ_TIME =       100;        // Time between projectiles
const AGGRO_RAN =       100;        // Range before it detects player
const PROJ_NUM =        2;          // Number of projectiles
const UPPER_P =         100;
const LOWER_P =         250;

export default class Cannon extends Phaser.Physics.Arcade.Sprite {

    private moveTween:      Phaser.Tweens.Tween;  

    public state:           State;


    constructor(params: any) {

        super(params.scene, params.x, params.y, params.texture);

        this.state = State.Moving;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        (this.body as any).allowGravity = false;
     

        this.create();

    }

    create(): void {

        // Y is calculated from original position
        const moveConfig = {
            targets: this,
            y: '+=150',
            duration: 2000,
            ease: 'Linear',
            yoyo: true,
            repeat: -1,
        };

        // We want for it to move up and down constantly
        this.moveTween = this.scene.add.tween(moveConfig);

        // Get player from scene's children
        let player = (this.scene as any).children.scene.player;

        // While moving: check for player position
        this.scene.events.on('moving', () => { this.moving(player); });

        // If monsters spots the player
        this.scene.events.addListener('shoot', () => {

            console.log("Hello");

            if (!this.moveTween.isPaused()) {
                this.moveTween.pause();
            }
            
            this.scene.time.delayedCall(3000, () => {
                
                if (this.moveTween.isPaused()) {
                    this.moveTween.resume();

                    reset(this, State.Moving, 2000);
                }
            }, [], this);
        });
    }

    update(): void {

        switch(this.state) {

            case State.Moving:
                this.scene.events.emit('moving');
                break;
        }
    }

    change(state: State): void {
        this.state = state;
    }

    moving(player: any): void {

        // Player must be near for it to start attacking
        // And at the same height (y)

        let isPlayerNear: boolean = isObjectNear(AGGRO_RAN, player, this) <= AGGRO_RAN && 
        (Phaser.Math.RoundTo(player.y, 1) == Phaser.Math.RoundTo(this.y, 1));

        // Is player near? If so, start to attack
        
        if (isPlayerNear) {

            reset(this, State.Attacking, 0);

            this.scene.events.emit('shoot');
                  
        }  
    }
}