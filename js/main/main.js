/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
/****************** DOMINO DEMO *****************/
$(document).ready(function () {
    var shapeA = new Rect([320, 450], 640, 50);
    var groundPlane = new Body(shapeA, 0, [0, 0], 0);

    var game = new Game();
    game.world.addBody(groundPlane);
    game.start();

    var reader = new MouseReader("#game");

    reader.startRead();
    $("#game").click(function () {
        var x = reader.getX();
        var y = reader.getY();
        var shape = new Regular([x,y], 20, 5,1,0);
        var body = new Body(shape, 10, [0, 0], 0);
        game.world.addBody(body);
    });

    $("#action").click(function(){
        if(game.running){
            game.pause();
        }
        else{
            game.continue();
        }
    });
});
