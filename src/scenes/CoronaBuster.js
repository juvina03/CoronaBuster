import Phaser from "phaser"
//Use ./ when you want to reference a file or directory that is in the same directory as the current file.
//Use ../ when you want to reference a file or directory that is in the parent directory of the current file.
import FallingObject from "./UI/FallingObject.js"
import Laser from "./UI/Laser.js";

export default class CoronaBusterScene extends Phaser.Scene {
  constructor() {
    super("corona-buster-scene");
  }
  init() {
    //------WRITE CODE BELLOW-----//
    //this.platforms = []; // Menginisialisasi platforms dengan array kosong
    this.clouds = undefined;
    this.nav_left = false;
    this.nav_right = false;
    this.shoot = false;
    this.player = undefined;
    this.speed = 120
    this.cursor = undefined;
    this.enemies = undefined;
    this.enemySpeed = 50;
    this.lasers = undefined;
    this.lastFired = 10;
    this.scoreLabel = undefined;
    this.score = 0;
    this.lifeLabel = undefined;
    this.life = 3;
    this.handsanitizer = undefined;
    this.backsound = undefined;
  }

  preload(){
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("cloud", "images/cloud.png");
    this.load.image("enemy", "images/enemy.png");
    this.load.image("explosion", "images/explosion.png");
    this.load.image("gameover", "images/gameover.png");
    this.load.image("handsanitizer", "images/handsanitizer.png");
    this.load.image("laser-bolts", "images/laserbolts.png");
    this.load.image("left-btn", "images/left-btn.png");
    this.load.image("right-btn", "images/right-btn.png");
    this.load.image("shoot-btn", "images/shoot-btn.png");
    this.load.spritesheet("player", "images/ship.png", {
      frameWidth : 66, frameHeight: 66
    });
    this.load.spritesheet('laser','images/laser-bolts.png',{
      frameWidth: 16,
      frameHeight: 16,
    })

    //sound
    this.load.audio("bgsound", "sfx/AloneAgainst Enemy.ogg");
    this.load.audio("laser", "sfx/sfx_laser.ogg");
    this.load.audio("destroy", "sfx/destroy.mp3");
    this.load.audio("life", "sfx/handsanitizer.mp3");
    this.load.audio("gameover", "sfx/gameover.wav");
  }

