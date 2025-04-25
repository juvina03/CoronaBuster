import Phaser from "phaser";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super("start-scene");
  }

  init(data) {
    this.playButton = undefined;
    //this.score = data.score;
  }

  preload() {
    this.load.image("background", "images/bg_layer1.png");
    //this.load.image("replay-button", "images/replay.png");
    
    //sound
    this.load.audio("bgsound", "sfx/AloneAgainst Enemy.ogg");
  }

  create() {
    this.sound.play("bgsound");
    this.add.image(200, 320, "background");
    this.add.text(70, 280, "Corona Buster", {
        fontSize: "32px",
        fontStyle: "italic",
        //fontFamily: "",
        color: "black",
    }).setDepth(1);

    //play button
    this.playButton = this.add.text(120, 320, 'Play Now', {
        fontSize: "32px", 
        color: "darkorange",
        fontStyle: "bold"
    }).setInteractive();

    this.playButton.once("pointerup", () => {
          this.scene.start("corona-buster-scene");
        },
        this
      );
      //Kode untuk berpindah scene. Diisi dengan key yang ditulis pada kode super di method constructor
  }
}