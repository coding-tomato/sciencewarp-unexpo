import "phaser";

export default class DialogBox extends Phaser.Scene {
    constructor() {
        super({
            key: 'DialogBox'
        })
    }

    create() {
        this.add.text(100, 100, "Hello");
    }
}