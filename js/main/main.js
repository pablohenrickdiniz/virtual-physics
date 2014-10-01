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
        var y = reader.getY()-120;
        var shape = new Trapezius([x,y], 120, 1,100);
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
