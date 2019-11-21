import "phaser";

export default class Menu extends Phaser.Scene {

	bg: Array<any>;

	private controlKeys: Phaser.Types.Input.Keyboard.CursorKeys;
	private enterKey: Phaser.Input.Keyboard.Key;
    private music: any;

	constructor() {
		super({
			key: "Menu"
		});

		this.bg = [];
	}

	public create(): void {

		const width = this.cameras.main.width;
		const height = this.cameras.main.height;
        
        // Music
        this.music = this.sound.add(`song`);
        if(!this.music.isPlaying) 
            this.music.play({
                volume: 0.3,
                loop: true
        });

		// Background
		this.bg[0] = this.add.image(0, 0, 'menu_title').setOrigin(0, 0).setScrollFactor(0);

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
		this.enterKey = this.input.keyboard.addKey('ENTER');
	}

	public update(): void {
		if (Phaser.Input.Keyboard.JustDown(this.controlKeys.up)) {
			if (this.data.get('item_selected') != 0) {
				let previous: number = this.data.get('item_selected')
				this.data.set('item_selected', previous - 1);
				this.events.emit('change', previous);
			}
		}

		// this.cameras.main.scrollX++;
		// this.bg[0].tilePositionX = this.cameras.main.scrollX * 0.8;

		if (Phaser.Input.Keyboard.JustDown(this.controlKeys.down)) {
			if (this.data.get('item_selected') != 2) {
				let previous: number = this.data.get('item_selected')
				this.data.set('item_selected', previous + 1);
				this.events.emit('change', previous);
			}
		} 

		if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            let item_selected = this.data.get(`item_selected`);
			this.cameras.main.once(
                'camerafadeoutcomplete', 
                (camera: any) => {
					this.scene.launch('TestLevel', { 
                        level: item_selected,
                        coins: 0
                    });
                    this.cameras.main.fadeIn(0);
				}
            );
			this.cameras.main.fadeOut(500);
					// this.time.delayedCall(1000, () => {
					// 	this.scene.start('TestLevel');
					// }, [], this);
					// break;
		}
	}
}
