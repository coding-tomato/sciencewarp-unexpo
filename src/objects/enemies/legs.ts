import "phaser";

import { isObjectNear } from "../../utils/libmon";

interface Legs {
    
    direction: number;
    
}

const enum State {
    
    Moving = 1,
    Attacking = 2,
    
}

const VELOCITY = 50;
const FRAME_RATE = 12;
const AGGRO_RANGE = 75;

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
		
		start: 8, end: 10
		
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
	this.direction = 1;

    }

    // Create events if needed

    public create() {

	this.scene.events.addListener("jump", () => {});

    }

    public update() {

	if (this.checkDistanceFromPlayer() <= AGGRO_RANGE) {
	    this.jump();
	}

        switch(this.state) {
		
            case State.Moving:
		
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
		
	}

	switch (this.direction) {
		
	    case 1:
		
		this.flipX = true;
		break;
		
	    case -1:
		
		this.flipX = false;
		break;
		
	}
	
    }

    private walk() {
	
        if (this.body.blocked.right || this.body.blocked.left) {
	    
            this.direction *= -1;
	    
        }
        
        this.setVelocityX(VELOCITY * this.direction);

    }

    private checkDistanceFromPlayer(): number {

	const player = (this.scene as any).children.scene.player;

	return Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
	
    }

    private jump(): void {
	console.log("Close");
    }

}

export default Legs;

/*
    class statement

    constructor() {

        animSetup();
        physicsSetup();
        
    }

    create() {

        tweens.walk();

        events.on('walk') {

            if (OutOfBounds) {
                remove();
            }

            if (checkPlayerDistance() is NEAR) {

                state = Attacking;
                attack();

            }

        }        

    }

    update() {

        switch(state) {

            case State.Moving:
                walk();

        }

    }

    attack() {

        jump();

        delayedCall(TIME, () => { state = Moving });

    }

    jump() {

        playAnimation();

        setVelocity(X, Y);

        delayedCall(TIME, () => { setVelocity (X, Y) });

    }

*/
