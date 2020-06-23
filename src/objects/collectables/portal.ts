import "phaser";

class Portal extends Phaser.Physics.Arcade.Sprite {
    levelToWarp: number;
    body: Phaser.Physics.Arcade.Body;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        this.levelToWarp = params.props.level;

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.anims.fromJSON(this.scene.cache.json.get('portal_anim'));
    }

    update() {
        this.anims.play("portal_loop", true);
    }

    vanish() {
        this.disableBody();
        this.anims.play("portal_vanish");
    }

    getLevel(): number {
        return this.levelToWarp;
    }

    animSetup() {
        this.scene.anims.create({
            key: "portal_loop",
            frames: this.scene.anims.generateFrameNumbers("portal", {
                start: 0,
                end: 10,
            }),
            frameRate: 16,
            repeat: 0,
        });

        this.scene.anims.create({
            key: "portal_vanish",
            frames: this.scene.anims.generateFrameNumbers("portal", {
                start: 11,
                end: 14,
            }),
            frameRate: 12,
            hideOnComplete: true,
        });
    }
}

export default Portal;
