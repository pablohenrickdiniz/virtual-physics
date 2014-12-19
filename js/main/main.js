/**
 * Created by Pablo Henrick Diniz on 15/10/14.
 */
$(document).ready(function () {
    $('body').on('contextmenu', '#game', function (e) {
        return false;
    });

    $('#tipo-header').click(function () {
        $('.tipo-area').toggle();
    });

    $('#cor-header').click(function () {
        $('.cor-area').toggle();
    });

    $('#tools-header').click(function () {
        $('.tools-group').toggle();
    });

    $('#propriedades-header').click(function () {
        $('#tipo-header').toggle();
        $('#cor-header').toggle();
        if (!$('#tipo-header').is(':visible')) {
            $('.tipo-area').hide();
        }
        if (!$('#cor-header').is(':visible')) {
            $('.cor-area').hide();
        }
    });

    var game = new Game();
    var drawing = new Canvas('drawing');
    game.start();
    var active = false;
    var cp = [0, 0];

    function refreshDrawing() {
        drawing.clearScreen();
        drawing.drawShape(Menu.shape);
    }

    KeyReader.onkeydown(KeyReader.KEY_ENTER, function () {
        if (Menu.selected == 'convex') {
            if (!Menu.shape.isClockWise()) {
                Menu.shape.invertPath();
            }
            Menu.shape.updateCenter();
            Menu.shape.updateRelative();

            var body = new Body(Menu.shape, Material.Gold, getType());
            game.world.addBody(body);
            Menu.shape = null;
            Menu.drawing = false;
            Menu.drawPoint = null;
            Menu.auxpoint = null;
            drawing.clearScreen();
            if (!game.running) {
                game.canvas.drawWorld(game.world);
            }
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_J, function () {
        Menu.joinSelectedBodies();
    });

    KeyReader.onkeydown(KeyReader.KEY_T, function () {
        var polygons = [];
        var i;
        var body;
        var j;
        var k;
        var bodies = Menu.selectedBodies;
        Menu.selectedBodies = [];
        for (i = 0; i < bodies.length; i++) {
            polygons.push(bodies[i].shape);
            game.world.removeBody(bodies[i]);
        }
        var contours = [];
        for (i = 0; i < polygons.length; i++) {
            contours[i] = [];
            var p = polygons[i];
            var v = p.getVerticesInWorldCoords();
            for (j = 0; j < v.length; j++) {
                contours[i].push(new poly2tri.Point(v[j][0], v[j][1]));
            }
        }
        for (k = 0; k < contours.length; k++) {
            var swctx = new poly2tri.SweepContext(contours[k]);
            swctx.triangulate();
            var triangles = swctx.getTriangles();
            for (i = 0; i < triangles.length; i++) {
                var points = triangles[i].getPoints();
                for (j = 0; j < points.length; j++) {
                    points[j] = [points[j].x, points[j].y];
                }
                var polygon = new Polygon();
                polygon.border.lineDash = [5, 5];
                polygon.vertices = points;
                if (!polygon.isClockWise()) {
                    polygon.invertPath();
                }
                polygon.updateCenter();
                polygon.rotate(MV.toDegree(polygons[k].theta), polygons[k].center);
                polygon.updateRelative();
                polygon.color = bodies[k].shape.color;
                body = new Body(polygon, Material.Iron, bodies[k].dinamic);
                body.vLin = bodies[k].vLin;
                body.vAng = bodies[k].vAng;
                game.world.addBody(body);
                Menu.selectedBodies.push(body);
            }
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_ESC, function () {
        Menu.shape = null;
        Menu.drawing = false;
        Menu.drawPoints = [];
        for (var i = 0; i < Menu.selectedBodies.length; i++) {
            Menu.selectedBodies[i].shape.border.lineDash = [];
        }
        Menu.selectedBodies = [];
        drawing.clearScreen();
    });

    KeyReader.onkeydown(KeyReader.KEY_PLUS, function () {
        if (Menu.shape != null && Menu.selected == 'regular') {
            Menu.shape.sides++;
            Menu.shape.updateVertices();
            refreshDrawing();
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_MINUS, function () {
        if (Menu.shape != null && Menu.selected == 'regular') {
            if (Menu.shape.sides > 3) {
                Menu.shape.sides--;
                Menu.shape.updateVertices();
                refreshDrawing();
            }
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_DEL, function () {
        for (var i = 0; i < Menu.selectedBodies.length; i++) {
            game.world.removeBody(Menu.selectedBodies[i]);
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
        if (Menu.mousejoint != null) {
            game.world.removeJoint(Menu.mousejoint);
            game.world.mouseJoint = null;
        }
    });

    $("#game").on('mousewheel', function (event) {
        if (!active && !Menu.drawing) {
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
        if (Menu.selected == 'regular' && Menu.drawing) {
            var sum = event.deltaY;
            if (sum > 0) {
                Menu.shape.sides++;
            }
            else if (sum < 0 && Menu.shape.sides > 3) {
                Menu.shape.sides--;
            }
            Menu.shape.updateVertices();
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

    var Menu = {
        itens: ['rect', 'regular', 'circle', 'cursor', 'eraser', 'move', 'convex'],
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
        },
        getSelectedShapes: function () {
            var shapes = [];
            var i;
            for (i = 0; i < this.selectedBodies.length; i++) {
                shapes.push([this.selectedBodies[i].shape, false]);
            }
            return shapes;
        },
        clearSelectedBodies: function () {
            for (var i = 0; i < this.selectedBodies.length; i++) {
                game.world.removeBody(this.selectedBodies[i]);
            }
            this.selectedBodies = [];
        },
        joinSelectedBodies: function () {
            var shapes = this.getSelectedShapes();
            Menu.clearSelectedBodies();
            shapes = Polygon.joinAll(shapes);
            var body;
            var i;
            var size = shapes.length;
            for (i = 0; i < size; i++) {
                if (shapes[i][1]) {
                    if (shapes[i][0].isClockWise()) {
                        shapes[i][0].invertPath();
                    }
                    shapes[i][0].updateCenter();
                    shapes[i][0].updateRelative();
                }
                shapes[i][0].border.lineDash = [5, 5];
                body = new Body(shapes[i][0], Material.Iron, false);
                game.world.addBody(body);
            }
        }
    };

    function findSelectedBodies(shape) {
        var bodies = [];
        var i;
        var size = game.world.bodies.length;
        var body;
        for (i = 0; i < size; i++) {
            body = game.world.bodies[i];
            if (AABBoverlap(getAABB2(shape.getVerticesInWorldCoords()), body.getAABB())) {
                body.shape.border.lineDash = [5, 5];
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

    $("#rect,#circle,#regular,#cursor,#eraser,#move,#convex").click(function () {
        Menu.select($(this).attr('id'));
    });

    Menu.select('cursor');


    $("#preenchimento").change(function () {
        var value = document.getElementById('preenchimento').value;
        if (Menu.shape != null) {
            Menu.shape.color = new Color(value);
        }
        for (var i = 0; i < Menu.selectedBodies.length; i++) {
            Menu.selectedBodies[i].shape.color = new Color(value);
        }
        if (!game.running) {
            game.canvas.drawWorld(game.world);
        }

    });

    $("input[name=tipo]").change(function () {
        var value = $(this).attr('value') == 'true';
        for (var i = 0; i < Menu.selectedBodies.length; i++) {
            Menu.selectedBodies[i].setDinamic(value);
        }
    });

    function getType() {
        return $('.tipo:checked').attr('value') == 'true'
    }

    Menu.toolsAction = {
        rect: function () {
            Menu.shape = new Rect([0, 0], 10, 10);
            Menu.shape.color = new Color(document.getElementById("preenchimento").value);
            Menu.drawing = true;
        },
        convex: function () {
            var pos = game.getMouse();
            Menu.shape = new Polygon([0, 0], 0);
            Menu.shape.vertices[Menu.shape.vertices.length] = [pos[0], pos[1]];
            Menu.shape.vertices[Menu.shape.vertices.length] = Menu.drawPoint;
            Menu.shape.color = new Color(document.getElementById("preenchimento").value);
            Menu.drawing = true;
        },
        regular: function () {
            if (Menu.shape == null) {
                var pos = game.getMouse();
                Menu.shape = new Regular([pos[0], pos[1]], 10,3,0);
                Menu.shape.color = new Color(document.getElementById("preenchimento").value);
            }
            Menu.drawing = true;
        },
        eraser: function () {
            var body = findSelectedBody();
            if (body != null) {
                game.world.removeBody(body);
            }
            if (!game.running) {
                game.canvas.drawWorld(game.world);
            }
        },
        cursor:function() {
            Menu.shape = new Rect(game.getMouse(), 1, 1);
            Menu.shape.color = new Color(255, 255, 255);
            Menu.shape.border.lineDash = [5, 5];
            Menu.drawing = true;
            for (var i = 0; i < Menu.selectedBodies.length; i++) {
                Menu.selectedBodies[i].shape.border.lineDash = [];
            }
            Menu.selectedBodies = [];

            if (!game.running) {
                game.canvas.drawWorld(game.world);
            }
        },
        move: function() {
            var bodyB = findSelectedBody();
            if (bodyB != null && bodyB.dinamic) {
                var shape = new Shape(Menu.drawPoint,null,null,0);
                shape.vertices[0] = [0, 0];
                shape.center = Menu.drawPoint;
                var bodyA = new MouseBody(shape);
                bodyA.center = Menu.drawPoint;

                Menu.mousejoint = new Joint(bodyA, 0, bodyB, 0);
                game.world.addJoint(Menu.mousejoint);
            }
        }
    };

    $("#game").mousedown(function (e) {
        switch (event.which) {
            case 1:
                if (!Menu.drawing) {
                    Menu.drawPoint = game.getMouse();
                    if(Menu.toolsAction[Menu.selected] != undefined){
                        Menu.toolsAction[Menu.selected]();
                    }
                }
                else {
                    switch (Menu.selected) {
                        case 'rect':
                            Menu.drawing = false;
                            drawing.clearScreen();
                            var body = new Body(Menu.shape, Material.Iron, getType());
                            game.world.addBody(body);
                            Menu.drawPoint = null;
                            if (!game.running) {
                                game.canvas.drawWorld(game.world);
                            }
                            break;
                        case 'convex':
                            var pos = game.getMouse();
                            Menu.shape.vertices.splice(Menu.shape.vertices.length - 1, 1);
                            if (Menu.auxpoint != null) {
                                Menu.shape.vertices[Menu.shape.vertices.length] = Menu.auxpoint;
                                Menu.auxpoint = null;
                            }
                            else {
                                Menu.shape.vertices[Menu.shape.vertices.length] = pos;
                            }

                            Menu.shape.vertices[Menu.shape.vertices.length] = Menu.drawPoint;
                            break;
                        case 'regular':
                            Menu.drawing = false;
                            drawing.clearScreen();
                            var body = new Body(Menu.shape, Material.Iron, getType());
                            game.world.addBody(body);
                            Menu.shape = null;
                            Menu.drawPoint = null;
                            if (!game.running) {
                                game.canvas.drawWorld(game.world);
                            }
                            break;
                    }
                }
                break;
        }
    });

    $("#game").mouseup(function (e) {
        switch (e.which) {
            case 1:
                switch (Menu.selected) {
                    case 'cursor':
                        Menu.drawing = false;
                        drawing.clearScreen();
                        break;
                }
                break;
        }
    });

    $("#game").mousemove(function () {
        var pos = game.getMouse();
        if (Menu.drawing && Menu.shape != null) {
            drawing.clearScreen();
            switch (Menu.selected) {
                case 'rect':
                    var dim = MV.VmV(pos, Menu.drawPoint);
                    try {
                        Menu.shape.updateDimen(Math.abs(dim[0]), Math.abs(dim[1]));
                        Menu.shape.center = [Menu.drawPoint[0] + (dim[0] / 2), Menu.drawPoint[1] + (dim[1] / 2)];
                        drawing.drawShape(Menu.shape);
                    }
                    catch (ex) {

                    }

                    break;
                case 'convex':
                    var xo = Menu.drawPoint[0];
                    var yo = Menu.drawPoint[1];
                    Menu.drawPoint[0] = pos[0];
                    Menu.drawPoint[1] = pos[1];
                    if (Menu.shape.isConvex()) {
                        Menu.drawPoint[0] = xo;
                        Menu.drawPoint[1] = yo;
                        Menu.auxpoint = [xo, yo];
                    }
                    drawing.drawShape(Menu.shape);
                    break;
                case 'regular':
                    var r = Math.abs(MV.distance(pos, Menu.drawPoint));
                    Menu.shape.setRadius(r);
                    // menu.shape.theta = MV.getDegree([x,y],menu.drawPoint);
                    drawing.drawShape(Menu.shape);
                    break;
                case 'circle':
                    var r = Math.abs(MV.distance(pos, Menu.drawPoint));
                    Menu.shape.setRadius(r);
                    drawing.drawShape(Menu.shape);
                    break;
                case 'cursor':
                    if (CanvasMouseReader.left) {
                        var dim = MV.VmV(pos, Menu.drawPoint);
                        Menu.shape.updateDimen(Math.abs(dim[0]), Math.abs(dim[1]));
                        Menu.shape.center = [Menu.drawPoint[0] + (dim[0] / 2), Menu.drawPoint[1] + (dim[1] / 2)];
                        drawing.drawShape(Menu.shape);
                        for (var i = 0; i < Menu.selectedBodies.length; i++) {
                            Menu.selectedBodies[i].shape.border.lineDash = [];
                        }
                        var bodies = findSelectedBodies(Menu.shape);
                        Menu.selectedBodies = bodies;
                        if (!game.running) {
                            game.canvas.drawWorld(game.world);
                        }
                    }

            }
        }
        else if (Menu.selected != null) {
            switch (Menu.selected) {
                case 'move':
                    if (Menu.drawPoint != null) {
                        Menu.drawPoint[0] = pos[0];
                        Menu.drawPoint[1] = pos[1];
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

    $('#friction-text').change(function () {
        var friction = document.getElementById('friction-text').value;
        console.log('friction:' + friction);
        game.world.setFriction(friction);
    });

    $('#gravity-text').change(function () {
        var gravity = document.getElementById('gravity-text').value;
        console.log('gravity:' + gravity);
        game.world.setGravity(gravity);
    });
});

function frictionUpdate(value) {
    document.getElementById('friction-text').value = value;
    $('#friction-text').change();
}

function gravityUpdate(value) {
    document.getElementById('gravity-text').value = value;
    $('#gravity-text').change();
}




