import "phaser";

import Player from "../objects/player";

import Coil from "../objects/enemies/coil";
import Cannon from "../objects/enemies/cannon";
import Legs from "../objects/enemies/legs";
import Vroomba from "../objects/enemies/vroomba";

import MapHelper from "../helpers/mapHelper";

import Coins from "../objects/collectables/coins";
import Powerup from "../objects/collectables/power_jump";
import Checkpoint from "../objects/collectables/checkpoint";
import Portal from "../objects/collectables/portal";

import { Second, Entrance } from "../utils/text";
import { addOrTakeLives } from "../utils/libplayer";

export default class TestLevel extends Phaser.Scene {
    // Player
	private player: Player;
    private checkpointPos: {
        x: number,
        y: number
    }
    // Map manager
	private mapManager: MapHelper;
    private currentLevel: number;
    private inputDisabled: boolean;
    private warping: boolean;
    // Colliders
	private enemyCollider: Phaser.Physics.Arcade.Collider;
    private projCollider: Phaser.Physics.Arcade.Collider;
    // Debug
	private debugControl: any[];
	private debugGraphics: any;
    // Map objects
    private allCheckpoints: Checkpoint[];
	private allCoins: any[];
	private allPowerups: any[];
    private allSprites: any[];
    private allProj: any[];
    private allPortals: any[];
    // Audio
    private music: any;

	constructor() {
		super({
			key: "TestLevel"
		});

		this.allSprites = [];
		this.allCoins = [];
        this.allProj = [];
	}

	public create(): void {
        this.cameras.main.fadeOut(0);
		this.data.set('temp_coins', 0);

		// Create Map Manager
		const teslaMapData = new Phaser.Tilemaps.MapData({ name: `tesla_level${this.currentLevel}` });
		this.mapManager = new MapHelper(
			this,
			teslaMapData,
			"tesla_tileset",
			"tileset"
		);

		// Audio
        this.music = this.sound.add('song', {
			loop: true
		});
    
        if(!this.music.isPlaying) 
            this.music.play({
                volume: 0.1
            });

		this.sound.add('coin_sfx', {
			loop: false,
			volume: 0.05
		});

		this.sound.add('hurt_sfx', {
			loop: false,
			volume: 0.05
		});

		// Create Player
		this.player = this.mapManager.createPlayer("Player", "p_respawn");

		// Create Enemies 
		// Hold all sprites in a variable
		// For easier collision
		this.allSprites = this.mapManager.createObjects(
            "Enemies", 
            "enemy", 
            {
                coil: Coil,
                cannon: Cannon,
                vroomba: Vroomba,
                legs: Legs
            });
		
		// Controls
		this.debugControl = [];
		this.debugControl[0] = this.input.keyboard.addKey("F2");
		this.debugControl[1] = this.input.keyboard.addKey("G");

		///////////////////////////////////////////

		this.mapManager.setStaticLayers(["Ground"], this.allSprites);
        this.mapManager.setSpriteCollision(this.player);
        
        // Creating game objects

		this.allCoins = this.mapManager.createObjects(
			"Coins",
			"collect",
			{
				coins: Coins
			}
		);

		this.allPowerups = this.mapManager.createObjects(
			"Powerups",
			"powerup",
			{
				powerups: Powerup
			}
		);

        this.allCheckpoints = this.mapManager.createObjects(
			"Player",
			"checkpoint",
			{
				checkpoint: Checkpoint
			}
		);

        this.allPortals = this.mapManager.createObjects(
			"Player",
			"portal",
			{
				portal: Portal
			}
		);
        // Setting up collision callbacks

		this.enemyCollider = this.physics.add.overlap(
			this.player,
			this.allSprites,
			this.hurtEnemy,
			null,
			this
		);
        
        this.projCollider = this.physics.add.overlap(
			this.player,
			this.allProj,
			this.hurtProj,
			null,
			this
		);

		this.physics.add.overlap(
			this.player,
			this.allCoins,
			this.getCoin,
			null,
			this
		);

		this.physics.add.overlap(
			this.player,
			this.allPowerups,
			this.getPowerup,
			null,
			this
		);

        this.physics.add.overlap(
			this.player,
			this.allCheckpoints,
			this.getPowerup,
			null,
			this
		);
        
        this.physics.add.overlap(
			this.player,
			this.allPortals,
			this.getPortal,
			null,
			this
		);

		this.cameras.main.startFollow(this.player).setLerp(0.15);

		// Launch scene Dialog Box
		// this.scene.launch("DialogBox", { text: [Entrance] });

		this.events.on("attack", () => {
			this.tweens.add({
				targets: this.player,
				alpha: 0.1,
				duration: 50,
				repeat: 15,
				yoyo: true,
				onComplete: () => {
					this.player.setAlpha(1, 1, 1, 1);
				}
			});
		});

		this.debugGraphics = this.physics.world.createDebugGraphic();
        this.debugGraphics.destroy();

		this.cameras.main.once('camerafadeoutcomplete', (camera: any) => {
			camera.fadeIn(500);
		})

        this.warping = false;
        this.inputDisabled = false;
	}

