$(document).ready(function() {
	var game = new Game();
    var mapa = game.getMap();
    var player = new Player(new Point(50,50));
    var page = new Page();
    page.setSprite(sprites.fox);
    var event = new Event(new Point(200,200));
    event.object.setVector(new Vector(-200,-200));
    player.object.setVector(new Vector(200,200));
    event.addPage('fox',page);
    mapa.addEvent(player);
    mapa.addEvent(event);
    game.start();


});