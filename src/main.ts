import Phaser from "phaser";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  width: 320,
  height: 240,
  backgroundColor: "#18212b",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: {
    create(this: Phaser.Scene) {
      this.add.text(160, 120, "Hello world!", {
        fontSize: "28px",
        color: "#f5f1e8",
      }).setOrigin(0.5);
    },
  },
});
