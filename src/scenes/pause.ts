// TODO: Implement handleVolume
// TODO: Implement handleExittoMainMenu

interface Pause {
    // Little hack to avoid errors
    // By calling functions programatically
    // With a string index
    [index: string]: any;
}

type optCfg = { value: string, x: number, y: number };
type Option = { text: Phaser.GameObjects.Text, call: any };
type fnCfg = (value: string, x: number, y: number) => optCfg;
type fnOpt = (config: optCfg) => Option;

type Menu = Array<Option>

class Pause extends Phaser.Scene {

    private controlKeys: Phaser.Types.Input.Keyboard.CursorKeys;
    private enterKey: Phaser.Input.Keyboard.Key;
    private list: Menu;

    constructor() {
        super({
            key: "Pause"
        });
    }

    create() {
        // List of menu entries
        // Continue              -- obvious reasons
        // Volume                -- reduce volume of both music and sfx
        // Exit to Main Menu     -- return to start screen

        // To send to fnOpt, which accepts optCfg
        const configOpt: fnCfg = (value, x, y) => {
            return { value, x, y };
        }

        // For uniform vertical paddings
        const fnPadding = (init: number, step: number) => {
            let padding = init;
            return function () {
                padding += step;
                return padding;
            }
        }

        // To get valid function names for multi-word options
        const stripWhiteSpace = (str: string) => str.split("").filter((ch) => ch != " ").join("");

        // Returns a new Option, which consists in a text object and a function name
        const makeOpt: fnOpt = (config) => {
            return {
                text: this.add
                    .text(config.x, config.y, config.value)
                    .setScrollFactor(0),
                call: "handle" + stripWhiteSpace(config.value)
            }
        }

        // Setup variables
        const getPaddingY = fnPadding(-45, 15);
        const posX = this.cameras.main.centerX - 50
        const centerY = this.cameras.main.centerY;

        // Menu object, add new words to create new options
        this.list = ["Continue", "Volume", "Exit to Main Menu", "Hello", "This is Great!"]
            .map((option) => configOpt(option, posX, centerY + getPaddingY()))
            .map(makeOpt);

        // First item is selected by default
        if (!this.data.get("item_selected")) {
            this.data.set("item_selected", 0);
        }

        // Fade in and out tween
        // Apply tween to currently selected list entry
        const getFadeTween = (targets: any) => this.tweens.add({
            targets,
            alpha: { from: 0.5, to: 1 },
            repeat: -1,
        });

        let optTween = getFadeTween(this.list[this.data.get("item_selected")].text);

        // When there's a change
        // Remove tween from previous entry
        // And apply to new selected entry
        this.events.addListener("change", (previous: number) => {
            optTween.remove();
            this.list[previous].text.setAlpha(1);
            /*DEBUG*/ // console.log(this.data.get("item_selected"));
            optTween = getFadeTween(this.list[this.data.get("item_selected")].text);
        });

        this.enterKey = this.input.keyboard.addKey("ENTER");
        this.controlKeys = this.input.keyboard.createCursorKeys();
    }

    update() {
        // Each menu option has a string property called "call"
        // Idea is to use this string to call a method
        // Whose name will be "handle" + [nameOfEntryWithoutSpaces]
        // E.g., an option named "Continue" will have "handleContinue"
        if (Phaser.Input.Keyboard.JustDown(this.enterKey)) {
            try {
                this[this.list[this.data.get("item_selected")].call]("enter");
            } catch (err) {
                console.error("There's no method called: " + this.list[this.data.get("item_selected")].call);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.left)) {
            this[this.list[this.data.get("item_selected")].call]("left");
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.right)) {
            this[this.list[this.data.get("item_selected")].call]("right");
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.up)) {
            if (this.data.get("item_selected") != 0) {
                let previous: number = this.data.get("item_selected");
                this.data.set("item_selected", previous - 1);
                this.events.emit("change", previous);
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.controlKeys.down)) {
            if (this.data.get("item_selected") != this.list.length - 1) {
                let previous: number = this.data.get("item_selected");
                this.data.set("item_selected", previous + 1);
                this.events.emit("change", previous);
            }
        }
    }

    private handleContinue(input: string): void {
        if (input === "enter") {
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

    private handleVolume(dir: string): void {
        if (dir === "left") {
            this.sound.volume -= 0.1
            console.log(this.sound.volume);
        } else {
            this.sound.volume += 0.1
            console.log(this.sound.volume);
        }
    }

    private handleExittoMainMenu(): void {
        console.log("Hi, I'm Exit!")
    }
}

export default Pause;
