import "phaser";

import { Dialog, Text } from '../../def';

const WIDTH = 300;
const PADDING = 10;

export default class DialogBox extends Phaser.Scene {

    public dialogBox: Dialog;
    public dialogText: Text[];

    private text: string[];
    private clock: any;
    private isDone: boolean;
    
    constructor() {
        super({
            key: 'DialogBox'
        });

        this.dialogText = [];
        this.isDone = false;
    }

    init(data: any) {
        // Text sent to this scene from another scene
        this.text = data.text || ["Error"];
    }

    create() {
        // Dialog Box configuration
        this.dialogBox = this.makeBox();

        // Index
        if (!this.data.get("index")) {
            this.data.set("index", 0);
        }

        // Create Dialog Box
        this.dialogBox.box.fillRect(this.dialogBox.x, this.dialogBox.y, this.dialogBox.width, this.dialogBox.height);

        // Create Dialog Box border
        let borderRect = new Phaser.Geom.Rectangle(
            this.dialogBox.x, 
            this.dialogBox.y,
            this.dialogBox.width,
            this.dialogBox.height
            );

        this.dialogBox.border.strokeRectShape(borderRect);

        // Create Dialog Text
        this.text.forEach((element: string, index: number) => {
            this.dialogText[index] = this.makeText(element);
        });

        // Animate text on Dialog Box
        this.animateText(this.dialogText, this.data.get("index"));
    }

    animateText(dialog: Text[], index: number) {

        let textArr: string[] = dialog[index].text.split('');
        let newTextArr: any[] = [];

        let count = 0;

        let actualText = this.add.text(dialog[index].x, dialog[index].y, ' ', { padding: PADDING,
            fontSize: 12,
            fontFamily: 'Bangers, cursive',
            wordWrap: { width: dialog[index].width - PADDING, advancedWordWrap: true }
        });

        const timeConfig: Phaser.Types.Time.TimerEventConfig = {
            delay: 75,
             callback: () => {
                if (count >= textArr.length) {
                     this.time.delayedCall(1000, () => {
                         if (index == dialog.length - 1) {
                            this.scene.stop();
                         } else {
                             textArr = [];
                             newTextArr = [];
                             actualText.setText('');
                             this.animateText(dialog, index + 1);
                         }
                         
                     }, [], this)
                 } else {
                     newTextArr.push(textArr[count]);
                     actualText.setText(newTextArr.join(''));
                     count++;    
                }
            },
            repeat: textArr.length
        };

        this.clock = this.time.addEvent(timeConfig);
    }

    update() {
        
    }

    makeBox(): Dialog {
        return {
            box: this.add.graphics().fillStyle(0x00ff00, 0.5),
            border: this.add.graphics().lineStyle(3, 0x000000, 1),
            x: this.cameras.main.centerX - WIDTH / 2,
            y: 10,
            width: WIDTH,
            height: 50
        }

    }

    makeText(message: string): Text {
        return {
            text: message,
            x: this.dialogBox.x + 2,
            y: this.dialogBox.y,
            width: this.dialogBox.width
        };
    }
}