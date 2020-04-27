import { Projectile } from "../../helpers/proj.js";
import Init from "../../libs/common.js";

const State = {
    MOVING: 1,
    ATTACKING: 2,
}

const Facing = {
    RIGHT: -1,
    LEFT: 1,
}

const VELOCITY = 50; // Velocity
const AGGRO_RAN = 300; // Range before it detects player
const AGGRO_WIDTH = 3; // Width of Y to detect player

export default class Cannon extends Phaser.GameObjects.Sprite {

    facing = Facing.LEFT;
    
    aggro = {
        x: 300,
        y: 3
    };

    travel = {
        dist: 150,
        time: 2000,
        resting: 300
    };
 
    state = State.MOVING;

    tween = this.scene.tweens.add({
        targets: this,
        y: `+=${this.travel.dist}`,
        duration: this.travel.time,
        ease: "Linear",
        yoyo: true,
        repeat: -1
    });

    flags = {
        attacking: false
    };

    size = { 
        x: 20, 
        y: 35 
    };

    offset = {
        x: 14,
        y: 10
    };

    velocity = 50;

    constructor(params) {
        super(params.scene, params.x, params.y, params.texture);

        const handle = Init.sprite(this.scene, this);
        handle.add(false);
        handle.resize(this.size, this.offset);

        if (params.props.direction)   
            this.facing = params.props.direction;
        if (params.props.travel_dist) 
            this.travel.dist = params.props.travel_dist;
        if (params.props.travel_time) 
            this.travel.time = params.props.travel_time;
        if (params.props.restingTime) 
            this.travel.resting = params.props.restingTime;
        
        switch(this.facing) {
            case Facing.RIGHT:
                this.setFlipX(true);
                break;
            default:
                this.setFlipX(false);
                break;
        }

        this.scene.anims.create({
            key: "cannon_move",
            frames: this.scene.anims.generateFrameNumbers("cannon", {
                start: 0,
                end: 7,
            }),
            frameRate: 10,
        });

        this.scene.anims.create({
            key: "cannon_attack",
            frames: this.scene.anims.generateFrameNumbers("cannon", {
                start: 8,
                end: 15,
            }),
            repeat: 4,
            frameRate: 12,
        });
    }

    update() {
        if (this.flags.attacking) {
            if (!this.tween.isPaused()) this.tween.pause();
        } else {
            if (this.state == State.MOVING) this.anims.play("cannon_move", true);
            else if (this.state == State.ATTACKING) this.attack();
        }

        let player = this.scene.player.body;
 
        const playerIsLeft = player.x < this.body.x && 
            player.x > this.body.x - this.aggro.x;

        const playerIsRight = player.x > this.body.x && 
            player.x < this.body.x + this.body.width + this.aggro.x;

        const isPlayerNear = (this.facing === Facing.LEFT ?
            playerIsLeft : playerIsRight) &&
            player.y < this.y + this.aggro.y &&
            player.y > this.y + this.aggro.y;

        if (isPlayerNear) this.state = State.ATTACKING;
    }

    attack() {
        this.flags.attacking = true;

        this.shootProjectiles();

        this.scene.time.delayedCall(2500, () => {
            if (!this.active) return;

            if (this.tween.isPaused()) this.tween.resume();
            this.state = State.MOVING;

            this.scene.time.delayedCall(this.travel.resting, () => {
                this.flags.attacking = false;
            });
        });
    }

    shootProjectiles() {
        this.anims.play("cannon_attack", true);

        for (let i = 400; i <= 2500; i += 700) {
            this.scene.time.delayedCall(i, () => {
                this.createProjectile();
            },);
        }
    }

    createProjectile() {
        if (!this.active) return;

        let center = this.body.center;
        let facing = this.facing;

        const proj = new Projectile({
            scene: this.scene,
            x: center.x,
            y: center.y - 3,
            texture: "cannon_part",
            lifetime: 3000,
            velocity: -100,
            setup: function() {
                this.body.setVelocity(this.velocity * facing, 0);
            },
        });

        this.scene.allProj.push(proj);
        this.scene.mapManager.setSpriteCollision(proj);
    }
}
