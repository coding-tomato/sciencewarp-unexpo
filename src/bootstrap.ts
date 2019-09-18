export default class Bootstrap extends Phaser.Scene {
	constructor() {
		super({
			key: "Bootstrap"
		});
	}

	public preload(): void {
		this.load.on('complete', () => {
			this.scene.start("TeslaLevel");
		});

		for (let i = 1; i <= 4; i++) {
			this.load.image(`layer0${i}`, `../assets/temp_layer0${i}.png`)
		}

		this.load.image('moran', '../assets/sprites/player/moran.png')
	}
}