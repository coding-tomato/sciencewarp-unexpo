import "phaser";

const const Direction {
    LEFT = -1,
    RIGHT = 1,
}

const const State {
    MOVING = 1,
    ATTACKING = 2,
    RESTING = 3,
}

interface Legs {
    direction: Direction;
}

const VELOCITY = 150;
const FRAME_RATE = 12;
const AGGRO_RANGE = 100;
const SIZE = { x: 25, y: 35 };
const JUMP_AMOUNT = -300;
const ACCELERATION = 200;
const RESET_TIME = 500;

class Legs extends Phaser.Physics.Arcade.Sprite {
    constructor(params) {
        super(params.scene, params.x, params.y, params.texture);

        this.createAnimations();
        this.arcadeSetup();
        this.create();
    }

    // All initialization setup goes here

     arcadeSetup() {
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.state = State.MOVING;
        this.setSize(SIZE.x, SIZE.y);
        this.setOffset(10, 8);
        this.direction = Direction.RIGHT;
    }

    // Create events if needed

     create() {
        this.scene.events.addListener("jump", () => {
            this.jump();
        });
    }

     update() {
        switch (this.state) {
            case State.MOVING:
                this.walk();
                if (
                    this.checkDistanceFromPlayer() <= AGGRO_RANGE &&
                    this.checkIfPlayerOnSight()
                ) {
                    this.jump();
                    this.state = State.ATTACKING;
                }
                break;

            case State.ATTACKING:
                this.walk();
                if (this.body.blocked.down) {
                    this.rest();
                    this.state = State.RESTING;
                }
                break;

            case State.RESTING:
                this.setVelocityX(0);
                break;
        }

        this.handleAnimations();
    }

     handleAnimations() {
        // Animation displays running to the left, if Legs is running left,
        // then do not flip the sprite
        this.setFlipX(this.direction === Direction.LEFT ? false : true);

        switch (this.state) {
            case State.MOVING:
                this.anims.play("legs_move", true);
                break;
            default:
                break;
        }
    }

     walk() {
        if (this.body.blocked.right || this.body.blocked.left) {
            this.direction *= Direction.LEFT;
        }
        this.setVelocityX(VELOCITY * this.direction);
    }

     checkDistanceFromPlayer() {
        const player = (this.scene as any).children.scene.player;

        return Phaser.Math.Distance.Between(player.x, player.y, this.x, this.y);
    }

     checkIfPlayerOnSight(): boolean {
        const player = (this.scene as any).children.scene.player;

        return (
            (this.direction == Direction.LEFT && this.x > player.x) ||
            (this.direction == Direction.RIGHT && this.x < player.x)
        );
    }

     jump() {
        this.anims.play("legs_jump", true);
        this.setVelocityY(JUMP_AMOUNT);
    }

     rest() {
        this.anims.play(`legs_land`, true);

        this.scene.time.delayedCall(
            RESET_TIME,
            () => {
                this.state = State.MOVING;
            },
            [],
            this
        );
    }

    // Create Animations
     createAnimations() {
        // Default animation
        this.scene.anims.create({
            key: "legs_move",
            frames: this.scene.anims.generateFrameNumbers("legs", {
                start: 0,
                end: 7,
            }),
            frameRate: FRAME_RATE,
        });

        // Play when attack starts
        this.scene.anims.create({
            key: "legs_jump",
            frames: this.scene.anims.generateFrameNumbers("legs", {
                start: 8,
                end: 10,
            }),
            frameRate: 10,
            repeat: 0,
        });

        // Play when attack ends
        this.scene.anims.create({
            key: "legs_land",
            frames: this.scene.anims.generateFrameNumbers("legs", {
                start: 11,
                end: 14,
            }),
            frameRate: FRAME_RATE,
            repeat: 0,
        });
    }
}

export default Legs;
