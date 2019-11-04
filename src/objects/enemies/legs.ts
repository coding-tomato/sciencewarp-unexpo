import "phaser";

interface Legs {
    direction: Direction;  
}

const enum State {
    Moving = 1,
    Attacking = 2,
    Resting = 3
}

const enum Direction {
    Left = -1,
    Right = 1
}

const VELOCITY =        50;
const FRAME_RATE =      12;
const AGGRO_RANGE =     75;
const SIZE =            { x: 25, y: 35 };
const JUMP_AMOUNT =     -250;
const ACCELERATION =    200;
const RESET_TIME =      2000;

class Legs extends Phaser.Physics.Arcade.Sprite {

    constructor(params: any) {

        super(params.scene, params.x, params.y, params.texture);  

        this.animSetup();
        this.arcadeSetup();
        this.create();

    }
    
    // Create Animations
    private animSetup(): void {
	
		// Default animation
		this.scene.anims.create({
			key: 'legs_move',
			frames: this.scene.anims.generateFrameNumbers('legs', {	
				start: 0, end: 7	
			}),
			frameRate: FRAME_RATE
		});

		// Play when attack starts
		this.scene.anims.create({
			key: 'legs_jump',
			frames: this.scene.anims.generateFrameNumbers('legs', {
				start: 8, end: 14
			}),
			frameRate: FRAME_RATE
		});

		// Play when attack ends
		this.scene.anims.create({
			key: 'legs_land',
			frames: this.scene.anims.generateFrameNumbers('legs', {
				start: 11, end: 14
			}),
			frameRate: FRAME_RATE	
		});
    }

    // All initialization setup goes here
    
    private arcadeSetup(): void {

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
		this.state = State.Moving;
		this.setSize(SIZE.x, SIZE.y);
		this.direction = Direction.Right;

    }

    // Create events if needed

    public create() {

		this.scene.events.addListener("jump", () => {

			this.anims.play("legs_jump");
			
			this.jump();

			this.scene.time.delayedCall(RESET_TIME, () => {

			this.state = State.Moving;
			
			}, [], this)
			
		});

    }

    public update() {

        switch(this.state) {
		
            case State.Moving:
                this.walk();  
		
				if (this.checkDistanceFromPlayer() <= AGGRO_RANGE && this.checkIfPlayerOnSight()) {
					
					this.state = State.Attacking;

					this.scene.events.emit("jump");
					
				}
            break;

	    	case State.Attacking:
				this.setVelocityY(-VELOCITY * 5);
			break;

	    	case State.Resting:
				this.walk();
			break;
		
        }

		this.handleAnimations();

    }

    private handleAnimations() {

		switch(this.state) {

			case State.Moving:
				this.anims.play('legs_move', true);
			break;

			case State.Attacking:
		    
			break;

			case State.Resting:
				this.anims.play('legs_move', true);
			break;
		
	}

		switch (this.direction) {
			
			case Direction.Right:
				this.flipX = true;
			break;
			
			case Direction.Left:
				this.flipX = false;
			break;
			
		}
	
    }

    private walk() {
	
        if (this.body.blocked.right || this.body.blocked.left) {
            this.direction *= Direction.Left;
        }
        
        this.setVelocityX(VELOCITY * this.direction);

    }

    private checkDistanceFromPlayer(): number {

		const player = (this.scene as any).children.scene.player;

		return Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
	
    }

    private checkIfPlayerOnSight(): boolean {

		const player = (this.scene as any).children.scene.player;

		return 	(this.direction == Direction.Left && this.x > player.x) ||
	    		(this.direction == Direction.Right && this.x < player.x);
    }

    private jump(): void {

		this.setVelocityY(JUMP_AMOUNT);
		this.setAcceleration(ACCELERATION, - ACCELERATION);

		console.log("Jump!");

		this.state = State.Resting;
    }

}

export default Legs;
