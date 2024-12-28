/**@type {HTMLCanvasElement} */ //this tells vs code suggust html canvas methods
const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 1000;

//holds number of enemies
const enemyCount = 20;
const enemiesArray = [];

//loading in a spritesheet for an enemy
// const enemyImage = new Image();
// enemyImage.src = "../res/enemies/enemy1.png";

//var to hold current frame
let gameFrame = 0;

//class template for enemy object
class Enemy {
    constructor() {
        this.image = new Image();
        this.image.src = "../res/enemies/enemy2.png";
        
        this.speed = Math.random() * 4 + 1;//select between 4 and 1
        this.spriteWidth = 266;
        this.spriteHeight = 188;

        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        //this.angle = Math.random() * 2;//used to generate sin value of movment in y axis
        this.angle = 0;
        this.angleSpeed = Math.random() * 0.2;//used to randomize increment of angle
        this.curve = Math.random() * 7;
    }

    update() {
        //this causes the wiggle effect on the bats
        //the minus range allows movement randomly in -ve dir'n
        //nb having larger range causes more wiggling 
        // range should be more or less even in both dir'n
        // to avoid stray movement in any one specific dir'n
        this.x -= this.speed;
        this.y += this.curve * Math.sin(this.angle);
        this.angle += this.angleSpeed;//used to generate sin value of movment in y axis

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