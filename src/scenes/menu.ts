import 'phaser';

/*
 * This is the most consciously hardcoded shit I've ever done, judge
 * me all you want because I deserve it.
 */

export default class Menu extends Phaser.Scene {
  screenState: {
    prev: number;
    current: number;
  };

  // A number states how many levels has the player beaten.
  levelsUnlocked: number;

  /*
   * Each array index in "ui" and "background" represents
   * a UI screen, which contains:
   *
   *  - An array of GameObjects
   *  - An array of tweens
   *  - An array of anims
   *
   * Screens:
   * 0 - Start menu
   * 1 - Home menu
   * 2 - Level selector
   * 3 - Controls menu
   */
  ui: Array<{
    gameObjects: Array<Phaser.GameObjects.Sprite>;
    tweens: Array<any>;
    anims: Array<any>;
  }>;
  background: {
    gameObjects: Array<Phaser.GameObjects.Sprite>;
    tweens: Array<any>;
  };

  public music: any;

  constructor() {
    super({
      key: 'Menu',
    });
    this.ui = [];
  }

  public init(data: any): any {
    if (data.levels_unlocked === undefined) {
      this.levelsUnlocked = 1;
    } else {
      this.levelsUnlocked = data.levels_unlocked;
    }
  }

  public create(): void {
    this.screenState = { prev: null, current: 0 };
    this.background = {
      gameObjects: [],
      tweens: [],
    };

    // UI init
    for (let i = 0; i < 3; i++) {
      this.ui[i] = {
        gameObjects: [],
        tweens: [],
        anims: [],
      };
    }

    // Music
    this.music = this.sound.add(`song`);
    console.log(this.music);
    if (this.music.isPlaying) {
      this.music.stop();
    }
    if (!this.music.isPlaying)
      this.music.play({
        volume: 0.02,
        loop: true,
      });

    this.gameObjectSetup();

    this.time.delayedCall(200, () => {
      this.input.keyboard.on('keydown', () => {
        // If on start menu, head to home menu
        // after any button is pressed.
        if (this.screenState.current === 0) {
          this.updateUI(1);
        }
      });
      this.input.on('pointerdown', () => {
        // If on start menu, head to home menu
        // after any button is pressed.
        console.log(this.levelsUnlocked);
        console.log('Pointer down');
        if (this.screenState.current === 0) {
          this.updateUI(1);
        }
      });
    });

    /* Debug screen navigation
        this.input.keyboard.on('keydown-M', () => {
          if (this.screenState.current < this.ui.length - 1) {
            this.updateUI(this.screenState.current + 1);
          }
        })

        this.input.keyboard.on('keydown-N', () => {
          if (this.screenState.current > 0) {
            this.updateUI(this.screenState.current - 1);
          }
        })
        */
  }

  public update(): void {}

  private updateUI(newScreenIndex: number): void {
    if (newScreenIndex === this.screenState.current) {
      console.log(`You're already in the ${this.screenState.current} screen`);
      return;
    }

    this.screenState.prev = this.screenState.current;
    this.screenState.current = newScreenIndex;

    // Hide previous UI screen gameObjects, show current ones and play
    // their respective animations.
    this.ui[this.screenState.prev].gameObjects.forEach((element) => {
      element.setVisible(false);
    });
    this.ui[this.screenState.current].gameObjects.forEach((element) => {
      element.setVisible(true);
    });
    this.ui[this.screenState.current].tweens.forEach((tween) => {
      tween.play();
    });
  }

