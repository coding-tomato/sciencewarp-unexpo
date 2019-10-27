import "phaser"

const enum State {
    WALKING = 1,
    WINDUP = 2,
    SHOOTING = 3
}

class Projectile extends Phaser.GameObjects.Sprite {
    public body: Phaser.Physics.Arcade.Body;
    constructor(params: any){
        super(params.scene, params.x, params.y, params.texture, params.frame);
        this.createAnimations();
        // Projectile settings
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.setVelocityY(-100);
        this.setDepth(-1);
        this.anims.play('loop');
        // Events
        this.scene.time.delayedCall(3000, () => {
            this.anims.play('vanish');
        }, [], this);
    }
    createAnimations(): void {
        this.scene.anims.create({
            key: 'loop',
            frames: this.scene.anims.generateFrameNumbers('vroomba_part', 
            {
                start: 0, end: 3
            }),
            frameRate: 12,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'vanish',
            frames: this.scene.anims.generateFrameNumbers('vroomba_part', 
            {
                start: 4, end: 6
            }),
            frameRate: 12
        });
        this.on('animationcomplete', this.animCompleteHandler, this);
    }
    animCompleteHandler(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame){
        if(this.anims.getCurrentKey() === 'vanish') this.destroy();
    }
}

export default class Vroomba extends Phaser.GameObjects.Sprite {
    private mapManager: any;
    private direction: number; 
    private velocity: number;
    private range: number;
    public body: Phaser.Physics.Arcade.Body;
     
    constructor(params: any) {
        super(params.scene, params.x, params.y, params.key, params.frame);
        this.mapManager = params.scene.mapManager;

        //Param handling - To do
        let dir_x = 1;
        let velocity = 100;
        this.direction = dir_x;
        this.velocity = velocity;
        this.state = State.WALKING; 
        this.range = 200;
    
        // Settings
        this.createAnimations();
        this.anims.play('walk');
        this.setDepth(1);
        this.scene.add.existing(this);
        this.scene.physics.world.enable(this);
        this.body.setSize(48, 8, false);
        this.body.setOffset(0, 24);
    }

    update(delta: number): void {
        this.animationHandler();
        this.moveHandler(delta);
    }

    moveHandler(delta: number): void {
        let center = this.body.center;
        
        switch(this.state){
            case State.WALKING:
                let player = (this.scene as any).player;
                //Check for player in sight
                let sight = (player.body.x > this.body.x && player.body.x < this.body.x + this.body.width)
                        &&  (player.body.y > this.body.y - this.range &&  player.body.y < this.body.y)
                if(sight) { this.state = State.WINDUP }

                //Checks for cliffs and walls to turn
                let turn: boolean = this.body.blocked.right 
                                ||  this.body.blocked.left
                                ||  this.mapManager.map.getTileAtWorldXY(  
                                        Phaser.Math.RoundTo(center.x + this.direction * (this.body.halfWidth + 5), 0),
                                        Phaser.Math.RoundTo(center.y + this.body.halfHeight, 0)) === null
                if (turn) this.direction *= -1;
                this.body.setVelocityX(this.body.blocked.down ? this.velocity * this.direction : 0);
                break;
            case State.WINDUP:
                if(this.body.velocity.x !== 0) {
                    this.body.setVelocityX(0);
                } 
                break;
        }
    }

    createAnimations(): void {
        this.scene.anims.create({
            key: 'walk',
            frames: this.scene.anims.generateFrameNumbers('vroomba', 
            {
                start: 0, end: 3
            }),
            frameRate: 12
        });
        this.scene.anims.create({
            key: 'windup',
            frames: this.scene.anims.generateFrameNumbers('vroomba',
            {
                start: 4, end: 5
            }),
            frameRate: 12,
            repeat: 0
        })
        this.scene.anims.create({
            key: 'shooting',
            frames: this.scene.anims.generateFrameNumbers('vroomba',
            {
                start: 7, end: 13
            }),
            frameRate: 12,
            repeat: 0
        })
        this.on('animationcomplete', this.animCompleteHandler, this)
    }

    animationHandler(): void {
        this.setFlipX(this.direction === -1);
        switch(this.state)
        {
            case State.WALKING:
                this.anims.play('walk', true);
                break;
            case State.WINDUP:
                if(this.anims.getCurrentKey() !== 'windup') this.anims.play('windup');
                break;
            case State.SHOOTING:
                if(this.anims.getCurrentKey() !== 'shooting') this.anims.play('shooting');
                break;
        } 
    }

    animCompleteHandler(animation: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame): void {
        switch(animation.key) {
            case "walking":
                break;
            case "windup":
                this.state = State.SHOOTING;
                this.shootProjectile();
                break;
            case "shooting":
                this.scene.time.delayedCall(500, () => {
                   this.state =  State.WALKING;
                }, [], this);
                break;
        }
    }

    shootProjectile(): void {
        let center = this.body.center;
        const proj = new Projectile({scene: this.scene,x: center.x, y: center.y - 10, texture: 'vroomba_part'});
        (this.scene as any).nobo.push(proj);
    }
}



