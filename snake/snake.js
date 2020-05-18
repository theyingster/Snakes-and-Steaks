    var length = 800;
var width = 600;
var game = new Phaser.Game(length, width, Phaser.AUTO, 'phaser-example', { 
    preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.spritesheet('snake', 'assets/games/snake/snake.png', 40, 40);
    game.load.image('background', 'assets/games/snake/background.jpg');
    game.load.image('steak', 'assets/games/snake/steak.jpg');
    game.load.image('pill', 'assets/games/snake/pill.jpg');
    game.load.image('snakeBody', 'assets/games/snake/snakeBody.jpg');
}

var snake;
var snakeList = [];
var steak;
var score = 0;
var keyX;
var keyY;
var speed;
var endgameText;
var pill;
var pillTimer = 10000;
var locX = [];
var locY = [];
var velX = [];
var velY = [];

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //background
    background = game.add.tileSprite(0, 0, 800, 600, 'background');

    //snake
    var x = Math.round((Math.random()-0.5)*length/2 + length / 2);
    var y = Math.round((Math.random()-0.5)*width/2 + width / 2);
    snakes = game.add.group();
    snake = snakes.create(x, y, 'snake');
    
    snake.anchor.setTo(0.5, 0.5);
    snakes.enableBody = true;
    game.physics.enable(snakes, Phaser.Physics.ARCADE);
    snake.body.velocity.x = 200;

    //steak
    x = Math.round(Math.random()*(length-100)+50);
    y = Math.round(Math.random()*(width-100)+50);
    steaks = game.add.group();
    steak = steaks.create(x, y, 'steak');
    steak.enableBody = true;
    game.physics.enable(steak, Phaser.Physics.ARCADE);
    steak.anchor.setTo(0.5, 0.5);

    //pill
    x = Math.round(Math.random()*(length-100)+50);
    y = Math.round(Math.random()*(width-100)+50);
    pills = game.add.group();
    console.log("first pill");
    pill = pills.create(x, y, 'pill');
    pill.enableBody = true;
    game.physics.enable(pill, Phaser.Physics.ARCADE);
    pill.anchor.setTo(0.5, 0.5);

    //The score
    scoreString = 'Score : ';
    scoreText = game.add.text(10, 10, scoreString + score, { font: '34px Arial', fill: '#fff' });

    //  Text
    stateText = game.add.text(game.world.centerX,game.world.centerY,' ', { font: '84px Arial', fill: '#fff' });
    stateText.anchor.setTo(0.5, 0.5);
    stateText.visible = false; 

    //  And some controls to play the game with
    cursors = game.input.keyboard.createCursorKeys();
    key = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR); 
}

function update(){
    if (snake.alive){
    //  Reset the snake, then check for movement keys
        if (snakes.length >= 2){
            for (var i = snakes.length-1; i > 0; i--){
                for (var array = 0; array < locX.length; array++){
                    var snake1x = Math.round(snakes.children[i].body.x*100)
                    var snake2x = Math.round(locX[array]*100)
                    var snake1y = Math.round(snakes.children[i].body.y*100)
                    var snake2y = Math.round(locY[array]*100)
                    if (snake1x == snake2x && snake1y == snake2y){
            snakes.children[i].body.velocity.x = velX[array];
            snakes.children[i].body.velocity.y = velY[array];
        if (i == snakes.length-1){
            locX.shift();
            locY.shift();
            velY.shift();
            velX.shift();
        }
        break;
                }
            }
        }
        }
        if (cursors.up.isDown && (Math.abs(snake.body.velocity.y) != 200 || snakes.length == 1))
        {

locX.push(snake.body.x);
locY.push(snake.body.y);
snake.body.velocity.x = 0;
snake.body.velocity.y = -200;
velX.push(snake.body.velocity.x)
velY.push(snake.body.velocity.y)
        }
        else if (cursors.down.isDown && (Math.abs(snake.body.velocity.y) != 200 || snakes.length == 1))
        {
locX.push(snake.body.x);
locY.push(snake.body.y);
snake.body.velocity.x = 0;
snake.body.velocity.y = 200;
velX.push(snake.body.velocity.x)
velY.push(snake.body.velocity.y)
        }
        else if (cursors.right.isDown && (Math.abs(snake.body.velocity.x) != 200 || snakes.length == 1))
        {
locX.push(snake.body.x);
locY.push(snake.body.y);
snake.body.velocity.x = 200;
snake.body.velocity.y = 0;
velX.push(snake.body.velocity.x)
velY.push(snake.body.velocity.y)
        }
        else if (cursors.left.isDown && (Math.abs(snake.body.velocity.x) != 200 || snakes.length == 1))
        {
locX.push(snake.body.x);
locY.push(snake.body.y);
snake.body.velocity.x = -200;
snake.body.velocity.y = 0;
velX.push(snake.body.velocity.x)
velY.push(snake.body.velocity.y)
        }
    }

    if(steaks.getFirstExists(false)){
        x = Math.round(Math.random()*length);
        y = Math.round(Math.random()*width);
        steak.reset(x, y);
    }
    
    if(pills.getFirstExists(false) && game.time.now > pillTimer){
        x = Math.round(Math.random()*length);
        y = Math.round(Math.random()*width);
        pill.reset(x, y);
        spawnPill();
    }

    tempsnake = snakes.children[snakes.length-1]
    keyX = tempsnake.body.x - tempsnake.body.velocity.x/5
    keyY = tempsnake.body.y - tempsnake.body.velocity.y/5

    //Run collision 
    wallHandler();
    game.physics.arcade.overlap(snake, steak, steakHandler, null, this);
    game.physics.arcade.overlap(snake, pills, pillHandler, null, this);  
    if (snakes.length >= 3){
        for (var i = 3; i < snakes.length; i++){
game.physics.arcade.overlap(snake, snakes.children[i], snakeHandler, null, this)
        }
    }
}

