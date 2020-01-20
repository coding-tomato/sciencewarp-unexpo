import "phaser";

const enum State {
    WALKING = "WALKING",
    FLYING = "FLYING",
    DASHING = "DASHING"
}

interface Fuel {
    vFuel: number;
    maxFuel: number;
    rateGetFuel: number;
    rateLoseFuel: number;
    bonusFuel: number;
    fuelBox: Phaser.GameObjects.Graphics;
    fuelBar: Phaser.GameObjects.Graphics;
}

interface Player {
    lives: number;
}

const MAX_LIVES = 5;

class Player extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    private currentScene: Phaser.Scene;
    //Debug
    public debug: Phaser.GameObjects.Text;
    public isColliding: boolean;
    //Powerup conditionals
    public powerup: {
        dashActive: boolean;
        jumpActive: boolean;
        jetpActive: boolean;
    }
    //Variables
    private acceleration: number;
    public name: string;
    public maxSpeed: number;
    private friction: number;
    private direction: {
        x: number;
        y: number;
    };
    private lastDirection: {
        x: number;
        y: number;
    };
    private isJumping: boolean;
    private jetAcceleration: number;
    private jetMaxSpeed: number;
    private jumpHeight: number;
    //Input
    private keys: Phaser.Types.Input.Keyboard.CursorKeys;
    // Fuel
    private fuel: Fuel;
    // Scene
    private level: any;
    // Animation
    private anim_json: Phaser.Types.Animations.JSONAnimations;
    private dash_cool: boolean;
    private fuelBarFade: any;

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.currentScene = params.scene;

        //Debug
        this.debug = this.currentScene.add
            .text(5, 5, "")
            .setScrollFactor(0)
            .setDepth(1)
            .setFontSize(14)
            .setBackgroundColor("rgba(0,0,0,0.3)");

        this.debug.setVisible(false);

        // Input
        this.keys = this.currentScene.input.keyboard.createCursorKeys();
        this.name = "player";

        // Powerup initialization
        this.powerup = {
            dashActive: false,
            jumpActive: false,
            jetpActive: false
        };

        // Lives
        this.lives = MAX_LIVES;

        // Audio
        this.currentScene.sound.add('jump_sfx', {
            loop: false,
            volume: 0.2,
		});

        // State
        this.state = State.WALKING;
        this.dash_cool = false;
        this.isColliding = false;

        // Movement variables
        this.jumpHeight = -300;
        this.acceleration = 300;
        this.maxSpeed = 150;
        this.friction = 400;
        this.direction = {
            x: 0,
            y: 0
        };
        this.lastDirection = {
            x: 0,
            y: 0
        };
        this.isJumping = false;
        this.jetAcceleration = -15;
        this.jetMaxSpeed = -150;
        this.gameShutdown();

        // Fuel
        this.fuel = {
            vFuel: 2000,
            maxFuel: 2000,
            rateGetFuel: 1000,
            rateLoseFuel: 5,
            bonusFuel: 10,
            fuelBox: this.currentScene.add.graphics(),
            fuelBar: this.currentScene.add.graphics()
        };

        this.createAnimations();
        this.play("idle", true);

        // Settings
        this.scene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        this.body.setSize(12, 32);
        this.body.setOffset(35, 13);

        // Level
        this.level = this.currentScene.scene.get("TestLevel");

        this.fuelBarFade = this.currentScene.tweens.add({
			targets: this.level.hud.fuelBar,
			alpha: 0.5,
			paused: true,
			duration: 1000,
			onComplete: () => {
                this.level.hud.fuelBar.setVisible(false);
                //this.level.hud.fuelBar.setAlpha(1, 1, 1, 1);
			}
		});
    }

    // Cycle
    public update(delta: number): void {
        // All controls go here
        this.handleInput();
        // Movement
        this.handleMovement(delta);
        // Check for fuel
        this.handleFuel(delta);
        // Check for constant animations
        this.handleAnimations();
        // Debug functions
        this.debugUpdate(delta);
        // Is player out of lives? If so, quit the game
        this.checkIfAlive();
        // Audio
        this.handleAudio();
        // XD
        
        if (this.state.valueOf() != "FLYING" && this.level.hud.fuelBar.visible) {
            this.fuelBarFade.play();
            //this.level.hud.fuelBar.setVisible(false);
        }
    }

    private handleAudio() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            //this.currentScene.sound.play('jump_sfx');
        }
    }

    private handleInput() {
        
            if (this.keys.right.isDown) {
                this.direction.x = 1;
            } else if (this.keys.left.isDown) {
                this.direction.x = -1;
            } else {
                this.direction.x = 0;
            }

            if (this.keys.up.isDown) {
                this.direction.y = -1;
            } else {
                this.direction.y = 0;
            }

        if (!this.dash_cool) {
            if (Phaser.Input.Keyboard.JustDown(this.keys.space) &&
                this.powerup.dashActive &&
                !this.dash_cool &&
                this.fuel.vFuel > 0) {

                this.dash();
            }
        }    
    }

    private dash() {
        // Check Player's Facing
        let facing = this.flipX ? -1 : 1;

        // Avoid Movement in Y
        this.body.setVelocityY(0);
        this.body.allowGravity = false;

        // Set Player's Velocity and Dash Cooldown
        const DASH_VELOCITY = 500;

        this.body.setVelocityX(DASH_VELOCITY * facing);
        this.state = State.DASHING;
        this.dash_cool = true;

        // Restore Player's State after X Seconds
        const DASH_RESTORE = 300

        this.currentScene.time.delayedCall(DASH_RESTORE, () => {
            this.state = State.WALKING;
            this.body.allowGravity = true;
            this.body.velocity.x /= 2;
        }, [], this);

        // Restore Dash Cooldown after X Seconds
        const DASH_COOLDOWN = 350;

        this.currentScene.time.delayedCall(DASH_COOLDOWN, () => {
            this.dash_cool = false;
        }, [], this);

    }

    private handleMovement(delta: number) {

        //Air control
        switch (this.state) {

            case State.WALKING:
                this.walkUpdate();
                if (this.direction.y === -1 && this.body.blocked.down && !this.body.blocked.up) {
                    this.isJumping = true;
                    this.currentScene.sound.play('jump_sfx', { volume: 0.2 });
                    this.body.setVelocityY(this.powerup.jumpActive ? (this.jumpHeight - 100) : this.jumpHeight);
                    this.lastDirection.y = this.direction.y;
                }
                //If player hasn't let go jump button, he won't fly
                else if ((this.lastDirection.y === -1) && 
                        (this.direction.y === 0) &&
                        this.isJumping) {
                    this.isJumping = false;
                    this.body.setVelocityY(this.body.velocity.y / 2);
                }
                else if(this.powerup.jetpActive) {
                    //Player will start flying if:
                    //(a) releases jump button
                    if  ((this.lastDirection.y === 0) && 
                        (this.direction.y === -1)) {
                        this.state = State.FLYING;
                    }
                    // (b) starts falling
                    else if ((this.body.velocity.y > 0) &&
                            (this.direction.y === -1) &&
                            (this.lastDirection.y === 0)) {
                        this.state = State.FLYING;
                    }
                }
                
                this.lastDirection.y = this.direction.y;
                break;

            //Flying
            case State.FLYING:
                this.walkUpdate();
                if (this.body.blocked.down) {
                    this.state = State.WALKING;
                }
                if (this.direction.y === -1 && this.fuel.vFuel > 0) {
                    
                    this.level.hud.fuelBar.setVisible(true);

                    this.body.velocity.y +=
                        this.jetAcceleration * Phaser.Math.CeilTo(delta, 0);
                    if (this.body.velocity.y < this.jetMaxSpeed)
                        this.body.setVelocityY(this.jetMaxSpeed);
                }
                break;

            //Dashing
            case State.DASHING:
                break;
        }
    }

    private handleAnimations() {
        if (this.direction.x !== 0) this.setFlipX(this.direction.x === -1);
        switch (this.state) {

            case State.WALKING:
                if (this.body.velocity.y > 200) this.play("fall", true);
                else if ( this.body.velocity.y < 0 ) {
                    const jumpType = this.powerup.jumpActive ? "jet_jump" : "jumping";
                    if(this.anims.getCurrentKey() !== jumpType) 
                        this.play(jumpType, true);
                }
                else if (this.body.blocked.down && this.body.velocity.x === 0)
                    this.play("idle", true);
                else if (this.body.blocked.down) this.play("run", true);
                break;

            case State.FLYING:
                if (this.direction.y === -1 && this.fuel.vFuel > 0) {
                    this.play("jetpack", true);
                }
                else if (this.body.velocity.y > 0)
                    this.play("jetpack_fall", true);
                else this.play("jetpack_still");
                break;

            case State.DASHING:
                this.play("dash", true);
                break;
        }
    }

    private handleFuel(delta: number): void {
        switch (this.state) {
            case State.WALKING: {
                if (
                    this.fuel.vFuel < this.fuel.maxFuel &&
                    this.body.blocked.down
                ) {
                    this.fuel.vFuel +=
                        this.fuel.rateGetFuel *
                        parseInt((delta * 0.1).toFixed());
                    this.fuel.vFuel.toFixed(0);
                    if (this.fuel.vFuel > 2000) {
                        this.fuel.vFuel = 2000;
                    }
                }
                break;
            }
            case State.FLYING: {
                if (this.fuel.vFuel > 0 && this.direction.y === -1) {
                    this.fuel.vFuel -=
                        this.fuel.rateLoseFuel *
                        parseInt((delta * 0.1).toFixed());
                    this.fuel.vFuel.toFixed(0);
                    if (this.fuel.vFuel < 0) {
                        this.fuel.vFuel = 0;
                    }

                    this.level.hud.fuelBar.setCrop(
                        0,
                        0,
                        820 * (this.fuel.vFuel / this.fuel.maxFuel),
                        300
                    )
                }
                break;
            }
            case State.DASHING: 
                this.fuel.vFuel = 0; 
                break;
        }
    }
    

    private walkUpdate(): void {
        if (this.body.blocked.down) {
            this.isJumping = false;
        }
        // Lateral movement
        // If the player turns X direction, velocity splits in half
        if (this.lastDirection.x !== this.direction.x) {
            this.body.setVelocityX(this.body.velocity.x / 2);
            this.lastDirection.x = this.direction.x;
        }
        if (this.direction.x !== 0) {
            this.body.setAccelerationX(this.acceleration * this.direction.x);
            // Fix velocity
            if (Math.abs(this.body.velocity.x) > this.maxSpeed)
                this.body.setVelocityX(this.maxSpeed * this.direction.x);
        } else {
            this.body.setAccelerationX(0);
            this.body.setDragX(this.friction);
        }
    }

    //Debug
    public debugUpdate(delta: number): void {
        const r = Phaser.Math.RoundTo;
        const debugUpdate: string[] = [
            `State:     ${this.state}`,
            `Position:  x: ${r(this.body.x, 0)} y: ${r(this.body.y, 0)}`,
            `Fuel:      ${this.fuel.vFuel}`,
            `Lives:     ${this.lives}              `,
            `FPS:       ${Phaser.Math.FloorTo(1000/delta, 0)}`,
            `Coins:     ${this.scene.data.get(`coins`)}`,
            `Temp_coins:${this.scene.data.get(`temp_coins`)}`
        ];
        this.debug.setText(debugUpdate);
    }

    private checkIfAlive(): void {
        if (this.lives <= 0) {
            this.currentScene.events.emit("gameOver");
        }
    }

    private gameShutdown(): void {
        // Player has lost all of its five lives
        this.currentScene.events.once("gameOver", () => {
            this.currentScene.scene.stop("TestLevel");
        });
    }

    public setFuel(amount: number): void {
        this.fuel.vFuel = amount;
    }

    //Create animations
    public createAnimations() {
        this.currentScene.anims.create({
            key: "idle",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 0,
                end: 3
            }),
            frameRate: 12,
            repeat: -1
        });
        this.currentScene.anims.create({
            key: "run",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 4,
                end: 11
            }),
            frameRate: 12,
            repeat: -1
        });
        this.currentScene.anims.create({
            key: "jetpack",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 12,
                end: 15
            }),
            frameRate: 12,
            repeat: -1
        });
        this.currentScene.anims.create({
            key: "jetpack_still",
            frames: [{ key: "moran", frame: 16 }],
            frameRate: 12,
            repeat: -1
        });
        this.currentScene.anims.create({
            key: "jetpack_fall",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 16,
                end: 17
            }),
            frameRate: 12,
            repeat: -1
        });
        this.currentScene.anims.create({
            key: "jumping",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 18,
                end: 21
            }),
            frameRate: 12,
            repeat: 0
        });
        this.currentScene.anims.create({
            key: "fall",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 22,
                end: 23
            }),
            frameRate: 12,
            repeat: -1
        });
        this.currentScene.anims.create({
            key: "dash",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 24,
                end: 29
            }),
            frameRate: 15,
            repeat: 0
        });
        this.currentScene.anims.create({
            key: "jet_jump",
            frames: this.currentScene.anims.generateFrameNumbers("moran", {
                start: 30,
                end: 34
            }),
            frameRate: 12,
            repeat: 0
        });
    }
}

export default Player;
