//load event waits for all asses to be fully loaded before
//running code in anonymous callback function
//anon func means func without name
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");//get canvas in var
    
    //holds all drawing methods to animate
    const ctx = canvas.getContext("2d");//get context in var

    canvas.width = 800;
    canvas.height = 600;

    //apply event listeners and hold array of currently active keys
    class InputHandler{
        constructor(){
            this.keys = [];
            //listener placed directly in class to auto apply them
            window.addEventListener("keydown", e => {
                //console.log(e.key);

                //need to use js bind method to make this work because
                //this is a callback function
                //es6 arrow functions dont bind their own 'this'
                //but inherit the one from parent scope
                //AKA lexical scoping
                //doing this allows js to not forget which object this keyword belongs to
                
                if( e.key ==="ArrowDown" ||
                    e.key ==="ArrowUp" ||
                    e.key ==="ArrowLeft" ||
                    e.key ==="ArrowRight"
                    && this.keys.indexOf(e.key) === -1) { 
                        this.keys.push(e.key);
                    }
                
                console.log(e.key, this.keys);
            });

            window.addEventListener("keyup", e => {
                if( e.key ==="ArrowDown" ||
                    e.key ==="ArrowUp" ||
                    e.key ==="ArrowLeft" ||
                    e.key ==="ArrowRight") {

                    this.keys.splice(this.keys.indexOf(e.key), 1);//remove one element if found at index
                }

                console.log(e.key, this.keys);
            });
        }
    }

    //player class reacts to key events as they are pressed, drawing and updating
    class Player {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            //sprite sheet has custom size
            //goodpracetive to size sprite sheet as actuality in game
            this.width = 200;
            this.height = 200;
            
            this.x = 0;
            this.y = this.gameHeight - this.height;//bottom of canvas

            this.image = document.getElementById("playerImage");

            this.frameX = 0;
            this.frameY = 0;

            this.speed = 0;
        }

        //context used to specify which canvas to draw on
        draw(context) {
            context.fillStyle = "white";
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                //cuts from sprite sheet
                this.frameX * this.width,//source x
                this.frameY * this.height,//source y
                this.width, this.height,//source width and height

                //placement
                this.x, this.y, this.width, this.height,
            );
        }

        update() {
            //++this.x;
            
            this.x += this.speed;//move player

            //horizontal movement
                    if(input.keys.indexOf("ArrowRight") > -1) { this.speed = 5;}
            else    if(input.keys.indexOf("ArrowLeft") > -1) { this.speed = -5;}
            else { this.speed = 0; }
        }
    }

    //simple class to handle endless scrolling background
    class Background {

    }

    //class to gen enemies
    class Enemy {

    }

    //simple function to handle enemy mgt, moving animating etc
    function handleEnemies() {

    }

    //func to handle score game over etc
    function displayStatusText() {

    }

    //instances 
    const input = new InputHandler();//input handler class
    const player = new Player(canvas.width, canvas.height);//player class
    //player.draw(ctx);//draw player on canvas

    //main aimation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clear canvas
        player.draw(ctx);
        player.update(input);//pass input handler to player as param
        requestAnimationFrame(animate);
    }

    animate();
})