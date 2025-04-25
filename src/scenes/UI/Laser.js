import Phaser from 'phaser'
export default class Laser extends 
Phaser.Physics.Arcade.Sprite { //Kelas ini digunakan untuk membuat object dengan tipe sprite
    constructor(scene, x, y, texture){
        //Terdapat 3 method yang dibuat dalam kelas ini. Lengkapi dengan lanjut ke tahap berikutnya!
        super (scene,x,y, texture)
        this.setScale(2) 
    }

    fire(x, y){
        this.setPosition(x,y-50) 
        this.setActive(true)
        this.setVisible(true)
    }

    die(){
        this.destroy()
    }

    update(time){
        this.setVelocityY(-200) //objek bergerak naik
        if (this.y <-10){
            this.die();
        }
    }
 }