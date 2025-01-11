//use enum to define a set of named states
//a name for each state and assign it a number
//order of states must match the order in which we add them to player states array
//this way swapping states would be more readable
//eg. instead of swapping to state 0 could swap to state standing left
export const states = {
    STANDING_LEFT: 0,
    STANDING_RIGHT: 1,
    SITTING_LEFT: 2,
    SITTING_RIGHT: 3,
    RUNNING_LEFT: 4,
    RUNNING_RIGHT: 5,
    JUMPING_LEFT: 6,
    JUMPING_RIGHT: 7,
    FALLING_LEFT: 8,
    FALLING_RIGHT: 9,
};

//just holds state prop passed as arg to constructor
class State {
    constructor(state) {
        this.state = state;//keeps track of currently active state
    }
}

//state design pattern each state rep by diff class
export class StandingLeft extends State {

    //expects player object as argument
    //to access player props to change sprite sheet and row speed etc
    constructor(player) {
        //super to access and called parent functions
        super('STANDING LEFT');

        //take arg and convert to class prop
        this.player = player;
    }

    //does everthing related to this state when players enter
    enter(){
        this.player.maxFrame = 6;//set max frame before frameY to avoid blinking
        this.player.frameY = 1;//row of spritesheet with that animation
        this.player.speed = 0;
        
    }

    //listen for predefined inp to swap states 
    handleInput(input) {
        if( input === 'PRESS right') { this.player.setState(states.RUNNING_RIGHT); }
        else if( input === 'PRESS left') { this.player.setState(states.RUNNING_LEFT); }
        else if ( input === 'PRESS down') { this.player.setState(states.SITTING_LEFT); }
        else if ( input === 'PRESS up') { this.player.setState(states.JUMPING_LEFT); }
    }
}

export class StandingRight extends State {
    constructor(player) {
        super('STANDING RIGHT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 0;
        this.player.speed = 0;
        this.player.maxFrame = 6;
    }

    handleInput(input) {
        if( input === 'PRESS left') { this.player.setState(states.RUNNING_LEFT); }
        else if( input === 'PRESS right') { this.player.setState(states.RUNNING_RIGHT); }
        else if ( input === 'PRESS down') { this.player.setState(states.SITTING_RIGHT); }
        else if ( input === 'PRESS up') { this.player.setState(states.JUMPING_RIGHT); }
    }
}

export class SittingLeft extends State {
    constructor(player) {
        super('SITTING LEFT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 9;
        this.player.speed = 0;
        this.player.maxFrame = 4;
    }

    handleInput(input) {
        if( input === 'PRESS right') { this.player.setState(states.SITTING_RIGHT); }
        else if( input === 'RELEASE down') { this.player.setState(states.STANDING_LEFT); }
    }
}

export class SittingRight extends State {
    constructor(player) {
        super('SITTING RIGHT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 8;
        this.player.speed = 0;
        this.player.maxFrame = 4;
    }

    handleInput(input) {
        if( input === 'PRESS left') { this.player.setState(states.SITTING_LEFT); }
        else if( input === 'RELEASE down') { this.player.setState(states.STANDING_RIGHT); }
    }
}

export class RunningLeft extends State {
    constructor(player) {
        super('RUNNING LEFT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 7;
        this.player.speed = -this.player.maxSpeed;
        this.player.maxFrame = 8;
    }

    handleInput(input) {
        if( input === 'PRESS right') { this.player.setState(states.RUNNING_RIGHT); }
        else if( input === 'RELEASE left') { this.player.setState(states.STANDING_LEFT); }
        else if ( input === 'PRESS down') { this.player.setState(states.SITTING_LEFT); }
    }
}

export class RunningRight extends State {
    constructor(player) {
        super('RUNNING RIGHT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 6;
        this.player.speed = this.player.maxSpeed;
        this.player.maxFrame = 8;
    }

    handleInput(input) {
        if( input === 'PRESS left') { this.player.setState(states.RUNNING_LEFT); }
        else if( input === 'RELEASE right') { this.player.setState(states.STANDING_RIGHT); }
        else if ( input === 'PRESS down') { this.player.setState(states.SITTING_RIGHT); }
    }
}

export class JumpingLeft extends State {
    constructor(player) {
        super('JUMPING LEFT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 3;
        if (this.player.onGround()) this.player.vy -= 20;//check player on ground before going up
        this.player.speed = -this.player.maxSpeed * 0.5;
        this.player.maxFrame = 6;
    }

    handleInput(input) {
        if( input === 'PRESS right') { this.player.setState(states.JUMPING_RIGHT); }
        else if (this.player.onGround()) { this.player.setState(states.STANDING_LEFT); }
        else if (this.player.vy > 0) { this.player.setState(states.FALLING_LEFT); }
    }
}

export class JumpingRight extends State {
    constructor(player) {
        super('JUMPING RIGHT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 2;
        if (this.player.onGround()) this.player.vy -= 20;//check player on ground before going up
        this.player.speed = this.player.maxSpeed * 0.5;
        this.player.maxFrame = 6;
    }

    handleInput(input) {
        if( input === 'PRESS left') { this.player.setState(states.JUMPING_LEFT); }
        else if (this.player.onGround()) { this.player.setState(states.STANDING_RIGHT); }
        else if (this.player.vy > 0) { this.player.setState(states.FALLING_RIGHT); }
    }
}

export class FallingLeft extends State {
    constructor(player) {
        super('FALLING LEFT');
        this.player = player;
    }

    enter(){
        this.player.frameY = 5;
        this.player.maxFrame = 6;
    }

    handleInput(input) {
        if( input === 'PRESS right') { this.player.setState(states.FALLING_RIGHT); }
        else if (this.player.onGround()) { this.player.setState(states.STANDING_LEFT); }
    }
}

export class FallingRight extends State {
    constructor(player) {
        super('FALLING Right');
        this.player = player;
    }

    enter(){
        this.player.frameY = 4;
        this.player.maxFrame = 6;
    }

    handleInput(input) {
        if( input === 'PRESS left') { this.player.setState(states.FALLING_LEFT); }
        else if (this.player.onGround()) { this.player.setState(states.STANDING_RIGHT); }
    }
}