import InputHandler from "./input.js";
import { drawStatusText } from "./utils.js";
import Player from "./player.js";
//NB named exports dont need {} around them

//let js wait for all assets to load before running
window.addEventListener('load', function() {
    //after loading get loading text and hide it
    const loading = document.getElementById('loading');
    loading.style.display = 'none';

    //setup canvas
    const canvas = document.getElementById('canvas1');
    
    //instantiate context to get all 2d drawing props and methods
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const player = new Player(canvas.width, canvas.height);
    //console.log(player);//test to see if player is created

    //inp handler
    const input = new InputHandler();
    
    //to hold time from last animation loop
    let lastTime = 0;

    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;//change in time from prev loop and this
        lastTime = timeStamp;//update last time to this current time

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //console.log(input.lastKey);
        player.update(input.lastKey);
        player.draw(ctx, deltaTime);
        drawStatusText(ctx, input, player);
        requestAnimationFrame(animate);
        
    }

    animate(0);
});