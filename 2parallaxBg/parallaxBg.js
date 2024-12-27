const canvas = document.getElementById("bg"); 
const ctx = canvas.getContext("2d");

//need to ensure consistent scaling
const CANVAS_WIDTH = canvas.width = 800;
const CANVAS_HEIGHT = canvas.height = 700;

//tying scroll speed dynamically to a variable so that it can be adjusted
//using with special moves by character
let gameSpeed = 5;//let declares vars that can be reassigned

const backgroundLayer1 = new Image();//create a new image object
//can use append child and it woudl slot img into html file same as if u wrote it
//can choose not to append nad it would stay hidden and jsut store image for us
//new image() basically does the document.createElement("img");

backgroundLayer1.src = "../res/bg/layer-1.png";

//bring all other layers into the project
const backgroundLayer2 = new Image();
backgroundLayer2.src = "../res/bg/layer-2.png";

const backgroundLayer3 = new Image();
backgroundLayer3.src = "../res/bg/layer-3.png";

const backgroundLayer4 = new Image();
backgroundLayer4.src = "../res/bg/layer-4.png";

const backgroundLayer5 = new Image();
backgroundLayer5.src = "../res/bg/layer-5.png";

//sldier game speed
const slider = document.getElementById("slider");//vcariable to store and ret slider values
slider.value = gameSpeed;//init page load set var value to gamespeed settings
const showGameSpeed = document.getElementById("showGameSpeed");//variable to store and ret slider values
showGameSpeed.innerHTML = gameSpeed;//init page load set var value to gamespeed settings

//to change scrolling speed based on user input
slider.addEventListener("change", function(e){
    gameSpeed = e.target.value;
    showGameSpeed.innerHTML = e.target.value;
});

//class to hold each background layer
class Layer {
    constructor(image, speedModifier){
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 700;
        this.image = image;
        this.speedModifier = speedModifier;
        this.speed = gameSpeed * this.speedModifier;
    }

    //move layers horizontally by changing x and x2 values
    //and will reset when x moves off screen
    //same as previous method, just wrapped in class
    update(){
        this.speed = gameSpeed * this.speedModifier;
        if( this.x <= -this.width){
            this.x = 0;
        }

        this.x = Math.floor(this.x - this.speed);
    }

    //takes info about layer and draw on canvas
    //everytime update runs to update posn, draw will run to redraw
    draw(){
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
    }
}


//instantiate each layer object
const layer1 = new Layer(backgroundLayer1, 0.2);
const layer2 = new Layer(backgroundLayer2, 0.4);
const layer3 = new Layer(backgroundLayer3, 0.6);
const layer4 = new Layer(backgroundLayer4, 0.8);
const layer5 = new Layer(backgroundLayer5, 1);

//declare array to store layers
const layerObjects = [layer1, layer2, layer3, layer4, layer5];

//drawing function to animate background
function animate(){
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//clears canvas
    
    //updae and draw each layer
    layerObjects.forEach(layer => {
        layer.update();
        layer.draw();
    });

    requestAnimationFrame(animate);//calls function over and over again
};

//call function to animate
animate();