class Boat {
    constructor(x, y, width, height,boatPos,boatAnimation){
        //Opciones del motor físico para el bote
        var options = {
            restitution: 0.8,
            friction: 1.0,
            density: 1.0
        }
    this.animation = boatAnimation;
    this.speed = 0.05;
    //Asignar cuerpo de la librería Matter
    this.body = Bodies.rectangle(x,y,width,height,options);
    this.width = width;
    this.height = height;
    
    //Variable que guarda la posición del bote 
    this.boatPosition = boatPos;
    this.isBroken = false;
    //Abregar cuerpo al mundo 
    World.add(world, this.body);
    }
    animate() {
        this.speed += 0.05;
      }
    //Función para remover el barco 
    remove(index){
        this.animation = brokenBoatAnimation;
        this.speed = 0.05;
        this.width = 300;
        this.height = 300;
        this.isBroken = true;
        //Función para ejecutar código después de 2 seg
        setTimeout( () => {
        //Remover cuerpo del barco del mundo 
        Matter.World.remove(world,boats[index].body);
        //Borrar barco de la matriz 
        delete boats[index];
        }, 2000 /*Tiempo en milisegundos*/ );
    }
    //Función para mostrar cuerpo 
    display(){
        var pos = this.body.position;
        var index = floor(this.speed % this.animation.length);
        push();
        translate(pos.x,pos.y);
        imageMode(CENTER);
        image(this.animation[index], 0, this.boatPosition, this.width,this.height);
        pop();
    }
}
