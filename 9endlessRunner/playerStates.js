//enum to define a set of named states
const states = {
    SITTING: 0,
    RUNNING: 1,
    JUMPING: 2,
    FALLING: 3,
}

class State {
    constructor(state) {
        this.state = state;//keeps track of currently active state just for monitoring purposes
    }

    //set player up as it enters state
    enter() { }

    //listen for predefined inp to swap states
    handleInput(input) {}
}

export class Sitting extends State {
    //accesses player props as arg
    constructor(player) {
        super('SITTING');//need to use super before using 'this' keyword
        this.player = player;
    }

    enter() {
        this.player.frameY = 5;//row of spritesheet
    }

    handleInput(input){
        if (input.includes('ArrowLeft') || input.includes('ArrowRight')) { this.player.setState(states.RUNNING); }
    }
}

export class Running extends State {
    //accesses player props as arg
    constructor(player) {
        super('RUNNING');//need to use super before using 'this' keyword
        this.player = player;
    }

    enter() {
        this.player.frameY = 3;//row of spritesheet
    }

    handleInput(input){
        if      (input.includes('ArrowDown'))   { this.player.setState(states.SITTING); }
        else if (input.includes('ArrowUp'))     { this.player.setState(states.JUMPING); }
    }
}

export class Jumping extends State {
    //accesses player props as arg
    constructor(player) {
        super('JUMPING');//need to use super before using 'this' keyword
        this.player = player;
    }

    enter() {
        if (this.player.onGround()) { this.player.vy -= 30; }//push up if on ground
        this.player.frameY = 1;//row of spritesheet
    }

    handleInput(input){
        if (this.player.vy > this.player.weight) { this.player.setState(states.FALLING); }
    }
}

export class Falling extends State {
    //accesses player props as arg
    constructor(player) {
        super('FALLING');//need to use super before using 'this' keyword
        this.player = player;
    }

    enter() {
        if (this.player.onGround()) { this.player.vy -= 30; }//push up if on ground
        this.player.frameY = 1;//row of spritesheet
    }

    handleInput(input){
        if (this.player.onGround()) { this.player.setState(states.RUNNING); }
    }
}