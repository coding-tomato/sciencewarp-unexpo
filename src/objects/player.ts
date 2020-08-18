import 'phaser';
import Sabana from '../helpers/sabana';
// Enum for player's state
const State = {
  // Default state
  WALKING: 0,
  // Player is either jumping or using a jetpack
  FLYING: 1,
  // Player is dashing
  DASHING: 2,
};

class Player extends Phaser.GameObjects.Sprite {
  // We declare the 'body' to avoid a Typescript bug
  body: Phaser.Physics.Arcade.Body;
  // Helper object that shows helpful debug information. Press F2 to toggle on/off
  debug: Phaser.GameObjects.Text;
  // Player controls
  keys: Phaser.Types.Input.Keyboard.CursorKeys;
  wkeys: any;
  // Level player is in. Used to get methods from the latter
  level = (this.scene as any).scene.get('TestLevel');
  // Tweens to dissappear fuel HUD

  lives = 5; // Start with max amount of lives
  state = State.WALKING; // Start on the floor
  powerup = {
    // Start without powerups
    dash: true,
    jump: true,
    jetpack: true,
  };

  dash = {
    // Object with all dash-related members and methods
    cooldown: false, // Start with dash out of cooldown
    velocity: 500,
    reset: {
      state: 300,
      dash: 350,
    },
    freeze(player): void {
      player.body.setVelocityY(0);
      player.body.setAllowGravity(false);
    },
    unfreeze(player): void {
      player.body.setVelocityX(player.body.velocity.x / 2);
      player.body.setAllowGravity(true);
    },
    putOnCooldown(player, time): void {
      this.cooldown = true;
      player.scene.time.delayedCall(
        time,
        () => (this.cooldown = false),
        [],
        this,
      );
    },
    onCooldown(): boolean {
      return this.cooldown;
    },
    activate(player): void {
      this.putOnCooldown(player, this.reset.dash);
      this.freeze(player);
      player.body.setVelocityX(this.velocity * player.getFacing());
      player.scene.time.delayedCall(
        this.reset.state,
        () => this.unfreeze(player),
        [],
        this,
      );
    },
  };

  fuelBarFade: any;
  fuelFrameFade: any;

  isColliding = false;

