import 'phaser';

import Player from '../objects/player';

import Coil from '../objects/enemies/coil';
import Cannon from '../objects/enemies/cannon';
import Legs from '../objects/enemies/legs';
import Vroomba from '../objects/enemies/vroomba';

import MapHelper from '../helpers/mapHelper';

import Coins from '../objects/collectables/coins';
import Powerup from '../objects/collectables/power_jump';
import Checkpoint from '../objects/collectables/checkpoint';
import Portal from '../objects/collectables/portal';

import { Second, Entrance } from '../utils/text';
import { addOrTakeLives } from '../utils/libplayer';

enum Power {
  Jump,
  Jetpack,
  Dash,
}

class TestLevel extends Phaser.Scene {
  // Player
  player: Player;
  checkpointPos: {
    x: number;
    y: number;
  };
  playerFadeTween: any;
  // Map manager
  mapManager: MapHelper;
  currentLevel: number;
  inputDisabled: boolean;
  warping: boolean;
  // Colliders
  enemyCollider: Phaser.Physics.Arcade.Collider;
  projCollider: Phaser.Physics.Arcade.Collider;
  // Debug
  debugControl: any[];
  debugGraphics: any;
  // Input
  pauseControl: any;
  // Map objects

  cluster = {
    checkpoints: [],
    powerups: [],
    coins: [],
    sprites: [],
    projectiles: [],
    portals: [],
  };

  allCheckpoints: Checkpoint[];
  allCoins: any[];
  allPowerups: any[];
  allSprites: any[];
  allProj: any[];
  allPortals: any[];

  // Audio
  music: any;
  coin: any;
  // HUD
  coinScore: any;
  lives: any;
  numbFont: Phaser.Types.GameObjects.BitmapText.RetroFontConfig;
  hud: {
    container?: any;
    lives?: any;
    coins?: {
      img?: any;
      text?: any;
    };
    fuelBar?: any;
    fuelFrame?: any;
    powerup?: {
      jump?: any;
      dash?: any;
      pack?: any;
    };
    level?: {
      img?: any;
      text?: any;
    };
  };

  constructor() {
    super({
      key: 'TestLevel',
    });

    this.allSprites = [];
    this.allCoins = [];
    this.allProj = [];
    this.hud = {
      coins: {},
      level: {},
      powerup: {},
    };
  }

