var BasicGame = {
     SCORELEVEL : [10,20,30],
     MAXBULLETS:10,
     BULLETADD:1,
     BULLET_VELOCITY:450,
     SPEEDUPINTERVAL : 8,
     NumOfSpeedUp : 200,
     PlayerInitSpeed : 200,
     // coins
     NumOfCoins : 2000,
     CoinAddInterval : 1.5,
     
     // item effect
     SpeedUpStep : 50,
     SpeedUpTime : 5,
     
     BulletAddInterval : 10,
     NumOfBulletAdd : 2000,
     
     NumOfBlood : 20,
     BloodAdded : 10,
     BloodAddInterval : 10,
     BloodScore : 20,
     
     
     
     // player property
     PlayerInitHealth : 100,
     PlayerMaxHealth : 150,
     RecoverTime : 5,
     PlayerMaxSpeed : 400,
     
     // enemy
     NumOfEnemy : 2000,
     EnemyHitDamage : -80,
     EnemyScoreReduce : -100,
     EnemyScoreAdd : 50,
     NoOfEnemyBullet : 2000,
     Enemy_Shot_Dealy : Phaser.Timer.SECOND*3,
     Hit_Player_Score_Reduce : -50,
     Hit_player_Health_damage : -20,
     
     
     // game time
     Game_Time : Phaser.Timer.MINUTE * 1 + Phaser.Timer.SECOND * 30,
    
     //Game_Time : Phaser.Timer.SECOND * 30
};

BasicGame.Boot = function (game) {
    
   

};


BasicGame.Boot.prototype = {

    init: function () {

        //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            //  If you have any desktop specific settings, they can go in here
            //this.scale.pageAlignHorizontally = true;
        }
        else
        {
            //  Same goes for mobile settings.
            //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1280, 768);
            this.scale.forceLandscape = true;
            this.scale.pageAlignHorizontally = true;
        }

    },

    preload: function () {

        //  Here we load the assets required for our preloader (in this case a background and a loading bar)
        //this.load.image('preloaderBackground', 'images/preloader_background.jpg');
        //this.load.image('preloaderBar', 'images/preloadr_bar.png');

    },

    create: function () {

        //  By this point the preloader assets have loaded to the cache, we've set the game settings
        //  So now let's start the real preloader going
        this.state.start('Preloader');

    }

};
