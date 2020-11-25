var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var jumpSound, dieSound,checkPoint


var cloud, cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var gameOver,gameOverImage;
var restart,restartImage
var score;


function preload(){
  trex_running =  loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImage=loadImage("gameOver.png")
  restartImage=loadImage("restart.png")
  jumpSound=loadSound('jump.mp3')
  dieSound=loadSound('die.mp3')
  checkPoint=loadSound('checkPoint.mp3')
  
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided" , trex_collided)
  trex.scale = 0.5;
  //trex.debug=true;
  trex.setCollider('rectangle',0,0,50,100)
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  score = 0;
  //ground.velocityX = -(4+3*score/100);
  ground.velocityX=-4;
  gameOver=createSprite(300,100,10,10)
  gameOver.scale=0.1;
  gameOver.addImage(gameOverImage)
 gameOver.visible=false;
  
  restart=createSprite(300,150,10,10)
  restart.scale=0.3;
  restart.addImage(restartImage)
  restart.visible=false;
  
  
  fill(rgb(100,200,250))
    textFont('georgia')
    textSize(20)
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = createGroup();
  
 
  
  
}

function draw() {
  background('lightblue');
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY){
    score = score + Math.round(frameCount/60);
    //move the ground
    ground.velocityX = -(4*2*score/300)
    if(keyDown("space")&& trex.y >= 100) {
    trex.velocityY = -13;
      jumpSound.play()
  }
  
  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  //spawn the clouds
  spawnClouds();
  
  //spawn obstacles on the ground
    spawnObstacles();
    if(trex.isTouching(obstaclesGroup)){
      trex.changeAnimation("collided" , trex_collided)
      gameState=END;
      dieSound.play()
    // trex.velocityY=-10 for artificial intelligence
      
    }
   // trex.velocityY=trex.velocityY+2( for AI)
  }
  else if(gameState === END){
    //stop the ground
    ground.velocityX = 0; 
     gameOver.visible=true;
    restart.visible=true;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setLifetimeEach(-160)
    cloudsGroup.setLifetimeEach(-160)
    trex.velocityY=0;
  //text('Game over',300,100)
  }
  if(mousePressedOver(restart)){
    gameOver.visible=false;
    restart.visible=false;
    obstaclesGroup.destroyEach()
    cloudsGroup.destroyEach()
    score=0;
    trex.changeAnimation("running", trex_running)
    gameState=PLAY
  }
  
  
  trex.collide(invisibleGround);
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(400,165,10,40);
   obstacle.velocityX = -(4*3*score/300)

   
    // //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5); 
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //adding obstacles to the group
   obstaclesGroup.add(obstacle);
 }
}




function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
     cloud = createSprite(600,100,40,10);
    cloud.y = Math.round(random(10,60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 134;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
  }
  
}