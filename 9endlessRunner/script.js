import Player from "./player.js";//importing player class and methods
import InputHandler from "./input.js";
import { Background } from "./background.js";

//ensures all assets are loaded before js can run
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");//get canvas in var
    const ctx = canvas.getContext("2d");//get access to 2d drawing api moethods

    //canvas dimensions
    canvas.width = 500;
    canvas.height = 500;

    //main brain or runner class stored
    //all logic runs through here
    class Game {
        //constructor taking dimensions as args
        //contructor is a special type of function
        //gets run when class is instantiated
        //so all code within constructor is executed on instantaiation (side effect)
        //takes canvas width and height as args
        constructor(width, height) {
            //take arg and convert to class prop
            this.width = width;
            this.height = height;

            this.groundMargin = 82;//space between ground and player
            this.speed = 0;//speed of layers

            this.background = new Background(this);//instantiate background
            //instantiate player
            //inside game class, this represents the current object executing methods
            this.player = new Player(this);//we use this to pass game as argument to player
            //this gives us access to player class within game class
            this.input = new InputHandler();
        }

        update(deltaTime) {
            this.background.update();//call update method
            this.player.update(this.input.keys, deltaTime);//pass input handler to player
        }

        //takes context (current canvas to draw on) as arg
        draw(context) {
            this.background.draw(context);//call draw method
            this.player.draw(context);//draw player taking context as arg
        }
    } 

    const game = new Game(canvas.width, canvas.height);//instantiate game class
    
    let lastTime = 0;//time of last frame from last ani loop

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;//time since last frame
        lastTime = timestamp;//sets last time to current time
        //console.log(deltaTime);//print time since last frame

        //clear canvas every frame to prevent artifacts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);//call draw method

        //has 2 spec features auto adjusts refresh rate
        //also auto gens timestamps and passes it as arg
        requestAnimationFrame(animate);//calls function over and over again
    }

    animate(0);
});