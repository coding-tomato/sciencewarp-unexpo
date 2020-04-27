export default class Init {
    static sprite(scene, sprite) {
        return {
            /**
            * Adds a sprite into a scene and bootstraps its physics
            * @param {boolean} [gravity = true] - whether gravity should affect the sprite or not
            */
            add(gravity) {
                scene.add.existing(sprite);
                scene.physics.world.enable(sprite);
                sprite.body.setAllowGravity(gravity);
            },
            resize(size, offset = { x: 0, y: 0 }) {
                sprite.body.setSize(size.x, size.y);
                sprite.body.setOffset(offset.x, offset.y);
            },
            invert(x, y) {
                sprite.body.setVelocity(
                    sprite.body.velocity.x * x,
                    sprite.body.velocity.y * y,
                );
            }
        }
    }
}
