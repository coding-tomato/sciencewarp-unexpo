

const State = {
    WALKING: "WALKING",
    FLYING: "FLYING",
    DASHING: "DASHING"
}

export default class PlayerInput extends Phaser.Scene {

  init(data) { 
    this.player = data.player;
  }

  create() {
    this.controls = this.input.keyboard.createCursorKeys();
  }

  update(delta) {
    let direction = this.player.direction;

    if (this.controls.right.isDown) {
      direction.x = 1;
    } else if (this.controls.left.isDown) {
      direction.x = -1;
    } else {
      direction.x = 0;
    }

    if (this.controls.up.isDown) {
      direction.y = -1;
    } else {
      direction.y = 0;
    }

    if (this.player.isDashReady() && this.player.hasPowerup("dashActive")) {
        if ((Phaser.Input.Keyboard.JustDown(this.controls.space)) && this.player.canDash()) {
        this.player.dash();
        this.player.halveFuel();
      }
    }
  }
}
/*
   handleMovement() {
    switch(this.player.state) {
      case State.WALKING:
        this.move();
        this.jump();
        break;
      case State.FLYING:
        this.move();
        this.fly();
        break;
    }
  }

   move() {
    let body    = this.player.body;
    let dir     = this.player.direction;
    let lastDir = this.player.lastDirection;

    if (body.blocked.down) {
      this.player.isJumping = false;
    }

    // Lateral Movement
    // If player turns around in the X axis, velocity splits in half
    if (lastDir.x !== dir.x) {
      body.setVelocityX(body.velocity.x / 2);
      lastDir.x = dir.x;
    }

    if (dir.x !== 0) {
      body.setAccelerationX(this.player.aceleration * dir.x);
      // Fix velocity
      if (Math.abs(body.velocity.x) > this.player.maxSpeed) {
        body.setVelocityX(this.player.maxSpeed * dir.x);
      }
    } else {
      body.setAccelerationX(0);
      body.setDragX(this.player.friction);
    }
  }

   jump() {
    let body    = this.player.body;
    let dir     = this.player.direction;
    let lastDir = this.player.lastDirection;

    // Player should only be able to jump while on a surface
    let isPlayerOnFloor       = body.blocked.down && !body.blocked.up;
    let isJumpButtonPressed   = lastDir.y === -1 && dir.y === 0 && this.player.isJumping;
    let isJumpButtonReleased  = lastDir.y === 0 && dir.y === -1;
    let isPlayerFalling       = body.velocity.y > 0 && dir.y === -1 && lastDir.y === 0;

    if (isPlayerOnFloor) {
      this.player.setJump(true);
      this.player.currentScene.sound.play('jump_sfx', { volume: 0.2 });
      // If player has the Jump powerup active they get a bonus of -100
      body.setVelocityY(this.player.hasPowerup("jump") ? (this.player.jumpHeight - 100) : this.player.jumpHeight);

    } else if (isJumpButtonPressed) {
      this.player.setJump(false);
      body.setVelocityY(body.velocity.y / 2);

    } else if (this.player.hasPowerup("jetpack")) {
      if (isJumpButtonReleased || isPlayerFalling) {
        this.player.state = State.FLYING; 
      }
    }

    lastDir.y = dir.y;
  }

  fly(delta) {
    let body = this.player.body;
    let hud = this.player.level.hud;
    let maxSpeed = this.player.jetMaxSpeed;

    if (body.blocked.down) {
      this.player.state = State.WALKING;
    }

    if (this.player.direction.y === -1 && this.player.fuel.vFuel > 0) {
      hud.fuelBar.setVisible(true);
      hud.fuelFrame.setVisible(true);
      body.velocity.x += this.player.jetAcceleration * Phaser.Math.CeilTo(delta, 0);

      if (body.velocity.y < maxSpeed) {
        body.setVelocityY(maxSpeed);
      }
    }
  }

  dash() {
    let body  = this.player.body;
    let state = this.player.state;
    let scene = this.player.currentScene;

    body.setVelocity(0);        // Stop movement
    body.allowGravity = false;  // in Y

    let dashVelocity = 500;

    // To dash in the correct direction
    let facing = this.player.flipX ? -1 : 1;

    // Start dash
    body.setVelocityX(dashVelocity * facing);
    state = State.DASHING;
    this.player.setDashCooldown(true);

    // Stop player collisions with enemies
    // scene.scene.pause("PH_01");

    // End dash and return to normal after dashTimer
    let dashTimer = 300;
    scene.time.delayedCall(dashTimer, () => {
      state = State.WALKING;
      body.allowGravity = true;
      body.setVelocityX(body.velocity.x / 2);
      // scene.scene.resume("PH_01");
    }, [], this);

    // Make possible to dash again after dashCooldown
    let dashCooldown = dashTimer + 50;
    scene.time.delayedCall(dashCooldown, () => {
      this.player.setDashCooldown(false);
    }, [], this);
  }
*/
