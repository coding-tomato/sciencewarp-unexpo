import GrayscalePipeline from "./shaders/grayPipeline.js";

class Bootstrap extends Phaser.Scene {
    constructor() { 
        super({
            key: "Bootstrap",
        });
    }

    preload() {
        this.load.path = "../assets/";        // Easier path typing

        this.load.on("complete", () => {          
            this.scene.start("Menu");     // Ensure all assets are loaded
        });

        ////////////////////////////////////////////////
        //--------------------------------------------//
        ////////////////////////////////////////////////

        this.game.renderer.addPipeline(
            "Grayscale",
            new GrayscalePipeline(this.game)
        );


        // Menu Title
        this.load.image("menu_title", "images/menu/im_menu_title.png");


        this.load.audio("coin_sfx", "audio/au_coin.ogg");
        this.load.audio("jump_sfx", "audio/au_jump.ogg");
        this.load.audio("hurt_sfx", "audio/au_hurt.ogg");
        this.load.audio("song", "audio/au_theme.mp3");


        // Sprites
        this.load.spritesheet("moran", "sprites/player/moran.png", {
            frameWidth: 80,
            frameHeight: 72,
        });

        this.load.spritesheet("coins", "sprites/collectables/coins.png", {
            frameWidth: 18,
            frameHeight: 17,
        });

        this.load.spritesheet("powerups", "sprites/collectables/powerups.png", {
            frameWidth: 24,
            frameHeight: 24,
        });

        this.load.spritesheet("coil", "sprites/enemies/coil/coil.png", {
            frameWidth: 30,
            frameHeight: 30,
        });

        this.load.spritesheet(
            "cannon",
            "sprites/enemies/cannoncopter/cannoncopter_48x48.png",
            { frameWidth: 48, frameHeight: 48 }
        );

        this.load.spritesheet(
            "cannon_part",
            "sprites/enemies/cannoncopter/cannoncopter_particle_14x14.png",
            {
                frameWidth: 14,
                frameHeight: 14,
            }
        );

        this.load.spritesheet(
            "legs",
            "sprites/enemies/legs/legs-luthor_49x45.png",
            { frameWidth: 49, frameHeight: 45 }
        );

        this.load.spritesheet(
            "vroomba",
            "sprites/enemies/vroomba/vroomba_48x32.png",
            { frameWidth: 48, frameHeight: 32 }
        );

        this.load.spritesheet(
            "vroomba_part",
            "sprites/enemies/vroomba/vroomba_particle_32x32.png",
            { frameWidth: 32, frameHeight: 32 }
        );

        this.load.spritesheet(
            "explosion",
            "sprites/enemies/explosions/explosion_50x52.png",
            { frameWidth: 50, frameHeight: 52 }
        );

        this.load.spritesheet(
            "checkpoint",
            "sprites/collectables/checkpoint.png",
            { frameWidth: 32, frameHeight: 32 }
        );

        this.load.spritesheet("portal", "sprites/collectables/portal.png", {
            frameWidth: 32,
            frameHeight: 32,
        });

        // Particles
        this.load.image(
            "explosion-particle0",
            "sprites/enemies/explosions/explosion-particles0_16x16.png"
        );
        this.load.image(
            "explosion-particle1",
            "sprites/enemies/explosions/explosion-particles1_16x16.png"
        );
        this.load.image(
            "explosion-particle2",
            "sprites/enemies/explosions/explosion-particles2_16x16.png"
        );

        // Backgrounds
        for (let i = 0; i < 4; i++) {
            this.load.image(`bg${i}`, `images/im_background_${i}.png`);
        }

        // Tilemaps
        this.load.image("tileset", "images/tilesets/im_tesla_tileset_extruded.png");
        this.load.tilemapTiledJSON(
            "tesla_level0",
            "tilemaps/tm_tesla_0.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level1",
            "tilemaps/tm_tesla_1.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level2",
            "tilemaps/tm_tesla_2.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level3",
            "tilemaps/tm_tesla_3.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level4",
            "tilemaps/tm_tesla_4.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level5",
            "tilemaps/tm_tesla_5.json"
        );
        this.load.tilemapTiledJSON(
            "tesla_level6",
            "tilemaps/tm_tesla_6.json"
        );

        // Font
        this.load.json("numbers_json", "sprites/fonts/font_numbers.json");
        this.load.image("numbers", "sprites/fonts/font_numbers.png");

        // HUD
        this.load.image("hud-heart", "images/hud/im_hud_heart.png");
        this.load.image("hud-piece", "images/hud/im_hud_piece.png");
        this.load.image("hud-portal", "images/hud/im_hud_portal.png");
        this.load.image("fuel-bar", "images/hud/im_hud_fuel_bar.png");
        this.load.image("fuel-frame", "images/hud/im_hud_fuel_frame.png");
        
    }
}

export default Bootstrap;
