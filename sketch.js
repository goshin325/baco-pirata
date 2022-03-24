const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world,ground;

var backgroundImg;
var ground; 
var tower,towerImg;
var cannon, cannonBall; 
var balls = [];
var boats = []; 
var boat;

var boatAnimation = [];
var boatSpritedata, boatSpritesheet;

var brokenBoatAnimation = [];
var brokenBoatSpritedata, brokenBoatSpritesheet;

var waterSplashAnimation = [];
var waterSplashSpritedata, waterSplashSpritesheet;
//Variable para sonidos
var backgroundMusic, waterSound,pirateLaughSound,cannonExplosion;
//Variable para estado de juego 
var isGameOver = false;
//Bandera para risa de pirata 
var isLaughing = false;
//Variable para puntuación 
var score = 0;

function preload() {
//Precargar imagen para fondo en una variable 
backgroundImg = loadImage("assets/background.gif");

//Precargar sonidos para el juego
backgroundMusic = loadSound("assets/background_music.mp3");
waterSound = loadSound("assets/cannon_water.mp3");
pirateLaughSound = loadSound("assets/pirare_laugh.mp3");
cannonExplosion = loadSound("assets/cannon_explosion.mp3");
//Precargar imagen de la torre 
towerImg = loadImage("assets/tower.png");

//Obtener datos de JSON y los archivos de imagen 
boatSpritedata = loadJSON("assets/boat/boat.json");
boatSpritesheet = loadImage("assets/boat/boat.png");

//Obtener datos de JSON y los archivos de imagen 
brokenBoatSpritedata = loadJSON("assets/boat/brokenBoat.json");
brokenBoatSpritesheet = loadImage("assets/boat/brokenBoat.png");

//Obtener datos de JSON y los archivos de imagen 
waterSplashSpritedata = loadJSON("assets/waterSplash/waterSplash.json");
waterSplashSpritesheet = loadImage("assets/waterSplash/waterSplash.png");

}

function setup() {
  canvas = createCanvas(1200, 600);
  //Motor físico 
  engine = Engine.create();
  //Se crea el nuevo mundo 
  world = engine.world;
  //En el set up
  //Unidad de medida para ángulo 
  angleMode(DEGREES);//Degrees-grados
  angle = 15;
  //Agregar opciones del motor físico Matter para el cuerpo 
  var ground_options = {
    isStatic: true
  }
  
  //Crear un objeto en este muendo usando BODIES 
  ground = Bodies.rectangle(0,height-1,width*2,1,ground_options);
   //Agregar cuerpo al mundo 
  World.add(world,ground);
 
  //Crear un objeto en este muendo usando BODIES 
  tower = Bodies.rectangle(160,350,160,310,ground_options);
  World.add(world,tower);
  
  //Guardar clase Cannon en una variable
  cannon = new Cannon(180,110,130,100,angle);
  //Guardar clase CannonBall en una variable
  cannonBall = new CannonBall(cannon.x, cannon.y);

  //Variable que contendra datos de los cuadros 
  var boatFrames = boatSpritedata.frames;
  //Bucle para obtener la posición de cada cuadro 
  for(var i = 0; i < boatFrames.length; i++){
    //se utiliza para obtener la posición de cada cuadro de boatFrames
    var pos = boatFrames[i].position;
    //se utiliza para obtener la imagen de boatSpritesheet
    var img = boatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    //Agregar imagen en la matriz boatAnimation
    boatAnimation.push(img);
  }

  //Variable que contendra datos de los cuadros 
  var brokenBoatFrames = brokenBoatSpritedata.frames;
  //Bucle para obtener la posición de cada cuadro 
  for (var i = 0; i < brokenBoatFrames.length; i++) {
    //se utiliza para obtener la posición de cada cuadro de boatFrames
    var pos = brokenBoatFrames[i].position;
    //se utiliza para obtener la imagen de boatSpritesheet
    var img = brokenBoatSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    //Agregar imagen en la matriz boatAnimation
    brokenBoatAnimation.push(img);
  }

  var waterSplashFrames = waterSplashSpritedata.frames;
  for (var i = 0; i < waterSplashFrames.length; i++) {
    var pos = waterSplashFrames[i].position;
    var img = waterSplashSpritesheet.get(pos.x, pos.y, pos.w, pos.h);
    waterSplashAnimation.push(img);
  }

}

