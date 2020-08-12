import "phaser";

export default class Menu extends Phaser.Scene {
    state: {
      prev: number, 
      current: number, 
    };

    /*
     * Each array index represents a UI screen, which contains:
     *  - A group of elements
     *  - A group of animations objects (tween, anim)
     *
     * 0 - Start menu
     * 1 - Home menu 
     * 2 - Level selector 
     * 3 - Controls menu 
    */
    ui: Array<{
      elements: Array<Phaser.GameObjects.Sprite>,
      tweens: Array<any>,
      anims: Array<any>,
    }>
    background: {
      elements: Array<Phaser.GameObjects.Sprite>,
      tweens: Array<any>,
    };

    public music: any;

    constructor() {
        super({
            key: "Menu",
        });

        this.state = {prev: null, current: 0}
        this.ui = [];
    }

    public create(): void {
        this.background = {
          elements: [],
          tweens: [],
        };

        // UI init
        for (let i = 0; i < 2; i++) {
          this.ui[i] = {
            elements: [],
            tweens: [],
            anims: [],
          };
        }

        // Music
        this.music = this.sound.add(`song`);
        if (!this.music.isPlaying)
            this.music.play({
                volume: 0.02,
                loop: true,
            });
                
        this.loadSprites();

        this.input.keyboard.on('keydown-ESC', () => {
          this.scene.restart();
        })

        this.input.keyboard.on('keydown', () => {
          if (this.state.current === 0) {
            this.updateUI(1);
          } else {
            this.updateUI(0);
          }
        })

    }

    public update(): void {

    }

    private updateUI(newScreenIndex: number): void {
        this.state.prev = this.state.current;
        this.state.current = newScreenIndex;

        this.ui[this.state.prev].elements.forEach(element => {
          element.setVisible(false);
        })

        this.ui[this.state.current].elements.forEach(element => {
          element.setVisible(true);
        })
        this.ui[this.state.current].tweens.forEach(tween => {
          tween.play();
        })

        // Play tween/sprite animationss, hide prev UI elements and show new ones.
        switch(this.state.current) {
          case 0:
            break;
          default:
            break;
        }
    }

