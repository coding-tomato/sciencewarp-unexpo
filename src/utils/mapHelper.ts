import "phaser";

export default class MapHelper extends Phaser.Tilemaps.Tilemap {
    private map: any;
    private tileset: any;
    private level: any[];
    private currentScene: Phaser.Scene

    constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.MapData) {
        super(scene, mapData);

        this.currentScene = scene;
        this.map = this.scene.add.tilemap(mapData.name);
        this.level = [];
    }

    setTilesetImage(tilesetInTiled: string, tilesetInBoot: string): void {
        this.tileset = this.map.addTilesetImage(tilesetInTiled, tilesetInBoot);
    }

    setStaticLayers(layers: Array<string>, sprites: Array<Phaser.GameObjects.Sprite>): void {
        layers.forEach((layer, index) => {
            this.level[index] = this.map.createStaticLayer(layer, this.tileset);
            this.level[index].setCollisionByProperty({collides: true});

            for (let i = 0; i < sprites.length; i++) {
                this.currentScene.physics.add.collider(this.level[index], sprites[i]);
            }     
        });
    }

    createObjects(sprite: string) {
        this.map.createFromObjects('pointer', 22, { key: sprite });
    }
}