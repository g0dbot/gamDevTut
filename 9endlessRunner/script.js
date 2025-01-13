import Player from "./player";//importing player class and methods

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
        //so all code within constructor is executed on instantaiation
        //takes canvas width and height as args
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }

        update() {

        }

        draw() {

        }
    } 

    const game = new Game(canvas.width, canvas.height);//instantiate game class
    const player = new Player(game);//instantiate player class
});