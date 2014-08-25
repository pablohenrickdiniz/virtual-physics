Player.prototype = new Event();

function Player(pos){
    Event.call(this,pos);
    var page1 = new Page();
    var page2 = new Page();
    var page3 = new Page();
    var page4 = new Page();
    var event = this;

    page1.setSprite(new Sprite('img/0045.png',4,4));
    page1.setAction(function(){
        event.translate(0,1);
    });

    page2.setSprite(new Sprite('img/0045.png',4,4));
    page2.setAction(function(){
        event.translate(0,-1);
    })

    page3.setSprite(new Sprite('img/0045.png',4,4));
    page3.setAction(function(){
        event.translate(-1,0);
    });

    page4.setSprite(new Sprite('img/0045.png',4,4));
    page4.setAction(function(){
        event.translate(1,0);
    });

    this.addPage('page01',page1);
    this.addPage('page02',page2);
    this.addPage('page03',page3);
    this.addPage('page04',page4);

    KeyReader.onKeyDown(KeyReader.keys.KEY_DOWN,function(){
        page1.init();
    });
    KeyReader.onKeyDown(KeyReader.keys.KEY_UP,function(){
        page2.init();
    });
    KeyReader.onKeyDown(KeyReader.keys.KEY_LEFT,function(){
        page3.init();
    });
    KeyReader.onKeyDown(KeyReader.keys.KEY_RIGHT,function(){
        page4.init();
    });
}
