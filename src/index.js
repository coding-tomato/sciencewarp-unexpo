import Bootstrap from  "./Bootstrap.js";
import Menu      from  "./scenes/menu.js";
import DialogBox from  "./scenes/hud/dialogbox.js";
import Pause     from  "./scenes/pause.js";
import TestLevel from  "./scenes/test_level.js";

const scene = [
    Bootstrap, Menu, DialogBox, Pause, TestLevel
];

const [width, height] = [480, 270];

const config = {
    title: "Science Warp",
    width,
    height,
    parent: "container",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 600 },
            debug: false,
        },
    },
    backgroundColor: "#4da6ff",
    zoom: 2,
    render: {
        pixelArt: true,     
        antialias: false,
    },
    scene,
};

new Phaser.Game(config);
