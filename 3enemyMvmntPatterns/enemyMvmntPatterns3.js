/**@type {HTMLCanvasElement} */ //this tells vs code suggust html canvas methods
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;

//holds number of enemies
const enemyCount = 20;
const enemiesArray = [];

//var to hold current frame
let gameFrame = 0;

//class template for enemy object
class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = "../res/enemies/enemy3.png";
        
        this.speed = Math.random() * 4 + 1;//select between 4 and 1
        this.spriteWidth = 218;
        this.spriteHeight = 177;

        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        //this.angle = Math.random() * 2;//used to generate sin value of movment in y axis
        //used for spawn point
        this.angle = Math.random() * 360;
        this.angleSpeed = Math.random() * 1.5 + 0.5;//used to randomize increment of angle
        //this.curve = Math.random() * 200 + 50;//amplitude
    }

    update() {
        //canvas.width/2 represents the radius 
        this.x = canvas.width/2 * Math.sin(this.angle * Math.PI / 90) + canvas.width / 2 - this.width/2;
        
        this.y = canvas.height/2 * Math.cos(this.angle * Math.PI / 180) + canvas.height / 2 - this.height/2;
        this.angle += this.angleSpeed;

        if (this.x + this.width < 0) this.x = canvas.width;//this moves it back to far right of screen to loop

        //animate sprite
        if ( gameFrame % this.flapSpeed === 0 ) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }
    }

    draw() {
        //first arg is image to draw
        //next 4 area to crop from source sprite sheet
        //last 4 where on canvas to place cropped frame 
        ctx.drawImage(this.image, 
            this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, 
            this.x, this.y, this.width, this.height);
    }
}

//create multiple enemies
for (let i = 0; i < enemyCount; i++) {
    enemiesArray.push(new Enemy());
}

function animate() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    //update each enemy
    enemiesArray.forEach((enemy) => {
        enemy.update();
        enemy.draw();
    });

    gameFrame++;
    requestAnimationFrame(animate);
}

animate();