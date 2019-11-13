import "phaser";
import { reset, isObjectNear, shoot } from "../../utils/libmon";
import { Projectile } from "../../helpers/proj" 

enum State {
    MOVING = 1,
    ATTACKING = 2
}

enum Direction {
    RIGHT = -1,
    LEFT = 1
}

const DIRECTION = Direction.RIGHT;
const TURRET_MODE = false; // Always shooting stationary
const MAX_DIS = 50; // Maximum movement in Y
const VELOCITY = 50; // Velocity
const RESTING_TIME = 300; // Time to hop from Resting to Moving
const AGGRO_RAN = 200; // Range before it detects player
const AGGRO_WIDTH = 3; // Width of Y to detect player
const PROJ_NUM = 4; // Number of projectiles

export default class Cannon extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    private moveTween: Phaser.Tweens.Tween;
    private isAttacking: boolean;
    //Properties
    private direction: Direction;
    private turretMode: boolean;
    private restingTime: number;
    public state: State;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.texture);

        let turretMode: boolean = TURRET_MODE;
        let direction: number = DIRECTION;
        let restingTime: number = RESTING_TIME;

        if (Object.keys(params.props).length > 0) {
          turretMode = params.props.turretMode;
          direction = params.props.direction;
        }

        this.state = State.MOVING;
        this.direction = direction || DIRECTION;
        this.turretMode = turretMode || TURRET_MODE;
        this.restingTime = restingTime || RESTING_TIME;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.body.allowGravity = false;

        this.body.setSize(20, 35);
        this.body.setOffset(14, 10);
        this.setFlipX(this.direction === Direction.LEFT ? false : true);
        this.createAnimations();
        this.create();
    }

    create(): void {
        // Y is calculated from original position
        const moveConfig = {
            targets: this,
            y: "+=150",
            duration: 2000,
            ease: "Linear",
            yoyo: true,
            repeat: -1
        };

        // We want for it to move up and down constantly
        this.moveTween = this.scene.add.tween(moveConfig);
        
        if (this.turretMode) {
            this.moveTween.pause();
            this.restingTime = 0;
        }  
    }

    update(): void {
        if (this.turretMode) {
           if(!this.isAttacking) this.attack();
           return
        }
        switch (this.state) {
            case State.MOVING:
                this.moving((this.scene as any).player);
                break;

            case State.ATTACKING:
                if(!this.isAttacking) {
                    this.attack();
                }
                break;
        }
    }

    moving(player: any): void {
        this.anims.play("cannon_move", true);
    
        if (this.isAttacking) return;

        // Player must be near for it to start attacking
        // And at the same height (y)
        const isPlayerNear = (this.direction === 1 ? 
                              (player.body.x < this.body.x && player.body.x > this.body.x - AGGRO_RAN) : 
                              (player.body.x > this.body.x && player.body.x < this.body.x + this.body.width + AGGRO_RAN)) &&
                             (player.y < this.y + AGGRO_WIDTH && player.y > this.y - AGGRO_WIDTH);

        // Is player near? If so, start to attack
        if (isPlayerNear) this.state = State.ATTACKING;
    }

    attack(): void {
        this.isAttacking = true;

        if (!this.moveTween.isPaused()) {
            this.moveTween.pause();
        }

        this.shootProjectiles();

        this.scene.time.delayedCall(
            2500,
            () => {
                if (!this.active) return
                if (this.moveTween.isPaused()) {
                    this.moveTween.resume();
                }
                this.scene.time.delayedCall(this.restingTime, () => { this.isAttacking = false }, [], this)
                this.state = State.MOVING;
            },
            [],
            this
        );
    }

    shootProjectiles() {
        this.anims.play("cannon_attack", true);
        for (let i = 400; i <= 2500; i += 700) {
            this.scene.time.delayedCall(
                i,
                () => {
                    this.createProjectiles();
                },
                [],
                this
            );
        }
    }

    createProjectiles() {
        if (!this.active) return;

        let center = this.body.center;
        let direction = this.direction;

        const proj = new Projectile({
			scene: this.scene,
			x: center.x, 
			y: center.y - 3, 
			texture: 'cannon_part',
			lifetime: 3000,
			velocity: -100,
			setup: function() { this.body.setVelocity(this.velocity * direction, 0) }
		});

        (this.scene as any).allSprites.push(proj);
        (this.scene as any).mapManager.setSpriteCollision(proj);
    }

    createAnimations(): void {
        this.scene.anims.create({
            key: "cannon_move",
            frames: this.scene.anims.generateFrameNumbers("cannon", {
                start: 0,
                end: 7
            }),
            frameRate: 10
        });

        let projNum = PROJ_NUM
        if(this.turretMode) projNum = -1;

        this.scene.anims.create({
            key: "cannon_attack",
            frames: this.scene.anims.generateFrameNumbers("cannon", {
                start: 8,
                end: 15
            }),
            repeat: projNum,
            frameRate: 12
        });
    }
}
