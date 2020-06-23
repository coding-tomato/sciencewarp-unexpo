import "phaser";

// Enum for player's state
const State = {
    // Default state
    WALKING: 0,
    // Player is either jumping or using a jetpack
    FLYING:  1,
    // Player is dashing
    DASHING: 2,
};

interface Fuel {
    vFuel: number;
    maxFuel: number;
    rateGetFuel: number;
    rateLoseFuel: number;
    bonusFuel: number;
    fuelBox: Phaser.GameObjects.Graphics;
    fuelBar: Phaser.GameObjects.Graphics;
}

class Player extends Phaser.GameObjects.Sprite {
    // We declare the 'body' to avoid a Typescript bug
    body: Phaser.Physics.Arcade.Body;
    // Helper object that shows helpful debug information. Press F2 to toggle on/off
    debug: Phaser.GameObjects.Text;

    lives = 5;              // Start with max amount of lives
    state = State.WALKING;  // Start on the floor
    powerup = {             // Start without powerups
        dash: false,
        jump: false,
        jetpack: false,
    };
    
    dash = {                // Object with all dash-related members and methods
        cooldown: false,    // Start with dash out of cooldown
        velocity: 500,      
        reset: {
            state: 300,
            dash: 350,
        },
        restore(player, timer, func) {
            player.scene.time.delayedCall(timer, func, [], this);
        },
        getFacing(player) {
            return player.flipX ? -1 : 1;
        },
        freeze(player) {
            player.body.setVelocityY(0);
            player.body.allowGravity = false;
        },
        activate(player) {
            player.body.setVelocityX(this.velocity * this.getFacing(player));
            player.state = State.DASHING;
            this.cooldown = true;
            this.freeze(player);
            this.restore(player, this.reset.state, () => player.state = State.WALKING);
            this.restore(player, this.reset.dash, () => this.cooldown = false);
            this.restore(player, this.reset.state, () => { 
                player.body.velocity.x /= 2;
                player.body.allowGravity = true;
            });
        },
    };

    isColliding = false;

    direction = { 
        x: 0, 
        y: 0 
    };

    lastDirection = { 
        x: 0, 
        y: 0, 
    };

    jet = {
        acceleration: -15,
        maxSpeed: -150,
    };

    jump = {
        state: false,
        height: -300,
    };

    //Variables
    acceleration = 300;
    maxSpeed = 150;
    friction = 400;

    name = "player";
  
    //Input
    keys: Phaser.Types.Input.Keyboard.CursorKeys;
    wkeys: any;
    // Fuel
    fuel: Fuel;
    // Scene
    level: any;
    // Animation
    anim_json: Phaser.Types.Animations.JSONAnimations;
    fuelBarFade: any;
    fuelFrameFade: any;

    constructor(params) {
        super(params.scene, params.x, params.y, params.key, params.frame);

        //Debug
        this.debug = this.scene.add
            .text(5, 5, "")
            .setScrollFactor(0)
            .setDepth(1)
            .setFontSize(14)
            .setBackgroundColor("rgba(0,0,0,0.3)");

        this.debug.setVisible(false);

        // Input
        this.keys = this.scene.input.keyboard.createCursorKeys();
        this.wkeys = this.scene.input.keyboard.addKeys('W, A, D');

        // Powerup initialization

        // Audio
        this.scene.sound.add('jump_sfx', {
            loop: false,
            volume: 0.2,
        });

        this.gameShutdown();

        // Fuel
        this.fuel = {
            vFuel: 2000,
            maxFuel: 2000,
            rateGetFuel: 1000,
            rateLoseFuel: 5,
            bonusFuel: 10,
            fuelBox: this.scene.add.graphics(),
            fuelBar: this.scene.add.graphics()
        };

        this.scene.anims.fromJSON(this.scene.cache.json.get('moran_anim'));
        this.play("idle", true);

        // Settings
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setSize(12, 32);
        this.body.setOffset(35, 13);

        // Level
        this.level = this.scene.scene.get("TestLevel");

        this.fuelBarFade = this.scene.tweens.add({
            targets: this.level.hud.fuelBar,
            alpha: 0.5,
            paused: true,
            duration: 500,
            onComplete: () => {
                this.level.hud.fuelBar.setVisible(false);
                //this.level.hud.fuelBar.setAlpha(1, 1, 1, 1);
            }
        });

        this.fuelFrameFade = this.scene.tweens.add({
            targets: this.level.hud.fuelFrame,
            alpha: 0.5,
            paused: true,
            duration: 500,
            onComplete: () => {
                this.level.hud.fuelFrame.setVisible(false);
                //this.level.hud.fuelBar.setAlpha(1, 1, 1, 1);
            }
        });
    }

