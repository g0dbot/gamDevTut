let playerState = 'run';//holds player state to change current animation
const dropdown = document.getElementById('animations');
dropdown.addEventListener('change', function(e){
    playerState = e.target.value;
})

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

let gameFrame = 0;
const staggerFrames = 5;//ratio to stagger frames

//variable to hold sprite animations
const spriteAnimations  = [];//main container to hold for all aniamtions
const animationStates = [
    {
        name:'idle',
        frames: 7,
    },
    {
        name:'jump',
        frames: 7,
    },
    {
        name:'fall',
        frames: 7,
    },
    {
        name:'run',
        frames: 9,
    },
    {
        name:'dizz',
        frames: 11,
    },
    {
        name:'sit',
        frames: 5,
    },
    {
        name:'roll',
        frames: 7,
    },
    {
        name:'bite',
        frames: 7,
    },
    {
        name:'ko',
        frames: 12,
    },
    {
        name:'getHit',
        frames: 4,
    },
];

//this furhter builds the animations data structure
//adding location values for x and y
//based on preset number of frames from array above and
//preset sprite height and width
animationStates.forEach((state, index) => {
    //init empty array to hold location values
    let frames = {
        loc: [],
    }

    for(let j=0; j<state.frames; j++){
        let positionX = j * spriteWidth;//calcs x based on set sprite width
        let positionY = index * spriteHeight;//calcs y based on set sprite height
        frames.loc.push({x: positionX, y:positionY});//appends the lcoation to the loc array
    }

    //creating a new key
    spriteAnimations[state.name] = frames;
});

console.log(spriteAnimations);//check if array is built properly

//simple animation
function animate(){
    //clear all animation paint from frame every render
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);//this clears from coordinates 0,0 to the specified location in the variables

    let position = Math.floor(gameFrame/staggerFrames) % (spriteAnimations[playerState].loc.length - 1);//hard coded to get length of the frame locations array

    //changing frame when required
    let frameX = spriteWidth * position;
    let frameY = spriteAnimations[playerState].loc[position].y;
    
    //drawing image from spritesheet
    ctx.drawImage(playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);    

    gameFrame++;
    requestAnimationFrame(animate);//calls animate function once, then waits for next frame
    //however, since this function is inside the animate function, it will call itself over and over again
}

//calling animate function
animate();

