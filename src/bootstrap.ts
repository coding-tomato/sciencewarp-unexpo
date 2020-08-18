import GrayscalePipeline from '../assets/shaders/grayPipeline';

class Bootstrap extends Phaser.Scene {
  constructor() {
    super({
      key: 'Bootstrap',
    });
  }

  preload() {
    // Load level on complete
    this.load.on('complete', () => {
      this.scene.start('Menu');
    });

    this.load.path = '../assets/';

    // ---- Menu Background
    this.load.image('menu_background', 'menu_title/menu_background.png');
    this.load.image('menu_title_science', 'menu_title/title_science.png');
    this.load.image('menu_title_warp', 'menu_title/title_warp.png');

    // - Start menu
    this.load.spritesheet(
      'menu_press_any_button',
      'menu_title/title_anyButtonToStart_400x45.png',
      { frameWidth: 400, frameHeight: 45 },
    );
    // - Home menu
    this.load.spritesheet(
      'start_journey',
      'menu_title/title_startJourney_227x32.png',
      { frameWidth: 227, frameHeight: 32 },
    );
    this.load.spritesheet('top_score', 'menu_title/title_topScore_126x49.png', {
      frameWidth: 126,
      frameHeight: 49,
    });
    this.load.spritesheet('options', 'menu_title/title_options_120x36.png', {
      frameWidth: 120,
      frameHeight: 36,
    });
    // - Level selector
    this.load.spritesheet(
      'levels',
      'menu_title/title_levelSelector_48x48.png',
      { frameWidth: 48, frameHeight: 48 },
    );
    this.load.spritesheet('backButton', 'menu_title/backButton_16x16.png', {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Audio
    this.load.audio('coin_sfx', 'audio/coin.ogg');
    this.load.audio('jump_sfx', 'audio/jump.ogg');
    this.load.audio('hurt_sfx', 'audio/hurt.ogg');
    this.load.audio('song', 'audio/edzes.mp3');

    // Sprites
    this.load.json('moran_anim', 'sprites/player/moran_anim.json');
    this.load.atlas(
      'moran',
      'sprites/player/moran.png',
      'sprites/player/moran_atlas.json',
    );

    this.load.json('coins_anim', 'sprites/collectables/coins_anim.json');
    this.load.atlas(
      'coins',
      'sprites/collectables/coins.png',
      'sprites/collectables/coins_atlas.json',
    );

    this.load.json('powerups_anim', 'sprites/collectables/powerups_anim.json');
    this.load.atlas(
      'powerups',
      'sprites/collectables/powerups.png',
      'sprites/collectables/powerups_atlas.json',
    );

    this.load.json('coil_anim', 'sprites/enemies/tesla/coil_anim.json');
    this.load.atlas(
      'coil',
      'sprites/enemies/tesla/coil.png',
      'sprites/enemies/tesla/coil_atlas.json',
    );

    this.load.spritesheet(
      'cannon',
      'sprites/enemies/tesla/cannoncopter_48x48.png',
      { frameWidth: 48, frameHeight: 48 },
    );

    this.load.spritesheet(
      'cannon_part',
      'sprites/enemies/tesla/cannoncopter_particle_14x14.png',
      {
        frameWidth: 14,
        frameHeight: 14,
      },
    );

    this.load.json('legs_anim', 'sprites/enemies/tesla/legs_anim.json');
    this.load.atlas(
      'legs',
      'sprites/enemies/tesla/legs.png',
      'sprites/enemies/tesla/legs_atlas.json',
    );

    this.load.spritesheet(
      'vroomba',
      'sprites/enemies/tesla/vroomba_48x32.png',
      { frameWidth: 48, frameHeight: 32 },
    );

    this.load.spritesheet(
      'vroomba_part',
      'sprites/enemies/tesla/vroomba_particle_32x32.png',
      { frameWidth: 32, frameHeight: 32 },
    );

    this.load.json('explosion_anim', 'sprites/enemies/explosion_anim.json');
    this.load.atlas(
      'explosion',
      'sprites/enemies/explosion.png',
      'sprites/enemies/explosion_atlas.json',
    );

    this.load.json(
      'checkpoint_anim',
      'sprites/collectables/checkpoint_anim.json',
    );
    this.load.atlas(
      'checkpoint',
      'sprites/collectables/checkpoint.png',
      'sprites/collectables/checkpoint_atlas.json',
    );

    this.load.json('portal_anim', 'sprites/collectables/portal_anim.json');
    this.load.atlas(
      'portal',
      'sprites/collectables/portal.png',
      'sprites/collectables/portal_atlas.json',
    );

    // Particles
    this.load.image(
      'explosion-particle0',
      'sprites/enemies/explosion-particles0_16x16.png',
    );
    this.load.image(
      'explosion-particle1',
      'sprites/enemies/explosion-particles1_16x16.png',
    );
    this.load.image(
      'explosion-particle2',
      'sprites/enemies/explosion-particles2_16x16.png',
    );

    // Backgrounds
    for (let i = 0; i < 4; i++) {
      this.load.image(`bg${i}`, `bg${i}.png`);
    }

    // Tilemaps
    this.load.image('tileset', 'tilesets/tesla_tileset_extruded.png');
    for (let i = 0; i < 9; i++) {
      this.load.tilemapTiledJSON(
        `tesla_level${i}`,
        `tilemaps/tesla_tilemap_${i}.json`,
      );
    }

    // Font
    this.load.json('numbers_json', 'font_numbers.json');
    this.load.image('numbers', 'font_numbers.png');

    // HUD
    this.load.image('hud-heart', 'sprites/hud/hud_heart.png');
    this.load.image('hud-piece', 'sprites/hud/hud_piece.png');
    this.load.image('hud-portal', 'sprites/hud/hud_portal.png');
    this.load.image('fuel-bar', 'sprites/hud/fuel_bar.png');
    this.load.image('fuel-frame', 'sprites/hud/fuel_frame.png');

    // Shaders
    (this.game.renderer as any).addPipeline(
      'Grayscale',
      new GrayscalePipeline(this.game),
    );
  }
}

export default Bootstrap;
