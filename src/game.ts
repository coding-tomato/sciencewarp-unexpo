import "phaser";

import Bootstrap from "./bootstrap";
import Menu from "./scenes/menu";

import TeslaLevel from './scenes/tesla_level'

const config: Phaser.Types.Core.GameConfig = {
	title: "Science Warp",
	width: 380,
	height: 240,
	parent: "container",
	physics: {
		default: "arcade",
		arcade: {
			gravity: { y: 800 },
			debug: true
		},
	},
	backgroundColor: "#ffb570",
	zoom: 2,
	render: {
		pixelArt: true,
		antialias: false
	},
	scene: [
		Bootstrap,
		Menu,
		TeslaLevel
	]
};

export class ScienceWarpGame extends Phaser.Game {
	constructor(config: Phaser.Types.Core.GameConfig) {
		super(config);
	}
}

window.onload = () => {
	const game = new ScienceWarpGame(config);
}