  private gameObjectSetup(): void {
    // Load all gameobjects into the current scene and their
    // respective tweens/animations

    // GENERAL BACKGROUND
    this.background.gameObjects.push(
      this.add
        .sprite(-12, -12, 'menu_background')
        .setOrigin(0, 0)
        .setScrollFactor(0),
    );
    this.background.tweens.push(
      this.add.tween({
        targets: this.background.gameObjects[0],
        x: -4,
        y: -4,
        duration: 2000,
        yoyo: true,
        loop: -1,
      }),
    );

    // START MENU

    // Title SCIENCE
    this.ui[0].gameObjects.push(
      this.add
        .sprite(0, -300, 'menu_title_science')
        .setOrigin(0, 0)
        .setScrollFactor(0),
    );
    this.ui[0].tweens.push(
      this.add.tween({
        targets: this.ui[0].gameObjects[0],
        y: -30,
        duration: 800,
        delay: 50,
        ease: 'Elastic',
        easeParams: [1.5, 0.5],
      }),
    );

    // Title WARP
    this.ui[0].gameObjects.push(
      this.add
        .sprite(0, -300, 'menu_title_warp')
        .setOrigin(0, 0)
        .setScrollFactor(0),
    );
    this.ui[0].tweens.push(
      this.add.tween({
        targets: this.ui[0].gameObjects[1],
        y: -30,
        duration: 800,
        delay: 150,
        ease: 'Elastic',
        easeParams: [1.5, 0.5],
      }),
    );

    // Press any button to start
    this.ui[0].gameObjects.push(
      this.add
        .sprite(40, 220, 'menu_press_any_button')
        .setOrigin(0, 0)
        .setScrollFactor(0),
    );
    this.ui[0].anims.push(
      this.anims.create({
        key: 'menuPressAnyloop',
        frames: this.anims.generateFrameNumbers('menu_press_any_button', {
          start: 0,
          end: 23,
        }),
        frameRate: 15,
        repeat: -1,
      }),
    );
    this.ui[0].gameObjects[2].anims.load('menuPressAnyloop');
    this.ui[0].gameObjects[2].anims.play('menuPressAnyloop');

    // HOME MENU

    // Title SCIENCE
    this.ui[1].gameObjects.push(
      this.add
        .sprite(0, -30, 'menu_title_science')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false),
    );
    this.ui[1].tweens.push(
      this.add.tween({
        targets: this.ui[1].gameObjects[0],
        y: -40,
        duration: 800,
        delay: 50,
        ease: 'Elastic',
        easeParams: [1.5, 0.5],
      }),
    );

