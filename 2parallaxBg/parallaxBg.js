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

//drawing function to animate background
function animate(){
    ctx.drawImage(backgroundLayer2, 0, 0);//draws image on canvas from x0 y0
    requestAnimationFrame(animate);//calls function over and over again
};

//call function to animate
animate();