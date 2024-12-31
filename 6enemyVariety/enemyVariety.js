//console.log("loading");

//ensure functions only fire after page correctly loads all assets
//on server use load instead of DOMContentLoaded
document.addEventListener("DOMContentLoaded", function(){
    console.log("loaded");
    //setup canvas
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    //same as in css
    canvas.width = 500;
    canvas.height = 800;

    class Game {
        constructor() {
            this.enemies = [];
            this.#addNewEnemy();
            console.log(this.enemies);
        }

        update(){
            this.enemies.forEach(object => {
                object.update();
            })
        }

        draw(){
            this.enemies.forEach(object => {
                object.draw();
            })
        }

        //private method can only be called from inside class
        #addNewEnemy() {
            this.enemies.push(new Enemy());
        }
    }

    //enemy superclass
    class Enemy {
        constructor() {
            this.x = 100;
            this.y = 100;
            this.width = 100;
            this.height = 100;
        }

        update(){
            this.x--;
        }

        draw(){
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    const game = new Game();//instantiate game
    let lastTime = 1;//time of last frame

    function animate(timeStamp){
        ctx.clearRect(0, 0, canvas.width, canvas.height);//clears canvas every frame
        const deltaTime = timeStamp - lastTime;//time since last frame
        lastTime = timeStamp;//sets last time to current time
        //console.log(deltaTime);

        //update and draw each enemy
        game.update();
        game.draw();
        
        requestAnimationFrame(animate);//calls function over and over again
    }

    animate(0);//start animation, putting 0 avoids NaN passing initially
});