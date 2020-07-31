class Sabana {
    static Init(object, scene) {
        return {
            Sprite(size = undefined, offset = undefined) {
                scene.add.existing(object);
                scene.physics.world.enable(object);
                if (size) object.body.setSize(size.x, size.y);
                if (offset) object.body.setOffset(offset.x, offset.y);
            }
        }
    }
}

export default Sabana;