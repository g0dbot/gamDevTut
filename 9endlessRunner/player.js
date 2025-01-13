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
        this.y = 0;
    }

    //move char around based on input and animate frames
    update() {

    }

    //draw takes values and render currently active frame on canvas using context
    //context takes canvas to draw on as arg
    draw(context) {
        //temp sprite
        context.fillStyle = "black";//giving color
        context.fillRect(this.x, this.y, this.width, this.height);//drawing to specific location
    }
}