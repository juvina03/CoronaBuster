import Phaser from 'phaser'
export default class FallingObject extends
 
Phaser.Physics.Arcade.Sprite{
    //The Function() constructor creates Function objects
    constructor(scene, x, y, texture, config) {
        super (scene, x, y, texture)
        this.scene = scene
        this.speed = config.speed
        this.rotationVal = config.rotation
    }
    spawn(positionX){  
        this.setPosition(positionX, -10)
        this.setActive(true)
        this.setVisible(true)  
    }
    die(){
        this.destroy()
    }
    update(time){
        //Object bergerak turun dan berotasi
        this.setVelocityY(this.speed) 
        this.rotation += this.rotationVal
        //Jika object melawati batas bawah layout, maka menghilang
        const gameHeight = this.scene.scale.height
        if (this.y > gameHeight +5){
            this.die()
        }
    }
}