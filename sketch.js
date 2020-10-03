//Create variables here
var dog, dogImg, happyDog, database, foodS, foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState, readState;
var bedroom, garden, washroom;

function preload()
{
  //load images here
  dogImg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
  bedroom = loadImage("images/Bed Room.png");
  garden = loadImage("images/Garden.png");
  washroom = loadImage("images/Wash Room.png");
}

function setup() {
  database=firebase.database();
  createCanvas(500, 500);

  foodObj = new Food();
  
  dog = createSprite(400,400,25,25);
  dog.addImage (dogImg);
  dog.scale=0.15;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  if (keyWentDown (UP_ARROW)){
    writeStock(foodS);
    dog.addImage(happyDog);
  }

  readState = database.ref('GameState');
  readState.on("value", function (data){
    gameState = data.val();
  });
  
}


function draw() {  

  background(46,139,87);

  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed%12 + " PM", 350,30);
   }else if(lastFed==0){
     text("Last Feed : 12 AM",350,30);
   }else{
     text("Last Feed : "+ lastFed + " AM", 350,30);
   }

  //add styles here
  textSize(30);
  fill ("red");
  stroke (3);

  if (gameState != "Hungry"){
    feed.hide();
    addFood.hide();
    if(gameState == "play"){
      dog.addImage(garden);
    }
    if(hour()>lastFed+1){
      changeState();
    }
    
    /*
    var rand  = Math.round(random(1,3));
    switch(rand){
      case 1:dog.addImage(bedroom);
      update("sleepy");
      break;
      case 2:dog.addImage(garden);
      update("play");
      break;
      case 3:dog.addImage(washroom);
      update("washroom");
      break;
      default:break;
    }*/
  } else {
    feed.show();
    addFood.show();
    dog.addImage (dogImg);
  }
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  });
  update ("play");

}
function changeState(){
  var time = hour();
  
  if(time== lastFed+1){
    update("play");
    dog.addImage(garden);
  }else if(time== lastFed+1){
    update("sleep");
    dog.addImage(bedroom);
  }else if(time == lastFed+2){
    update("washroom");
    dog.addImage(washroom);
  }else if(time == lastFed+3){
    update("Hungry");
  }
}
//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
}

function update (state){
  database.ref('/').update({
    GameState:state
  });
}



