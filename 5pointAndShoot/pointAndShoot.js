const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ravens = [];//array to hold all ravens

//helper variables for timestamp use
let timeToNextRaven = 0;//accumlate between frames until next raven
let ravenInterval = 500;//the amt of time till new spawn
let lastTime = 0;//time of last frame

let score = 0;//score
let gameOver = false;//game state

//canvas for collision detection
const collCanvas = document.getElementById("canvas2");
const collCtx = collCanvas.getContext("2d", { willReadFrequently: true });
collCanvas.width = window.innerWidth;
collCanvas.height = window.innerHeight;

//blueprint for creation of every raven
class Raven {
    constructor() {
       this.spriteWidth = 271;
       this.spriteHeight = 194;
       
       this.sizeModifier = Math.random() * 0.6 + 0.4;//random size between 0.4 and 1

       this.width = this.spriteWidth * this.sizeModifier;
       this.height = this.spriteHeight * this.sizeModifier;
       
       this.x = canvas.width;//makes ravens appear to the right
       this.y = Math.random() * (canvas.height - this.height);//random y position within constraints

       this.directionX = Math.random() * 5 + 3;//random speed between 3 and 8
       this.directionY = Math.random() * 5 - 2.5;//random speed between 3 and 8
       this.markedForDeletion = false;

       this.image = new Image();
       this.image.src = "../res/raven.png";       
       this.frame = 0;
       this.maxFrame = 4;

       this.timeSinceFlap = 0;
       this.flapInterval = Math.random() * 100 + 50;

       this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)]; // [red, green, blue]
       this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';//color of raven

       this.hasTrail = Math.random() > 0.5;//50% chance of trail
    }

    //move raven around and update any values b4 drawing next frame
    update(deltatime){
        if(this.y < 0 || this.y > canvas.height - this.height) 
            this.directionY = -this.directionY;//reverses direction if raven out of y view
        
        this.x -= this.directionX;//moves raven left
        this.y += this.directionY;//moves raven down/up
        if (this.x < 0 - this.width) this.markedForDeletion = true;//marks instance removes raven from array

        this.timeSinceFlap += deltatime;//time since last flap
        if(this.timeSinceFlap > this.flapInterval) {
            if (this.frame > this.maxFrame) this.frame = 0;//resets frame counter
            else this.frame++;
            this.timeSinceFlap = 0;//resets time counter

            if(this.hasTrail) {
                for(let i = 0; i < 5; i++) {
                    particles.push(new Particle(this.x, this.y, this.width, this.randomColor));
                }
            }
        }

        //game over conditoin
        if(this.x < 0 - this.width) gameOver = true;
    }

    //draw call takes updated vals and updates raven instance
    draw(){
        collCtx.fillStyle = this.color;
        collCtx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
            this.x, this.y, this.width, this.height,
        )
    }
}

//explosinos
let explosions = [];
class Explosion {
    constructor(x, y, size) {
        this.image = new Image();
        this.image.src = "../res/boom.png";
        this.spriteWidth = 200;
        this.spriteheight = 179;
        this.size = size;
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.sound = new Audio();
        this.sound.src = "../res/sfx/boom.wav";
        this.timeSinceLastFrame = 0;
        this.frameInterval = 200;
        this.markedForDeletion = false;
    }

    update(deltatime) {
        if(this.frame === 0) { this.sound.play(); }
       
        this.timeSinceLastFrame += deltatime;
        if(this.timeSinceLastFrame > this.frameInterval) {
            this.frame++;
            this.timeSinceLastFrame = 0;
            if (this.frame > 5) this.markedForDeletion = true;            
        }
    }

    draw(){
        ctx.drawImage(this.image,
            this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteheight,
            this.x, this.y - this.size/4, this.size, this.size);
    }
}

let particles = [];//holds all particle objs
class Particle {
    constructor(x, y, size, color) {
        this.size = size;
        this.x = x + this.size / 2 + Math.random() * 50 - 25;
        this.y = y + this.size / 3 + Math.random() * 50 - 25;
        
        this.radius = Math.random() * this.size / 10;
        this.maxRadius = Math.random() * 20 + 35;
        this.markedForDeletion = false;
        this.speedX = Math.random() * 3 - 1.5;
        this.color = color;
    }

    update(){
        this.x += this.speedX;
        this.radius += 0.5;//grows particle
        if(this.radius > this.maxRadius - 5) this.markedForDeletion = true;
    }

    draw(){
        ctx.save();
        ctx.globalAlpha = 1 - this.radius / this.maxRadius;//makes particles transparent as they get bigger
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }   
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "50px Impact";
    ctx.fillText("Score: " + score, 50, 80);

    ctx.fillStyle = "white";
    ctx.font = "50px Impact";
    ctx.fillText("Score: " + score, 50, 75);
}

function drawGameOver(){
    ctx.textAlign = 'center'
    ctx.fillStyle = "black";
    ctx.font = "50px Impact";
    ctx.fillText("GAME OVER youre score is: " + score, canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = "white";
    ctx.font = "50px Impact";
    ctx.fillText("GAME OVER youre score is: " + score, canvas.width / 2, canvas.height / 2 + 5);
}

//callback to listen for clicks
window.addEventListener("click", function(e){
    const detectPixelColor = collCtx.getImageData(e.x, e.y, 1, 1);//pixel color at click

    const pc = detectPixelColor.data;
    
    ravens.forEach(object => {
        if(object.randomColor[0] == pc[0] && object.randomColor[1] == pc[1] && object.randomColor[2] == pc[2]) {
            object.markedForDeletion = true;
            score++;
            explosions.push(new Explosion(object.x, object.y, object.width));
        }
    });
})

function animate(timestap){
    ctx.clearRect(0, 0, canvas.width, canvas.height);//clears canvas every frame
    collCtx.clearRect(0, 0, canvas.width, canvas.height);//clears coll canvas every frame

    let deltatime = timestap - lastTime;//time since last frame
    lastTime = timestap;
    timeToNextRaven += deltatime;//increase time every frame render
    
    //if time surpasses req'd time for another spawn, create a new raven
    //and reset the counter
    if(timeToNextRaven > ravenInterval){
        ravens.push(new Raven());
        timeToNextRaven = 0;
        //treats smaller widths as a raven that is further away
        //and sorts by that constraint
        ravens.sort(function(a, b) {return a.width - b.width;});
    };

    //update and draw each raven
    [...particles, ...ravens, ...explosions ].forEach(object => object.update(deltatime));//update each raven
    [...particles, ...ravens, ...explosions].forEach(object => object.draw());//draw each raven
    ravens = ravens.filter(object => !object.markedForDeletion);//removes marked ravens
    explosions = explosions.filter(object => object.frame < 5);//removes explosions
    particles = particles.filter(object => !object.markedForDeletion);//removes marked particles

    drawScore();
    //nb order of rendering affects layering
    if (!gameOver) requestAnimationFrame(animate);//calls function over and over again
    else drawGameOver();
}

animate(0);