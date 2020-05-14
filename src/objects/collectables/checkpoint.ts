import "phaser";

const DESPAWN_TIMER = 500;

export default class Checkpoint extends Phaser.Physics.Arcade.Sprite {

    body: Phaser.Physics.Arcade.Body;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.anims.create({
            key: "checkpoint_loop",
            frames: this.scene.anims.generateFrameNumbers("checkpoint", {
                start: 0,
                end: 10,
            }),
            frameRate: 16,
            repeat: -1,
        });

        this.scene.anims.create({
            key: "checkpoint_vanish",
            frames: this.scene.anims.generateFrameNumbers("checkpoint", {
                start: 11,
                end: 14,
            }),
            frameRate: 12,
            hideOnComplete: true,
        });

        this.anims.play("checkpoint_loop");
    }

    vanish() {
        this.disableBody();

        (this.scene as any).checkpointPos = {
            x: this.x,
            y: this.y,
        };

        this.anims.play("checkpoint_vanish");

        this.scene.time.delayedCall(DESPAWN_TIMER, () => {
            this.destroy();
        }, [], this);
    }
}
