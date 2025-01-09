//load event waits for all asses to be fully loaded before
//running code in anonymous callback function
//anon func means func without name
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");//get canvas in var
    
    //holds all drawing methods to animate
    const ctx = canvas.getContext("2d");//get context in var

    canvas.width = 800;
    canvas.height = 720;

    let enemies = [];//array to hold all enemies

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
                
                if((e.key ==="ArrowDown" ||
                    e.key ==="ArrowUp" ||
                    e.key ==="ArrowLeft" ||
                    e.key ==="ArrowRight")//wrapping condiationals in brackets ensures only unique arrows
                    && this.keys.indexOf(e.key) === -1) { 
                        this.keys.push(e.key);
                    }
                
                console.log(e.key, this.keys);
            });

            window.addEventListener("keyup", e => {
                if((e.key ==="ArrowDown" ||
                    e.key ==="ArrowUp" ||
                    e.key ==="ArrowLeft" ||
                    e.key ==="ArrowRight")) {

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

            this.vy = 0;//vertical velocity
            this.weight = 1;
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

            //horizontal movement inp
                    if(input.keys.indexOf("ArrowRight") > -1) { this.speed = 5;}
            else    if(input.keys.indexOf("ArrowLeft") > -1) { this.speed = -5;}

            //vertical movement inp
            else if (input.keys.indexOf("ArrowUp") > -1 && this.onGround()) { this.vy -= 32; }
            else { this.speed = 0; }

            //restricting horizontalmovement within canvas
            //horizontal
            this.x += this.speed;//move player
            if (this.x < 0) this.x = 0;
            else if (this.x > this.gameWidth - this.width) {
                this.x = this.gameWidth - this.width;
            }

            //vertical
            this.y += this.vy;
            if (!this.onGround()) { 
                this.frameY = 1;//change ani frame
                this.vy += this.weight;//gravity
            }
            else { 
                this.vy = 0;
                this.frameY = 0;
            }

            //restrict vertical movement within canvas
            if (this.y > this.gameHeight - this.height) {
                this.y = this.gameHeight - this.height;
                this.vy = 0;
            }
        }

        onGround() {
            return this.y >= this.gameHeight - this.height;
        }
    }

    //simple class to handle endless scrolling background
    class Background {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.image = document.getElementById("backgroundImage");
            this.x = 0;
            this.y = 0;
            this.width = 2400;
            this.height = 700;
            this.speed = 5;
        }

        draw(context) {
            context.drawImage(this.image, 
                this.x, this.y, this.width, this.height
            );

            context.drawImage(this.image, 
                this.x + this.width - this.speed,//this creates a scrolling effect the speed adjusts to hide gap
                this.y, this.width, this.height
            );
        }

        update() {
            this.x -= this.speed;//scrolling bg
            if (this.x < 0 -this.width) this.x = 0;
        }
    }

    //class to gen enemies
    class Enemy {
        constructor(gameWidth, gameHeight) {
            this.gameWidth = gameWidth;
            this.gameHeight = gameHeight;
            this.width = 160;
            this.height = 119;
            this.image = document.getElementById("enemyImage");
            this.x = this.gameWidth - 100;
            this.y = this.gameHeight - this.height;//bottom of canvas

            this.frameX = 0;
        }

        draw(context) {
            context.drawImage(this.image,
                this.frameX * this.width, 0, this.width, this.height, 
                this.x, this.y, this.width, this.height);
        }

        update() {
            this.x--;
        }
    }

    //simple function to handle enemy mgt, moving animating etc
    function handleEnemies() {
        enemies.push(new Enemy(canvas.width, canvas.height));

        enemies.forEach(object => { 
            object.draw(ctx);
            object.update();
        });
    }

    //func to handle score game over etc
    function displayStatusText() {

    }

    //instances 
    const input = new InputHandler();//input handler class
    const player = new Player(canvas.width, canvas.height);//player class
    const background = new Background(canvas.width, canvas.height);//background class
    const enemy1 = new Enemy(canvas.width, canvas.height);//enemy class

    //player.draw(ctx);//draw player on canvas

    //main aimation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clear canvas
        background.draw(ctx);//draw background
        //.update();

        player.draw(ctx);
        player.update(input);//pass input handler to player as param

        
        
        requestAnimationFrame(animate);
    }

    animate();
})