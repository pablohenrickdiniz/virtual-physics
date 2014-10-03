/**
 * Created by Pablo Henrick Diniz on 29/09/14.
 */
/****************** DOMINO DEMO *****************/
$(document).ready(function () {
    $('body').on('contextmenu', '#game', function(e){ return false; });

    var reader = new MouseReader("#game");
    var game = new Game();
    game.start();
    reader.startRead();

    var shapeA = new Rect([320, 450], 640, 50);
    var groundPlane = new Body(shapeA, Material.Iron,false, [0, 0], 0);
    game.world.addBody(groundPlane);
    var active = false;
    var cp = [0,0];
    var change = [0,0];
    var change2 = [0,0];

    $("#game").mousedown(function(event){
        if(event.which == 1){
            var x = (reader.x+game.canvas.x)/game.canvas.scale;
            var y = (reader.y+game.canvas.y)/game.canvas.scale;
            var shape = new Regular([x,y], 10,4,1,0);
            var color = new Color('Green');
            color.alpha = 0.5;

            shape.color = color;
            var body = new Body(shape, Material.Gold, true,[0, 0], 0);
            game.world.addBody(body);
        }
        else if(event.which == 3){
            active = true;
            $("#game").css('cursor','move');
            cp = [reader.x+change[0],reader.y+change[1]];
        }
    });

    $("#game").mouseup(function(event){
        if(event.which == 3){
            $("#game").css('cursor','default');
            active = false;
        }
    });

    $("#game").on('mousewheel',function(event){
        if(!active){
            var cw = game.canvas.width;
            var ch = game.canvas.height;
            if(event.deltaY > 0 && game.canvas.scale < 20){
                game.canvas.scale+=0.1;
            }
            else if(game.canvas.scale >0.1){
                game.canvas.scale-=0.1;
            }
            console.log('frame:{x:0-'+game.canvas.frameWidth+',y:0-'+game.canvas.frameHeight+'}');
            console.log('scale:'+game.canvas.scale);
        }
    });

    $("#game").mousemove(function(event){
        if(active){
            var x = cp[0]- reader.x;
            var y = cp[1]- reader.y;
            change = [x,y];
            game.canvas.move(x,y);
        }
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
