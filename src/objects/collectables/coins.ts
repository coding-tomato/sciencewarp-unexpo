import "phaser";

const DESPAWN_TIMER = 500;

class Coins extends Phaser.Physics.Arcade.Sprite {

    body: Phaser.Physics.Arcade.Body;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key);

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.anims.fromJSON(this.scene.cache.json.get('coins_anim'));

        this.anims.play("coins_float");
    }

    vanish() {
        this.anims.play("coins_vanish");
        this.disableBody();

        this.scene.time.delayedCall(DESPAWN_TIMER, () => {
            this.destroy();
        }, [], this);
    }
}

export default Coins;
