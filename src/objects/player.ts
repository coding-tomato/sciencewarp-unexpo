import "phaser"

const enum State {
    WALKING_NO_JETPACK,
    WALKING_JETPACK,
    JUMPING_NO_JETPACK,
    JUMPING_JETPACK
}

export default class Player extends Phaser.Physics.Arcade.Sprite {
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
    private jetAcceleration: number;
    private jetMaxSpeed: number;
    //Input
    private keys: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.currentScene = params.scene

        //Input
        this.keys = this.currentScene.input.keyboard.createCursorKeys();

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
        this.jetAcceleration = -20;
        this.jetMaxSpeed = -200;

        //Settings
        this.scene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        //this.setCollideWorldBounds(true);
        
    }

    //Cycle
    update(delta: number): void {
        this.handleInput();
        this.handleMovement(delta);
        this.handleAnimations();
    }

    private handleInput() {
        if(this.keys.right.isDown)     { this.direction.x = 1  }
        else if(this.keys.left.isDown) { this.direction.x = -1 }
        else { this.direction.x = 0 }

        if(this.keys.up.isDown) { this.direction.y = -1 }
        else { this.direction.y = 0 }
    }

    private handleMovement(delta: number /*, player_state: State*/) {
        // Lateral movement
        if(this.lastDirection.x !== this.direction.x) {
            this.setVelocityX(this.body.velocity.x/2);
            this.lastDirection.x = this.direction.x;
        }

        if(this.direction.x !== 0) {
            this.setAccelerationX(this.acceleration * this.direction.x);
            if (Math.abs(this.body.velocity.x) > this.maxSpeed) this.setVelocityX(this.maxSpeed * this.direction.x);
        } else {
            this.setAccelerationX(0);
            this.setDragX(this.friction);
        }
        //Jet pack
        if(this.direction.y == -1) {
            this.body.velocity.y += this.jetAcceleration * delta * 0.1;
            if (this.body.velocity.y < this.jetMaxSpeed) this.setVelocityY(this.jetMaxSpeed)
        }
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

    get playerScene(): Phaser.Scene {
        return this.currentScene;
    }
}