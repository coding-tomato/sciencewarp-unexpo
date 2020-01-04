export default class Bootstrap extends Phaser.Scene {
    constructor() {

	super({
	    	key: "Bootstrap"
		});
    }

    public preload(): void {

		// Load level on complete
		this.load.on('complete', () => {
			this.scene.start("Menu");
		});

		this.load.path = '../assets/';

		// Menu Title
		this.load.image('menu_title', 'menu_title.png');

		// Audio
		this.load.audio('coin_sfx', 'audio/coin.ogg');
		this.load.audio('jump_sfx', 'audio/jump.ogg');
		this.load.audio('hurt_sfx', 'audio/hurt.ogg');
		this.load.audio('song', 'audio/edzes.mp3');

		// Sprites
		this.load.spritesheet('moran', 'sprites/player/moran.png', 
				{ frameWidth: 80, frameHeight: 72} );

		this.load.spritesheet('coins', 'sprites/collectables/pieces.png', {
			frameWidth: 18,
			frameHeight: 17
		});

		this.load.spritesheet('powerups', 'sprites/collectables/powerups.png', {
			frameWidth: 24,
			frameHeight: 24
		});

		this.load.spritesheet('coil', 'sprites/enemies/tesla/coil.png', 
			      { frameWidth: 30, frameHeight: 30 });

		this.load.spritesheet('cannon', 'sprites/enemies/tesla/cannoncopter_48x48.png', 
			      { frameWidth: 48, frameHeight: 48 });
	
		this.load.spritesheet(
            'cannon_part', 
            'sprites/enemies/tesla/cannoncopter_particle_14x14.png', 
			{ 
                frameWidth: 14, 
                frameHeight: 14 
            }
        );

        this.load.spritesheet('legs', 'sprites/enemies/tesla/legs-luthor_49x45.png', { frameWidth: 49, frameHeight: 45 });

        this.load.spritesheet('vroomba', 'sprites/enemies/tesla/vroomba_48x32.png', { frameWidth: 48, frameHeight: 32 });
        
        this.load.spritesheet('vroomba_part', 'sprites/enemies/tesla/vroomba_particle_32x32.png', {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('explosion', 'sprites/enemies/explosions_50x52.png', {frameWidth: 50, frameHeight: 52});

        this.load.spritesheet('checkpoint', 'sprites/collectables/checkpoint.png', {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('portal', 'sprites/collectables/portal.png', {frameWidth: 32, frameHeight: 32});

        // Particles
        this.load.image('explosion-particle0', 'sprites/enemies/explosion-particles0_16x16.png');
        this.load.image('explosion-particle1', 'sprites/enemies/explosion-particles1_16x16.png');
        this.load.image('explosion-particle2', 'sprites/enemies/explosion-particles2_16x16.png');

        // Backgrounds
        for (let i=0; i < 4; i++) {
            this.load.image(`bg${i}`, `bg${i}.png`)
        }

        // Tilemaps
        this.load.image('tileset', 'tilesets/tesla_tileset_extruded.png');
		this.load.tilemapTiledJSON('tesla_level0', 'tilemaps/tesla_tilemap_0.json');
		this.load.tilemapTiledJSON('tesla_level1', 'tilemaps/tesla_tilemap_1.json');
		this.load.tilemapTiledJSON('tesla_level2', 'tilemaps/tesla_tilemap_2.json');
		this.load.tilemapTiledJSON('tesla_level3', 'tilemaps/tesla_tilemap_3.json');
		this.load.tilemapTiledJSON('tesla_level4', 'tilemaps/tesla_tilemap_4.json');

		// Font
		this.load.json('numbers_json', 'font_numbers.json');
		this.load.image('numbers', 'font_numbers.png');
    }
}
