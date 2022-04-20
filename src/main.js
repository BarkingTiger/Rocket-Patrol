/*
Kevin Khau
Modded Rocket Patrol
4/19/21
~3-4 hours

Implement a simulatneous two-player mode (30)
Create a new spaceship type that's smaller , moves faster, and is worth more points (20)
Create new artwork for all of the in-game assets (20)
Display the time remaining on the screen(10)
Implement parallax scrolling(10)
Create a new scrolling tile sprite for the background (5)
Implement the speed inreate that happens after 30 seconds in the original game (5)
*/
let config = {
    type: Phaser.CANVAS,
    width: 640, 
    height: 480, 
    scene: [ Menu, Play ]
}

let game = new Phaser.Game(config);

let keyW, keyA, keyD, keyF, keyR, keyUP, keyLEFT, keyRIGHT;

//set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

