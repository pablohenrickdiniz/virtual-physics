$(document).ready(function() {
	var game = new Game();
    var mapa = game.getMap();
    var ball1 = new Event(new Point(100,100));
    var ball2 =  new Event(new Point(300,300));
    ball2.object.setVector(new Vector(-150,-100));
    ball1.object.dinamic = true;
    ball1.object.gravityInfluence = false;
    ball2.object.dinamic = true;
    ball2.object.gravityInfluence = false;
    mapa.addEvent(ball1);
    mapa.addEvent(ball2);
    game.start();


});