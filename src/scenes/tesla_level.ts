import "phaser"

import { Player } from '../objects/player'

export default class TeslaLevel extends Phaser.Scene {
    private player!: Player;

    constructor() {
        super({
            key: "TeslaLevel"
        })
    }
    public create(): void {
        this.player = new Player({
            scene: this,
            x: 40,
            y: 40,
            key: "moran"
        })
    }
    public update(): void {
        this.player.update();
    }
}