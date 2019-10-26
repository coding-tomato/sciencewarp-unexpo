import "phaser"

const enum State {
    WALKING = "WALKING",
    FLYING = "FLYING"
}

interface Fuel {
    vFuel: number,
    maxFuel: number,
    rateGetFuel: number,
    rateLoseFuel: number,
    bonusFuel: number,
    fuelBox: Phaser.GameObjects.Graphics;
    fuelBar: Phaser.GameObjects.Graphics;
}

export default class Player extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    private currentScene: Phaser.Scene;
    //Debug
    private debugActive : boolean;
    private debug: {
        velocity: Phaser.GameObjects.Text,
        acceleration: Phaser.GameObjects.Text
        state: Phaser.GameObjects.Text,
        direction: Phaser.GameObjects.Text,
        fuel: Phaser.GameObjects.Text

    };
    //Variables
    private acceleration: number;
    public name: string
    private maxSpeed: number;
    private friction: number;
    private direction: {
        x: number,
        y: number
    };
    private lastDirection: {
        x: number,
        y: number
    }
    private jetAcceleration: number;
    private jetMaxSpeed: number;
    private jumpHeight: number;
    //Input
    private keys: Phaser.Types.Input.Keyboard.CursorKeys;
    // Fuel
    private fuel: Fuel;
    // Animation
    private anim_json: Phaser.Types.Animations.JSONAnimations

    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.currentScene = params.scene
        //Debug
        this.debugActive = true;
        this.debug = {
            state: this.currentScene.add.text(5,5, "State: ")
                .setScrollFactor(0)
                .setDepth(1)
                .setFontSize(14)
                .setVisible(this.debugActive),
            velocity: this.currentScene.add.text(5,20, "Velocity: ")
                .setScrollFactor(0)
                .setDepth(1)
                .setFontSize(14)
                .setVisible(this.debugActive),
            acceleration: this.currentScene.add.text(5,35, "Acceleration: ")
                .setScrollFactor(0)
                .setFontSize(14)
                .setDepth(1)
                .setVisible(this.debugActive),
            direction: this.currentScene.add.text(5,50, "Direction: ")
                .setScrollFactor(0)
                .setDepth(1)
                .setFontSize(14)
                .setVisible(this.debugActive),
            fuel: this.currentScene.add.text(5,65, "Fuel: ")
                .setScrollFactor(0)
                .setDepth(1)
                .setFontSize(14)
                .setVisible(this.debugActive)
        }

        //Input
        this.keys = this.currentScene.input.keyboard.createCursorKeys();

        this.name = "player";

        // State
        this.state = State.WALKING;

        //Movement variables
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
        }
        this.jetAcceleration = -15;
        this.jetMaxSpeed = -150;

        //Fuel
        this.fuel = {
            vFuel: 2000,
            maxFuel: 2000,
            rateGetFuel: 1000,
            rateLoseFuel: 5,
            bonusFuel: 10,
            fuelBox: this.currentScene.add.graphics(),
            fuelBar: this.currentScene.add.graphics(),
        };
        this.setFuelHUD();

        //Animations
        this.currentScene.anims.create({ key:"idle", frames: this.currentScene.anims.generateFrameNumbers('moran', {start: 0, end: 3}), frameRate: 10, repeat: -1 })
        this.currentScene.anims.create({ key:"run", frames: this.currentScene.anims.generateFrameNumbers('moran', {start: 4, end: 11}), frameRate: 12, repeat: -1 })
        this.currentScene.anims.create({ key:"jetpack", frames: this.currentScene.anims.generateFrameNumbers('moran', {start: 12, end: 15}), frameRate: 16, repeat: -1 })
        this.currentScene.anims.create({ key:"jetpack_still", frames: [{key: 'moran', frame: 16}], frameRate: 16, repeat: -1 })
        this.currentScene.anims.create({ key:"jetpack_fall", frames: this.currentScene.anims.generateFrameNumbers('moran', {start: 16, end: 17}), frameRate: 20, repeat: -1 })
        this.currentScene.anims.create({ key:"jumping", frames: this.currentScene.anims.generateFrameNumbers('moran', {start: 18, end: 21}), frameRate: 10, repeat: 0 })
        this.currentScene.anims.create({ key:"fall", frames: this.currentScene.anims.generateFrameNumbers('moran', {start: 22, end: 23}), frameRate: 20, repeat: -1 })

        this.play('idle', true)

        //Settings
        this.scene.add.existing(this);
        this.currentScene.physics.world.enable(this);
        this.body.setSize(12,32)
        this.body.setOffset(8,4)
    }

    //Cycle
    public update(delta: number): void {
        this.handleInput();
        this.handleMovement(delta);
        this.handleFuel(delta);
        this.handleAnimations();
        this.debugUpdate();
    }

    private handleInput() {
        if(this.keys.right.isDown)     { this.direction.x = 1  }
        else if(this.keys.left.isDown) { this.direction.x = -1 }
        else { this.direction.x = 0 }

        if(this.keys.up.isDown) { this.direction.y = -1 }
        else { this.direction.y = 0 }
    }

    private handleMovement(delta: number /*, player_state: State*/) {
        // Lateral movement
        // If the player turns X direction, velocity splits in half
        if(this.lastDirection.x !== this.direction.x) {
            this.body.setVelocityX(this.body.velocity.x/2);
            this.lastDirection.x = this.direction.x;
        }
        if(this.direction.x !== 0) {
            this.body.setAccelerationX(this.acceleration * this.direction.x);
            // Fix velocity
            if (Math.abs(this.body.velocity.x) > this.maxSpeed) this.body.setVelocityX(this.maxSpeed * this.direction.x);
        } else {
            this.body.setAccelerationX(0);
            this.body.setDragX(this.friction);
        }
        //Air control
        switch(this.state) {
            case State.WALKING:
                if(this.direction.y === -1 && this.body.blocked.down) {
                    this.body.setVelocityY(this.jumpHeight);
                    this.lastDirection.y = this.direction.y;
                }
                switch(true){
                    //If player hasn't let go jump button, he won't fly
                    case (this.lastDirection.y === -1 && this.direction.y === -1): break;
                    case (this.lastDirection.y === -1 && this.direction.y === 0): 
                        this.body.setVelocityY(this.body.velocity.y/2); 
                        break;
                    //Player will start flying if: 
                    //(a) releases jump button 
                    case (this.lastDirection.y === 0 && this.direction.y === -1):
                        this.state = State.FLYING;
                        break;
                    // (b) starts falling
                    case (this.body.velocity.y > 0 && this.direction.y === -1 && this.lastDirection.y === 0):
                        this.state = State.FLYING
                        break;
                }
                this.lastDirection.y = this.direction.y;
                break;
            //Flying
            case State.FLYING:
                if(this.body.blocked.down) { this.state = State.WALKING }
                if(this.direction.y === -1 && this.fuel.vFuel > 0) {
                    this.body.velocity.y += this.jetAcceleration * delta * 0.1;
                    if (this.body.velocity.y < this.jetMaxSpeed) this.body.setVelocityY(this.jetMaxSpeed)
                }
                break;
        }
    }

    private handleAnimations() {
        if(this.direction.x !== 0) this.setFlipX(this.direction.x === -1);
        switch(this.state) {
            case State.WALKING:
                if(this.body.velocity.y > 200) this.play('fall', true)
                else if(this.body.velocity.y < 0 && this.anims.getCurrentKey() !== 'jumping') this.play('jumping', true)
                else if(this.body.blocked.down && this.body.velocity.x === 0) this.play('idle', true)
                else if (this.body.blocked.down) this.play('run', true)
                break;
            case State.FLYING:
                if(this.direction.y === -1 && this.fuel.vFuel > 0) this.play('jetpack', true)
                else if(this.body.velocity.y > 0) this.play('jetpack_fall', true)
                else this.play('jetpack_still')
        }
    }

    private handleFuel(delta: number): void {
        switch(this.state) {
            case State.WALKING: {
                if (this.fuel.vFuel < this.fuel.maxFuel && this.body.blocked.down) {
                    this.fuel.vFuel += this.fuel.rateGetFuel * parseInt((delta*0.1).toFixed());
                    this.fuel.vFuel.toFixed(0);
                    if(this.fuel.vFuel > 2000) { this.fuel.vFuel = 2000 }
                }
                break;
            }
            case State.FLYING: {
                if (this.fuel.vFuel > 0 && this.direction.y === -1) {
                    this.fuel.vFuel -= this.fuel.rateLoseFuel * parseInt((delta*0.1).toFixed());
                    this.fuel.vFuel.toFixed(0);
                    if(this.fuel.vFuel < 0) { this.fuel.vFuel = 0 }
                }
                break;
            }
        }
    }

    //HUD
    public setFuelHUD(): void {
        const black: Phaser.Display.Color = Phaser.Display.Color.HexStringToColor('#0000');
        this.fuel.fuelBox.fillStyle(black.color, 0.5);
        this.fuel.fuelBox.setScrollFactor(0, 0);

        const {width, height} = this.currentScene.cameras.main;
        
        this.fuel.fuelBox.fillRect(width, 0, -20, height);
    }

    //Debug
    public debugUpdate(): void {
        this.debug.state.setText(`State: ${this.state}`)
        this.debug.velocity.setText(`Velocity: X ${this.body.velocity.x.toFixed(1)} Y ${this.body.velocity.y.toFixed(1)}`)
        this.debug.acceleration.setText(`Acceleration: X ${this.body.acceleration.x.toFixed(1)} Y ${this.body.acceleration.y.toFixed(1)}`)
        this.debug.direction.setText(`Direction: X ${this.direction.x} Y ${this.direction.y}`)
        this.debug.fuel.setText(`Fuel: ${this.fuel.vFuel}`)
    }

}
