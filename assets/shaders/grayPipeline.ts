import "phaser";

class GrayscalePipeline extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {
    constructor(game: any) {
        const config = {
            game: game,
            renderer: game.renderer,
            fragShader: `
                precision mediump float;
                uniform sampler2D uMainSampler;
                varying vec2 outTexCoord;
                
                void main(void) {
                    vec4 color = texture2D(uMainSampler, outTexCoord);
                    float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
                    gl_FragColor = vec4(vec3(gray), 1.0);
                }
            `
        }
        super(config);
    }
}

export default GrayscalePipeline;