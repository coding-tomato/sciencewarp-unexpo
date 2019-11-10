import "phaser";

import Player from "../objects/player";

import Coil from "../objects/enemies/coil";
import Cannon from "../objects/enemies/cannon";
import Legs from "../objects/enemies/legs";
import Vroomba from "../objects/enemies/vroomba";

import MapHelper from "../helpers/mapHelper";

import Platform from "../objects/hazards/h_plat";
import Disappear from "../objects/hazards/h_diss";

import { Second, Entrance } from "../utils/text";
import { addOrTakeLives } from "../utils/libplayer";

export default class TestLevel extends Phaser.Scene {

	private player: Player;
	private mapManager: MapHelper;
	private allSprites: any[];
	private firstCollide: Phaser.Physics.Arcade.Collider;
	private debugControl: any[];
	private debugGraphics: any;

	constructor() {
		super({
			key: "TestLevel"
		});

		this.allSprites = [];
	}

	public create(): void {

		// Create Map Manager
		const teslaMapData = new Phaser.Tilemaps.MapData({ name: "tesla" });
		this.mapManager = new MapHelper(
			this,
			teslaMapData,
			"tesla_tileset",
			"tileset"
		);

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

		this.allSprites.push(this.player);

		// Controls
		this.debugControl = [];

		this.debugControl[0] = this.input.keyboard.addKey("F2");
		this.debugControl[1] = this.input.keyboard.addKey("G");

		///////////////////////////////////////////

		this.mapManager.setStaticLayers(["Ground"], this.allSprites);
		this.player.setFuelHUD();

		this.firstCollide = this.physics.add.overlap(
			this.player,
			this.allSprites,
			this.hurt,
			null,
			this
		);

		this.cameras.main.startFollow(this.player).setLerp(0.15);

		// Launch scene Dialog Box
		this.scene.launch("DialogBox", { text: [Entrance] });
		///////////////////////////////

		////////
		///// EVENTS /////////

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
	}

	public update(time: number, delta: number): void {
		this.allSprites.forEach(element => {
			if (element.active) {
				element.update(delta);
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

	private hurt(element1: any, element2: any) {
		if (element1.state != "DASHING") {
			this.cleanCollider(this.firstCollide);

			console.log(`You had ${this.player.lives} lives.`);
			addOrTakeLives(this.player, -1);
			console.log(`Now you have ${this.player.lives} lives.`);

			this.events.emit("attack");
		}

		if (element1.state == "DASHING") {
			this.cleanCollider(this.firstCollide);
			console.log("Am DASHING!");
			element2.destroy();
		}
	}

	private cleanCollider(collider: any) {
		this.physics.world.removeCollider(collider);

		this.time.delayedCall(
			1500,
			() => {
				this.firstCollide = this.physics.add.overlap(
					this.player,
					this.allSprites,
					this.hurt,
					null,
					this
				);
			},
			[],
			this
		);
	}
}