	public update(time: number, delta: number): void {
		if (this.player.body.y > this.mapManager.map.heightInPixels + 10) {
            let checkpoint = this.checkpointPos
            let teleport = this.add.sprite(checkpoint.x, checkpoint.y + 20, `checkpoint`);
            
            this.anims.create({
                key: `teleport`,
                frames: this.anims.generateFrameNumbers(`checkpoint`,
                {
                    start: 11, end: 14
                }),
                frameRate: 12,
                repeat: 0
            });
            
            this.time.delayedCall(100, () => teleport.anims.play(`teleport`), [], this);
            
            teleport.on( `animationcomplete`, 
                (animation: any, frame: any) => { 
                    teleport.destroy() 
                }
            );

            this.player.x = checkpoint.x;
            this.player.y = checkpoint.y;
            this.cleanCollider();
            this.events.emit(`attack`);
        }
        
        this.mapManager.parallaxUpdate();
       
        if(!this.inputDisabled) this.player.update(delta);

        this.allProj.forEach(element => {
            if (element.active) {
				element.update(delta);
			}
		});

        this.allSprites.forEach(element => {
            if (element.active) {
				element.update(delta);
			}
		});

		this.allCoins.forEach(element => {
			if (element.active) {
				element.update(delta);
			}
		});

		this.allPowerups.forEach(element => {
			if (element.active) {
				element.update(delta);
			}
		});
        
        this.allCheckpoints.forEach(element => {
			if (element.active) {
				element.update();
			}
		});

		if (Phaser.Input.Keyboard.JustDown(this.debugControl[0])) {
			if (this.debugGraphics.active) {
				this.debugGraphics.destroy();
				this.player.debug.setVisible(false);
			} else {
				this.player.debug.setVisible(true);
				this.debugGraphics = this.physics.world.createDebugGraphic();
			}
		}

		if (Phaser.Input.Keyboard.JustDown(this.debugControl[1])) {
			addOrTakeLives(this.player, -5);
		}
	}

    public init(data: any): void {
        this.currentLevel = data.level;
        this.data.set(`coins`, data.coins);
    }

    private hurt(): any {
        this.player.maxSpeed = 80;
        this.sound.play('hurt_sfx');
		console.log(`You had ${this.player.lives} lives.`);
		addOrTakeLives(this.player, -1);
		console.log(`Now you have ${this.player.lives} lives.`);
        this.time.delayedCall(1000, () => {
            if(this.player !== null) this.player.maxSpeed = 150
        }, [], this)
    }

	private hurtEnemy(element1: any, element2: any) {
		if (element1.state != "DASHING") {
			this.cleanCollider();
            this.hurt();
			this.events.emit("attack");
		}

		if (element1.state == "DASHING") {
            let explosion = this.add.sprite(element2.x, element2.y, `explosion`);

            for (let i=0; i<3; i++) {
                let particle = this.add.particles(`explosion-particle${i}`);
                particle.setDepth(-1);
                let emitter = particle.createEmitter({
                    lifespan: 2000,
                    angle: { min: 240, max: 300},
                    speed: { min: 200, max: 300},
                    quantity: {min: 1, max: 2},
                    rotate: { start: 0, end: 720, ease: `Back.easeOut` },
                    gravityY: 800,
                    on: false
                });
                emitter.emitParticleAt(element2.x, element2.y);
            }

            this.anims.create({
                key: `explode`,
                frames: this.anims.generateFrameNumbers(`explosion`,
                {
                    start: 0, end: 7
                }),
                frameRate: 12,
                repeat: 0
            });

            explosion.anims.play(`explode`)
            
            explosion.on( `animationcomplete`, 
                    (animation: any, frame: any) => { 
                        explosion.destroy() 
                    }
                );

			element2.destroy();
		}
	}

    private hurtProj(element1: any, element2: any) {
		this.cleanCollider();
        this.hurt();
		this.events.emit("attack");
	}

	private cleanCollider() {
		this.physics.world.removeCollider(this.enemyCollider);
        this.physics.world.removeCollider(this.projCollider);

		this.time.delayedCall(
			1000,
			() => {
				this.enemyCollider = this.physics.add.overlap(
					this.player,
					this.allSprites,
					this.hurtEnemy,
					null,
					this
				);
                this.projCollider = this.physics.add.overlap(
					this.player,
					this.allProj,
					this.hurtProj,
					null,
					this
				);
			},
			[],
			this
		);
	}

	private getCoin(element1: any, element2: any) {
		element2.vanish();
		this.data.set('temp_coins', this.data.get('temp_coins') + 1);
		this.sound.play('coin_sfx');
	}

	private getPowerup(element1: any, element2: any) {
		element2.vanish(element1);
	}

    private getPortal(element1: any, element2: any) {
        let next_level = element2.getLevel();
       
        console.log(next_level)

        if (this.warping) return 

        this.allPortals.forEach((element, index) => element.vanish());

        this.music.destroy();

        this.warping = true;
        this.inputDisabled = true;
		this.time.delayedCall(600, () => {
                this.scene.restart({ 
                    level: next_level,
                    coins: this.data.get(`temp_coins`) + this.data.get(`coins`)
		        })
            }
            , [], this);
        this.cameras.main.fadeOut(200); 
    }
}
