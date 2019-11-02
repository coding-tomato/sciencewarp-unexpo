import "phaser"
import { Projectile } from '../../helpers/proj'

const enum State {
    WALKING = 1,
    WINDUP = 2,
    SHOOTING = 3
}

const SIGHT_RANGE = 200;
const VELOCITY = 100;
const REST_TIME = 1000;
const DIRECTION = 1;
const PROJ_VEL = -100;

export default class Vroomba extends Phaser.GameObjects.Sprite {
    private mapManager: any;
    private direction: number; 
    private velocity: number;
    private range: number;
	private rest_time: number;
	private proj_vel: number;
    public body: Phaser.Physics.Arcade.Body;
     
    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.mapManager = params.scene.mapManager;

        // Param handling - To do
        this.state 		= State.WALKING;
        this.direction 	= params.direction 	|| DIRECTION;
		this.velocity 	= params.velocity 	|| VELOCITY;
        this.range 		= params.range		|| SIGHT_RANGE;
		this.rest_time 	= params.rest_time	|| REST_TIME;
		this.proj_vel 	= params.proj_vel 	|| PROJ_VEL;
    
        // Animations
        this.createAnimations();
        this.anims.play('walk');
        this.setDepth(1);

		// Physics settings
        this.scene.physics.world.enable(this);
		this.body.setVelocityX(this.velocity);
		this.body.setBounceX(1);
        this.body.setSize(48, 8, false);
        this.body.setOffset(0, 24);
		
		this.scene.add.existing(this);
    }

    update(delta: number): void {
		//Update handlers
        this.animationHandler();
        this.moveHandler();
    }

    moveHandler(): void {
        let center = this.body.center;
        switch(this.state){
            case State.WALKING:
                //	Check for player in sight
                if(this.isPlayerAbove()) { this.state = State.WINDUP }
                //	Checks for cliffs to turn (bounce property takes cares of walls)
                let turn: boolean =  this.mapManager.map.getTileAtWorldXY(  
                                        Phaser.Math.RoundTo(center.x + this.direction * (this.body.halfWidth + 5), 0),
                                        Phaser.Math.RoundTo(center.y + this.body.halfHeight, 0)) === null
                if (turn) this.body.setVelocity(-this.body.velocity.x);
				this.direction = Math.sign(this.body.velocity.x);
                break;
            case State.WINDUP:
                if(this.body.velocity.x !== 0) {
                    this.body.setVelocityX(0);
                } 
                break;
        }
    }

	isPlayerAbove() {
		//	Checks if a player is above the Vroomba's body up to a maximum Y range of the range property
		let player = (this.scene as any).player;
		let sight =	(player.body.x > this.body.x && player.body.x < this.body.x + this.body.width)
		    	&& 	(player.body.y > this.body.y - this.range &&  player.body.y < this.body.y);
		return sight;
	}

    createAnimations(): void {
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('vroomba', 
            {
                start: 0, end: 3
            }),
            frameRate: 12
        });
        this.scene.anims.create({
            key: 'windup',
            frames: this.scene.anims.generateFrameNumbers('vroomba',
            {
                start: 4, end: 5
            }),
            frameRate: 12,
            repeat: 0
        })
        this.scene.anims.create({
            key: 'shooting',
            frames: this.scene.anims.generateFrameNumbers('vroomba',
            {
                start: 7, end: 13
            }),
            frameRate: 12,
            repeat: 0
        })
        this.on('animationcomplete', this.animCompleteHandler, this)
    }

    animationHandler(): void {
        this.setFlipX(this.direction === -1);
        switch(this.state)
        {
            case State.WALKING:
                this.anims.play('walk', true);
                break;
            case State.WINDUP:
                if(this.anims.getCurrentKey() !== 'windup') this.anims.play('windup');
                break;
            case State.SHOOTING:
                if(this.anims.getCurrentKey() !== 'shooting') this.anims.play('shooting');
                break;
        } 
    }

    animCompleteHandler(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame): void {
        switch(animation.key) {
            case "walking":
                break;
            case "windup":
                this.state = State.SHOOTING;
                this.shootProjectile();
                break;
            case "shooting":
                this.scene.time.delayedCall(500, () => {
                   this.state =  State.WALKING;
				   // Return to our original direction
				   this.body.setVelocityX(this.velocity * this.direction);
                }, [], this);
                break;
        }
    }

    shootProjectile(): void {
        let center = this.body.center;
		let proj_vel = this.proj_vel;
        const proj = new Projectile({
			scene: this.scene,
			x: center.x, 
			y: center.y - 10, 
			texture: 'vroomba_part',
			lifetime: 5000,
			velocity: -100,
			setup: function() { this.body.setVelocity(0, this.velocity) }
		});
        (this.scene as any).nobo.push(proj);
    }
}



