//newgame();
//var result;
// listen(function(result){
//         console.log(result)});
listen();
predict(["f2f3"]);

setTimeout(function() {predict(["f2f3", "e7e6", "g2g4"])}, 10000);

function move(prediction){
    console.log(prediction);
}
// moves=["f2f3"];
// predict(moves);
//
