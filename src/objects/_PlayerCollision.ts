import "phaser";

interface PlayerCollision {
    [index: string]: any;
}

class PlayerCollision extends Phaser.Scene {
    private player: any;          // The first element
    private collidable: any;      // The second element
    private collider: any;        // The collider
    private callback: any;        // Function to call when overlap
    private context: any;         // Caller scene

    constructor() {
        super({
            key: "PlayerCollision"
        });
    }

    init(data: any) {

    }

    create() {
        console.log("Collider, created!");
        let context = this.scene.get("TestLevel");
        this.player = context.player;
        this.collidable = context.allSprites;

        this.physics.add.overlap(this.player, this.collidable, () => {console.log("YEASA")}, null, this);
        console.log(this.collidable);
    }

    sayHello() {
        console.log("Hello!");
    }

    update() {
    }
}

export default PlayerCollision;
