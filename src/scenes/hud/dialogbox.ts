import "phaser";

import { Dialog, Text } from '../../def';

const WIDTH = 300;
const PADDING = 10;

export default class DialogBox extends Phaser.Scene {
    public dialogBox: Dialog;
    public dialogText: Text;
    private text: string;

    constructor() {
        super({
            key: 'DialogBox'
        })
    }

    init(data: any) {
        this.text = data.text || "Error";
    }

    create() {
        // Dialog Box configuration
        this.dialogBox = {
            box: this.add.graphics().fillStyle(0xffff, 0.5),
            x: this.cameras.main.centerX - WIDTH / 2,
            y: 10,
            width: WIDTH,
            height: 50
        };

        // Create Dialog Box
        this.dialogBox.box.fillRect(this.dialogBox.x, this.dialogBox.y, this.dialogBox.width, this.dialogBox.height);

        // Create Dialog Text
        this.dialogText = {
            text: this.text,
            x: this.dialogBox.x + 2,
            y: this.dialogBox.y,
            width: this.dialogBox.width
        };

        const textArr = this.dialogText.text.split('');
        console.log(textArr);

        const newTextArr: any[] = [];

        let count = 0;

        const genial = this.add.text(this.dialogText.x, this.dialogText.y, ' ', { padding: PADDING,
            fontSize: 12,
            wordWrap: { width: this.dialogText.width - PADDING, advancedWordWrap: true }
        });

        const timeConfig: Phaser.Types.Time.TimerEventConfig = {
            delay: 75,
             callback: () => {
                if (count >= textArr.length) {
                     this.time.delayedCall(1000, () => {
                         this.scene.stop();
                     }, [], this)
                 } else {
                     newTextArr.push(textArr[count]);
                     genial.setText(newTextArr.join(''));
                     count++;    
                }
            },
            loop: true
        };

        this.time.addEvent(timeConfig);
    }
}