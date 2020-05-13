import "phaser";

const DESPAWN_TIMER = 500;

class Coins extends Phaser.Physics.Arcade.Sprite {

    isGone = false;
    body: Phaser.Physics.Arcade.Body;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.anims.create({
            key: "coins_float",
            frames: this.scene.anims.generateFrameNumbers("coins", {
                start: 0,
                end: 5,
            }),
            frameRate: 12,
        });

        this.scene.anims.create({
            key: "coins_vanish",
            frames: this.scene.anims.generateFrameNumbers("coins", {
                start: 6,
                end: 8,
            }),
            frameRate: 12,
            hideOnComplete: true,
        });
    }

    update() {
        if (!this.isGone) {
            this.anims.play("coins_float", true);
        } else {
            this.anims.play("coins_vanish", true);
        }
    }

    vanish() {
        this.disableBody();
        this.isGone = true;

        this.scene.time.delayedCall(DESPAWN_TIMER, () => {
            this.destroy();
        }, [], this);
    }
}

export default Coins;
