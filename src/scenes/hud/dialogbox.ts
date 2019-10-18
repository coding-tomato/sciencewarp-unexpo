import "phaser";

import { Dialog, Text } from '../../def';

const WIDTH = 300;
const PADDING = 10;

export default class DialogBox extends Phaser.Scene {

    public dialogBox: Dialog;
    public dialogText: Text[];

    private text: string[];

    constructor() {
        super({
            key: 'DialogBox'
        });

        this.dialogText = [];
    }

    init(data: any) {
        this.text = data.text || ["Error"];
    }

    create() {
        // Dialog Box configuration
        this.dialogBox = this.makeBox();

        // Create Dialog Box
        this.dialogBox.box.fillRect(this.dialogBox.x, this.dialogBox.y, this.dialogBox.width, this.dialogBox.height);

        // Create Dialog Text
        this.text.forEach( (element: string, index: number) => {
            this.dialogText[index] = this.makeText(element);
        });

        this.animateText(this.dialogText, 0);

        
    }

    animateText(dialog: Text[], index: number) {

        const textArr: string[] = dialog[index].text.split('');
        const newTextArr: any[] = [];

        let count = 0;

        const actualText = this.add.text(dialog[index].x, dialog[index].y, ' ', { padding: PADDING,
            fontSize: 12,
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
                             actualText.setText(' ');
                             this.animateText(dialog, index + 1);
                         }
                     }, [], this)
                 } else {
                     newTextArr.push(textArr[count]);
                     actualText.setText(newTextArr.join(''));
                     count++;    
                }
            },
            loop: true
        };

        this.time.addEvent(timeConfig);
    }

    makeBox(): Dialog {
        return {
            box: this.add.graphics().fillStyle(0xffff, 0.5),
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