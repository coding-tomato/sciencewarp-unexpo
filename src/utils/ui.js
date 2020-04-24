function createComponent(image, txt) {
    return {
        img: this.add.image(image.x, image.y, image.handle),
        text: this.add.bitmapText(
            txt.x,
            txt.y,
            txt.font,
            txt.text,
        ),
    };
}

function createPowerup(props) { 
    let colorGray = 0x555555;
    this.add.image(props.x, props.y, "powerups", props.frame)
        .setTint(colorGray);
}

function createUI() {
    // Coins - Top left of UI
    let [ width, height ] = [ 
        this.cameras.main.width, 
        this.cameras.main.height
    ];

    this.hud.coins = createComponent(
        { x: 20, y: 20, handle: "hud-piece" },
        { x: 35, y: 10, font: "numbers", text: this.data.get("coins") },
    );

    this.hud.level = createComponent(
        { x: width - 45, y: height - 30, handle: "hud-portal" },
        { 
            x: width - 30, y: height - 30, font: "numbers", 
            text: this.data.get("levels")
        }
    );

    // Powerups - Bottom left of UI
    // They start deactivated - tinted gray
    let powerupHeight = height - 20;

    this.hud.powerup = {
        jump: createPowerup(50, powerupHeight, 0),
        pack: createPowerup(80, powerupHeight, 7),
        dash: createPowerup(20, powerupHeight, 14),
    }

    // Config for lives group
    let config = {
        key: "hud-heart",
        repeat: 4,
        setXY: {
            x: this.cameras.main.width - 120,
            y: 20,
            stepX: 25,
        },
    };
    this.hud.lives = this.add.group(config);
    this.hud.lives.children.iterate((element) => {
        element.setScrollFactor(0, 0).setScale(0.8);
    });

    // Cointainer
    this.hud.container = this.add.container(0, 0);
    this.hud.container.add([
        this.hud.coins.img,
        this.hud.coins.text,
        this.hud.level.img,
        this.hud.level.text,
        this.hud.powerup.dash,
        this.hud.powerup.jump,
        this.hud.powerup.pack,
    ]);
    this.hud.container.setScrollFactor(0, 0);

    this.hud.fuelBar = this.add
        .sprite(66, 18, "fuel-bar")
        .setScale(1)
        .setVisible(false);

    this.hud.fuelFrame = this.add
        .sprite(66, 18, "fuel-frame")
        .setScale(1)
        .setVisible(false);
}