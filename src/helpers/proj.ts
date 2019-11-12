import "phaser" 

const PROJ_LIFETIME = 1000;
const PROJ_VELOCITY = 100;

// TO DO:
// - Allow for optional params to alter the lifetime and velocity
// FUTURE:
// - Custom parameter "pattern" function to alter the x and y values along the way
// - Custom parameter "behavious" function to alter the projectile's behavious

export class Projectile extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    private lifetime: number;
	private velocity: number;
    private timer: Phaser.Time.TimerEvent;

	constructor(params: any){
        super(params.scene, params.x, params.y, params.texture, params.frame);
		// Visual settings
		this.createAnimations();
		this.setDepth(-1);
		this.anims.play(`${this.texture.key}_loop`);
        // Physics settings
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        // Projectile setup
		this.lifetime = params.lifetime || PROJ_LIFETIME; 
		this.velocity = params.velocity || PROJ_VELOCITY;
		if(params.setup !== undefined) params.setup.call(this);
		else this.defaultSetup();
		// Events

        this.timer = this.scene.time.addEvent({
            delay: this.lifetime,
            callback: () => {
                this.anims.play(`${this.texture.key}_vanish`);
                this.scene.time.delayedCall(200, () => this.destroy(), [], this);
            },
            callbackScope: this,
            loop: false,
            repeat: 0
        });

		this.scene.add.existing(this);
    }
    update(delta: number) {
        if(!this.body.blocked.none) {
            this.timer.destroy();
            this.body.setVelocity(0, 0);
            this.anims.play(`${this.texture.key}_vanish`);
            this.scene.time.delayedCall(200, () => this.destroy(), [], this);
        } 
    }
    createAnimations(): void {
		const texture_key: string = this.texture.key;
        this.scene.anims.create({
            key: `${texture_key}_loop`,
            frames: this.scene.anims.generateFrameNumbers(texture_key, 
            {
                start: 0, end: 3
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: `${texture_key}_vanish`,
            frames: this.scene.anims.generateFrameNumbers(texture_key, 
            {
                start: 4, end: 6
            }),
            frameRate: 12
        });
    }
	defaultSetup(): void {
		this.body.setVelocity(this.velocity, 0);
	}
}
