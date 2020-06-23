import "phaser";

enum Power {
    Jump,
    Jetpack,
    Dash,
}

class Powerup extends Phaser.Physics.Arcade.Sprite {

    isGone = false;

    typeOf: Power;
    body: Phaser.Physics.Arcade.Body;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key);

        this.typeOf = params.props.typeOf;

        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);

        this.scene.anims.fromJSON(this.scene.cache.json.get('powerups_anim'));

        switch(this.typeOf) {
          case Power.Jump:
              this.anims.play("jump_float");
              break;
          case Power.Jetpack:
              this.anims.play("jet_float");
              break;
          case Power.Dash:
              this.anims.play("dash_float");
              break;
        }
    }

    vanish(player) {
        this.disableBody();
        this.isGone = true;

        switch (this.typeOf) {
            case Power.Jump:
                this.anims.play("jump_vanish", true);
                player.powerup.jump = true;
                break;
            case Power.Jetpack:
                this.anims.play("jet_vanish", true);
                player.powerup.jetpack = true;
                break;
            case Power.Dash:
                this.anims.play("dash_vanish", true);
                player.powerup.dash = true;
                break;
        }

        this.scene.time.delayedCall(500, () => {
            this.destroy();
        }, [], this);
    }
}

export default Powerup;
