import { 
    StandingLeft, StandingRight,
    SittingLeft, SittingRight,
    RunningLeft, RunningRight,
    JumpingLeft, JumpingRight,
    FallingLeft, FallingRight } from "./state.js";

//to export class to be reused by other modules
export default class Player {
    //player needs to know boundaries of window
    constructor(gameWidth,gameHeight){
        //conv args to class properties for easy use
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;

        //each posn in array will be one possible player state
        //eg running jumping sitting
        //has to be added in the right order
        this.states = [
            new StandingLeft(this),
            new StandingRight(this),
            new SittingLeft(this),
            new SittingRight(this),
            new RunningLeft(this),
            new RunningRight(this),
            new JumpingLeft(this),
            new JumpingRight(this),
            new FallingLeft(this),
            new FallingRight(this),
        ];

        this.currentState = this.states[1]; //player can only be in one state at a time

        this.image = document.getElementById('dogImage');

        //width and hei of one frame
        this.width = 200;
        this.height = 181.83;

        //positional coords to draw
        this.x = this.gameWidth / 2 - this.width / 2;
        this.y = this.gameHeight - this.height;

        this.maxFrame = 6;
        this.frameX = 0;
        this.frameY = 0;

        this.speed = 0;
        this.maxSpeed = 10;

        this.vy = 0;
        this.weight = 0.5;

        //for timer frames
        this.fps = 30;
        this.frameTimer = 0;
        this.frameInterval = 1000 / this.fps;
    }

    //function to draw on specific canvas (context) supplied as arg
    draw(context, deltaTime) {
        //animate frame
        if (this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;
            if (this.frameX < this.maxFrame) { this.frameX++; }
            else { this.frameX = 0; }
        } else {
            this.frameTimer += deltaTime;
        }

        //draw image on canvas at x,y posn
        context.drawImage(this.image, //image to draw

            //these 4 args crop out part of image           
            //size of crop
            this.width * this.frameX,//animation frame
            this.height * this.frameY,//different actions

            //size of crop
            this.width, this.height,

            this.x, this.y,//coords to draw it at
            this.width, this.height);//size/scale ratio of drawing
    }

    update(input){
        this.currentState.handleInput(input);
        //horizontal movement
        this.x += this.speed;
        if (this.x <= 0) { this.x = 0; }//left bound
        else if (this.x >= this.gameWidth - this.width) { this.x = this.gameWidth - this.width; }//right bound

        //vertical movement
        this.y += this.vy;

        //if player not standing add weight to fall
        if (!this.onGround()) { this.vy += this.weight; }
        else { this.vy = 0; }//if player is on ground dont fall

        //ensure player doesn't fall though the floor
        if (this.y > this.gameHeight - this.height) { this.y = this.gameHeight - this.height; }
    }

    setState(state) {
        this.currentState = this.states[state];
        this.currentState.enter();
    }

    onGround() {
        return this.y >= this.gameHeight - this.height;
    }
}