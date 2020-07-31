import "phaser";

const enum Direction {
    LEFT = -1,
    RIGHT = 1,
}

const enum State {
    MOVING = 1,
    ATTACKING = 2,
    RESTING = 3,
}

interface Legs {
    direction: Direction;
}

const VELOCITY = 150;
const AGGRO_RANGE = 100;
const SIZE = { x: 17, y: 23 };
const JUMP_AMOUNT = -300;
const ACCELERATION = 200;
const RESET_TIME = 500;

class Legs extends Phaser.Physics.Arcade.Sprite {
    constructor(params: any) {
        super(params.scene, params.x, params.y, params.texture);

        this.scene.anims.fromJSON(this.scene.cache.json.get('legs_anim'));
        //this.createAnimations();
        this.arcadeSetup();
        this.create();
    }

    // All initialization setup goes here

    arcadeSetup() {
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.state = State.MOVING;
        this.setSize(SIZE.x, SIZE.y);
        this.setOffset(18, 14);
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

    checkDistanceFromPlayer(): number {
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

    jump(): void {
        this.anims.play("legs_jump", true);
        this.setVelocityY(JUMP_AMOUNT);
    }

    rest(): void {
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
}

export default Legs;
