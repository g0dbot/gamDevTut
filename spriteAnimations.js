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
playerImage.src = "res/shadow_dog.png";

//simple animation
function animate(){
    //clear all animation paint from frame every render
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//this clears from coordinates 0,0 to the specified location in the variables

    //test method with simple rectangle
    ctx.fillRect(50,50,100,100);//first 2 are position x and y adn the last 2 are wid and hei

    requestAnimationFrame(animate);//calls animate function once, then waits for next frame
    //however, since this function is inside the animate function, it will call itself over and over again
}

//calling animate function
animate();