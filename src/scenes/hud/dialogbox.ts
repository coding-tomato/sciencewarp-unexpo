import "phaser";


interface Dialog {
    box: Phaser.GameObjects.Graphics;
    x: number;
    y: number;
    width: number;
    height: number
}

interface Text {
    text: string;
    x: number;
    y: number;
    width: number;
}

export default class DialogBox extends Phaser.Scene {
    public dialogBox: Dialog;
    public dialogText: Text;

    constructor() {
        super({
            key: 'DialogBox'
        })
    }

    create() {

        const WIDTH = 300;
        
        this.dialogBox = {
            box: this.add.graphics().fillStyle(0xffff, 0.5),
            x: this.cameras.main.centerX - WIDTH / 2,
            y: 10,
            width: WIDTH,
            height: 50
        };

        this.dialogBox.box.fillRect(this.dialogBox.x, this.dialogBox.y, this.dialogBox.width, this.dialogBox.height);

        this.dialogText = {
            text: "Hello Hssssssssssssssssssow are you? Fine thanks",
            x: this.dialogBox.x + 2,
            y: this.dialogBox.y + 2,
            width: this.dialogBox.width - 10,
        };

        const textArr = this.dialogText.text.split(' ');
        console.log(textArr);

        // const count = 0

        // const timeConfig: Phaser.Types.Time.TimerEventConfig = {
        //     delay: 300,
        //     callback: () => {
        //         this.loadCount++;
        //         if (count) {
        //             this.loadText.setText(' ');
        //             this.loadCount = 0;
        //         } else {
        //             this.loadText.setText(' ' + '.'.repeat(this.loadCount));
        //         }
        //     },
        //     loop: true
        // };

        //this.time.addEvent(timeConfig);

        this.add.text(this.dialogText.x, this.dialogText.y, this.dialogText.text, {
            wordWrap: { width: this.dialogText.width }
        });





    }
}