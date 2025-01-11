//just place for small utility function

//context canvas to draw on and input to last key value
export function drawStatusText(context, input, player) {
    context.font ='28px Helvetica';
    context.fillText('Last input: ' + input.lastKey, 20, 50);
    context.fillText('Last input: ' + player.currentState.state, 20, 90);
}