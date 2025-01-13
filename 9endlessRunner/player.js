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
        this.y = this.game.height - this.height;//height of entire canvas - height of sprite

        //this.image = document.getElementById("player");
        //js auto creates ref to all elemesnt with id attr into global namespace using id as var name
        this.image = player;

        //horizontal movement props
        this.speed = 0;
        this.maxSpeed = 10;

        //vertical mvmnt props
        this.vy = 0;
        this.weight = 1;
    }

    //move char around based on input and animate frames
    update(input) {
        //this.x++;//simulate mvmnt
        //handle movement
        //horizontal mvmnt
        this.x += this.speed;

        if (input.includes('ArrowLeft')) { this.x -= this.maxSpeed; }
        else if (input.includes('ArrowRight')) { this.x += this.maxSpeed; }
        else this.speed = 0;//handles movement err after key up

        //placing boundaries
        if (this.x <= 0) { this.x = 0; }//left bound
        else if (this.x >= this.game.width - this.width) { this.x = this.game.width - this.width; }//right bound

        

        //if the player is on the ground, the player can jump
        if(input.includes('ArrowUp') && this.onGround()) { this.vy -= 30; }//jump
        //vertical mvmnt
        this.y += this.vy;
        if (!this.onGround()) { this.vy += this.weight; }//gravity affecting jump to pull player back down
        else this.vy = 0;//if player is on ground dont fall below ground
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

        //9 arg draw image takes 4 extra args,
        //source x, source y, source width, source height
        //source x and y means position to start crop
        //width and height means how much to crop from source image to draw on canvas
        context.drawImage(this.image,
            0, 0, this.width, this.height,
            this.x, this.y, this.width, this.height);
    }

    //checks if player is on ground
    onGround() { return this.y >= this.game.height - this.height; }
}