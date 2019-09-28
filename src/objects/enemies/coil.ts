import "phaser"

export default class Coil extends Phaser.GameObjects.Sprite {
    private currentScene: Phaser.Scene;
    private direction: {
        x: number,
        y: number
    };
    private velocity: number;
    public body: Phaser.Physics.Arcade.Body
    //Variables

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.currentScene = params.scene

        this.direction = params.direction;
        this.velocity = 60;
    
        //Settings
        this.scene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        this.body.setAllowGravity(false);
    }

    //Cycle
    update(delta: number): void {
        this.handleMovement(delta);
        this.handleAnimations();
    }

    private handleMovement(delta: number) {
        if(this.direction.x !== 0) {
            if (this.body.blocked.right || this.body.blocked.left) {
                this.direction.x *= -1;
            }
        }
        if(this.direction.y !== 0) {
            if ( this.body.blocked.up || this.body.blocked.down) {
                this.direction.y *= -1;
            }
        }
        this.body.setVelocityX(this.velocity * this.direction.x);
        this.body.setVelocityY( this.velocity * this.direction.y);
    }

    private handleAnimations() {

    }
}