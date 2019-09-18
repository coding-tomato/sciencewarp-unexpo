import "phaser";

export default class Menu extends Phaser.Scene {

	bg: Array<any>;

	private controlKeys: any;

	constructor() {
		super({
			key: "Menu"
		});

		this.bg = [];
	}

	public create(): void {
		const width = this.cameras.main.width;
		const height = this.cameras.main.height;

		// Background
		this.bg[0] = this.add.tileSprite(0, 0, width, height, 'layer01').setOrigin(0, 0).setScrollFactor(0);
		const list = [
			this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 20, "Level One").setScrollFactor(0),
			this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 10, "Level Two").setScrollFactor(0),
			this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Level Three").setScrollFactor(0),
		];

		if (!this.data.get('item_selected')) {
			this.data.set('item_selected', 0)
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

		this.controlKeys = this.input.keyboard.createCursorKeys();



	}

	public update(): void {
		if (Phaser.Input.Keyboard.JustDown(this.controlKeys.up)) {
			if (this.data.get('item_selected') != 0) {
				let previous: number = this.data.get('item_selected')
				this.data.set('item_selected', previous - 1);
				this.events.emit('change', previous);
			}
		}

		this.cameras.main.scrollX++;
		this.bg[0].tilePositionX = this.cameras.main.scrollX * 0.8;



		if (Phaser.Input.Keyboard.JustDown(this.controlKeys.down)) {
			if (this.data.get('item_selected') != 2) {
				let previous: number = this.data.get('item_selected')
				this.data.set('item_selected', previous + 1);
				this.events.emit('change', previous);
			}
		}
	}
}