    // Cycle
    update(delta: number) {
        // All controls go here
        this.handleInput();
        // Movement
        this.handleMovement(delta);
        // Check for fuel
        this.handleFuel(delta);
        // Check for constant animations
        this.handleAnimations();
        // Debug functions0
        this.debugUpdate(delta);
        // Is player out of lives? If so, quit the game
        this.checkIfAlive();
        // Audio
        this.handleAudio();
        // XD

        if (this.state.valueOf() == State.WALKING &&
            (this.body.velocity.y == 0) &&
            this.level.hud.fuelBar.visible) {
            this.fuelBarFade.play();
            this.fuelFrameFade.play();
            //this.level.hud.fuelBar.setVisible(false);
        }
    }

    handleAudio() {
        if (Phaser.Input.Keyboard.JustDown(this.keys.up)) {
            //this.scene.sound.play('jump_sfx');
        }
    }

    handleInput() {

        if (this.keys.right.isDown || this.wkeys.D.isDown) {
            this.direction.x = 1;
        } else if (this.keys.left.isDown || this.wkeys.A.isDown) {
            this.direction.x = -1;
        } else {
            this.direction.x = 0;
        }

        if (this.keys.up.isDown || this.wkeys.W.isDown) {
            this.direction.y = -1;
        } else {
            this.direction.y = 0;
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.space) &&
            this.powerup.dash &&
            !this.dash.cooldown &&
            this.fuel.vFuel > 320) {
            console.log(`Dashed`);
            this.dash.activate(this);
            this.fuel.vFuel = this.fuel.vFuel / 2;
        }
    }

    handleMovement(delta: number) {

        //Air control
        switch (this.state) {

            case State.WALKING:
                this.walkUpdate();
                if (this.direction.y === -1 && this.body.blocked.down && !this.body.blocked.up) {
                    this.jump.state = true;
                    this.scene.sound.play('jump_sfx', { volume: 0.2 });
                    this.body.setVelocityY(this.powerup.jump ? (this.jump.height - 100) : this.jump.height);
                    this.lastDirection.y = this.direction.y;
                }
                //If player hasn't let go jump button, he won't fly
                else if ((this.lastDirection.y === -1) &&
                        (this.direction.y === 0) &&
                        this.jump.state) {
                    this.jump.state = false;
                    this.body.setVelocityY(this.body.velocity.y / 2);
                }
                else if(this.powerup.jetpack) {
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
                    this.level.hud.fuelFrame.setVisible(true);

                    this.body.velocity.y +=
                        this.jet.acceleration * Phaser.Math.CeilTo(delta, 0);
                    if (this.body.velocity.y < this.jet.maxSpeed)
                        this.body.setVelocityY(this.jet.maxSpeed);
                }
                break;

            //Dashing
            case State.DASHING:
                break;
        }
    }

    handleAnimations() {
        if (this.direction.x !== 0) this.setFlipX(this.direction.x === -1);
        switch (this.state) {

            case State.WALKING:
                if (this.body.velocity.y > 200) this.play("fall", true);
                else if ( this.body.velocity.y < 0 ) {
                    const jumpType = this.powerup.jump ? "jet_jump" : "jumping";
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

    handleFuel(delta: number) {
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
                        64 * (this.fuel.vFuel / this.fuel.maxFuel),
                        18
                    )
                }
                break;
            }
            case State.DASHING:
                this.level.hud.fuelBar.setCrop(
                    0,
                    0,
                    64 * (this.fuel.vFuel / this.fuel.maxFuel),
                    18
                )
                break;
        }
    }


    walkUpdate() {
        if (this.body.blocked.down) {
            this.jump.state = false;
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
    debugUpdate(delta: number) {
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

    checkIfAlive() {
        if (this.lives <= 0) {
            this.scene.events.emit("gameOver");
        }
    }

    gameShutdown() {
        // Player has lost all of its five lives
        this.scene.events.once("gameOver", () => {
            if (this.scene.scene.isPaused("Menu")) {
                this.scene.scene.resume("Menu");
            }

            if (this.scene.scene.isActive("DialogBox")) {
                this.scene.scene.stop("DialogBox");
            }
            this.scene.scene.stop("TestLevel");
        });
    }

    setFuel(amount: number) {
        this.fuel.vFuel = amount;
    }

    //Create animations
    createAnimations() {
        this.scene.anims.create({
            key: "idle",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 0,
                end: 3
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: "run",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 4,
                end: 11
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jetpack",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 12,
                end: 15
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jetpack_still",
            frames: [{ key: "moran", frame: 16 }],
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jetpack_fall",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 16,
                end: 17
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: "jumping",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 18,
                end: 21
            }),
            frameRate: 12,
            repeat: 0
        });
        this.scene.anims.create({
            key: "fall",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 22,
                end: 23
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: "dash",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 24,
                end: 29
            }),
            frameRate: 15,
            repeat: 0
        });
        this.scene.anims.create({
            key: "jet_jump",
            frames: this.scene.anims.generateFrameNumbers("moran", {
                start: 30,
                end: 34
            }),
            frameRate: 12,
            repeat: 0
        });
    }
}

export default Player;