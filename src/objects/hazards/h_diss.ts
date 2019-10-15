import "phaser";

interface Props {
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string
}

export default class Disappear extends Phaser.Physics.Arcade.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    public scene: Phaser.Scene;
    public respawn: {
        x: number,
        y: number
    }

    constructor(params: Props) {
        super(params.scene, params.x, params.y, params.texture);
        params.scene.add.existing(this);
        params.scene.physics.world.enable(this);

        this.scene = params.scene;

        this.respawn = {
            x: params.x,
            y: params.y
        }

        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }   

    public disable() {
        this.scene.time.delayedCall(1000, () => {
            this.disableBody(true, true);
        }, [], this);

        this.scene.time.delayedCall(3000, () => {
            this.enableBody(true, this.respawn.x, this.respawn.y, true, true);
        }, [], this);
    }

    public enable() {

    }
}