import GrayscalePipeline from "../assets/shaders/grayPipeline";

class Bootstrap extends Phaser.Scene {
    constructor() {
        super({
            key: "Bootstrap",
        });
    }

    preload() {
        // Load level on complete
        this.load.on("complete", () => {
            this.scene.start("Menu");
        });

        this.load.path = "../assets/";

        // Menu Title
        this.load.image("menu_title", "menu_title.png");

        // Audio
        this.load.audio("coin_sfx", "audio/coin.ogg");
        this.load.audio("jump_sfx", "audio/jump.ogg");
        this.load.audio("hurt_sfx", "audio/hurt.ogg");
        this.load.audio("song", "audio/edzes.mp3");

        // Sprites
        this.load.spritesheet("moran", "sprites/player/moran.png", {
            frameWidth: 80,
            frameHeight: 72,
        });

        this.load.json('coins_anim', 'sprites/collectables/coins_anim.json');
        this.load.atlas('coins', 'sprites/collectables/coins.png', 'sprites/collectables/coins_atlas.json');

        this.load.json('powerups_anim', 'sprites/collectables/powerups_anim.json');
        this.load.atlas('powerups', 'sprites/collectables/powerups.png', 'sprites/collectables/powerups_atlas.json');

        this.load.json("coil_anim", "sprites/enemies/tesla/coil_anim.json");
        this.load.atlas("coil", "sprites/enemies/tesla/coil.png", "sprites/enemies/tesla/coil_atlas.json");

        this.load.spritesheet(
            "cannon",
            "sprites/enemies/tesla/cannoncopter_48x48.png",
            { frameWidth: 48, frameHeight: 48 }
        );

        this.load.spritesheet(
            "cannon_part",
            "sprites/enemies/tesla/cannoncopter_particle_14x14.png",
            {
                frameWidth: 14,
                frameHeight: 14,
            }
        );

        this.load.json('legs_anim', 'sprites/enemies/tesla/legs_anim.json');
        this.load.atlas('legs', 'sprites/enemies/tesla/legs.png', 'sprites/enemies/tesla/legs_atlas.json');

        this.load.spritesheet(
            "vroomba",
            "sprites/enemies/tesla/vroomba_48x32.png",
            { frameWidth: 48, frameHeight: 32 }
        );

        this.load.spritesheet(
            "vroomba_part",
            "sprites/enemies/tesla/vroomba_particle_32x32.png",
            { frameWidth: 32, frameHeight: 32 }
        );

        this.load.json('explosion_anim', 'sprites/enemies/explosion_anim.json');
        this.load.atlas('explosion', 'sprites/enemies/explosion.png', 'sprites/enemies/explosion_atlas.json');

        // this.load.spritesheet(
        //     "explosion",
        //     "sprites/enemies/explosions_50x52.png",
        //     { frameWidth: 50, frameHeight: 52 }
        // );

        this.load.json('checkpoint_anim', 'sprites/collectables/checkpoint_anim.json');
        this.load.atlas('checkpoint', 'sprites/collectables/checkpoint.png', 'sprites/collectables/checkpoint_atlas.json');

        this.load.json('portal_anim', 'sprites/collectables/portal_anim.json');
        this.load.atlas('portal', 'sprites/collectables/portal.png', 'sprites/collectables/portal_atlas.json');

        // Particles
        this.load.image(
            "explosion-particle0",
            "sprites/enemies/explosion-particles0_16x16.png"
        );
        this.load.image(
            "explosion-particle1",
            "sprites/enemies/explosion-particles1_16x16.png"
        );
        this.load.image(
            "explosion-particle2",
            "sprites/enemies/explosion-particles2_16x16.png"
        );

        // Backgrounds
        for (let i = 0; i < 4; i++) {
            this.load.image(`bg${i}`, `bg${i}.png`);
        }

        // Tilemaps
        this.load.image("tileset", "tilesets/tesla_tileset_extruded.png");
        this.load.tilemapTiledJSON(
            "tesla_level0",
            "tilemaps/tesla_tilemap_0.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level1",
            "tilemaps/tesla_tilemap_1.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level2",
            "tilemaps/tesla_tilemap_2.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level3",
            "tilemaps/tesla_tilemap_3.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level4",
            "tilemaps/tesla_tilemap_4.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level5",
            "tilemaps/tesla_tilemap_5.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level6",
            "tilemaps/tesla_tilemap_6.json"
        );

        // Font
        this.load.json("numbers_json", "font_numbers.json");
        this.load.image("numbers", "font_numbers.png");

        // HUD
        this.load.image("hud-heart", "sprites/hud/hud_heart.png");
        this.load.image("hud-piece", "sprites/hud/hud_piece.png");
        this.load.image("hud-portal", "sprites/hud/hud_portal.png");
        this.load.image("fuel-bar", "sprites/hud/fuel_bar.png");
        this.load.image("fuel-frame", "sprites/hud/fuel_frame.png");

        // Shaders
        (this.game.renderer as any).addPipeline(
            "Grayscale",
            new GrayscalePipeline(this.game)
        );
    }
}

export default Bootstrap;