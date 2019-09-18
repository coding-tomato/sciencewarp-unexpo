import "phaser"

export class Player extends Phaser.Physics.Arcade.Sprite {
    private currentScene: Phaser.Scene;
    //Variables
    private acceleration: integer;
    private direction: integer;
    private maxSpeed: integer;
    private jumpSpeed: integer;
    private isJumping: boolean;
    private onGround: boolean;

    //Input
    private RIGHT: Phaser.Input.Keyboard.Key;
    private LEFT: Phaser.Input.Keyboard.Key;
    private UP: Phaser.Input.Keyboard.Key;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.currentScene = params.scene

        this.initSprite();
        this.scene.add.existing(this);
    }

    private initSprite() {
        this.RIGHT = this.currentScene.input.keyboard.addKey("RIGHT");
        this.LEFT = this.currentScene.input.keyboard.addKey("LEFT");
        this.UP = this.currentScene.input.keyboard.addKey("UP");

        this.acceleration = 300;
        this.direction = 0;
        this.maxSpeed = 150;
        this.jumpSpeed = 300;

        this.currentScene.physics.world.enable(this);
        this.setCollideWorldBounds(true);
    }

    //Cycle
    update(): void {
        this.handleInput();
        this.handleMovement();
        this.handleAnimations();
    }

    private handleInput() {
        if(this.RIGHT.isDown)     { this.direction = 1  }
        else if(this.LEFT.isDown) { this.direction = -1 }
        else { this.direction = 0 }
        
        if(this.UP.isDown) { this.isJumping = true }
    }

    private handleMovement() {
        // Lateral movement
        if(this.direction !== 0) {
            this.setAccelerationX(this.acceleration * this.direction);
            if (Math.abs(this.body.velocity.x) > this.maxSpeed) this.setVelocityX(this.maxSpeed * this.direction);
        } else {
            this.setAccelerationX(0);
            this.setDragX(400);
        }
        //Jumping
        if(this.isJumping) {
            this.setVelocityY(-this.jumpSpeed);
            this.onGround = false;
            this.isJumping = false;
        }
        //Ground checking
    }

    private handleAnimations() {
        switch(this.direction){
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