  create() {
    this.cameras.main.fadeOut(0);

    if (this.data.get('levels') === undefined) {
      this.data.set('levels', 0);
    }

    if (this.data.get('coins') === undefined) {
      this.data.set('coins', 0);
    }

    this.data.set('temp_coins', 0);

    // Create Map Manager
    const teslaMapData = new Phaser.Tilemaps.MapData({
      name: `tesla_level${this.currentLevel}`,
    });

    this.mapManager = new MapHelper(
      this,
      teslaMapData,
      'tesla_tileset',
      'tileset',
    );

    this.numbFont = this.cache.json.get('numbers_json');

    this.cache.bitmapFont.add(
      'numbers',
      Phaser.GameObjects.RetroFont.Parse(this, this.numbFont),
    );

    this.pauseControl = this.input.keyboard.addKey('ENTER');
    // Audio
    this.coin = this.sound.add('coin_sfx', {
      loop: false,
    });

    this.sound.add('hurt_sfx', {
      loop: false,
    });

    // Controls
    this.debugControl = [];
    this.debugControl[0] = this.input.keyboard.addKey('F2');
    this.debugControl[1] = this.input.keyboard.addKey('G');

    ///////////////////////////////////////////

    // Creating game objects
    // Player
    this.player = this.mapManager.createPlayer('Player', 'p_respawn');
    this.player.lives = 5;

    // Enemies
    this.allSprites = this.mapManager.createObjects('Enemies', 'enemy', {
      coil: Coil,
      cannon: Cannon,
      vroomba: Vroomba,
      legs: Legs,
    });

    // Coins
    this.allCoins = this.mapManager.createObjects('Coins', 'collect', {
      coins: Coins,
    });

    // Powerups
    this.allPowerups = this.mapManager.createObjects('Powerups', 'powerup', {
      powerups: Powerup,
    });

    // Checkpoints
    this.allCheckpoints = this.mapManager.createObjects(
      'Player',
      'checkpoint',
      {
        checkpoint: Checkpoint,
      },
    );

    // Portals
    this.allPortals = this.mapManager.createObjects('Player', 'portal', {
      portal: Portal,
    });

    this.mapManager.setStaticLayers(['Ground'], this.allSprites);
    this.mapManager.setSpriteCollision(this.player);

    ///////////////////////////////////////////

    // Setting up collision callbacks
    // Collision with enemies
    this.enemyCollider = this.physics.add.overlap(
      this.player,
      this.allSprites,
      this.hurtEnemy,
      null,
      this,
    );

    // Collision with projectiles
    this.projCollider = this.physics.add.overlap(
      this.player,
      this.allProj,
      this.hurtProj,
      null,
      this,
    );

    // Collision with coins
    this.physics.add.overlap(
      this.player,
      this.allCoins,
      this.getCoin,
      null,
      this,
    );

    // Collision with powerups
    this.physics.add.overlap(
      this.player,
      this.allPowerups,
      this.getPowerup,
      null,
      this,
    );

    // Collision with checkpoints
    this.physics.add.overlap(
      this.player,
      this.allCheckpoints,
      this.getPowerup,
      null,
      this,
    );

    // Collision with portals
    this.physics.add.overlap(
      this.player,
      this.allPortals,
      this.getPortal,
      null,
      this,
    );

    this.cameras.main.startFollow(this.player).setLerp(0.15);

    // Launch scene Dialog Box
    this.scene.launch('DialogBox', {
      text: [Entrance, Second, 'Trust me.'],
    });

    // Tween
    // paused property true to avoid
    // tween to fire on create
    this.playerFadeTween = this.tweens.add({
      targets: this.player,
      alpha: 0.1,
      paused: true,
      duration: 50,
      repeat: 50,
      yoyo: true,
      onComplete: () => {
        this.player.setAlpha(1, 1, 1, 1);
      },
    });

    this.debugGraphics = this.physics.world.createDebugGraphic();
    this.debugGraphics.destroy();

    this.cameras.main.once('camerafadeoutcomplete', (camera: any) => {
      camera.fadeIn(500);
    });

    this.warping = false;
    this.inputDisabled = false;

    // UI
    this.anims.fromJSON(this.cache.json.get('explosion_anim'));
    this.createUI();
  }

