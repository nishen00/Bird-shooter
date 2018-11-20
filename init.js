var context;
var queue;
var WIDTH = 1024;
var HEIGHT = 768;
var mouseXPosition;
var mouseYPosition;
var batImage;
var stage;
var animation;
var deathAnimation;
var spriteSheet;
var enemyXPos=100;
var enemyYPos=100;
var enemyXSpeed = 1.5;
var enemyYSpeed = 1.75;
var score = 0;
var scoreText;
var gameTimer;
var gameTime = 0;
var timerText;
var level=1;
var levelText;

window.onload = function()
{
    
    var canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("myCanvas");

   
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);
    createjs.Sound.alternateExtensions = ["ogg"];

   
    queue.loadManifest([
        {id: 'backgroundImage', src: 'images/background.png'},
        {id: 'crossHair', src: 'images/crosshair.png'},
        {id: 'shot', src: 'images/shot.mp3'},
        {id: 'background', src: 'images/countryside.mp3'},
        {id: 'gameOverSound', src: 'images/gameOver.mp3'},
        {id: 'tick', src: 'images/tick.mp3'},
        {id: 'deathSound', src: 'images/die.mp3'},
        {id: 'batSpritesheet', src: 'images/batSpritesheet.png'},
        {id: 'batDeath', src: 'images/batDeath.png'},
    ]);
    queue.load();

    
    gameTimer = setInterval(updateTime, 1000);

}

function queueLoaded(event)
{
    
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);

    
    scoreText = new createjs.Text("Score: " + score.toString(), "36px Arial", "black");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);
	
	
	
	
	levelText=new createjs.Text("Level:"+level.toString(),"36px Arial", "black");
	levelText.x=400;
	levelText.y=10;
	stage.addChild(levelText);

    
    timerText = new createjs.Text("Time: " + gameTime.toString(), "36px Arial", "black");
    timerText.x = 800;
    timerText.y = 10;
    stage.addChild(timerText);

    
    createjs.Sound.play("background", {loop: -1});

    
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('batSpritesheet')],
        "frames": {"width": 109, "height": 100},
        "animations": { "flap": [0,4] }
    });

    
    batDeathSpriteSheet = new createjs.SpriteSheet({
    	"images": [queue.getResult('batDeath')],
    	"frames": {"width": 198, "height" : 148},
    	"animations": {"die": [0,7, false,1 ] }
    });

    
    createEnemy();

  

 
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);

   
    window.onmousedown = handleMouseDown;
}

function createEnemy()
{
	animation = new createjs.Sprite(spriteSheet, "flap");
    animation.regX = 99;
    animation.regY = 58;
    animation.x = enemyXPos;
    animation.y = enemyYPos;
    animation.gotoAndPlay("flap");
    stage.addChildAt(animation,1);
}

function batDeath()
{
  deathAnimation = new createjs.Sprite(batDeathSpriteSheet, "die");
  deathAnimation.regX = 99;
  deathAnimation.regY = 58;
  deathAnimation.x = enemyXPos;
  deathAnimation.y = enemyYPos;
  deathAnimation.gotoAndPlay("die");
  stage.addChild(deathAnimation);
}

function tickEvent()
{
	
	if(enemyXPos < WIDTH && enemyXPos > 0)
	{
		enemyXPos += enemyXSpeed;
	} else 
	{
		enemyXSpeed = enemyXSpeed * (-1);
		enemyXPos += enemyXSpeed;
	}
	if(enemyYPos < HEIGHT && enemyYPos > 0)
	{
		enemyYPos += enemyYSpeed;
	} else
	{
		enemyYSpeed = enemyYSpeed * (-1);
		enemyYPos += enemyYSpeed;
	}

	animation.x = enemyXPos;
	animation.y = enemyYPos;

	
}



function handleMouseDown(event)
{
    
    
    crossHair = new createjs.Bitmap(queue.getResult("crossHair"));
    crossHair.x = event.clientX-45;
    crossHair.y = event.clientY-45;
    stage.addChild(crossHair);
    createjs.Tween.get(crossHair).to({alpha: 0},1000);
    
    
    createjs.Sound.play("shot");

    
    enemyXSpeed *= 1.05;
    enemyYSpeed *= 1.06;

    
    var shotX = Math.round(event.clientX);
    var shotY = Math.round(event.clientY);
    var spriteX = Math.round(animation.x);
    var spriteY = Math.round(animation.y);

    
    var distX = Math.abs(shotX - spriteX);
    var distY = Math.abs(shotY - spriteY);

    
    if(distX < 60 && distY < 60)
    {
    	
    	stage.removeChild(animation);
    	batDeath();
    	score += 100;
    	scoreText.text = "Score: " + score.toString();
    	createjs.Sound.play("deathSound");
    	
        
    	enemyYSpeed *= 1.25;
    	enemyXSpeed *= 1.3;

  
    	var timeToCreate = Math.floor((Math.random()*3500)+1);
	    setTimeout(createEnemy,timeToCreate);

    } else
    {
    	
    	score -= 10;
    	scoreText.text = "Score: " + score.toString();

    }

	
}

function updateTime()
{
	gameTime += 1;
	
	if(gameTime==20)
	{
		level+=1;
		
		levelText.text="Level:"+level.toString();
		
		
		
	}
	
	if(gameTime==30)
		
	{
		level+=1;
		
		levelText.text="Level:"+level.toString();
			
	}
	
	
	if(gameTime==40)
		
	{
		level+=1;
		
		levelText.text="Level:"+level.toString();
			
	}
	
	
	if(gameTime==50)
		
	{
		level+=1;
		
		levelText.text="Level:"+level.toString();
			
	}
	
	
	
	if(gameTime > 60)
	{
		
		timerText.text = "GAME OVER";
		stage.removeChild(animation);
		stage.removeChild(crossHair);
        createjs.Sound.removeSound("background");
        var si =createjs.Sound.play("gameOverSound");
		clearInterval(gameTimer);
	}
	else
	{
		timerText.text = "Time: " + gameTime
    createjs.Sound.play("tick");
	}
}
