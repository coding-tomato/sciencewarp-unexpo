/*
  Phaser 3 Map Helper
  Author: Humberto Rondon
*/

import "phaser";
import "../objects/enemies/coil";
import Player from "../objects/player"
import { prependOnceListener } from "cluster";

interface objectProp {
    [key: string] : any;
}

export default class MapHelper extends Phaser.Tilemaps.Tilemap {
    private map: any;
    private tileset: any;
    private level: any[];
    private currentScene: Phaser.Scene;
    private background: Phaser.GameObjects.Image[];
    
    constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.MapData, tilesetInTiled: string, tilesetInBoot:string) {
        super(scene, mapData);

        // Variables setup

        this.currentScene = scene;
        this.map = this.scene.add.tilemap(mapData.name);
        this.level = [];
        this.background = [];

        // Functions called at Initialization
        
        this.createBackground();
        this.setBounds();
        this.setTilesetImage(tilesetInTiled, tilesetInBoot);
    }

    /*** Set the Tileset for the Tilemap ***/
    ////////////////////////////////////////
    
    private setTilesetImage(tilesetInTiled: string, tilesetInBoot: string): void {
        this.tileset = this.map.addTilesetImage(tilesetInTiled, tilesetInBoot, 16, 16, 1, 2);
    }

    private setSpriteCollision(sprite: Phaser.GameObjects.Sprite): void {
        this.currentScene.physics.add.collider(this.level[0], sprite);
    }

    /* Set Static Layers */
    public setStaticLayers(layers: Array<string>, sprites: Array<Phaser.GameObjects.Sprite>): void {
        layers.forEach((layer, index) => {
            this.level[index] = this.map.createStaticLayer(layer, this.tileset);
            this.level[index].setCollisionByProperty({collides: true});

            for (let i = 0; i < sprites.length; i++) {
                this.currentScene.physics.add.collider(this.level[index], sprites[i]);
            }     
        });
    }

    public createPlayer(layer_n: string, obj_n: string): any { 
        let player: any = null;

        let obj_layer: Phaser.Tilemaps.ObjectLayer = null;

        this.map.objects.forEach( (element: any) => {
            if (element.name == layer_n) {
                obj_layer = element
            }
        });

        obj_layer.objects.forEach( (element: any, index: number) => {
            if (element.name == obj_n) {
                player = new Player({ scene: this.scene, x: element.x, y: element.y, key: 'moran' });
            }
        });

        return player;   
    }

    public createObjectsFromArray<T extends Phaser.GameObjects.Sprite>(layer_n: string, obj_n: string, class_n: any, texture: any): any[] {
        let obj_arr: any[] = [];
        
        let obj_layer: Phaser.Tilemaps.ObjectLayer = null;

        return obj_arr;
        
    }
    public createObjects<T extends Phaser.GameObjects.Sprite>(layer_n: string, obj_n: string, classes: any): any[] {
        let obj_arr: any[] = [];
        
        let obj_layer: Phaser.Tilemaps.ObjectLayer = null;


        this.map.objects.forEach( (layer: any) => {
            if (layer.name == layer_n) {
                obj_layer = layer;
            }
        });

        obj_layer.objects.forEach( (element: any, index: number) => {
            if (element.type == obj_n) {
                const class_n = classes[element.name];
                let newProps: objectProp = {};
                if (element.hasOwnProperty('properties')) {
                    element.properties.forEach( (element: any) => {
                        newProps[element.name] = element.value
                    })
                };
                obj_arr[index] = new class_n({ 
                    scene: this.scene, 
                    x: element.x + element.width/2, 
                    y: element.y - element.height/2, 
                    props: newProps, 
                    key: element.name 
                });
            }
        });

        return obj_arr;
    }

    private setBounds(): void {
        this.currentScene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true);   
    }

    private createBackground(): void {
        //for(let i=0; i<4; i++) {
        //    this.background[i] = this.currentScene.add.tileSprite(0, Math.max(0, 200 - i*100), this.map.widthInPixels, 344, `bg${i}`)
        //        .setTileScale(1)
        //        .setScale(1)
        //        .setOrigin(0, 0)
        //        .setScrollFactor(0.4 - 0.1 * i, 0.2 - i * 0.05)
        //        .setDepth(-i-1);
        //
        for(let i=0; i<4; i++) {
            this.background[i] = this.currentScene.add.image(0, Math.max(0, 200 - i*100), `bg${i}`)
                .setOrigin(0, 0)
                .setScrollFactor(0, 0.2 - i * 0.05)
                .setDepth(-i-1);
        }
    }  
}

