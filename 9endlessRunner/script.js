import Player from "./player.js";//importing player class and methods
import InputHandler from "./input.js";
import { Background } from "./background.js";
import { FlyingEnemy, GroundEnemy, ClibmingEnemy } from "./enemy.js";
import { UI } from "./ui.js";

//ensures all assets are loaded before js can run
window.addEventListener("load", function() {
    const canvas = document.getElementById("canvas1");//get canvas in var
    const ctx = canvas.getContext("2d");//get access to 2d drawing api moethods

    //canvas dimensions
    canvas.width = 500;
    canvas.height = 500;

    //main brain or runner class stored
    //all logic runs through here
    class Game {
        //constructor taking dimensions as args
        //contructor is a special type of function
        //gets run when class is instantiated
        //so all code within constructor is executed on instantaiation (side effect)
        //takes canvas width and height as args
        constructor(width, height) {
            //take arg and convert to class prop
            this.width = width;
            this.height = height;

            this.groundMargin = 82;//space between ground and player
            this.speed = 0;//speed of layers

            this.background = new Background(this);//instantiate background
            //instantiate player
            //inside game class, this represents the current object executing methods
            this.player = new Player(this);//we use this to pass game as argument to player
            //this gives us access to player class within game class
            this.input = new InputHandler(this);

            this.UI = new UI(this);

            //enemies
            this.enemies = [];//array to hold all current enemies
            this.enemyTimer = 0;
            this.enemyInterval = 1000;//time between enemy spawn

            this.particles = [];//array to hold all current particles
            this.maxParticles = 50;

            this.debug = true;//debug
            this.score = 0;
            this.fontColor = "black";

            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();//enter starting state
        }

        update(deltaTime) {
            this.background.update();//call update method
            this.player.update(this.input.keys, deltaTime);//pass input handler to player

            //handle enemies
            if (this.enemyTimer > this.enemyInterval) {
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }

            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
                if (enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1);//remove enemy
            });

            this.particles.forEach((particle, index) =>{
                particle.update();
                if(particle.markedForDeletion) this.particles.splice(index, 1);//remove particle
            });

            if (this.particles.length > this.maxParticles) {
                this.particles = this.particles.slice(0, this.maxParticles);
            }

            //console.log(this.particles);
        }

        //takes context (current canvas to draw on) as arg
        draw(context) {
            this.background.draw(context);//call draw method
            this.player.draw(context);//draw player taking context as arg

            this.enemies.forEach(enemy => {
                enemy.draw(context);
                
            });

            this.UI.draw(context);

            this.particles.forEach((particle) =>{
                particle.draw(context);
                if(particle.markedForDeletion) this.particles.splice(this.particles.indexOf(particle), 1);//remove particle
            });
        }

        addEnemy() {
            //only add gound enemies if player is moving
            if(this.speed > 0 && Math.random() < 0.05) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClibmingEnemy(this));

            this.enemies.push(new FlyingEnemy(this));
            //console.log(this.enemies);//debug
        }
    } 

    const game = new Game(canvas.width, canvas.height);//instantiate game class
    
    let lastTime = 0;//time of last frame from last ani loop

    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;//time since last frame
        lastTime = timestamp;//sets last time to current time
        //console.log(deltaTime);//print time since last frame

        //clear canvas every frame to prevent artifacts
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);//call draw method

        //has 2 spec features auto adjusts refresh rate
        //also auto gens timestamps and passes it as arg
        requestAnimationFrame(animate);//calls function over and over again
    }

    animate(0);
});