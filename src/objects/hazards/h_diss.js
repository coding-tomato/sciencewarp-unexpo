import "phaser";

interface Props {
    scene: Phaser.Scene;
    x;
    y;
    texture: string;
}

export default class Disappear extends Phaser.Physics.Arcade.Sprite {
     body: Phaser.Physics.Arcade.Body;
     scene: Phaser.Scene;
     respawn: {
        x;
        y;
    };

    constructor(params: Props) {
        super(params.scene, params.x, params.y, params.texture);
        params.scene.add.existing(this);
        params.scene.physics.world.enable(this);

        this.scene = params.scene;

        this.respawn = {
            x: params.x,
            y: params.y,
        };

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

     disable() {
        this.scene.time.delayedCall(
            1000,
            () => {
                this.disableBody(true, true);
            },
            [],
            this
        );

        this.scene.time.delayedCall(
            3000,
            () => {
                this.enableBody(
                    true,
                    this.respawn.x,
                    this.respawn.y,
                    true,
                    true
                );
            },
            [],
            this
        );
    }

     enable() {}
}
