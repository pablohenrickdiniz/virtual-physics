$(document).ready(function() {
    function Controller(){};
    Controller.game =  new Game();;
    var mapa = Controller.game.getMap();
    Controller.game.start();

    var chao = new Event();
    chao.setContact(new Rect(new Point(250,400),420,30));
    chao.object.dinamic = true;
    chao.object.gravityInfluence = false;
    chao.object.dinamic=false;
    chao.object.setMass(1000);
    mapa.addEvent(chao);

    var reader = new MouseReader("#canvas-area");
    reader.startRead();
    $("#canvas-area").click(function(){
        var ball = new Event();
        ball.setContact(new Circle(new Point(reader.getX()-30, reader.getY()-30),30));
        ball.object.dinamic = true;
        ball.object.gravityInfluence = true;
        console.log(ball.object);
        mapa.addEvent(ball);
    });

});