  update(time: number, delta: number) {
    if (this.player.body.y > this.mapManager.map.heightInPixels + 10) {
      let checkpoint = this.checkpointPos;
      let teleport = this.add.sprite(
        checkpoint.x,
        checkpoint.y - 16,
        `checkpoint`,
      );

      this.anims.create({
        key: 'teleport',
        frames: this.anims.generateFrameNames('checkpoint', {
          prefix: 'checkpoint_',
          start: 11,
          end: 14,
        }),
        frameRate: 12,
        repeat: 0,
      });

      this.time.delayedCall(
        100,
        () => teleport.anims.play('teleport'),
        [],
        this,
      );

      teleport.on(`animationcomplete`, (animation: any, frame: any) => {
        teleport.destroy();
      });

      this.player.x = checkpoint.x;
      this.player.y = checkpoint.y;
      this.player.body.setVelocityY(-40);
      this.player.fuel.refill();
      this.player.fuelBarFade.play();
      this.player.fuelFrameFade.play();
      this.player.level.hud.fuelBar.setCrop(
        0,
        0,
        64 * this.player.fuel.getPercent(),
        18,
      );

      this.cleanCollider();
    }

    if (Phaser.Input.Keyboard.JustDown(this.pauseControl)) {
      //this.scene.get("DialogBox").cameras.main.setRenderToTexture("Grayscale");
      this.cameras.main.setRenderToTexture('Grayscale');
      this.scene.launch('Pause');
      //this.player.setPipeline("Grayscale");
      this.scene.pause('DialogBox');
      (this.scene.get('Menu') as any).music.pause();
      this.scene.moveBelow('TestLevel', 'DialogBox');
      this.scene.pause('TestLevel');
    }

    this.mapManager.parallaxUpdate();

    if (!this.inputDisabled) this.player.update(delta);

    this.allProj.forEach((element) => {
      if (element.active) {
        element.update(delta);
      }
    });

    this.allSprites.forEach((element) => {
      if (element.active) {
        element.update(delta);
      }
    });

    this.allCoins.forEach((element) => {
      if (element.active) {
        element.update(delta);
      }
    });

    this.allPowerups.forEach((element) => {
      if (element.active) {
        element.update(delta);
      }
    });

    this.allCheckpoints.forEach((element) => {
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
      this.hurt();
    }

    if (this.hud.fuelBar.visible) {
      this.hud.fuelBar.setPosition(this.player.x, this.player.y + 30);
      this.hud.fuelFrame.setPosition(this.player.x, this.player.y + 30);
    }
  }

  init(data: any) {
    this.currentLevel = data.level;
    this.data.set(`coins`, data.coins);
  }

  hurt(): any {
    // Player has been hit so it should be slowed
    this.player.maxSpeed = 80;
    // Sound
    this.sound.play('hurt_sfx', {
      volume: 0.1,
    });

    // Take life from player
    addOrTakeLives(this.player, -1);

    // Update HUD
    if (this.player.lives > 0) {
      this.hud.lives.children.entries[this.player.lives].setTint(0x555555);
    } else {
      if (this.scene.isActive('DialogBox')) this.scene.stop('DialogBox');
      this.scene.start('Menu', {
        levels_unlocked: this.data.get('levels') + 1,
      });
      this.scene.stop('TestLevel');
    }

    // Restore player speed
    this.time.delayedCall(
      1000,
      () => {
        if (this.player !== null) this.player.maxSpeed = 150;
      },
      [],
      this,
    );
  }

  hurtEnemy(player: any, enemy: any) {
    const DASHING = 2;
    if (player.state != DASHING && !player.isColliding) {
      this.cleanCollider();
      this.hurt();
    }

    if (player.state == DASHING) {
      let explosion = this.add.sprite(enemy.x, enemy.y, 'explosion');

      for (let i = 0; i < 3; i++) {
        let particle = this.add.particles(`explosion-particle${i}`);
        particle.setDepth(-1);
        let emitter = particle.createEmitter({
          lifespan: 2000,
          angle: { min: 240, max: 300 },
          speed: { min: 200, max: 300 },
          quantity: { min: 1, max: 2 },
          rotate: { start: 0, end: 720, ease: `Back.easeOut` },
          gravityY: 800,
          on: false,
        });
        emitter.emitParticleAt(enemy.x, enemy.y);
      }

      explosion.anims.play('explosion');

      explosion.on(`animationcomplete`, (animation: any, frame: any) => {
        explosion.destroy();
      });

      enemy.destroy();
    }
  }

  hurtProj(player: any, projectile: any) {
    const DASHING = 2;

    // If player isn't dashing or in grace period
    // Hurt player
    // Else destroy the projectile
    if (player.state != DASHING && !player.isColliding) {
      this.cleanCollider();
      this.hurt();
    } else {
      projectile.destroy();
    }
  }

  cleanCollider() {
    console.log('Clean collider on!');
    this.playerFadeTween.play();
    this.player.isColliding = true;
    this.physics.world.removeCollider(this.enemyCollider);
    this.physics.world.removeCollider(this.projCollider);

    this.time.delayedCall(
      2500,
      () => {
        //this.playerFadeTween.stop();
        this.player.isColliding = false;
        this.enemyCollider = this.physics.add.overlap(
          this.player,
          this.allSprites,
          this.hurtEnemy,
          null,
          this,
        );
        this.projCollider = this.physics.add.overlap(
          this.player,
          this.allProj,
          this.hurtProj,
          null,
          this,
        );
      },
      [],
      this,
    );
  }

  getCoin(element1: any, element2: any) {
    element2.vanish();
    this.data.set('temp_coins', this.data.get('temp_coins') + 1);
    this.coin.play({
      volume: 0.4,
    });
    this.hud.coins.text.setText(
      this.data.get('temp_coins') + this.data.get('coins'),
    );
  }

  getPowerup(element1: any, element2: any) {
    // Activate respective HUD element
    switch (element2.typeOf) {
      case Power.Jump:
        this.hud.powerup.jump.setTint(0xffffff);
        break;
      case Power.Dash:
        this.hud.powerup.dash.setTint(0xffffff);
        break;
      case Power.Jetpack:
        this.hud.powerup.pack.setTint(0xffffff);
        break;
    }
    element2.vanish(element1);
  }

  getPortal(element1: any, element2: any) {
    let next_level = element2.getLevel();

    if (this.warping) return;

    this.allPortals.forEach((element, index) => element.vanish());

    this.warping = true;
    this.inputDisabled = true;
    let actualLevel = this.data.get('levels');
    this.data.set('levels', actualLevel + 1);
    this.time.delayedCall(
      600,
      () => {
        this.scene.restart({
          level: next_level,
          coins: this.data.get(`temp_coins`) + this.data.get(`coins`),
        });
      },
      [],
      this,
    );
    this.cameras.main.fadeOut(200);
  }

  createUI() {
    // Coins - Top left of UI
    this.hud.coins = {
      img: this.add.image(20, 20, 'hud-piece'),
      text: this.add.bitmapText(35, 10, 'numbers', this.data.get('coins')),
    };

    // Levels - Bottom right of UI
    this.hud.level = {
      img: this.add.image(
        this.cameras.main.width - 45,
        this.cameras.main.height - 30,
        'hud-portal',
      ),
      text: this.add.bitmapText(
        this.cameras.main.width - 30,
        this.cameras.main.height - 30,
        'numbers',
        this.data.get('levels'),
      ),
    };

    // Powerups - Bottom left of UI
    // They start deactivated - tinted gray
    this.hud.powerup = {
      dash: this.add
        .sprite(20, this.cameras.main.height - 20, 'powerups', 'powerups_14')
        .setTint(0x555555),
      jump: this.add
        .sprite(50, this.cameras.main.height - 20, 'powerups', 'powerups_0')
        .setTint(0x555555),
      pack: this.add
        .sprite(80, this.cameras.main.height - 20, 'powerups', 'powerups_7')
        .setTint(0x555555),
    };

    // Config for lives group
    let config: Phaser.Types.GameObjects.Group.GroupCreateConfig = {
      key: 'hud-heart',
      repeat: 4,
      setXY: {
        x: this.cameras.main.width - 120,
        y: 20,
        stepX: 25,
      },
    };

    this.hud.lives = this.add.group(config);
    this.hud.lives.children.iterate((element: any) => {
      element.setScrollFactor(0, 0).setScale(0.8);
    });

    // Cointainer
    this.hud.container = this.add.container(0, 0);
    this.hud.container.add([
      this.hud.coins.img,
      this.hud.coins.text,
      this.hud.level.img,
      this.hud.level.text,
      this.hud.powerup.dash,
      this.hud.powerup.jump,
      this.hud.powerup.pack,
    ]);

    this.hud.container.setScrollFactor(0, 0);

    this.hud.fuelBar = this.add
      .sprite(66, 18, 'fuel-bar')
      .setScale(1)
      .setVisible(false);

    this.hud.fuelFrame = this.add
      .sprite(66, 18, 'fuel-frame')
      .setScale(1)
      .setVisible(false);
  }

  hideUI() {
    this.hud.container.each((prop) => prop.setVisible(false));
  }

  restoreUI() {
    this.hud.container.each((prop) => prop.setVisible(true));
  }
}

export default TestLevel;
