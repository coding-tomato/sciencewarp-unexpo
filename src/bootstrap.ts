export default class Bootstrap extends Phaser.Scene {
	constructor() {
		super({
			key: "Bootstrap"
		});
	}

	public preload(): void {
		this.load.on('complete', () => {
			this.scene.start("TestLevel");
		});

		for (let i = 1; i <= 4; i++) {
			this.load.image(`layer0${i}`, `../assets/temp_layer0${i}.png`)
		}

		this.load.path = '../assets/'

		this.load.image('moran', 'sprites/player/moran_still.png');
		this.load.image('coil', 'sprites/enemies/tesla/coil_still.png')
		this.load.image('bg0', 'bg0.png')
		this.load.image('bg1', 'bg1.png')
		this.load.image('bg2', 'bg2.png')

		this.load.image('tileset', 'tilesets/tesla_tileset.png');
		this.load.tilemapTiledJSON('tesla', 'tilemaps/test_tilemap_0.json');
	}
}