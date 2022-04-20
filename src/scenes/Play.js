class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        //load images/tile sprites
        this.load.image('p1rocket', './assets/Rocket1.png');
        this.load.image('p2rocket', './assets/Rocket2.png');
        this.load.image('spaceship', './assets/Spaceship.png');
        this.load.image('spaceship2', './assets/Spaceship2.png');
        this.load.image('starfield', './assets/Starfield.png');
        this.load.image('stars', './assets/Stars.png')

        //load spritesheet
        this.load.spritesheet('explosion', './assets/Explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        //place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);


        

        //green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        
        //white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
  
        //add rocket (p1)
        this.p1Rocket = new Rocket2(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'p1rocket').setOrigin(0.5, 0);
        this.p2Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'p2rocket').setOrigin(0.5, 0);
        //add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0, 0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0, 0);
        this.ship04 = new Spaceship2(this, game.config.width + borderUISize * 6, borderUISize * 4 - 20, 'spaceship2', 0, 100).setOrigin(0, 0);
        //define keys
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
      
        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        //initalize score
        this.p1Score = 0;
        this.p2Score = 0;

        //display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);
        this.scoreRight = this.add.text(borderUISize + borderPadding * 44, borderUISize + borderPadding * 2, this.p2Score, scoreConfig);

        //GAME OVER flag
        this.gameOver = false;

        //speed up flag
        this.thirty = false;

        //60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width / 2, game.config.height / 2 - 64, 'GAME OVER', scoreConfig).setOrigin(0.5);
            if (this.p1Score > this.p2Score) {
                this.add.text(game.config.width / 2, game.config.height / 2, 'P1 WINS', scoreConfig).setOrigin(0.5);
            }
            else if (this.p1Score < this.p2Score) {
                this.add.text(game.config.width / 2, game.config.height / 2, 'P2 WINS', scoreConfig).setOrigin(0.5);
            }
            else {
                this.add.text(game.config.width / 2, game.config.height / 2, 'TIED', scoreConfig).setOrigin(0.5);
            }
            this.add.text(game.config.width / 2, game.config.height / 2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        //initialize timer
        this.timer = this.clock.getRemainingSeconds();

        //display timer
        let timerConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.timerCenter = this.add.text(borderUISize + borderPadding * 22, borderUISize + borderPadding * 2, this.timer, timerConfig);
    }

    update() {
        //check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        //after 30 seconds speed up all ships
        if (Math.round(this.clock.getElapsedSeconds()) == 30 && this.thirty == false) {
            this.ship01.moveSpeed *= 2;
            this.ship02.moveSpeed *= 2;
            this.ship03.moveSpeed *= 2;
            this.ship04.moveSpeed *= 2;
            this.thirty = true;
        }

        //move stars for parallax scrolling
        this.starfield.tilePositionX -= 2;
        this.stars.tilePositionX -= 4;
        
        if (!this.gameOver) {
            this.p1Rocket.update();     //update p1rocket sprite
            this.p2Rocket.update();     //update p2rocket sprite
            this.ship01.update();       //update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
            this.timer = Math.round(this.clock.getRemainingSeconds());  //update timer
            this.timerCenter.text = this.timer;
        }

        //check collisions
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p2Rocket, this.ship04)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship04);
        }
        if (this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship03);
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship02);
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode2(this.ship01);
        }

    }

    checkCollision(rocket, ship) {
        //simple AABB checking
        if (rocket.x < ship.x + ship.width && rocket.x + rocket.width > ship.x && rocket.y < ship.y + ship.height && rocket.height + rocket.y > ship.y) {
            return true;
        }
        else {
            return false;
        }
    }
    

    shipExplode(ship) {
        //temporarily hide ship
        ship.alpha = 0;

        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after anim completes
            ship.reset();                       //reset ship postion
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite
        })

        //score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        this.sound.play('sfx_explosion');
    }

    shipExplode2(ship) {
        //temporarily hide ship
        ship.alpha = 0;

        //create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             //play explode animation
        boom.on('animationcomplete', () => {    //callback after anim completes
            ship.reset();                       //reset ship postion
            ship.alpha = 1;                     //make ship visible again
            boom.destroy();                     //remove explosion sprite
        })

        //score add and repaint
        this.p2Score += ship.points;
        this.scoreRight.text = this.p2Score;

        this.sound.play('sfx_explosion');
    }
}