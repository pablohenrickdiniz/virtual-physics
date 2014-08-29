/**
 * Created by Pablo Henrick Diniz on 13/08/14.
 */

function Graphics() {
}

Graphics.render = function (map) {
    //Graphics.clearAll();
    var eventos = map.getEvents();
    CanvasList.canvas[0].clearScreen();
    for(var i = 0; i < eventos.length;i++){

        for(var j = 0; j < eventos[i].length;j++){
            var page =  eventos[i][j].getAtualPage();
            var contact = eventos[i][j].getContact();
            if(page != null){
                var layer = eventos[i][j].getLayer();
                var x = eventos[i][j].getX();
                var y = eventos[i][j].getY();
                var sprite = page.getSprite();
                var frame = sprite.getAtualFrame();
                CanvasList.canvas[layer].drawFrame(x,y,frame);
            }
            CanvasList.canvas[0].drawShape(contact);
        }
    }
}


Graphics.clearAll = function () {
    for (var index in CanvasList.canvas) {
        CanvasList.canvas[index].clearScreen();
    }
};