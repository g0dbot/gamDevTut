//set sup listeners for specific kjeys and keep track or last key pressed or released
export default class InputHandler {
    constructor(){
        this.lastKey = '';

        //KEY DOWN LISTENERS
        //es6 arrow functions allow scope retention of called inside function so we dont need to use bind
        window.addEventListener('keydown', (e) => {
            //console.log(e.key, 'pressed');//checking events to see if it works
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'PRESS left';
                    break;
                case 'ArrowRight':
                    this.lastKey = 'PRESS right';
                    break;
                case 'ArrowUp':
                    this.lastKey = 'PRESS up';
                    break;
                case 'ArrowDown':
                    this.lastKey = 'PRESS down';
                    break;
            }//end of swtich
        });//end of listener

        //KEYUP LISTENERS
        window.addEventListener('keyup', (e) => {
            //console.log(e.key, 'released');//checking events to see if it works
            switch (e.key) {
                case 'ArrowLeft':
                    this.lastKey = 'RELEASE left';
                    break;
                case 'ArrowRight':
                    this.lastKey = 'RELEASE right';
                    break;
                case 'ArrowUp':
                    this.lastKey = 'RELEASE up';
                    break;
                case 'ArrowDown':
                    this.lastKey = 'RELEASE down';
                    break;               
            }//end of swtich
        });//end of listener
    }
}