  direction = {
    x: 0,
    y: 0,
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

  // Returns current horizontal unit vector
  getFacing(): number {
    return this.flipX ? -1 : 1;
  }

  canDash(): boolean {
    return (
      this.powerup.dash &&
      !this.dash.onCooldown() &&
      !this.isColliding &&
      this.fuel.getAmount() > 320
    );
  }

  //Variables
  acceleration = 300;
  maxSpeed = 150;
  friction = 400;

  // For use with Tiled
  name = 'player';

  fuel = {
    amount: 2000,
    max: 2000,
    lossRate: 5,
    loss(delta: number): number {
      return this.lossRate * Phaser.Math.FloorTo(delta * 0.1);
    },
    refill() {
      this.amount = this.max;
    },
    halve() {
      this.amount /= 2;
    },
    update(delta: number) {
      this.amount -= this.loss(delta);
    },
    getAmount(): number {
      return this.amount;
    },
    getPercent(): number {
      return Phaser.Math.Percent(this.amount, 0, this.max);
    },
  };

  constructor(params) {
    super(params.scene, params.x, params.y, params.key, params.frame);

    Sabana.Init(this, this.scene).Sprite({ x: 12, y: 32 }, { x: 35, y: 13 });

    this.keys = this.scene.input.keyboard.createCursorKeys();
    this.wkeys = this.scene.input.keyboard.addKeys('W, A, D');

    this.scene.anims.fromJSON(this.scene.cache.json.get('moran_anim'));
    this.play('idle', true);

    this.scene.sound.add('jump_sfx', {
      loop: false,
      volume: 0.2,
    });

    //Debug
    this.debug = this.scene.add
      .text(5, 5, '')
      .setScrollFactor(0)
      .setDepth(1)
      .setFontSize(14)
      .setBackgroundColor('rgba(0,0,0,0.3)');

    this.debug.setVisible(false);

    this.fuelBarFade = this.scene.tweens.add({
      targets: this.level.hud.fuelBar,
      alpha: 0.5,
      paused: true,
      duration: 500,
      onComplete: () => {
        this.level.hud.fuelBar.setVisible(false);
        //this.level.hud.fuelBar.setAlpha(1, 1, 1, 1);
      },
    });

    this.fuelFrameFade = this.scene.tweens.add({
      targets: this.level.hud.fuelFrame,
      alpha: 0.5,
      paused: true,
      duration: 500,
      onComplete: () => {
        this.level.hud.fuelFrame.setVisible(false);
        //this.level.hud.fuelBar.setAlpha(1, 1, 1, 1);
      },
    });
  }

  // Cycle
  update(delta) {
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

    if (
      this.state.valueOf() == State.WALKING &&
      this.body.velocity.y == 0 &&
      this.level.hud.fuelBar.visible
    ) {
      this.fuelBarFade.play();
      this.fuelFrameFade.play();
      //this.level.hud.fuelBar.setVisible(false);
    }
  }

  handleInput() {
    if (this.keys.right.isDown || this.wkeys.D.isDown) this.direction.x = 1;
    else if (this.keys.left.isDown || this.wkeys.A.isDown)
      this.direction.x = -1;
    else this.direction.x = 0;

    if (this.keys.up.isDown || this.wkeys.W.isDown) this.direction.y = -1;
    else this.direction.y = 0;

    if (Phaser.Input.Keyboard.JustDown(this.keys.space) && this.canDash()) {
      // DEBUG: console.log(`Dashed`);
      this.switchState(this.state, State.DASHING, 300);
      this.dash.activate(this);
      this.fuel.halve();
    }
  }

  switchState(old, next, time): void {
    this.state = next;
    this.scene.time.delayedCall(
      time,
      () => {
        this.state = old;
      },
      [],
      this,
    );
  }

  handleMovement(delta) {
    //Air control
    switch (this.state) {
      case State.WALKING:
        this.walkUpdate();
        if (
          this.direction.y === -1 &&
          this.body.blocked.down &&
          !this.body.blocked.up
        ) {
          this.jump.state = true;
          this.scene.sound.play('jump_sfx', { volume: 0.2 });
          this.body.setVelocityY(
            this.powerup.jump ? this.jump.height - 100 : this.jump.height,
          );
          this.lastDirection.y = this.direction.y;
        }
        //If player hasn't let go jump button, he won't fly
        else if (
          this.lastDirection.y === -1 &&
          this.direction.y === 0 &&
          this.jump.state
        ) {
          this.jump.state = false;
          this.body.setVelocityY(this.body.velocity.y / 2);
        } else if (this.powerup.jetpack) {
          //Player will start flying if:
          //(a) releases jump button
          if (this.lastDirection.y === 0 && this.direction.y === -1) {
            this.state = State.FLYING;
          }
          // (b) starts falling
          else if (
            this.body.velocity.y > 0 &&
            this.direction.y === -1 &&
            this.lastDirection.y === 0
          ) {
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
        if (this.direction.y === -1 && this.fuel.getAmount() > 0) {
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
        this.level.hud.fuelBar.setVisible(true);
        this.level.hud.fuelFrame.setVisible(true);
        break;
    }
  }

  handleAnimations() {
    if (this.direction.x !== 0) this.setFlipX(this.direction.x === -1);
    switch (this.state) {
      case State.WALKING:
        if (this.body.velocity.y > 200) this.play('fall', true);
        else if (this.body.velocity.y < 0) {
          const jumpType = this.powerup.jump ? 'jet_jump' : 'jumping';
          if (this.anims.getCurrentKey() !== jumpType)
            this.play(jumpType, true);
        } else if (this.body.blocked.down && this.body.velocity.x === 0)
          this.play('idle', true);
        else if (this.body.blocked.down) this.play('run', true);
        break;

      case State.FLYING:
        if (this.direction.y === -1 && this.fuel.getAmount() > 0) {
          this.play('jetpack', true);
        } else if (this.body.velocity.y > 0) this.play('jetpack_fall', true);
        else this.play('jetpack_still');
        break;

      case State.DASHING:
        this.play('dash', true);
        break;
    }
  }

  handleFuel(delta) {
    switch (this.state) {
      case State.WALKING: {
        if (this.body.blocked.down) {
          this.fuel.refill();
        }
        break;
      }
      case State.FLYING: {
        if (this.fuel.getAmount() > 0 && this.direction.y === -1) {
          this.fuel.update(delta);

          this.level.hud.fuelBar.setCrop(0, 0, 64 * this.fuel.getPercent(), 18);
        }
        break;
      }
      case State.DASHING:
        this.level.hud.fuelBar.setCrop(0, 0, 64 * this.fuel.getPercent(), 18);
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
  debugUpdate(delta) {
    const r = Phaser.Math.RoundTo;
    const debugUpdate: string[] = [
      `State:     ${this.state}`,
      `Position:  x: ${r(this.body.x, 0)} y: ${r(this.body.y, 0)}`,
      `Fuel:      ${this.fuel.getAmount()}`,
      `Lives:     ${this.lives}              `,
      `FPS:       ${Phaser.Math.FloorTo(1000 / delta, 0)}`,
      `Coins:     ${this.scene.data.get(`coins`)}`,
      `Temp_coins:${this.scene.data.get(`temp_coins`)}`,
    ];
    this.debug.setText(debugUpdate);
  }
}

export default Player;

