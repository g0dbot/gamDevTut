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
        this.image.src = "../res/enemies/enemy4.png";
        
        this.speed = Math.random() * 4 + 1;//select between 4 and 1
        this.spriteWidth = 213;
        this.spriteHeight = 213;

        this.width = this.spriteWidth / 2.5;
        this.height = this.spriteHeight / 2.5;

        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);

        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);

        this.interval = Math.floor(Math.random() * 200 + 50);
    }

    update() {
        if (gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }

        let dx = this.x - this.newX;
        let dy = this.y - this.newY;

        this.x -= dx / 70;
        this.y -= dy / 70;
        //canvas.width/2 represents the radius 
        //this.x = 0;        
        //this.y = 0;

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