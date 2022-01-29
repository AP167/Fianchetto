var stockfish = new Worker('stockfish.asm.js');
console.log("stockfish initialized");
function newgame(){
    stockfish.postMessage("uci");
    stockfish.postMessage("setoption name Hash value 32");
    stockfish.postMessage("ucinewgame");

}
function predict(movelist){
    var cmd="position startpos moves ";
    for(var i =0; i<movelist.length; i++)
        cmd+=movelist[i]+" ";
    stockfish.postMessage(cmd);
    stockfish.postMessage("go depth 15");
    console.log("inside predict");
}

function listen(stockfishMove){
    var prediction=new Map([['type', ''], ['from', ''], ["to", ""], ["promotion", ""]]);
    stockfish.onmessage=function(event) {
        var line
        if (event && typeof event === "object") {
            line = event.data;
        } else {
            line = event;
        }
            var match = line.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
            //console.log(line);
            if(match) {
                prediction.set('type', 'move');
                prediction.set('from', match[1]);
                prediction.set("to" , match[2]);
                if(match[3]!==undefined)
                    prediction.set("promotion" , match[3]);
                    stockfishMove(prediction)
            }
    };
    return prediction;
}

// function quit(){
//     stockfish.postMessage('quit')
// }
// function currentState(){
// stockfish.postMessage("d");
// }

export {listen, predict, newgame}
