import "phaser";

interface Coins {
    coinsAnim: any;
}

class Coins extends Phaser.GameObjects.Sprite {
    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);

        (this.body as Phaser.Physics.Arcade.Body).setImmovable(true);
        (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
        
        this.animSetup();
    }

    public create(): void {
	    
    }

    public update(): void {
        this.anims.play('coins_float', true);
    }

    private animSetup(): void {
        this.scene.anims.create({
            key: 'coins_float',
            frames: this.scene.anims.generateFrameNumbers('coins', {
                start: 0, end: 5
            }),
            frameRate: 12
        });
    }
    
}

export default Coins;
