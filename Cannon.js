class Cannon {
    constructor(x,y,width,height,angle){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.angle = angle; //Variable que almacena angulo del cañon 
        this.cannon_image = loadImage("assets/canon.png");
        this.cannon_base = loadImage("assets/cannonBase.png");
    }
    display(){//CLASE CANNON
        
        if(keyIsDown(RIGHT_ARROW) && this.angle < 70){
            this.angle +=1;
        }
        if(keyIsDown(LEFT_ARROW )&& this.angle >- 30){
            this.angle -=1;
        }
        //Código para crear la parte superior del cañon 
        push();//Push captura la nueva posición 
            translate(this.x,this.y);//Desplaza el origen, a los puntos asignados
            rotate(this.angle);
            imageMode(CENTER);
            image(this.cannon_image,0, 0, this.width, this.height);
        pop(); //Vuelve a la posición anterior 

        //Código para crera la parte inferior del cañon 
        image(this.cannon_base,70,20,200,200);
        noFill();
        
        
    }
}
