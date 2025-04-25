import Phaser from 'phaser'

export default class AmongUsScene extends Phaser.Scene {
    constructor() {
        super('Among-Us')
    }

    preload() {
        this.load.image('maps','images/Maps.png');
        this.load.image('playerRed', 'images/Red.png');
        this.load.image('playerCyan','images/Cyan.png');
        this.load.image('playerOrange', 'images/Orange.png');
        this.load.image('playerPink','images/Pink.png');
        this.load.image('playerGreen','images/Green.png');
    }

    create() {
        this.add.image(960,540,'maps').setScale(0.8);
        this.add.image(450,370,'playerPink').setScale(0.5);
        this.add.image(1600,550,'playerGreen').setScale(0.3);
        this.add.image(1000,400,'playerRed');
        this.add.image(980,850,'playerCyan').setScale(0.3);
        this.add.image(450,780,'playerOrange').setScale(0.5);
    }
}