  create() {
    //------WRITE CODE BELLOW-----//
    const gameWidht = this.scale.width*0.5;
    const gameHeight = this.scale.height*0.5;
    this.add.image (gameWidht, gameHeight, "background")
    //cari dan simpan nilai dari setengah lebar dan tinggi layout 
    //dan gunakan untuk menempatkan bg agar berada ditengah
    
    this.clouds = this.physics.add.group ({
      key : 'cloud',
      repeat : 20,
    })

    Phaser.Actions.RandomRectangle(
      this.clouds.getChildren(),
      this.physics.world.bounds
    )  

    this.createButton();
    this.player = this.createPlayer()

    // Initialize cursor keys
    this.cursors = this.input.keyboard.createCursorKeys(); // Add this line

    this.enemies = this.physics.add.group({
      classType: FallingObject,
      maxSize: 10,
      runChildUpdate: true
    })
    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 5000), 
      callback: this.spawnEnemy, 
      callbackScope: this,
      loop: true
    })

    this.lasers = this.physics.add.group({
      classType: Laser,
      maxSize: 10,
      runChildUpdate: true
    })
    // Set up overlap between lasers and enemies
    //When an overlap is detected, the hitEnemy method is called with the laser and enemy as parameters.
    //The null parameter indicates that no additional filtering is needed, and this is the context in which the hitEnemy method should be called.
    this.physics.add.overlap(this.lasers, this.enemies, this.hitEnemy, null, this);

    //score label
    this.scoreLabel = this.add.text(10, 10, "Score", {
      fontSize: "16px",
      color: "black",
      backgroundColor: "white",
    }).setDepth(1); //control the rendering order of game objects. 
    //Objects with a lower depth value are drawn first, and those with a higher depth value are drawn on top of them. 
    // This is particularly useful when you have overlapping objects and want to control which ones appear in front of others. 

    //create life
    this.lifeLabel = this.add.text(10,30,"Life",{
      fontSize: "16px",
      color: "black",
      backgroundColor: "white",
    }).setDepth(2);

    this.physics.add.overlap(this.player, this.enemies, this.decreaseLife, null, this);

    this.handsanitizer = this.physics.add.group({
      classType: FallingObject,
      runChildUpdate: true,
    });
    this.time.addEvent({
      delay: 10000,
      callback: this.spawnHandsanitizer,
      callbackScope: this,
      loop: true,
    });

    this.physics.add.overlap(this.player, this.handsanitizer, this.increaseLife, null, this);

    this.backsound = this.sound.add("bgsound");
    var soundConfig = {
      loop: true,
      volume: 0.5,
    }; this.backsound.play(soundConfig);
    /* play = Memainkan backsound 
    loop: true = Pengaturan sound */
  }

  update(time) {
    //this.clouds.children.iterate ((child) => {
      //child.setVelocityY(20) //semua awan bergerak kebawah dengan v 20
      //if (child.y > this.scale.height){
        //child.x = Phaser.Math.Between (10,400)
        //child.y = 0;
      //}
    //})

    this.clouds.children.iterate((child) => {
      // Check if child is a Phaser.Physics.Arcade.Sprite
      if (child instanceof Phaser.Physics.Arcade.Sprite) {
          child.setVelocityY(20); // All clouds move down with velocity 20
          if (child.y > this.scale.height) {
              child.x = Phaser.Math.Between(10, 400);
              child.y = 0; // You can also use child.setY(0) if you prefer
          }
      }
    });
    this.movePlayer(this.player, time);

    this.scoreLabel.setText("Score : " + this.score);
    // "Score : " = Agar scoreLabel selalu menampilkan nilai score terkini. 

    this.lifeLabel.setText("Life : " + this.life );
  }

  createButton (){
    this.input.addPointer(3)

    let shoot = this.add.image(320,550,'shoot-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

    let nav_left = this.add.image(50,550,'left-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

    let nav_right = this.add.image(nav_left.x + nav_left.displayWidth + 20, 550,'right-btn').setInteractive().setDepth(0.5).setAlpha(0.8)

    nav_left.on ('pointerdown',() => {
      //ketika pointer up (clicked), maka properti nav left akan bernilai true
      this.nav_left = true
    }, this)

    nav_left.on ('pointerout',() => {
      //ketika pointer out (not clicked), maka properti nav left akan bernilai true
      this.nav_left = false
    }, this)

    nav_right.on ('pointerdown',() => {
      this.nav_right = true
    }, this)

    nav_right.on ('pointerout',() => {
      this.nav_right = false
    }, this)

    shoot.on ('pointerdown',() => {
      this.shoot = true
    }, this)

    shoot.on ('pointerout',() => {
      this.shoot = false
    }, this)
  }

  movePlayer(player, time) {
    // Check for left and right movement
    if (this.cursors.left.isDown || this.nav_left) {
      player.setVelocityX(this.speed * -1);
      player.anims.play("left", true);
      player.setFlipX(false);
    } else if (this.cursors.right.isDown || this.nav_right) {
      player.setVelocityX(this.speed);
      player.anims.play("right", true);
      player.setFlipX(true);
    } 
    //// Check for up and down movement
    else if (this.cursors.up.isDown) {
      player.setVelocityY(this.speed * -1); // Move up
      player.anims.play("turn", true); // Play turn animation
    } else if (this.cursors.down.isDown) {
      player.setVelocityY(this.speed); // Move down
      player.anims.play("turn", true); // Play turn animation
    } else {
      player.setVelocityX(0);
      player.setVelocityY(0);
      player.anims.play("turn");
    }

     //above there’s codes for moving player
    if ((this.shoot) && time > this.lastFired) {
      const laser = this.lasers.get(0, 0, 'laser')
      if (laser) {
        laser.fire(this.player.x, this.player.y)
        this.lastFired = time + 100;
        this.sound.play("laser");
      }
    }
  }
  
  createPlayer(){
    const player = this.physics.add.sprite(200, 450, 'player') 
    player.setCollideWorldBounds(true)
    this.anims.create({
      key: "turn",
      frames: [
        {
          key: "player",
          frame: 0,
        },
      ],
    });
    this.anims.create({
      key: "left",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    this.anims.create({
      key: "right",
      frames: this.anims.generateFrameNumbers("player", {
        start: 1,
        end: 2,
      }),
    });
    return player;
  }

  spawnEnemy() {
    const config = { //mengatur kecepatan dan besar rotasi dari enemy
    speed: 50,
    rotation: 0.05
    }
    // @ts-ignore
    const enemy = this.enemies.get(0,0,'enemy',config)
    const positionX = Phaser.Math.Between(50, 350)
    if (enemy) {
    enemy.spawn(positionX) //Memanggil method spawn dengan parameter nilai posisi sumbux
    }
  }

  hitEnemy(laser, enemy) {
    laser.die()
    enemy.die()
    this.score += 1;
    this.sound.play("destroy");
  }

  decreaseLife(player, enemy) {
    enemy.die();
    this.life--;
    if (this.life == 2) {
      player.setTint(0xff0000);
    } else if (this.life == 1) {
      player.setTint(0xff0000).setAlpha(0.2);
    } else if (this.life == 0) {
      this.scene.start("over-scene", { score: this.score });
      
      this.sound.stopAll();
      this.sound.play("gameover");
      //----------------------------------//
      this.scene.start("over-scene", { score: this.score });
    }
  }

  spawnHandsanitizer(){
    const config = {
      speed: 60,
      rotation: 0,   // ------------> handsanitizer tidak berputar
    };
    // @ts-ignore
    const handsanitizer = this.handsanitizer.get(0, 0, "handsanitizer", config);
    const positionX = Phaser.Math.Between(70, 330);
    if (handsanitizer) {
      handsanitizer.spawn(positionX);
    }
  }

  increaseLife(player, handsanitizer) {
    handsanitizer.destroy();
    this.life++;
    if (this.life >= 3) {               //------> Menambah 1 life
        player.clearTint().setAlpha(1);
    } else if (this.life == 2) {
        player.setTint(0x00ff00);
    } else if (this.life == 1) {
        player.setTint(0xffff00);
    }
    this.sound.play("life");
  }
}