    private loadSprites(): void {
        // Create all sprites
        
        // GENERAL BACKGROUND
        this.background.elements.push(this.add.sprite(-12, -12, "menu_background")
            .setOrigin(0, 0)
            .setScrollFactor(0)
        );
        this.background.tweens.push(this.add.tween({
          targets: this.background.elements[0],
          x: -4,
          y: -4,
          duration: 2000,
          yoyo: true,
          loop: -1,
        }))


        // START MENU

        // Title SCIENCE
        this.ui[0].elements.push(this.add.sprite(0, -300, "menu_title_science")
            .setOrigin(0, 0)
            .setScrollFactor(0)
        );
        this.ui[0].tweens.push(this.add.tween({
          targets: this.ui[0].elements[0],
          y: -30,
          duration: 800,
          delay: 50,
          ease: 'Elastic',
          easeParams: [ 1.5, 0.5],
        }))

        // Title WARP
        this.ui[0].elements.push(this.add.sprite(0, -300, "menu_title_warp")
            .setOrigin(0, 0)
            .setScrollFactor(0)
        );
        this.ui[0].tweens.push(this.add.tween({
          targets: this.ui[0].elements[1],
          y: -30,
          duration: 800,
          delay: 150,
          ease: 'Elastic',
          easeParams: [ 1.5, 0.5],
        }))
        
        // Press any button to start
        this.ui[0].elements.push(this.add
            .sprite(40, 220, "menu_press_any_button")
            .setOrigin(0, 0)
            .setScrollFactor(0)
        );
        this.ui[0].anims.push(this.anims.create({
            key: "menuPressAnyloop",
            frames: this.anims.generateFrameNumbers("menu_press_any_button", {
                start: 0,
                end: 23,
            }),
            frameRate: 15,
            repeat: -1,
        }));
        this.ui[0].elements[2].anims.load('menuPressAnyloop');
        this.ui[0].elements[2].anims.play('menuPressAnyloop');


        // HOME MENU
        
        // Start journey
        this.ui[1].elements.push(this.add
            .sprite(10, 200, "start_journey")
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setVisible(false)
            .setInteractive()
        );
        this.ui[1].anims.push(this.anims.create({
            key: "menuStartJourney",
            frames: this.anims.generateFrameNumbers("start_journey", {
                start: 0,
                end: 23,
            }),
            frameRate: 15,
            repeat: -1,
        }));
        const startJourney = this.ui[1].elements[0];
        startJourney.anims.load('menuStartJourney');
        startJourney.on('pointerover', () => {
          startJourney.anims.play('menuStartJourney');
        })
        startJourney.on('pointerout', () => {
          startJourney.anims.restart();
          startJourney.anims.stop();
        })

        // Options
        this.ui[1].elements.push(this.add
            .sprite(10, 230, "options")
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setVisible(false)
            .setInteractive()
        );
        this.ui[1].anims.push(this.anims.create({
            key: "menuOptions",
            frames: this.anims.generateFrameNumbers("options", {
                start: 0,
                end: 23,
            }),
            frameRate: 15,
            repeat: -1,
        }));
        const options = this.ui[1].elements[1];
        options.anims.load('menuOptions');
        options.on('pointerover', () => {
          options.anims.play('menuOptions');
        })
        options.on('pointerout', () => {
          options.anims.restart();
          options.anims.stop();
        })


        // Level selector
        
    }
}

        /*
        let menuPressAnyButtonAnim = this.anims.create({
            key: "loop",
            frames: this.anims.generateFrameNumbers("menu_press_any_button", {
                start: 0,
                end: 23,
            }),
            frameRate: 15,
            repeat: -1,
        });

        this.tweens.add({
          targets: this.background[0],
          x: -4,
          y: -4,
          duration: 2000,
          yoyo: true,
          loop: -1,
        })

        this.tweens.add({
          targets: this.background[1],
          y: -30,
          duration: 800,
          delay: 50,
          ease: 'Elastic',
          easeParams: [ 1.5, 0.5],
        })

        this.tweens.add({
          targets: this.background[2],
          y: -30,
          duration: 800,
          delay: 150,
          ease: 'Elastic',
          easeParams: [ 1.5, 0.5],
        })
        */

        /*
        const list = [
            this.add
                .text(
                    this.cameras.main.centerX + 150,
                    this.cameras.main.centerY - 30,
                    "Level One"
                )
                .setScrollFactor(0),
            this.add
                .text(
                    this.cameras.main.centerX + 150,
                    this.cameras.main.centerY - 15,
                    "Level Two"
                )
                .setScrollFactor(0),
            this.add
                .text(
                    this.cameras.main.centerX + 150,
                    this.cameras.main.centerY,
                    "Level Three"
                )
                .setScrollFactor(0),
        ];

        for (let element of list) {
            element
                .setFontFamily('"ZCOOL QingKe HuangYou", serif')
                .setFill("rgb(20, 10, 10");
        }

        if (!this.data.get("item_selected")) {
            this.data.set("item_selected", 0);
        }

        let high = this.tweens.add({
            targets: list[this.data.get("item_selected")],
            alpha: { from: 0.5, to: 1 },
            repeat: -1,
        });

        this.events.addListener("change", (previous: number) => {
            high.remove();
            list[previous].setAlpha(1);
            console.log(this.data.get("item_selected"));
            high = this.tweens.add({
                targets: list[this.data.get("item_selected")],
                alpha: { from: 0.5, to: 1 },
                repeat: -1,
            });
        });

        */

      /*
        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.up)) {
            if (this.data.get("item_selected") != 0) {
                let previous: number = this.data.get("item_selected");
                this.data.set("item_selected", previous - 1);
                this.events.emit("change", previous);
            }
        }

        // this.cameras.main.scrollX++;
        // this.bg[0].tilePositionX = this.cameras.main.scrollX * 0.8;

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.down)) {
            if (this.data.get("item_selected") != 2) {
                let previous: number = this.data.get("item_selected");
                this.data.set("item_selected", previous + 1);
                this.events.emit("change", previous);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            let item_selected = this.data.get(`item_selected`);
            this.cameras.main.once("camerafadeoutcomplete", (camera: any) => {
                this.scene.launch("TestLevel", {
                    level: item_selected,
                    coins: 0,
                });
                this.cameras.main.fadeIn(0);
                this.scene.pause("Menu");
            });
            this.cameras.main.fadeOut(500);
            // this.time.delayedCall(1000, () => {
            // 	this.scene.start('TestLevel');
            // }, [], this);
            // break;
        }
    */
