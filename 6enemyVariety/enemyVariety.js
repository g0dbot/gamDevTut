//console.log("loading");

//ensure functions only fire after page correctly loads all assets
//on server use load instead of DOMContentLoaded
document.addEventListener("DOMContentLoaded", function(){
    //console.log("loaded");
    //setup canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    //same as in css
    canvas.width = 500;
    canvas.height = 800;

    class Game {
        constructor(ctx, width, height) {
            this.ctx = ctx;
            this.width = width;
            this.height = height;
            this.enemies = [];
            //this.#addNewEnemy();
            
            this.enemyInterval = 500;
            this.enemyTimer = 0;
            this.enemyTypes = ['worm', 'ghost', 'spider'];
        }

        update(deltaTime){
            this.enemies = this.enemies.filter(object => !object.markedForDeletion);

            if (this.enemyTimer > this.enemyInterval) {
                this.#addNewEnemy();
                this.enemyTimer = 0;
                //console.log(this.enemies);
            }

            else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(object => { object.update(deltaTime); });
        }

        draw(){
            this.enemies.forEach(object => { object.draw(this.ctx); });
        }

        //private method can only be called from inside class
        #addNewEnemy() {
            const randomEnemy = this.enemyTypes[Math.floor(Math.random() * this.enemyTypes.length)];
            //console.log(randomEnemy);
            if (randomEnemy == 'worm') this.enemies.push(new Worm(this));
            else if (randomEnemy == 'ghost') this.enemies.push(new Ghost(this));
            else if (randomEnemy == 'spider') this.enemies.push(new Spider(this));
            
            //this.enemies.sort(function(a,b) {return a.y - b.y;});
        }
    }

    //enemy superclass
    class Enemy {
        constructor(game) {
            this.game = game;
            this.markedForDeletion = false;
            this.frameX = 0;
            this.maxFrame = 5;
            this.frameInterval = 100;
            this.frameTimer = 0;
        }

        update(deltaTime){
            //console.log(deltaTime);
            this.x -= this.vx * deltaTime;//moves enemy left
            if(this.x < 0 - this.width) this.markedForDeletion = true;

            if(this.frameTimer > this.frameInterval) {
                if (this.frameX < this.maxFrame) this.frameX++;
                else this.frameX = 0;
                this.frameTimer = 0;
            } else {
                this.frameTimer += deltaTime;
            }
        }

        draw(ctx){
            //ctx.fillRect(this.x, this.y, this.width, this.height);
            ctx.drawImage(this.image, 
                this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight,
                this.x, this.y, this.width, this.height);
        }
    }

    class Worm extends Enemy {
        constructor(game) {
            super(game);//super must be called before u use this keyword
            this.spriteWidth = 229;
            this.spriteHeight = 171;
            
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;

            this.x = this.game.width;
            this.y = this.game.height - this.height;

            //any element created in the dom with an id attr is auto added to js exe envr as global variable
            this.image = worm;
            this.vx = Math.random() * 0.2 + 0.2;//random speed between 0.5 and 1.5
        }
    }

    class Ghost extends Enemy {
        constructor(game) {
            super(game);//super must be called before u use this keyword
            this.spriteWidth = 261;
            this.spriteHeight = 209;
            
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;

            this.x = this.game.width;
            this.y = Math.random() * this.game.height * 0.6;//random y position within constraints

            //any element created in the dom with an id attr is auto added to js exe envr as global variable
            this.image = ghost;
            this.vx = Math.random() * 0.2 + 0.1;//random speed between 0.5 and 1.5

            this.angle = 0;
            this.curve = Math.random() * 3;//amplitude
        }

        update(deltaTime){
            super.update(deltaTime);
            this.y += Math.sin(this.angle) * this.curve;
            this.angle += 0.04;
        }

        draw(ctx){
            // ctx.globalAlpha = 0.5;//transparency
            // super.draw(ctx);
            // ctx.globalAlpha = 1;

            ctx.save();
            ctx.globalAlpha = 0.7;//transparency
            super.draw(ctx);//super must be called before u use this keyword
            ctx.restore();
        }
    }

    class Spider extends Enemy {
        constructor(game) {
            super(game);//super must be called before u use this keyword
            this.spriteWidth = 310;
            this.spriteHeight = 175;
            
            this.width = this.spriteWidth / 2;
            this.height = this.spriteHeight / 2;

            this.x = Math.random() * this.game.width;//random x position within constraints
            this.y = 0 - this.height;

            //any element created in the dom with an id attr is auto added to js exe envr as global variable
            this.image = spider;
            
            this.vx = 0;
            this.vy = Math.random() * 0.1 + 0.1;//random speed between 0.5 and 1.5

            this.maxLength = Math.random() * this.game.height; 
        }

        update(deltaTime){
            super.update(deltaTime);
            this.y += this.vy * deltaTime;//moves enemy down

            if (this.y > this.maxLength) {
                this.vy *= -1;//reverses direction
            }
        }

        draw(ctx){
            ctx.beginPath();
            ctx.moveTo(this.x + this.width/2, 0);//starting point
            ctx.lineTo(this.x + this.width/2, this.y + 10);//moves to starting point
            ctx.stroke();
            super.draw(ctx);
        }
    }

    const game = new Game(ctx, canvas.width, canvas.height);//instantiate game
    let lastTime = 1;//time of last frame

    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clears canvas every frame
        const deltaTime = timeStamp - lastTime;//time since last frame
        lastTime = timeStamp;//sets last time to current time
        //console.log(deltaTime);

        //update and draw each enemy
        game.update(deltaTime);
        game.draw();
        
        requestAnimationFrame(animate);//calls function over and over again
    }

    animate(0);//start animation, putting 0 avoids NaN passing initially
});