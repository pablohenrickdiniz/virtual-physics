/**
 * Created by Pablo Henrick Diniz on 15/10/14.
 */
$(document).ready(function () {
    $('body').on('contextmenu', '#game', function (e) {
        return false;
    });


    var game = new Game();
    var drawing = new Canvas('drawing');
    game.start();
    var active = false;
    var cp = [0, 0];

    function refreshDrawing() {
        drawing.clearScreen();
        drawing.drawShape(menu.shape);
    }

    KeyReader.onkeydown(KeyReader.KEY_ENTER, function () {
        if (menu.selected == 'convex') {
            if (!menu.shape.isClockWise()) {
                var first = menu.shape.vertices.shift();
                menu.shape.vertices.reverse();
                menu.shape.vertices.unshift(first);
            }
            menu.shape.updateCenter();
            menu.shape.updateRelative();

            var body = new Body(menu.shape, Material.Gold, $("#tipo").val() == 'true');
            game.world.addBody(body);
            menu.shape = null;
            menu.drawing = false;
            menu.drawPoint = null;
            menu.auxpoint = null;
            drawing.clearScreen();
            if (!game.running) {
                game.canvas.drawWorld(game.world);
            }
        }
    });

    var joinPolygons = function(polygons){

            for(var i = 0; i < polygons.length;i++){
                for(var j =i+1; j < polygons.length;j++){
                    var result = Polygon.join(polygons[i],polygons[j]);
                    if(result.length == 1){
                        polygons[i] = result[0];
                        polygons.splice(j,1);
                        j--;
                    }
                }
            }

        return polygons;
    };


    KeyReader.onkeydown(KeyReader.KEY_J,function(){

            var polygons = [];
            var i;
            var body;
            for(i = 0; i < menu.selectedBodies.length;i++){
                polygons.push(menu.selectedBodies[i].shape);
                game.world.removeBody(menu.selectedBodies[i]);
            }
            var result = joinPolygons(polygons);
            menu.selectedBodies = [];
            for(i = 0; i < result.length;i++){
                result[i].border.lineDash = [5,5];
                body = new Body(result[i],Material.Iron,false);
                game.world.addBody(body);
                menu.selectedBodies.push(body);
            }

    });

    KeyReader.onkeydown(KeyReader.KEY_ESC, function () {
        menu.shape = null;
        menu.drawing = false;
        menu.drawPoints = [];
        for(var i = 0; i < menu.selectedBodies.length;i++){
            menu.selectedBodies[i].shape.border.lineDash =[];
        }
        menu.selectedBodies =[];
        drawing.clearScreen();
    });

    KeyReader.onkeydown(KeyReader.KEY_PLUS, function () {
        if (menu.shape != null && menu.selected == 'regular') {
            menu.shape.sides++;
            menu.shape.updateVertices();
            refreshDrawing();
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_MINUS, function () {
        if (menu.shape != null && menu.selected == 'regular') {
            if (menu.shape.sides > 3) {
                menu.shape.sides--;
                menu.shape.updateVertices();
                refreshDrawing();
            }
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_DEL, function () {
        for(var i = 0; i < menu.selectedBodies.length;i++){
            game.world.removeBody(menu.selectedBodies[i]);
        }
        if (!game.running) {
            game.canvas.drawWorld(game.world);
        }
    });

    game.reader.onmousedown(game.reader.RIGHT, function () {
        var center = game.canvas.center;
        $("#game").css('cursor', 'move');
        cp = MV.VpV(game.reader.vertex, center);
    });

    game.reader.onmouseup(game.reader.RIGHT, function () {
        $("#game").css('cursor', 'default');
    });


    $("#game").mouseup(function (event) {
        if (menu.mousejoint != null) {
            game.world.removeJoint(menu.mousejoint);
            game.world.mouseJoint = null;
        }
    });

    $("#game").on('mousewheel', function (event) {
        if (!active && !menu.drawing) {
            if (event.deltaY > 0 && game.canvas.scale < 20) {
                game.canvas.scale += 0.1;
                drawing.scale += 0.1;
                game.quad.scale += 0.1;
            }
            else if (game.canvas.scale > 0.2) {
                game.canvas.scale -= 0.1;
                drawing.scale -= 0.1;
                game.quad.scale -= 0.1;
            }
            if (!game.running) {
                game.canvas.drawWorld(game.world);
            }
        }
        if (menu.selected == 'regular' && menu.drawing) {
            var sum = event.deltaY;
            if (sum > 0) {
                menu.shape.sides++;
            }
            else if (sum < 0 && menu.shape.sides > 3) {
                menu.shape.sides--;
            }
            menu.shape.updateVertices();
            refreshDrawing();
        }
    });

    $("#game").mousemove(function () {
        if (game.reader.right) {
            var center = MV.VmV(cp, game.reader.vertex);
            game.canvas.move(center);
            drawing.move(center);
            game.quad.move(center);
            if (!game.running) {
                game.quad.drawQuadTree(game.world.quadTree);
                game.canvas.drawWorld(game.world);
            }
        }
    });

    $("#action").click(function () {
        if (game.running) {
            game.pause();
        }
        else {
            game.restart();
        }
    });

    var menu = {
        itens: ['quadrado', 'regular', 'circulo', 'cursor', 'eraser', 'move', 'convex', 'chain'],
        selected: 'cursor',
        drawing: false,
        shape: null,
        selectedBodies: [],
        auxpoint: null,
        mousejoint: null,
        rope: null,
        bodyA: null,
        bodyB: null,
        vertexA: null,
        vertexB: null,
        select: function (item) {
            this.selected = item;
            $("#" + item).addClass('well well-sm');
            for (var i = 0; i < this.itens.length; i++) {
                if (this.itens[i] != item) {
                    $('#' + this.itens[i]).removeClass('well well-sm');
                }
            }
            this.drawing = false;
            this.shape = null;
            drawing.clearScreen();
        }
    };

    function findSelectedBodies(shape) {
        var AABB = getAABB2(shape.getVerticesInWorldCoords());
        var bodies = [];
        var i;
        var size = game.world.bodies.length;
        var body;
        for (i = 0; i < size; i++) {
            body = game.world.bodies[i];
            if (AABBoverlap(AABB, body.getAABB(),0)) {
                body.shape.border.lineDash = [5, 5];
                game.canvas.drawAABB(AABB);
                game.canvas.drawAABB(body.getAABB());
                bodies.push(body);
            }
        }
        return bodies;
    }

    function findSelectedBody() {
        var pos = game.getMouse();
        var bodies = [];
        var i;
        var sizeA = game.world.bodies.length;

        for (i = 0; i < sizeA; i++) {
            var body = game.world.bodies[i];
            if (body.shape.contains(pos)) {
                bodies.push(body);
            }
        }
        var sizeB = bodies.length;
        if (sizeB > 0) {
            var min = 0;
            var distance = MV.distance(bodies[0].center, pos);
            var aux;
            for (i = 1; i < sizeB; i++) {
                aux = MV.distance(bodies[i].center, pos);
                if (aux < distance) {
                    distance = aux;
                    min = i;
                }
            }
            if (min != -1) {
                return bodies[min];
            }
        }

        return null;
    }

    $("#quadrado,#circulo,#regular,#cursor,#eraser,#move,#convex,#chain").click(function () {
        menu.select($(this).attr('id'));
    });

    menu.select('cursor');


    $("#preenchimento").change(function () {
        var value = document.getElementById('preenchimento').value;
        if (menu.shape != null) {
            menu.shape.color = new Color(value);
        }

            for(var i = 0;i< menu.selectedBodies.length;i++){
                menu.selectedBodies[i].shape.color = new Color(value);
            }

            if (!game.running) {
                game.canvas.drawWorld(game.world);
            }

    });

    $("#tipo").change(function () {
        var value = document.getElementById('tipo').value == 'true';
        for(var i = 0;i< menu.selectedBodies.length;i++){
            menu.selectedBodies[i].setDinamic(value);
        }
    });

    $("#game").mousedown(function (e) {
        switch (event.which) {
            case 1:
                if (!menu.drawing) {
                    var pos = game.getMouse();
                    menu.drawPoint = pos;
                    if (menu.selected == 'quadrado') {
                        menu.shape = new Rect([0, 0], 10, 10);
                        menu.shape.color = new Color(document.getElementById("preenchimento").value);
                        menu.drawing = true;
                    }
                    else if (menu.selected == 'convex') {
                        menu.shape = new Polygon([0, 0], 0);
                        menu.shape.vertices[menu.shape.vertices.length] = [pos[0], pos[1]];
                        menu.shape.vertices[menu.shape.vertices.length] = menu.drawPoint;
                        menu.shape.color = new Color(document.getElementById("preenchimento").value);
                        menu.drawing = true;
                    }
                    else if (menu.selected == 'regular') {
                        if (menu.shape == null) {
                            menu.shape = new Regular([pos[0], pos[1]], 10);
                            menu.shape.color = new Color(document.getElementById("preenchimento").value);
                        }
                        menu.drawing = true;
                    }
                    else if (menu.selected == 'eraser') {
                        var body = findSelectedBody();
                        if (body != null) {
                            game.world.removeBody(body);
                        }
                        if (!game.running) {
                            game.canvas.drawWorld(game.world);
                        }
                    }
                    else if (menu.selected == 'cursor') {

                        menu.shape = new Rect(pos, 1, 1);
                        menu.shape.color = new Color(255, 255, 255);
                        menu.shape.border.lineDash = [5, 5];
                        menu.drawing = true;
                        for (var i = 0; i < menu.selectedBodies.length; i++) {
                            menu.selectedBodies[i].shape.border.lineDash = [];
                        }
                        menu.selectedBodies = [];

                        if (!game.running) {
                            game.canvas.drawWorld(game.world);
                        }
                    }
                    else if (menu.selected == 'move') {
                        var bodyB = findSelectedBody();
                        if (bodyB != null && bodyB.dinamic) {
                            var shape = new Shape(menu.drawPoint);
                            shape.vertices[0] = [0, 0];
                            shape.center = menu.drawPoint;
                            var bodyA = new MouseBody(shape);
                            bodyA.center = menu.drawPoint;

                            menu.mousejoint = new Joint(bodyA, 0, bodyB, 0);
                            game.world.addJoint(menu.mousejoint);
                        }
                    }
                    else if (menu.selected == 'chain') {
                        var bodyA = findSelectedBody();
                        if (bodyA != null) {
                            var pos = game.getMouse();
                            menu.vertexA = MV.VmV(bodyA.center, pos);
                            menu.bodyA = bodyA;
                            menu.drawing = true;
                        }
                    }
                }
                else {
                    switch (menu.selected) {
                        case 'quadrado':
                            menu.drawing = false;
                            drawing.clearScreen();
                            var body = new Body(menu.shape, Material.Iron, $("#tipo").val() == 'true');
                            game.world.addBody(body);
                            menu.drawPoint = null;
                            if (!game.running) {
                                game.canvas.drawWorld(game.world);
                            }
                            break;
                        case 'convex':
                            var pos = game.getMouse();
                            menu.shape.vertices.splice(menu.shape.vertices.length - 1, 1);
                            if (menu.auxpoint != null) {
                                menu.shape.vertices[menu.shape.vertices.length] = menu.auxpoint;
                                menu.auxpoint = null;
                            }
                            else {
                                menu.shape.vertices[menu.shape.vertices.length] = pos;
                            }

                            menu.shape.vertices[menu.shape.vertices.length] = menu.drawPoint;
                            break;
                        case 'regular':
                            menu.drawing = false;
                            drawing.clearScreen();
                            var body = new Body(menu.shape, Material.Iron, $("#tipo").val() == 'true');
                            game.world.addBody(body);
                            menu.shape = null;
                            menu.drawPoint = null;
                            if (!game.running) {
                                game.canvas.drawWorld(game.world);
                            }
                            break;
                        case 'chain':

                    }
                }
                break;
        }
    });

    $("#game").mouseup(function(e){
           switch(e.which){
               case 1:
                   switch(menu.selected){
                       case 'cursor':
                           menu.drawing = false;
                           drawing.clearScreen();
                       break;
                   }
               break;
           }
    });

    $("#game").mousemove(function () {
        var pos = game.getMouse();
        if (menu.drawing && menu.shape != null) {
            drawing.clearScreen();
            switch (menu.selected) {
                case 'quadrado':
                    var dim = MV.VmV(pos, menu.drawPoint);
                    menu.shape.updateDimen(Math.abs(dim[0]), Math.abs(dim[1]));
                    menu.shape.center = [menu.drawPoint[0] + (dim[0] / 2), menu.drawPoint[1] + (dim[1] / 2)];
                    drawing.drawShape(menu.shape);
                    break;
                case 'convex':
                    var xo = menu.drawPoint[0];
                    var yo = menu.drawPoint[1];
                    menu.drawPoint[0] = pos[0];
                    menu.drawPoint[1] = pos[1];
                    if (menu.shape.isConvex()) {
                        menu.drawPoint[0] = xo;
                        menu.drawPoint[1] = yo;
                        menu.auxpoint = [xo, yo];
                    }
                    drawing.drawShape(menu.shape);
                    break;
                case 'regular':
                    var r = Math.abs(MV.distance(pos, menu.drawPoint));
                    menu.shape.setRadius(r);
                    // menu.shape.theta = MV.getDegree([x,y],menu.drawPoint);
                    drawing.drawShape(menu.shape);
                    break;
                case 'circulo':
                    var r = Math.abs(MV.distance(pos, menu.drawPoint));
                    menu.shape.setRadius(r);
                    drawing.drawShape(menu.shape);
                    break;
                case 'cursor':
                    if (CanvasMouseReader.left) {
                        var dim = MV.VmV(pos, menu.drawPoint);
                        menu.shape.updateDimen(Math.abs(dim[0]), Math.abs(dim[1]));
                        menu.shape.center = [menu.drawPoint[0] + (dim[0] / 2), menu.drawPoint[1] + (dim[1] / 2)];
                        drawing.drawShape(menu.shape);
                        for (var i = 0; i < menu.selectedBodies.length; i++) {
                            menu.selectedBodies[i].shape.border.lineDash = [];
                        }
                        var bodies = findSelectedBodies(menu.shape);
                        menu.selectedBodies = bodies;
                        console.log(menu.selectedBodies);
                        if (!game.running) {
                            game.canvas.drawWorld(game.world);
                        }
                    }

            }
        }
        else if (menu.selected != null) {
            switch (menu.selected) {
                case 'move':
                    if (menu.drawPoint != null) {
                        menu.drawPoint[0] = pos[0];
                        menu.drawPoint[1] = pos[1];
                    }
            }
        }
    });

    $("#play-btn").click(function () {
        game.restart();
    });

    $("#pause-btn").click(function () {
        game.pause();
    });

});
