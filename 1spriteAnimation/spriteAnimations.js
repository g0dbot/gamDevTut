const canvas = document.getElementById("spriteAnimationCanvas"); //gets the canvas so that we can draw on it
const ctx = canvas.getContext("2d");//context of the canvas so we can draw on it gives access to drawing methods
//now we have the 2d drawing methdods stored in a variable and we can call them from ctx

//console.log(ctx);//this shows properties which are the global canvas settings

//to ensure proper scaling, we set canvas hei and wid
//default canvas set to 300pxx300px
//variables to hold width and height, set to the same as in css file
const CANVAS_WIDTH = canvas.width = 600;
const CANVAS_HEIGHT = canvas.height = 600;

//bringing spritesheet into project
const playerImage = new Image(); //built in image constructor class, creates image the same as in using img tag in html
playerImage.src = "../res/shadow_dog.png";

//global variables for sprite dimensions
const spriteWidth = 575;//really 573
const spriteHeight = 523;

//variables for animation frame selection and iteration
//nb method1 requires changing the frameX and frameY to match frrames in animation sequence
// as some anumation sequences have more frames in them
let frameX = 0;
let frameY = 0;

let gameFrame = 0;
const staggerFrames = 5;

//simple animation
function animate(){
    //clear all animation paint from frame every render
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//this clears from coordinates 0,0 to the specified location in the variables

    //test method with simple rectangle
    //ctx.fillRect(50,50,100,100);//first 2 are position x and y adn the last 2 are wid and hei

    //drawing image from spritesheet
    //drwa function can e be passed 3,5 or 9 args depending on control required
    //sx,sy,sh,sw,dx,dy,dw,dh source/destination
    ctx.drawImage(playerImage, frameX * spriteWidth, frameY * spriteHeight, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);

    //staggers game grame animation
    //method 1
    // if (gameFrame % staggerFrames == 0){
    //     //manual iteration of frameX horizontally
    //     if(frameX < 6) frameX++;
    //     else frameX = 0;
    // }    

    //method 2
    

    gameFrame++;
    requestAnimationFrame(animate);//calls animate function once, then waits for next frame
    //however, since this function is inside the animate function, it will call itself over and over again
}

//calling animate function
animate();

