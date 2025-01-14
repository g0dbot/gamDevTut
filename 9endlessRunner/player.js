import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';

//each file/module can have only one export
export default class Player {
    //takes game as arg to get access to game properties
    constructor(game) {
        //js objects are ref data types, so they are passed by reference (like pointers)
        //so when passed as arg, a new instance is not created or copied
        this.game = game;

        this.width = 100;
        this.height = 91.3;

        //player position on canvs
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;//height of entire canvas - height of sprite

        //this.image = document.getElementById("player");
        //js auto creates ref to all elemesnt with id attr into global namespace using id as var name
        this.image = player;

        //horizontal movement props
        this.speed = 0;
        this.maxSpeed = 10;

        //vertical mvmnt props
        this.vy = 0;
        this.weight = 1;

        //to hold all states of player
        this.states = [ 
            new Sitting(this.game),
            new Running(this.game),
            new Jumping(this.game),
            new Falling(this.game),
            new Rolling(this.game),
            new Diving(this.game),
            new Hit(this.game),
        ];//sep class for each state so that each state can have its own enter method to handle any props needed

        

        //frames
        this.fps = 20;
        this.frameInterval = 1000 / this.fps;
        this.frameTimer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;

        //to hold current state of player
        // this.currentState = this.states[0];

        // this.currentState.enter();//enter starting state
    }

    //move char around based on input and animate frames
    update(input, deltaTime) {
        this.checkCollision();
        //this.x++;//simulate mvmnt
        
        //handle state
        this.currentState.handleInput(input);

        //handle movement
        //horizontal mvmnt
        this.x += this.speed;

        if (input.includes('ArrowLeft') && this.currentState !== this.states[6]) { this.x -= this.maxSpeed; }
        else if (input.includes('ArrowRight') && this.currentState !== this.states[6]) { this.x += this.maxSpeed; }
        else this.speed = 0;//handles movement err after key up

        //placing boundaries
        if (this.x <= 0) { this.x = 0; }//left bound
        else if (this.x >= this.game.width - this.width) { this.x = this.game.width - this.width; }//right bound

        
        //if the player is on the ground, the player can jump
        //if(input.includes('ArrowUp') && this.onGround()) { this.vy -= 30; }//jump
        //vertical mvmnt
        this.y += this.vy;
        if (!this.onGround()) { this.vy += this.weight; }//gravity affecting jump to pull player back down
        else this.vy = 0;//if player is on ground dont fall below ground

        //vert bounds
        if (this.y > this.game.height - this.height - this.game.groundMargin) { 
            this.y = this.game.height - this.height - this.game.groundMargin;
        }//bottom bound

        //sprite animation
        // if (this.frameX < this.maxFrame) { this.frameX++; }//animate
        // else this.frameX = 0;//reset frame

        if(this.frameTimer > this.frameInterval) {
            this.frameTimer = 0;//reset time counter

            if (this.frameX < this.maxFrame) { this.frameX++; }//animate
            else this.frameX = 0;//reset frame
        }

        else this.frameTimer += deltaTime;
    }

    //draw takes values and render currently active frame on canvas using context
    //context takes canvas to draw on as arg
    draw(context) {
        //temp sprite
        //context.fillStyle = "red";//giving color
        //context.fillRect(this.x, this.y, this.width, this.height);//drawing to specific location

        //drawimage needs at least 3 args image to draw and x and y coords where to draw
        //context.drawImage(this.image, this.x, this.y);

        //added args stretxhes image to specified size
        //context.drawImage(this.image, this.x, this.y, this.width, this.height);

        //debug mode
        if (this.game.debug) { context.strokeRect(this.x, this.y, this.width, this.height); }

        //9 arg draw image takes 4 extra args,
        //source x, source y, source width, source height
        //source x and y means position to start crop
        //width and height means how much to crop from source image to draw on canvas
        //frames are locations on sprite sheet, so they pass the correct frame for animations
        context.drawImage(this.image,
            this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height);
    }

    //checks if player is on ground
    onGround() { return this.y >= this.game.height - this.height - this.game.groundMargin; }

    //changing player state
    setState(state, speed) { 
        this.currentState = this.states[state];
        this.game.speed = speed;
        this.currentState.enter();
    }

    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if(
                enemy.x < this.x + this.width &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ) {
                //coll detect
                enemy.markedForDeletion = true;
                this.game.collisions.push(
                    new CollisionAnimation(this.game, 
                        enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));

                if (this.currentState === this.states[4] ||
                    this.currentState === this.states[5]
                ) {
                    this.game.score++;//increment score
                }

                else {
                    this.setState(6, 0);
                }
            }
            else{
                //no coll detect
            }
        })
    }
}