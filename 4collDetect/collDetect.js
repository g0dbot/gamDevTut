//research operation efficiencies eg. division and multiplication

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width = 500;
const CANVAS_HEIGHT = canvas.height = 700;

let canvasPosition = canvas.getBoundingClientRect();
//console.log(canvasPosition);


//simple test to ensure js is working
// ctx.fillStyle = "white";
// ctx.fillRect(50, 50, 100, 150);

const explosions = [];//array to hold explosion objects

class Explosin {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.spriteWidth = 200;
        this.spriteheight = 179;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteheight / 2;
        this.image = new Image();
        this.image.src = "../res/boom.png";
        this.frame = 0;
    }

    update(){
        this.frame++;
    }

    draw(){
        //first 4 are area to crop from spire sheet last 4 where to place cropped img
        ctx.drwaImage(this.image, 
            this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteheight,
            this.x, this.y, this.width, this.height);
    }
}

window.addEventListener("click", function(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;

    console.log(e.x, e.y);
    ctx.fillStyle = "white";
    ctx.fillRect(positionX, positionY, 50, 50);//draws a 10x10 square where the mouse is clicked
});//to ensure js is working