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

        let dir_x = 1;
        let dir_y = 0

        if (Object.keys(params.props).length > 0) {
            dir_x = params.props.dir_x
            dir_y = params.props.dir_y
        }

        this.direction = {x: dir_x, y: dir_y};
        this.velocity = 100;
    

        //Settings
        this.scene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        this.body.setAllowGravity(false);
        this.body.setSize(16, 16)
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
        this.currentScene.anims.create({
            key: 'coil_move',
            frames: this.currentScene.anims.generateFrameNumbers('coil', { start: 0, end: 7}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.play('coil_move', true);
        
    }
}