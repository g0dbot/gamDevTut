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
    let score = 0;

    let gameOver = false;

    //apply event listeners and hold array of currently active keys
    class InputHandler{
        constructor(){
            this.keys = [];
            this.touchY = null;//y pos of touch event
            this.touchTreshold = 30;//threshold for touch events

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
                
                else if (e.key === "Enter" && gameOver) {
                    restartGame();
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

            //touch events
            window.addEventListener("touchstart", e => {
                //console.log('start');
                //console.log(e);
                this.touchY = e.changedTouches[0].pageY;
            });

            window.addEventListener("touchmove", e => {
                //console.log('moving');
                const swipeDistance = e.changedTouches[0].pageY - this.touchY;

                if (swipeDistance < -this.touchTreshold && this.keys.indexOf('swipe up') === -1) {
                    this.keys.push('swipe up')
                }

                if (swipeDistance > this.touchTreshold && this.keys.indexOf('swipe down') === -1) {
                    this.keys.push('swipe down');
                    if (gameOver) restartGame();
                }
            });

            window.addEventListener("touchend", e => {
                //console.log(this.keys);
                //remove swipe events
                this.keys.splice(this.keys.indexOf('swipe up'), 1);
                this.keys.splice(this.keys.indexOf('swipe down'), 1);
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

            this.maxFrame = 8;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.speed = 0;

            this.vy = 0;//vertical velocity
            this.weight = 1;
        }

        //for restarting game
        restart() {
            this.x = 0;
            this.y = this.gameHeight - this.height;
            this.maxFrame = 8;
            this.frameY = 0;
        }

        //context used to specify which canvas to draw on
        draw(context) {
            //temp hitbox
            // context.strokeStyle = "white";
            // context.strokeRect(this.x, this.y, this.width, this.height);
            
            //circular hitbox
            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2, false);
            context.stroke();

            //context.fillStyle = "white";
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.image,
                //cuts from sprite sheet
                this.frameX * this.width,//source x
                this.frameY * this.height,//source y
                this.width, this.height,//source width and height

                //placement
                this.x, this.y, this.width, this.height,
            );
        }

        update(input, deltaTime, enemies) {
            //collision detection
            enemies.forEach(enemy => {
                const dx = enemy.x - this.x;
                const dy = enemy.y - this.y;

                //if distance is less than sum of radius
                const distance = Math.hypot(dx, dy);
                if (distance < enemy.width / 2 + this.width / 2) {
                    console.log("collision");
                    gameOver = true;
                }
            });

            //ANIMATION
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) { this.frameX = 0; }
                else { this.frameX++; }
                this.frameTimer = 0;
            }
            else {
                this.frameTimer += deltaTime;
            }

            //CONTROLS
            //horizontal movement inp
                    if(input.keys.indexOf("ArrowRight") > -1) { this.speed = 5;}
            else    if(input.keys.indexOf("ArrowLeft") > -1) { this.speed = -5;}

            //vertical movement inp
            else if ((input.keys.indexOf("ArrowUp") > -1 || input.keys.indexOf("swipe up") > -1) && this.onGround()) { this.vy -= 32; }
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
                this.maxFrame = 5;
            }
            else {
                this.maxFrame = 8;
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

        restart() {
            this.x = 0;
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
            this.maxFrame = 5;
            this.fps = 20;
            this.frameTimer = 0;
            this.frameInterval = 1000 / this.fps;

            this.speed = Math.random() * 5 + 5;//random number between 5 and 10
            this.markedForDeletion = false;
        }

        draw(context) {
            //temp hitbox
            // context.strokeStyle = "white";
            // context.strokeRect(this.x, this.y, this.width, this.height);

            context.beginPath();
            context.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2, false);
            context.stroke();

            context.drawImage(this.image,
                this.frameX * this.width, 0, this.width, this.height, 
                this.x, this.y, this.width, this.height);
        }

        update(deltaTime) {
            if (this.frameTimer > this.frameInterval) {
                if (this.frameX >= this.maxFrame) { this.frameX = 0; }//reset sheet x pos
                else { this.frameX++; }

                this.frameTimer = 0;
            }
            else {
                this.frameTimer += deltaTime;
            }
            
            this.x -= this.speed;

            if (this.x < 0 - this.width) {
                this.markedForDeletion = true;
                score ++;
            }
        }
    }

    //simple function to handle enemy mgt, moving animating etc

    function handleEnemies(deltaTime) {
        if (enemyTimer > enemyInterval + randomEnemyInterval) {
            console.log(enemyInterval + randomEnemyInterval);
            enemies.push(new Enemy(canvas.width, canvas.height));
            enemyTimer = 0;
            randomEnemyInterval = Math.random() * 1000 + 500;
        }
        else {
            enemyTimer += deltaTime;
        }

        enemies.forEach(object => { 
            object.draw(ctx);
            object.update(deltaTime);
        });

        enemies = enemies.filter(object => !object.markedForDeletion);//filter all enemies not on canvas
    }

    //func to handle score game over etc
    function displayStatusText(context) {
        context.textAlign = "left";
        context.font = "40px Helvetica";
        context.fillStyle = "black";
        context.fillText("Score: " + score, 20, 50);
        context.fillStyle = "white";
        context.fillText("Score: " + score, 22, 50);

        if (gameOver) {
            context.textAlign = "center";
            context.fillStyle = "black";
            context.fillText("GAME OVER your score is: " + score, canvas.width / 2, canvas.height / 2);
            context.fillStyle = "white";
            context.fillText("GAME OVER your score is: " + score, canvas.width / 2, canvas.height / 2 + 5);
        }
    }

    function restartGame() {
        player.restart();
        background.restart();
        enemies = [];
        score = 0;
        gameOver = false;
        animate(0);
    }

    //instances 
    const input = new InputHandler();//input handler class
    const player = new Player(canvas.width, canvas.height);//player class
    const background = new Background(canvas.width, canvas.height);//background class
    //const enemy1 = new Enemy(canvas.width, canvas.height);//enemy class

    //player.draw(ctx);//draw player on canvas

    let lastTime = 0;
    let enemyTimer = 0;
    let enemyInterval = 1000;//milliseconds
    let randomEnemyInterval = Math.random() * 1000 + 500;//milliseconds

    //main aimation loop
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;//time since last frame
        lastTime = timeStamp;//sets last time to current time

        ctx.clearRect(0, 0, canvas.width, canvas.height);//clear canvas
        background.draw(ctx);//draw background
        background.update();

        player.draw(ctx);
        player.update(input, deltaTime, enemies);//pass input handler to player as param

        handleEnemies(deltaTime);//handle enemies
        displayStatusText(ctx);
        if (!gameOver) {
            requestAnimationFrame(animate);//calls function over and over again
        }
    }

    animate(0);//start animation
})