import "phaser";

const config: Phaser.Types.Core.GameConfig = {
  title: "Science Warp",
  width: 600,
  height: 800,
  parent: "container",
};

export class ScienceWarpGame extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = () => {
  const game = new ScienceWarpGame(config);
}
