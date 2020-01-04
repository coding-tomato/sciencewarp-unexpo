import "phaser";
import Player from "../../objects/player";

interface Interface {
    player: Player;
    fuelBar: any;
}

class Interface extends Phaser.Scene {
    constructor() {
        super({
            key: "Interface"
        });
    }

    init(data: any): void {
        this.player = data.player;
    }

    create(): void {
        // Create Box
        const headerBox = this.add.graphics().lineStyle(1, 0xfff, 1);
        headerBox.strokeRect(
            10, 
            10,
            this.cameras.main.displayWidth - 20,
            20
            );
        

    }

    update() {
        
    }
}

export default Interface;