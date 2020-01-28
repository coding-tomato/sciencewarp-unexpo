class Pause extends Phaser.Scene {
    private controlEnter: any;
    constructor() {
        super({
            key: "Pause"
        });
    }

    create() {
        let title = this.add.text(
            this.cameras.main.centerX - 150,
            this.cameras.main.centerY + 70,
            "PAUSE", {
                fontSize: "100px",
                lineSpacing: 30
            }
        );

        title.setAngle(-45);

        this.controlEnter = this.input.keyboard.addKey("ENTER");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.controlEnter)) {
            this.scene.resume("DialogBox");
            this.scene.resume("TestLevel");
            //this.scene.get("DialogBox").cameras.main.clearRenderToTexture();
            this.scene.get("TestLevel").cameras.main.clearRenderToTexture();
            this.scene.stop("Pause");
        }
    }
}

export default Pause;