function snakeHandler(){
    console.log("hit itself")
    for (var i = 0; i < snakes.length; i++){
snakes.children[i].body.velocity.x = 0;
snakes.children[i].body.velocity.y = 0;
        } 

        stateText.text= " GAME OVER \n Click to restart";
        stateText.visible = true;
        steaks.removeAll();
        pills.removeAll();
        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
}

function steakHandler(){
    console.log("killed steak")
    steak.kill(); //to do: increase length of snake
    score += 100;
    scoreText.text = scoreString + score;
    increaseLength();
}

function pillHandler(){
    console.log("killed pill")
    pill.kill(); //to do: decrease length of snake
    if (snakes.length != 1)
        snakes.removeChildAt(snakes.length-1)
}

function wallHandler(){
    if(snake.centerX>=800||snake.centerY>=600||snake.centerY<=0||snake.centerX<=0){
        for (var i = 0; i < snakes.length; i++){
snakes.children[i].body.velocity.x = 0;
snakes.children[i].body.velocity.y = 0;
        } 

        stateText.text= " GAME OVER \n Click to restart";
        stateText.visible = true;
        steaks.removeAll();
        pills.removeAll();
        //the "click to restart" handler
        game.input.onTap.addOnce(restart,this);
    }
}

function restart () {
    //new snake appears in new game
    var x = Math.round((Math.random()-0.5)*length/2 + length / 2);
    var y = Math.round((Math.random()-0.5)*width/2 + width / 2);
    snakes.removeAll();
    snake = snakes.create(x, y, 'snake');
    snake.anchor.setTo(0.5, 0.5);
    snakes.enableBody = true;
    game.physics.enable(snakes, Phaser.Physics.ARCADE);
    snake.body.velocity.x = 200
    //steak
    x = Math.round(Math.random()*(length-100)+50);
    y = Math.round(Math.random()*(width-100)+50);
    steaks = game.add.group();
    steak = steaks.create(x, y, 'steak');
    steak.enableBody = true;
    game.physics.enable(steak, Phaser.Physics.ARCADE);
    steak.anchor.setTo(0.5, 0.5);
    //pill
    x = Math.round(Math.random()*(length-100)+50);
    y = Math.round(Math.random()*(width-100)+50);
    pills = game.add.group();
    console.log("first pill");
    pill = pills.create(x, y, 'pill');
    pill.enableBody = true;
    game.physics.enable(pill, Phaser.Physics.ARCADE);
    pill.anchor.setTo(0.5, 0.5);
    //hides the text
    stateText.visible = false;
}

function spawnPill(){
    pillTimer = game.time.now + 10000;
}

function increaseLength(){
    snakes.create(keyX,keyY,'snake')
    snakes.children[snakes.length-1].body.velocity.x = snakes.children[snakes.length-2].body.velocity.x
    snakes.children[snakes.length-1].body.velocity.y = snakes.children[snakes.length-2].body.velocity.y
}

function render () {
    for (var i = 0; i < snakes.length; i++){
        game.debug.body(snakes.children[i]);
    }
}
