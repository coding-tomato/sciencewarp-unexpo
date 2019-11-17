import "phaser";

class ExplosionParticle extends Phaser.GameObjects.Particles.Particle {
    private anim: any;
    private t: number;
    private i: number;

    constructor(emitter: any, anim: any) {
        super(emitter);
        this.t = 0;
        this.i = 0;
        this.anim = anim;
    }
    update(delta: any, step: any, processors: any) {
        let result = super.update(delta, step, processors);
        this.t += delta;

        if (this.t >= this.anim.msPerFrame) {
            this.i++;
            if (this.i > 4) { this.i = 0 }
            this.frame = this.anim.frames[this.i].frame;
            this.t -= this.anim.msPerFrame;
        }

        return result;
    }
}

class Explosion {
    private scene: Phaser.Scene;
    private x: number;
    private y: number;
    private animConfig: object;
    private emitterConfig: object;
    private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    private particle: ExplosionParticle;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        this.emitterConfig = {
            
        }
    }

    explode(): void {
        
    }
}

export default Explosion
