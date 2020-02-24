import "phaser";

interface Props {
    scene: Phaser.Scene;
    x: number;
    y: number;
    texture: string;
}

export default class Platform extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.Body;

    constructor(params: Props) {
        super(params.scene, params.x, params.y, params.texture);
        params.scene.add.existing(this);
        params.scene.physics.world.enable(this);

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        params.scene.add.tween({
            targets: this,
            duration: 100,
            y: params.y + 20,
            repeat: -1,
            yoyo: true,
        });
    }
}
