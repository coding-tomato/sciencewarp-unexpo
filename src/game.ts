import "phaser";
import Bootstrap from "./bootstrap";
import Menu from "./scenes/menu";

const config: Phaser.Types.Core.GameConfig = {
  title: "Science Warp",
  width: 800,
  height: 794,
  parent: "container",
  scene: [
    Bootstrap,
    Menu
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
