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

class Explosion {
    constructor(x, y) {
        
        this.spriteWidth = 200;
        this.spriteheight = 179;
        this.width = this.spriteWidth / 2;
        this.height = this.spriteheight / 2;

        this.x = x;
        this.y = y;

        this.image = new Image();
        this.image.src = "../res/boom.png";
        this.frame = 0;
        this.timer = 0;
        this.angle = Math.random() * 6.2;

        this.sound = new Audio();
        this.sound.src = "../res/sfx/boom.wav";
    }

    update(){
        if(this.frame === 0) this.sound.play();//plays sound on first frame
        this.timer++;
        if (this.timer % 10 === 0)
            this.frame++;
    }

    draw(){
        ctx.save();
        ctx.translate(this.x, this.y);//move canvas to position of explosion
        ctx.rotate(this.angle);
        //first 4 are area to crop from spire sheet last 4 where to place cropped img
        ctx.drawImage(this.image, 
            this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteheight,
            0 - this.width / 2, 0 - this.height / 2, this.width, this.height);

        ctx.restore();
    }
}

window.addEventListener("click", function(e){
    createAnimation(e);
});//to ensure js is working

function createAnimation(e){
    let positionX = e.x - canvasPosition.left;
    let positionY = e.y - canvasPosition.top;
    explosions.push(new Explosion(positionX, positionY));
}

function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    explosions.forEach(element => {
        element.update();
        element.draw();
        if (explosions.frame > 5){
            explosions.splice(i, 1);
            i--;
        }
    });

    requestAnimationFrame(animate);
}

animate();