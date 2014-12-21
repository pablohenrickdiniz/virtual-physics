/**
 * Created by Pablo Henrick Diniz on 15/10/14.
 */
$(document).ready(function () {
    Reader = new MouseReader('#game');
    var game = new Game();
    game.start();
    Reader.start();
    var active = false;
    var cp = [0, 0];


    $('body').on('contextmenu', 'canvas', function(e){ return false; });

    function refreshDrawing() {
        game.drawing.clearScreen();
        game.drawing.drawShape(Menu.shape);
    }

    KeyReader.onkeydown(KeyReader.KEY_ENTER, function () {
        if (Menu.selected == 'convex') {
            if (!Menu.shape.isClockWise()) {
                Menu.shape.invertPath();
            }
            Menu.shape.updateCenter();
            Menu.shape.updateRelative();

            var body = new Body(Menu.shape, Material.Gold, getType());
            game.add(body);
            Menu.clear();
            game.drawing.clearScreen();
            if (!game.running) {
                game.drawWorld();
            }
        }
    });
/*
    KeyReader.onkeydown(KeyReader.KEY_J, function () {
        Menu.joinSelectedBodies();
    });;*/

    /*
    KeyReader.onkeydown(KeyReader.KEY_T, function () {
        var polygons = [];
        var i;
        var body;
        var j;
        var k;
        var bodies = Menu.selectedBodies;
        var contours = [];
        var p;
        var v;
        var swctx;
        var triangles;
        var points;
        var polygon;
        var size = bodies.length;
        var size2;

        Menu.selectedBodies = [];
        for (i = 0; i < size; i++) {
            body = bodies[i];
            polygons.push(body.shape);
            game.remove(body);
        }

        size = polygons.length;

        for (i = 0; i < size; i++) {
            contours[i] = [];
            p = polygons[i];
            v = p.getVerticesInWorldCoords();
            size2 =  v.length;
            for (j = 0; j < size2; j++) {
                contours[i].push(new poly2tri.Point(v[j][0], v[j][1]));
            }
        }

        size = contours.length;

        for (k = 0; k < size; k++) {
            swctx = new poly2tri.SweepContext(contours[k]);
            swctx.triangulate();
            triangles = swctx.getTriangles();
            size2 =  triangles.length;
            for (i = 0; i < size2; i++) {
                points = triangles[i].getPoints();
                for (j = 0; j < points.length; j++) {
                    points[j] = [points[j].x, points[j].y];
                }
                polygon = new Polygon();
                polygon.border.setLineDash([5, 5]);
                polygon.setVertices(points);
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
                game.add(body);
                Menu.selectedBodies.push(body);
            }
        }
    });*/

    KeyReader.onkeydown(KeyReader.KEY_ESC, function () {
        var i;
        var bodies =  Menu.selectedBodies;
        var size = bodies.length;

        for (i = 0; i < size; i++) {
            bodies[i].shape.border.setLineDash([]);
        }
        game.drawing.clearScreen();
        Menu.clear();
    });

    KeyReader.onkeydown(KeyReader.KEY_PLUS, function () {
        if (Menu.shape instanceof Regular ) {
            Menu.shape.sides++;
            Menu.shape.updateVertices();
            refreshDrawing();
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_MINUS, function () {
        if (Menu.shape instanceof Regular) {
            if (Menu.shape.sides > 3) {
                Menu.shape.sides--;
                Menu.shape.updateVertices();
                refreshDrawing();
            }
        }
    });

    KeyReader.onkeydown(KeyReader.KEY_DEL, function () {
        game.removeAll(Menu.selectedBodies);
    });

    Reader.onmousedown(MouseReader.RIGHT, function () {
        var center = game.canvas.center;
        $("#game").css('cursor', 'move');
        cp = MV.VpV(Reader.vertex, center);
        console.log('mousedwon right');
    });

    Reader.onmouseup(MouseReader.RIGHT, function () {
        $("#game").css('cursor', 'default');
        console.log('mouseup right');
    });


    $("#game").mouseup(function (event) {
        if (Menu.mousejoint != null) {
            game.world.removeJoint(Menu.mousejoint);
            game.world.mouseJoint = null;
        }
    });

    $("#game").on('mousewheel', function (event) {
        if (!active && !Menu.drawing) {
            if (event.deltaY > 0) {
                game.scale(0.1);
            }
            else if (game.canvas.scale > 0.2) {
                game.scale(-0.1);
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

    Reader.onmousemove(function(){
        if(Reader.right){
            var center = MV.VmV(cp, Reader.vertex);
            game.moveCamera(center);
            console.log('mouse move reader');
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
        select: function (item) {
            var self = this;
            var i;
            self.selected = item;
            $("#" + item).addClass('well well-sm');
            for (i = 0; i < this.itens.length; i++) {
                if (self.itens[i] != item) {
                    $('#' + self.itens[i]).removeClass('well well-sm');
                }
            }
            self.drawing = false;
            self.shape = null;
            game.drawing.clearScreen();
        },
        getSelectedShapes: function () {
            var shapes = [];
            var i;
            var self = this;
            var bodies = self.selectedBodies;
            var size = bodies.length;
            for (i = 0; i < size; i++) {
                shapes.push([bodies[i].shape, false]);
            }
            return shapes;
        },
        clearSelectedBodies: function () {
            var self = this;
            game.removeAll(self.selectedBodies);
            self.selectedBodies = [];
        },
        joinSelectedBodies: function () {
            Menu.clearSelectedBodies();
            var self = this;
            var shapes = self.getSelectedShapes();
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
                shapes[i][0].border.setLineDash([5, 5]);
                body = new Body(shapes[i][0], Material.Iron, false);
                game.add(body);
            }
        },
        clear:function(){
            var self = this;
            self.shape = null;
            self.drawing = false;
            self.drawPoint = null;
            self.auxpoint = null;
            self.selectedBodies = [];
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
                body.shape.border.setLineDash([5, 5]);
                bodies.push(body);
            }
        }
        return bodies;
    }

    function findSelectedBody() {
        var pos = game.getPosition();
        var i;
        var body;
        var sizeA = game.world.bodies.length;
        var world = game.world;
        var bodies = world.bodies;
        var shape;
        var min;
        var sizeB;
        var distance;
        var aux;

        for (i = 0; i < sizeA; i++) {
            body = bodies[i];
            shape = body.shape;
            if (shape.contains(pos)) {
                bodies.push(body);
            }
        }
        sizeB = bodies.length;
        if (sizeB > 0) {
            min = 0;
            distance = MV.distance(bodies[0].center, pos);
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
        var i;
        var bodies = Menu.selectedBodies;
        var size = bodies.length;
        var color = new Color(value);

        for (i = 0; i < size; i++) {
            bodies[i].shape.setColor(color);
        }
        if (!game.running) {
            game.drawWorld();
        }

    });

    $("input[name=tipo]").change(function () {
        var value = $(this).is(':checked');
        var i;
        var bodies = Menu.selectedBodies;
        var size = bodies.length;

        for (i = 0; i < size; i++) {
            bodies[i].setDinamic(value);
        }
    });

    function getType() {
        return $('.tipo').is(':checked');
    }

    Menu.toolsAction = {
        rect: function () {
            var value = document.getElementById("preenchimento").value;
            Menu.shape = new Rect([0, 0], 10, 10);
            Menu.shape.setColor(new Color(value));
            Menu.drawing = true;
        },
        convex: function () {
            var pos = game.getPosition();
            var value = document.getElementById("preenchimento").value;
            Menu.shape = new Polygon([0, 0], 0);
            Menu.shape.add([pos[0], pos[1]]);
            Menu.shape.add(Menu.drawPoint);
            Menu.shape.setColor(new Color(value));
            Menu.drawing = true;
        },
        regular: function () {
            if (Menu.shape == null) {
                var pos = game.getPosition();
                console.log(pos);
                var value = document.getElementById("preenchimento").value;
                Menu.shape = new Regular([pos[0], pos[1]], 10, 3, 0);
                Menu.shape.setColor(new Color(value));
            }
            Menu.drawing = true;
        },
        eraser: function () {
            var body = findSelectedBody();
            if (body != null) {
                game.remove(body);
            }
        },
        cursor: function () {
            var pos = game.getPosition();
            Menu.shape = new Rect(pos, 1, 1);
            var shape = Menu.shape;
            var i;
            var bodies =  Menu.selectedBodies;
            var size = bodies.length;

            shape.setColor(new Color(255, 255, 255));
            shape.border.setLineDash([5, 5]);
            Menu.drawing = true;
            for (i = 0; i < size; i++) {
                bodies[i].shape.border.setLineDash([]);
            }
            Menu.selectedBodies = [];

            if (!game.running) {
                game.drawWorld();
            }
        },
        move: function () {
            var bodyB = findSelectedBody();
            if (bodyB != null && bodyB.dinamic) {
                var shape = new Shape(Menu.drawPoint, null, null, 0);
                shape.vertices[0] = [0, 0];
                shape.setCenter(Menu.drawPoint);
                var bodyA = new MouseBody(shape);
                bodyA.setCenter(Menu.drawPoint);

                Menu.mousejoint = new Joint(bodyA, 0, bodyB, 0);
                game.world.addJoint(Menu.mousejoint);
            }
        }
    };

    Menu.toolsCreate = {
        rect: function () {
            Menu.drawing = false;
            game.drawing.clearScreen();
            var body = new Body(Menu.shape, Material.Iron, getType());
            game.add(body);
            Menu.clear();
        },
        convex: function () {

            Menu.shape.vertices.splice(Menu.shape.vertices.length - 1, 1);
            if (Menu.auxpoint != null) {
                Menu.shape.vertices[Menu.shape.vertices.length] = Menu.auxpoint;
                Menu.auxpoint = null;
            }
            else {
                var pos = game.getPosition();

                Menu.shape.vertices.push(pos);
            }

            Menu.shape.vertices.push(Menu.drawPoint);
        },
        regular: function () {
            Menu.drawing = false;
            game.drawing.clearScreen();
            var body = new Body(Menu.shape, Material.Iron, getType());
            game.add(body);
            Menu.clear();
        }
    };

    Menu.toolsMouseMoveDrawing = {
        complete:function(){
           game.drawing.drawShape(Menu.shape);

        },
        rect: function () {
            var pos = game.getPosition();
            var dim = MV.VmV(pos, Menu.drawPoint);
            try {
                Menu.shape.updateDimen(Math.abs(dim[0]), Math.abs(dim[1]));
                Menu.shape.setCenter([Menu.drawPoint[0] + (dim[0] / 2), Menu.drawPoint[1] + (dim[1] / 2)]);
            }
            catch (ex) {

            }
        },
        convex: function () {
            var pos = game.getPosition();
            var xo = Menu.drawPoint[0];
            var yo = Menu.drawPoint[1];
            Menu.drawPoint[0] = pos[0];
            Menu.drawPoint[1] = pos[1];
            if (Menu.shape.isConvex()) {
                Menu.drawPoint[0] = xo;
                Menu.drawPoint[1] = yo;
                Menu.auxpoint = [xo, yo];
            }
        },
        regular: function () {
            var pos = game.getPosition();
            var r = Math.abs(MV.distance(pos, Menu.drawPoint));
            Menu.shape.setRadius(r);
        },
        circle: function () {
            var pos = game.getPosition();
            var r = Math.abs(MV.distance(pos, Menu.drawPoint));
            Menu.shape.setRadius(r);
        },
        cursor: function () {
            var pos = game.getPosition();
            if (Reader.left) {
                var dim = MV.VmV(pos, Menu.drawPoint);
                Menu.shape.updateDimen(Math.abs(dim[0]), Math.abs(dim[1]));
                Menu.shape.setCenter([Menu.drawPoint[0] + (dim[0] / 2), Menu.drawPoint[1] + (dim[1] / 2)]);
                for (var i = 0; i < Menu.selectedBodies.length; i++) {
                    Menu.selectedBodies[i].shape.border.setLineDash([]);
                }
                var bodies = findSelectedBodies(Menu.shape);
                Menu.selectedBodies = bodies;
                if (!game.running) {
                    game.drawWorld();
                }
            }
        }
    };

    Menu.toolsMouseMove = {
        move: function () {
            var pos = game.getPosition();
            if (Menu.drawPoint != null) {
                Menu.drawPoint[0] = pos[0];
                Menu.drawPoint[1] = pos[1];
            }
        }
    };


    $("#game").mousemove(function () {
        if (Menu.drawing && Menu.shape != null) {
            game.drawing.clearScreen();
            if (Menu.toolsMouseMoveDrawing[Menu.selected] != undefined) {
                Menu.toolsMouseMoveDrawing[Menu.selected]();
                Menu.toolsMouseMoveDrawing.complete();
            }
        }
        else if (Menu.selected != null) {
            if (Menu.toolsMouseMove[Menu.selected] != undefined) {
                Menu.toolsMouseMove[Menu.selected]();
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


    $("#game").mousedown(function (e) {
        if (e.which == 1) {
            if (!Menu.drawing) {
                Menu.drawPoint = game.getPosition();
                if (Menu.toolsAction[Menu.selected] != undefined) {
                    Menu.toolsAction[Menu.selected]();
                }
            }
            else {
                if (Menu.toolsCreate[Menu.selected] != undefined) {
                    Menu.toolsCreate[Menu.selected]();
                }
            }
        }
    });

    $("#game").mouseup(function (e) {
        switch (e.which) {
            case 1:
                switch (Menu.selected) {
                    case 'cursor':
                        Menu.drawing = false;
                        game.drawing.clearScreen();
                        break;
                }
                break;
        }
    });

    $('#show-quadtree').change(function(){
        game.setShowQuadTree($(this).is(':checked'));
    });

    $('#show-aabb').change(function(){
        game.setShowAABBS($(this).is(':checked'));
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




