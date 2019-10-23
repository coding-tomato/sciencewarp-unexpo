export default class Bootstrap extends Phaser.Scene {
	private moranx: Phaser.Cache.BaseCache
	constructor() {
		super({
			key: "Bootstrap"
		});
	}

	public preload(): void {

		// Load level on complete
		this.load.on('complete', () => {
			this.scene.start("TestLevel");
		});

		this.load.path = '../assets/'

		// TEST CODE ///////////////////////////////////////////////////////
		for (let i = 1; i <= 4; i++) {
			this.load.image(`layer0${i}`, `../assets/temp_layer0${i}.png`)
		}
		////////////////////////////////////////////////////////////////////

		// Sprites
		this.load.spritesheet('moran', 'sprites/player/moran.png', 
		{ frameWidth: 31, frameHeight: 56} );

		this.load.spritesheet('coil', 'sprites/enemies/tesla/coil.png', 
		{ frameWidth: 30, frameHeight: 30 });

		this.load.spritesheet('cannon', 'sprites/enemies/tesla/cannoncopter_48x48.png', 
		{ frameWidth: 48, frameHeight: 48 });

		this.load.spritesheet('cannon_part', 'sprites/enemies/tesla/cannoncopter_particle_14x14.png', 
		{ frameWidth: 14, frameHeight: 14 });

		this.load.image('legs', 'sprites/enemies/tesla/legs-luthor.png');

		// Backgrounds
		this.load.image('bg0', 'bg0.png')
		this.load.image('bg1', 'bg1.png')
		this.load.image('bg2', 'bg2.png')

		// Tilemaps
		this.load.image('platform', 'h_block.png');
		this.load.image('tileset', 'tilesets/tesla_tileset.png');
		this.load.tilemapTiledJSON('tesla', 'tilemaps/test_tilemap_0.json');
	}
}