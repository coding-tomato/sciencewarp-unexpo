/*
  Phaser 3 Map Helper
  Author: Humberto Rondon
*/

import "../objects/enemies/coil.js";
import Player from "../objects/player.js";

export default class MapHelper extends Phaser.Tilemaps.Tilemap {
    //  map;
    //  lastPlayerXPos;
    //  tileset;
    //  level;
    //  currentScene;
    //  background;

    constructor(
        scene,
        mapData,
        tilesetInTiled,
        tilesetInBoot
    ) {
        super(scene, mapData);

        // Variables setup

        this.currentScene = scene;
        this.map = this.scene.add.tilemap(mapData.name);
        this.level = [];
        this.background = [];
        this.lastPlayerXPos = 0;

        // Functions called at Initialization

        this.createBackground();
        this.setBounds();
        this.setTilesetImage(tilesetInTiled, tilesetInBoot);
    }

    /*** Set the Tileset for the Tilemap ***/
    ////////////////////////////////////////

     setTilesetImage(
        tilesetInTiled,
        tilesetInBoot
    ) {
        this.tileset = this.map.addTilesetImage(
            tilesetInTiled,
            tilesetInBoot,
            16,
            16,
            1,
            2
        );
    }

     setSpriteCollision(sprite) {
        this.currentScene.physics.add.collider(this.level[0], sprite);
    }

    /* Set Static Layers */
     setStaticLayers(
        layers,
        sprites
    ) {
        layers.forEach((layer, index) => {
            this.level[index] = this.map.createStaticLayer(layer, this.tileset);
            this.level[index].setCollisionByProperty({ collides: true });

            for (let i = 0; i < sprites.length; i++) {
                this.currentScene.physics.add.collider(
                    this.level[index],
                    sprites[i]
                );
            }
        });
    }

     createPlayer(layer_n, obj_n) {
        let player = null;

        let obj_layer = null;

        this.map.objects.forEach((element) => {
            if (element.name == layer_n) {
                obj_layer = element;
            }
        });

        obj_layer.objects.forEach((element, index) => {
            if (element.name == obj_n) {
                player = new Player({
                    scene: this.scene,
                    x: element.x,
                    y: element.y,
                    key: "moran",
                });
                this.currentScene.checkpointPos = {
                    x: element.x,
                    y: element.y,
                };
            }
        });

        return player;
    }

     createObjects(
        layer_n,
        obj_n,
        classes
    ) {
        let obj_arr = [];

        let obj_layer = null;

        this.map.objects.forEach((layer) => {
            if (layer.name == layer_n) {
                obj_layer = layer;
            }
        });

        obj_layer.objects.forEach((element, index) => {
            if (element.type == obj_n) {
                const class_n = classes[element.name];
                let newProps = {};
                if (element.hasOwnProperty("properties")) {
                    element.properties.forEach((element) => {
                        newProps[element.name] = element.value;
                    });
                }
                obj_arr[index] = new class_n({
                    scene: this.scene,
                    x: element.x + element.width / 2,
                    y: element.y - element.height / 2,
                    props: newProps,
                    key: element.name,
                });
            }
        });

        return obj_arr;
    }

     setBounds() {
        this.currentScene.cameras.main.setBounds(
            0,
            0,
            this.map.widthInPixels,
            this.map.heightInPixels,
            true
        );
    }

     createBackground() {
        // Manually adjusted values to make parallax height scroll look good
        const scrollValues = [0.5, 0.3, 0.05, 0];
        const tileSpriteYValues = [500, 200, 25, 0];

        for (let i = 0; i < 4; i++) {
            this.background[i] = this.currentScene.add
                .tileSprite(0, tileSpriteYValues[i], 512, 512, `bg${i}`)
                .setScale(1)
                .setOrigin(0, 0)
                .setScrollFactor(0, scrollValues[i])
                .setDepth(-i - 1);
        }
    }

     parallaxUpdate() {
        this.background.forEach((i, index) => {
            i.tilePositionX =
                this.currentScene.cameras.main.scrollX / (index + 1.5);
        });
    }
}
