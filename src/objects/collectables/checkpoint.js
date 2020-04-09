import "phaser";

export default class Checkpoint extends Phaser.Physics.Arcade.Sprite {
    private isGone: boolean;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.isGone = false;

        (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);

        this.animSetup();
    }

    update() {
        if (!this.isGone) this.anims.play(`checkpoint_loop`, true);
    }

    vanish() {
        this.disableBody();
        this.isGone = true;
        (this.scene as any).checkpointPos = {
            x: this.x,
            y: this.y,
        };
        this.anims.play(`checkpoint_vanish`);
        this.scene.time.delayedCall(
            500,
            () => {
                this.destroy();
            },
            [],
            this
        );
    }

    animSetup() {
        this.scene.anims.create({
            key: "checkpoint_loop",
            frames: this.scene.anims.generateFrameNumbers("checkpoint", {
                start: 0,
                end: 10,
            }),
            frameRate: 16,
            repeat: 0,
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
    }
}