function draw() {
  image(backgroundImg,0,0,1200,600);
  //Condición para sonido de fondo 
  if(!backgroundMusic.isPlaying()) {
backgroundMusic.play();
backgroundMusic.setVolume(0.1);
  }
  //Se actualiza motor físico
  Engine.update(engine);
  
  //Asignar figura al cuerpo creado
  rect(ground.position.x, ground.position.y, width*2,1);
  
  //Asignar figura al cuerpo creado
  push();//Push captura la nueva posición 
    imageMode(CENTER);
    image(towerImg,tower.position.x, tower.position.y, 160,310);
  pop(); //Vuelve a la posición anterior 
  showBoats();
  //Bucle para sacar las balas d la matriz y colocarlas en el cañon 
  for(var i = 0; i < balls.length; i ++){
    showCannonBalls(balls[i],i);
    collisionWithBoat(i);
  }
  
  //Mostrar cañon
  cannon.display();
  //Texto de puntuación 
  fill("black");
  textSize(40);
  text("score: "+score,width-200,50);
  textAlign(CENTER,CENTER);
}
function collisionWithBoat(index){
  //EL bucle tiene acceso a los barcos 
  for(var i = 0; i < boats.length; i = i+1){
      //Verifica si el índice de la bala de cañon y la i del barco están definidos
    if(balls[index] !== undefined && boats[i] !== undefined){
      //Guardar en una variable el resultado de la función Matter
      //COLLIDES detecta la colisión de los objetos y regresa un valor TRUE/FALSE
      var collision = Matter.SAT.collides(balls[index].body, boats[i].body);
      //En la función collisionWithBoat
      if(collision.collided){
        //Mandaremos a llamar a la función remover barcos 
        boats[i].remove(i);
        //Aumento de puntaje cada vez que se destruye un barco
        score = score+5;
         //Mandaremos a llamar a la función remover balas
        Matter.World.remove(world,balls[index].body);
        delete balls[index];
      }
    }
  }
}

//Al presionar la tecla 
function keyPressed(){
  if(keyCode === DOWN_ARROW){
    //Crear una nueva bala con la clase 
    var cannonBall = new CannonBall(cannon.x, cannon.y);
    //Guardar la nueva bala en la matriz 
    balls.push(cannonBall);
  }
}

//Mostrar balas 
function showCannonBalls(ball,index){
  //Si se crea una pelota hay que mostrarla 
  if(ball){
    ball.display();
    ball.animate();
    if(ball.body.position.x >= width || ball.body.position.y >= height -50){
      //Sonido de bala tocando el agua 
     waterSound.play();
      ball.remove(index);
    }
  }
}
function showBoats(){
  if (boats.length > 0){ 
    //Condición-comprueba si el último elemento de la matriz es un cuerpo
    if(boats[boats.length - 1] === undefined ||
      boats[boats.length -1].body.position.x < width -300){
        //Posiciones para el nuevo barco
        var positions = [-40,-60,-70,-20];
        //Obtiene posición aleatoria de la matriz positions 
        var position = random(positions);
        //Asignar esta nueva posición al molde que se creara 
        var boat = new Boat(width,height-100,170,170,position,boatAnimation);
        //Introducir barco en la matriz boats 
        boats.push(boat);
    }
    //Bucle para sacar barcos de la matriz 
    for ( var i = 0; i < boats.length; i = i+1){
      //Comprueba si hay un barco y le asigna velociodad 
      if(boats[i]){
        Matter.Body.setVelocity(boats[i].body,{
          x:-0.9,
          y: 0
        } )
        //Muestra el barco 
        boats[i].display();
        boats[i].animate();
      
        //Verificar colisión de barcos con la torre 
        var collision = Matter.SAT.collides(tower,boats[i].body);
        //Condición par comprobar colisión de bote adecuado
        if (collision.collided && !boats[i].isBroken) {
          //Condición para sonido de risa pirata 
          if (!isLaughing && !pirateLaughSound.isPlaying()) {
        pirateLaughSound.play();
        isLaughing=true;
          }
          isGameOver = true;
          gameOver();
        }
      }
    }
  }
  else {
    var boat = new Boat(width,height-60,170,170,-60,boatAnimation);
    boats.push(boat);
  }
}
//Al soltar la tecla 
function keyReleased() {
  if (keyCode === DOWN_ARROW) {
    //Sonido de disparo
    cannonExplosion.play();
    //Dispara las balas de la matriz 
    balls[balls.length-1].shoot();
  }
}

function gameOver() {
  swal( {
    //Clave de título 
      title: `¡Fuite invadido`,
    //Clave de texto
      text: "¡No terindas!",
    //Ruta de imagen con piratas ganando 
      imageUrl:
        "https://raw.githubusercontent.com/whitehatjr/PiratesInvasion/main/assets/boat.png",
    //Tamaño de imagen
      imageSize: "150x150",
    //Botón para reiniciar
      confirmButtonText: "vuel be intetalo"
    },
    //Función que reinicia cuando se presiona el botón 
    function(isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    });
}

