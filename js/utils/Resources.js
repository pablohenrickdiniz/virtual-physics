/**
 * Created by Pablo Henrick Diniz on 15/08/14.
 */
keyreader = new KeyReader('#gamearea');


var sprites = {
    pikachu:new Sprite('img/0045.png',4,4),
    fox:new Sprite('img/0052.png',4,4),
    bird:new Sprite('img/0078.png',4,4),
    player1:new Sprite('img/0005.png',4,4)
};

var animations = {
    player1:{
        md:new Animation(sprites.player1,0,0,0,3),
        ml:new Animation(sprites.player1,1,0,1,3),
        mr:new Animation(sprites.player1,2,0,2,3),
        mu:new Animation(sprites.player1,3,0,3,3)
    }
};

var player1 = new Object(new Rect(new Point(100,100),32,32));
player1.dinamico = true;



var objects = {
    player1:{
        body:player1
    }
};

