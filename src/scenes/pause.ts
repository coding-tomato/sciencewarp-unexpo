enum Entry {
    Continue,
    Volume,
    Exit
};

interface Pause {
    // Little hack to avoid errors
    // By calling functions programatically
    // With a string index
    [index: string]: any;
}

class Pause extends Phaser.Scene {

    private controlKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private enterKey: Phaser.Input.Keyboard.Key;

    constructor() {
        super({
            key: "Pause",
        });
    }

    create() {
        // List of menu entries
        // For now:
        // Continue              -- for obvious reasons
        // Volume                -- to reduce volume of both music and sfx
        // Exit to Main Menu     -- to return to start screen
        const list = [
            this.add
                .text(
                    this.cameras.main.centerX - 50,
                    this.cameras.main.centerY - 30,
                    "Continue"
                )
                .setScrollFactor(0),
            this.add
                .text(
                    this.cameras.main.centerX - 50,
                    this.cameras.main.centerY - 15,
                    "Volume"
                )
                .setScrollFactor(0),
            this.add
                .text(
                    this.cameras.main.centerX - 50,
                    this.cameras.main.centerY,
                    "Exit to Main Menu"
                )
                .setScrollFactor(0),
        ];

        // First item is selected by default
        if (!this.data.get("item_selected")) {
            this.data.set("item_selected", 0);
        }

        // Apply tween to currently selected list entry
        let high = this.tweens.add({
            targets: list[this.data.get("item_selected")],
            alpha: { from: 0.5, to: 1 },
            repeat: -1,
        });

        // When there's a change
        // Remove tween from previous entry
        // And apply to new selected entry
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

        this.enterKey = this.input.keyboard.addKey("ENTER");
        this.controlKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            this.handleInput({type: "Continue"}, "enter");
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.up)) {
            if (this.data.get("item_selected") != 0) {
                let previous: number = this.data.get("item_selected");
                this.data.set("item_selected", previous - 1);
                this.events.emit("change", previous);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.down)) {
            if (this.data.get("item_selected") != 2) {
                let previous: number = this.data.get("item_selected");
                this.data.set("item_selected", previous + 1);
                this.events.emit("change", previous);
            }
        }
    }

    public handleInput(entry: any, input: any): any {
        this["handle" + entry.type]();
    }

    private handleContinue(): void {
        this.scene.moveAbove("TestLevel", "DialogBox");
        this.scene.resume("DialogBox");
        this.scene.resume("TestLevel");
        // Restart music
        (this.scene.get("Menu") as any).music.resume();
        // Delete gray shader
        this.scene.get("TestLevel").cameras.main.clearRenderToTexture();
        this.scene.stop("Pause");
    }
}

export default Pause;
