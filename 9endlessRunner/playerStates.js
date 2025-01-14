//import particle fx
import { Dust, Splash, Fire } from './particles.js';

//enum to define a set of named states
const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
    ROLLING: 4,
    DIVING: 5,
    HIT: 6,
}

class State {
    constructor(state, game) {
        this.game = game;
        this.state = state;//keeps track of currently active state just for monitoring purposes
    }

    //set player up as it enters state
    enter() { }

    //listen for predefined inp to swap states
    handleInput(input) {}
}

export class Sitting extends State {
    //accesses player props as arg
    constructor(game) {
        super('SITTING', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.maxFrame = 4;//set max frame before frameY to avoid blinking
        this.game.player.frameY = 5;//row of spritesheet        
    }

    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) { this.game.player.setState(states.RUNNING, 1); }

        else if (input.includes('Enter')) { this.game.player.setState(states.ROLLING, 2); }
    }
}

export class Running extends State {
    //accesses player props as arg
    constructor(game) {
        super('RUNNING', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.maxFrame = 8;//set max frame before frameY to avoid blinking
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.frameY = 3;//row of spritesheet
    }

    handleInput(input){
        this.game.particles.unshift(
            new Dust(   this.game, 
                        this.game.player.x + this.game.player.width * 0.5, 
                        this.game.player.y + this.game.player.height));

        if      (input.includes('ArrowDown'))   { this.game.player.setState(states.SITTING, 0); }
        else if (input.includes('ArrowUp'))     { this.game.player.setState(states.JUMPING, 1); }
        else if (input.includes('Enter')) { this.game.player.setState(states.ROLLING, 2); }
    }
}

export class Jumping extends State {
    //accesses player props as arg
    constructor(game) {
        super('JUMPING', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.maxFrame = 6;//set max frame before frameY to avoid blinking
        if (this.game.player.onGround()) { this.game.player.vy -= 30; }//push up if on ground
        this.game.player.frameY = 1;//row of spritesheet
    }

    handleInput(input){
        if (this.game.player.vy > this.game.player.weight) { this.game.player.setState(states.FALLING, 1); }
        else if (input.includes('Enter')) { this.game.player.setState(states.ROLLING, 2); }
        else if (input.includes('ArrowDown')) { this.game.player.setState(states.DIVING, 0); }
    }
}

export class Falling extends State {
    //accesses player props as arg
    constructor(game) {
        super('FALLING', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.maxFrame = 6;//set max frame before frameY to avoid blinking
        if (this.game.player.onGround()) { this.game.player.vy -= 30; }//push up if on ground
        this.game.player.frameY = 2;//row of spritesheet
    }

    handleInput(input){
        if (this.game.player.onGround()) { this.game.player.setState(states.RUNNING, 1); }
        else if (input.includes('ArrowDown')) { this.game.player.setState(states.DIVING, 0); }
    }
}

export class Rolling extends State {
    //accesses player props as arg
    constructor(game) {
        super('ROLLING', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.maxFrame = 6;//set max frame before frameY to avoid blinking
        //if (this.game.player.onGround()) { this.game.player.vy -= 30; }//push up if on ground
        this.game.player.frameY = 6;//row of spritesheet
    }

    handleInput(input){
        this.game.particles.unshift(
            new Fire(   this.game, 
                        this.game.player.x + this.game.player.width * 0.5, 
                        this.game.player.y + this.game.player.height * 0.5));

        if (!input.includes('Enter') && this.game.player.onGround()) { 
            this.game.player.setState(states.RUNNING, 1);
        }

        else if (!input.includes('Enter') && !this.game.player.onGround()) { 
            this.game.player.setState(states.FALLING, 1);
        }

        else if (input.includes('Enter') && input.includes('ArrowUp') && this.game.player.onGround()) { 
            this.game.player.setState(states.ROLLING, 2);
            this.game.player.vy -= 27;
        }

        else if (input.includes('ArrowDown') && !this.game.player.onGround()) { this.game.player.setState(states.DIVING, 0); }
    }
}

export class Diving extends State {
    //accesses player props as arg
    constructor(game) {
        super('DIVING', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.maxFrame = 6;//set max frame before frameY to avoid blinking
        //if (this.game.player.onGround()) { this.game.player.vy -= 30; }//push up if on ground
        this.game.player.frameY = 6;//row of spritesheet
        this.game.player.vy = 15;
    }

    handleInput(input){
        this.game.particles.unshift(
            new Fire(   this.game, 
                        this.game.player.x + this.game.player.width * 0.5, 
                        this.game.player.y + this.game.player.height * 0.5));

        if (this.game.player.onGround()) { 
            this.game.player.setState(states.RUNNING, 1);
            for(let i=0; i<30; i++){
                this.game.particles.unshift(new Splash(this.game, this.game.player.x, this.game.player.y));
            }
        }

        else if (input.includes('Enter') && !this.game.player.onGround()) { 
            this.game.player.setState(states.ROLLING, 2);
        }
    }
}

export class Hit extends State {
    //accesses player props as arg
    constructor(game) {
        super('HIT', game);//need to use super before using 'this' keyword
    }

    enter() {
        this.game.player.frameX = 0;//reset frame to prev blinking
        this.game.player.maxFrame = 10;//set max frame before frameY to avoid blinking
        this.game.player.frameY = 4;//row of spritesheet
    }

    handleInput(input){
        if (this.game.player.frameX >= this.game.player.maxFrame
            && this.game.player.onGround()
        ) { 
            this.game.player.setState(states.RUNNING, 1);
        }
        
        else if (this.game.player.frameX <= this.game.player.maxFrame
            && !this.game.player.onGround()
        ) {
            this.game.player.setState(states.FALLING, 1);
        }
    }
}