import "phaser";

class Coins extends Phaser.GameObjects.Sprite {
    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key);
        this.scene.add.existing(this);
    }

    public create(): void {
	    
    }

    private animSetup(): void {
    }
    
}

export default Coins;
