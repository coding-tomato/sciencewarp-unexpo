import Init from "../../libs/common.js";

const [ RIGHT, NOFLY ] = [ 1, 0 ];

class Coil extends Phaser.GameObjects.Sprite {
    
    velocity = 100;

    size = {
        x: 16,
        y: 16
    };

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        this.direction = { 
            x: params.props.dir_x && RIGHT,
            y: params.props.dir_y && NOFLY
        };

        const handle = Init.sprite(this.scene, this);
    
        handle.add(false);
        handle.resize(this.size);

        const config = {
            key: "coil_move",
            frames: this.scene.anims.generateFrameNumbers(
                "coil", {
                    start: 0,
                    end:   7,
                }
            ),
            frameRate: 10,
            repeat:    -1
        };

        this.scene.anims.create(config);

        this.body.setVelocity(
            this.velocity * this.direction.x,
            this.velocity * this.direction.y,
        );
    }

    update(time, delta) {
        // Coil hits obstacle horizontally 
        if (this.direction.x && this.body.blocked.right || this.body.blocked.left) {
            this.direction.x *= -1;
            this.body.setVelocityX(this.velocity * this.direction.x);
        }

        // Coils hits obstacle vertically
        if (this.direction.y && this.body.blocked.up || this.body.blocked.down) {
            this.direction.y *= -1;
            this.body.setVelocityY(this.velocity * this.direction.y);
        }
      
        this.anims.play("coil_move", true);
    }
}

export default Coil;