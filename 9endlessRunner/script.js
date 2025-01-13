import Player from "./player.js";//importing player class and methods
import InputHandler from "./input.js";

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

            //instantiate player
            //inside game class, this represents the current object executing methods
            this.player = new Player(this);//we use this to pass game as argument to player
            //this gives us access to player class within game class

            this.input = new InputHandler();
        }

        update() {
            this.player.update(this.input.keys);//pass input handler to player
        }

        //takes context (current canvas to draw on) as arg
        draw(context) {
            this.player.draw(context);//draw player taking context as arg
        }
    } 

    const game = new Game(canvas.width, canvas.height);//instantiate game class
    

    function animate(timestamp) {
        //clear canvas every frame to prevent artifacts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update();
        game.draw(ctx);//call draw method

        requestAnimationFrame(animate);//calls function over and over again
    }

    animate(0);
});