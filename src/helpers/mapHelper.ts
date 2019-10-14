/*
    Phaser 3 Map Helper
    Author: Humberto Rondon
*/

import "phaser";
import "../objects/enemies/coil";
import Coil from "../objects/enemies/coil";

export default class MapHelper extends Phaser.Tilemaps.Tilemap {
    private map: any;
    private tileset: any;
    private level: any[];
    private currentScene: Phaser.Scene;

    constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.MapData, tilesetInTiled: string, tilesetInBoot:string) {
        super(scene, mapData);

        // Variables setup

        this.currentScene = scene;
        this.map = this.scene.add.tilemap(mapData.name);
        this.level = [];

        console.log(this.map.objects.forEach((element: any) => {
            if (element.name == 'pointer') {
                console.log(element);
            }

        }));
        // Functions called at Initialization
        this.setBounds();
        this.setTilesetImage(tilesetInTiled, tilesetInBoot);
    }

    /*** Set the Tileset for the Tilemap ***/
    ////////////////////////////////////////
    
    private setTilesetImage(tilesetInTiled: string, tilesetInBoot: string): void {
        this.tileset = this.map.addTilesetImage(tilesetInTiled, tilesetInBoot);
        
    }

    public setStaticLayers(layers: Array<string>, sprites: Array<Phaser.GameObjects.Sprite>): void {
        layers.forEach((layer, index) => {
            this.level[index] = this.map.createStaticLayer(layer, this.tileset);
            this.level[index].setCollisionByProperty({collides: true});

            for (let i = 0; i < sprites.length; i++) {
                this.currentScene.physics.add.collider(this.level[index], sprites[i]);
            }     
        });
    }

    public createObjects<T extends Phaser.GameObjects.Sprite>(layer_n: string, obj_n: string): any[] {
        let obj_arr: any[] = [];

        let obj_layer: Phaser.Tilemaps.ObjectLayer = null;

        this.map.objects.forEach( (element: any) => {
            if (element.name == layer_n) {
                obj_layer = element
            }
        })

        obj_layer.objects.forEach( (element: any, index: number) => {
            if (element.name == obj_n) {
                obj_arr[index] = new Coil({ scene: this.scene, x: element.x, y: element.y, direction: { x: 1, y: 0}, key: 'coil' });
            }
        })

        return obj_arr;
    }

    private setBounds(): void {
        this.currentScene.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels, true);   
    }
}