import "phaser";

enum State {
    Moving,
    Attacking
}

export default class Legs extends Phaser.Physics.Arcade.Sprite {

    private direction: number;

    constructor(params: any) {

        super(params.scene, params.x, params.y, params.texture);

        this.state = State.Moving;

        this.direction = 1;

        this.animSetup();

        this.arcadeSetup();

        this.create();

    }

    private animSetup(): void {

    }

    private arcadeSetup(): void {

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.state = State.Moving;


    }

    private create() {

        this.scene.events.on('moving', () => {
            this.walk();
        });
        


    }

    public update() {

        switch(this.state) {
            case State.Moving:
                this.scene.events.emit('moving');
                break;
        }
    }

    walk() {

        if (this.direction) {
            if (this.body.blocked.right || this.body.blocked.left) {
                this.direction *= -1;
            }
        }

        this.setVelocityX(100 * this.direction);

    }


}

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