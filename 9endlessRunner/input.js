//class to handle active input from user and removing inactive input
export default class InputHandler{
    constructor() {
        this.keys = [];//keeps track of active keys (key pressed down) and remvoing inactive(key up)
        this.lastKey = '';//keeps track of last key pressed

        //listener for keydown event and adds key to keys array if not already in it
        window.addEventListener("keydown", e => {
            
            if((e.key ==="ArrowDown" ||
                e.key ==="ArrowUp" ||
                e.key ==="ArrowLeft" ||
                e.key ==="ArrowRight"||
                e.key ==="Enter")//wrapping condiationals in brackets ensures only unique arrows
                && this.keys.indexOf(e.key) === -1) 
                { this.keys.push(e.key); }//adds key to keys array if not already inside
            //inedeOf returns index -1 means key is not in array

            this.lastKey = e.key;//keeps track of last key pressed
            console.log(e.key, this.keys);//checking events to see if it works
        })

        //listener for keyup event and removes key from keys array if in it
        window.addEventListener("keyup", e => {
            if((e.key ==="ArrowDown" ||
                e.key ==="ArrowUp" ||
                e.key ==="ArrowLeft" ||
                e.key ==="ArrowRight")||
                e.key ==="Enter") 
                { 
                    this.keys.splice(this.keys.indexOf(e.key), 1);//removes key from keys array if in it
                }

                console.log(e.key, this.keys);//checking events to see if it works
        })
    }
}