    // Title WARP
    this.ui[1].gameObjects.push(
      this.add
        .sprite(0, -30, 'menu_title_warp')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false),
    );
    this.ui[1].tweens.push(
      this.add.tween({
        targets: this.ui[1].gameObjects[1],
        y: -40,
        duration: 800,
        delay: 150,
        ease: 'Elastic',
        easeParams: [1.5, 0.5],
      }),
    );

    // Start journey
    this.ui[1].gameObjects.push(
      this.add
        .sprite(10, 200, 'start_journey')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false)
        .setInteractive(),
    );
    this.ui[1].anims.push(
      this.anims.create({
        key: 'menuStartJourney',
        frames: this.anims.generateFrameNumbers('start_journey', {
          start: 0,
          end: 23,
        }),
        frameRate: 15,
        repeat: -1,
      }),
    );
    const startJourney = this.ui[1].gameObjects[2];
    startJourney.anims.load('menuStartJourney');
    startJourney.on('pointerover', () => {
      startJourney.anims.play('menuStartJourney');
    });
    startJourney.on('pointerout', () => {
      startJourney.anims.restart();
      startJourney.anims.stop();
    });
    startJourney.on('pointerdown', () => {
      // Open level selector
      this.updateUI(2);
    });

    this.ui[1].tweens.push(
      this.add.tween({
        targets: startJourney,
        y: 203,
        duration: 800,
        yoyo: true,
        loop: -1,
      }),
    );

    /*
    // Options
    this.ui[1].gameObjects.push(
      this.add
        .sprite(10, 230, 'options')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false)
        .setInteractive(),
    );
    this.ui[1].anims.push(
      this.anims.create({
        key: 'menuOptions',
        frames: this.anims.generateFrameNumbers('options', {
          start: 0,
          end: 23,
        }),
        frameRate: 15,
        repeat: -1,
      }),
    );
    const options = this.ui[1].gameObjects[3];
    options.anims.load('menuOptions');

    options.on('pointerover', () => {
      options.anims.play('menuOptions');
    });
    options.on('pointerout', () => {
      options.anims.restart();
      options.anims.stop();
    });
    options.on('pointerdown', () => {
      // Open options menu
    });

    this.ui[1].tweens.push(
      this.add.tween({
        targets: options,
        y: 233,
        duration: 800,
        yoyo: true,
        loop: -1,
      }),
    );
    */

    // LEVEL SELECTOR

    // Locked level animation
    this.ui[2].anims.push(
      this.anims.create({
        key: `levelLocked`,
        frames: this.anims.generateFrameNumbers('levels', {
          frames: [20],
        }),
        frameRate: 10,
        repeat: -1,
      }),
    );

    // Loading level selection buttons
    for (let i = 0; i < 9; i++) {
      let animFrameStart = 0;
      let animFrameEnd = 0;

      if (i == 0) {
        animFrameStart = i;
      } else {
        animFrameStart = i * 2;
      }
      animFrameEnd = animFrameStart + 1;

      this.ui[2].anims.push(
        this.anims.create({
          key: `level${i + 1}`,
          frames: this.anims.generateFrameNumbers('levels', {
            start: animFrameStart,
            end: animFrameEnd,
          }),
          frameRate: 10,
          repeat: -1,
        }),
      );

      this.ui[2].gameObjects.push(
        this.add
          .sprite(20 + i * 50, 200, 'levels')
          .setOrigin(0, 0)
          .setScrollFactor(0)
          .setVisible(false)
          .setInteractive(),
      );

      const levelName =
        i < this.levelsUnlocked ? `level${i + 1}` : 'levelLocked';
      const levelButton = this.ui[2].gameObjects[i];
      levelButton.anims.load(levelName);

      if (levelName !== 'levelLocked') {
        levelButton.on('pointerover', () => {
          levelButton.anims.play(levelName);
        });
        levelButton.on('pointerout', () => {
          levelButton.anims.restart();
          levelButton.anims.stop();
        });
        levelButton.on('pointerdown', () => {
          this.cameras.main.once('camerafadeoutcomplete', (camera: any) => {
            this.music.stop();
            this.scene.launch('TestLevel', {
              level: i,
              coins: 0,
              levelsUnlocked: this.levelsUnlocked,
            });
            this.cameras.main.fadeIn(0);
            this.scene.stop('Menu');
          });
          this.cameras.main.fadeOut(500);
        });
      }

      this.ui[2].tweens.push(
        this.add.tween({
          targets: levelButton,
          y: 202,
          duration: 800,
          delay: i * 20,
          yoyo: true,
          loop: -1,
        }),
      );
    }

    // Title SCIENCE
    this.ui[2].gameObjects.push(
      this.add
        .sprite(0, -30, 'menu_title_science')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false),
    );
    this.ui[2].tweens.push(
      this.add.tween({
        targets: this.ui[2].gameObjects[9],
        y: -40,
        duration: 800,
        delay: 50,
        ease: 'Elastic',
        easeParams: [1.5, 0.5],
      }),
    );

    // Title WARP
    this.ui[2].gameObjects.push(
      this.add
        .sprite(0, -30, 'menu_title_warp')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false),
    );
    this.ui[2].tweens.push(
      this.add.tween({
        targets: this.ui[2].gameObjects[10],
        y: -40,
        duration: 800,
        delay: 150,
        ease: 'Elastic',
        easeParams: [1.5, 0.5],
      }),
    );

    // Back button
    this.ui[2].gameObjects.push(
      this.add
        .sprite(10, 180, 'backButton')
        .setOrigin(0, 0)
        .setScrollFactor(0)
        .setVisible(false)
        .setInteractive(),
    );
    this.ui[2].anims.push(
      this.anims.create({
        key: 'backButtonLoop',
        frames: this.anims.generateFrameNumbers('backButton', {
          start: 0,
          end: 1,
        }),
        frameRate: 10,
        repeat: -1,
      }),
    );

    const backButton = this.ui[2].gameObjects[11];
    backButton.anims.load('backButtonLoop');

    backButton.on('pointerover', () => {
      backButton.anims.play('backButtonLoop');
    });
    backButton.on('pointerout', () => {
      backButton.anims.restart();
      backButton.anims.stop();
    });
    backButton.on('pointerdown', () => {
      this.updateUI(1);
    });

    this.ui[2].tweens.push(
      this.add.tween({
        targets: this.ui[2].gameObjects[11],
        y: 183,
        duration: 800,
        loop: -1,
        yoyo: true,
      }),
    );
  }
}
