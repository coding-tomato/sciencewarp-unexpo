class Pause extends Phaser.Scene {
    private controlEnter: any;

    private controlKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private enterKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "Pause"
        });
    }

    create() {
        const list = [
            this.add.text(this.cameras.main.centerX - 50, this.cameras.main.centerY - 30, "Level One").setScrollFactor(0),
		    this.add.text(this.cameras.main.centerX - 50, this.cameras.main.centerY - 15, "Level Two").setScrollFactor(0),
		    this.add.text(this.cameras.main.centerX - 50, this.cameras.main.centerY, "Level Three").setScrollFactor(0),
		];

		if (!this.data.get('item_selected')) {
			this.data.set('item_selected', 0);
		}

        let high = this.tweens.add({
			targets: list[this.data.get('item_selected')],
			alpha: { from: 0.5, to: 1 },
			repeat: -1
		});

		this.events.addListener('change', (previous: number) => {
			high.remove();
			list[previous].setAlpha(1);
			console.log(this.data.get('item_selected'));
			high = this.tweens.add({
				targets: list[this.data.get('item_selected')],
				alpha: { from: 0.5, to: 1 },
				repeat: -1
			});
		});

        this.enterKey = this.input.keyboard.addKey("ENTER");
        this.controlKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.scene.moveAbove("TestLevel", "DialogBox");
            this.scene.resume("DialogBox");
            this.scene.resume("TestLevel");
            // Restart music
            (this.scene.get("Menu") as any).music.resume();
            // Delete gray shader
            this.scene.get("TestLevel").cameras.main.clearRenderToTexture();
            this.scene.stop("Pause");
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.up)) {
			if (this.data.get('item_selected') != 0) {
				let previous: number = this.data.get('item_selected')
				this.data.set('item_selected', previous - 1);
				this.events.emit('change', previous);
			}
		}

		if (Phaser.Input.Keyboard.JustDown(this.controlKeys.down)) {
			if (this.data.get('item_selected') != 2) {
				let previous: number = this.data.get('item_selected')
				this.data.set('item_selected', previous + 1);
				this.events.emit('change', previous);
			}
		}
    }
}

export default Pause;
