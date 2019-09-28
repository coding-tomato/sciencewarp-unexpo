import "phaser"

const enum State {
    WALKING_NO_JETPACK,
    WALKING_JETPACK,
    JUMPING_NO_JETPACK,
    JUMPING_JETPACK
}

export default class TeslaGoon extends Phaser.Physics.Arcade.Sprite {
    private currentScene: Phaser.Scene;
    //Variables
    private acceleration: number;
    private maxSpeed: number;
    private friction: number;
    private direction: {
        x: number,
        y: number
    };
    private lastDirection: {
        x: number,
        y: number
    }

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.currentScene = params.scene

        //Movement variables
        this.acceleration = 300;
        this.maxSpeed = 150;
        this.friction = 400;
        this.direction = {
            x: 0,
            y: 0
        };
        this.lastDirection = {
            x: 0,
            y: 0
        }

        //Settings
        this.scene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        //this.setCollideWorldBounds(true);
        
    }

    //Cycle
    update(delta: number): void {

    }

    private handleMovement(delta: number /*, player_state: State*/) {

    }

    private handleAnimations() {
        switch(this.direction.x){
            case 1:
                this.setFlipX(false);
                break;
            case -1:
                this.setFlipX(true);
                break;
            default:
                break;
        }
    }
}