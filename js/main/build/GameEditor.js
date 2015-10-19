define([
    'Game',
    'React',
    'ToolMenu',
    'Rect',
    'Math',
    'Body',
    'Material',
    'Polygon',
    'KeyReader',
    'Regular',
    'Color',
    'FrictionPhysics',
    'MV',
    'Border',
    'chart'
],function(Game,React,ToolMenu,Rect,Math,Body,Material,Polygon,KeyReader,Regular,Color,FrictionPhysics,MV,Border,Chart){
    var GameEditor = {
        game:null,
        tools:[
            {
                name:'cursor',
                icon:'fa fa-2x fa-hand-o-up'
            },
            {
                name:'move',
                icon:'fa fa-2x fa-arrows'
            },
            {
                name:'convex',
                icon:'fa fa-2x fa-pencil'
            },
            {
                name:'rect',
                icon:'fa fa-2x fa-square'
            },
            {
                name:'circle',
                icon:'fa fa-2x fa-circle'
            },
            {
                name:'regular',
                icon:'fa fa-2x fa-star'
            }
        ],
        selectedTool:null,
        shape:null,
        drawing:false,
        color:'rgba(0,0,0,0)',
        dinamic:true,
        chart:null,
        selectedBodies:[],
        lastLoop:null,
        bodiesQtd:[0,50,100,150,200,250,300,350,400,450,500],
        times:[0,0,0,0,0,0,0,0,0,0,0],
        initialize:function(){
            var self = this;
            var game = self.getGame();
            game.start();
            self.initializeTools();
        },

        initializeTools:function(){
            var self = this;
            var game = self.getGame();
            var canvasEngine = game.getCanvasEngine();
            var mouseReader = canvasEngine.getMouseReader();
            var krd = canvasEngine.getKeyReader();
            var drawLayer = game.getDrawLayer();
            var world = game.getWorld();

            krd.onSequence([KeyReader.Keys.KEY_ENTER],function(){
                console.log('keydown');
                if(self.selectedTool == 'convex' && self.drawing){
                    var shape = self.shape;
                    if(shape.vertices.length >= 3 && !shape.isConvex()){
                        if (!shape.isClockWise()) {
                            shape.invertPath();
                        }
                        shape.updateCenter();
                        shape.updateRelative();
                        var body = new Body({shape:shape,material:Material.Iron,dinamic:self.dinamic});
                        game.getWorld().add(body);
                        self.drawing = false;
                        self.shape = null;
                        drawLayer.clear();
                    }
                }
            });

            krd.onSequence([KeyReader.Keys.KEY_UP],function(){
                if(self.selectedTool == 'regular' && self.drawing){
                    self.shape.set({
                        sides:self.shape.sides+1
                    });
                    drawLayer.clear().drawShape(self.shape);
                }
            });


            krd.onSequence([KeyReader.Keys.KEY_DOWN],function(){
                if(self.selectedTool == 'regular' && self.drawing){
                    self.shape.set({
                        sides:self.shape.sides-1
                    });
                    drawLayer.clear().drawShape(self.shape);
                }
            });

            krd.onSequence([KeyReader.Keys.KEY_DEL],function(){
                self.selectedBodies.forEach(function(body){
                    world.remove(body);
                });
            });


            mouseReader.onmousemove(function(){
                var self = GameEditor;
                if(mouseReader.left && self.selectedTool == 'move'){
                    var sp = mouseReader.lastDown.left;
                    var ep = mouseReader.lastMove;
                    var scale = GameEditor.getGame().getCanvasEngine().scale;
                    sp = Math.sdv(scale,sp);
                    ep = Math.sdv(scale,ep);

                    var dim = Math.vmv(ep, sp);
                    var halfW = dim.x/2;
                    var halfH = dim.h/2;
                    var x = sp.x + (dim.x/2);
                    var y = sp.y + (dim.y/ 2);
                    var rect = new Rect({
                        width:Math.abs(dim.x),
                        height:Math.abs(dim.y),
                        center:[x,y],
                        border:new Border({
                            lineDash:[5,5]
                        })
                    });
                    drawLayer.clear().drawShape(rect);

                    self.selectedBodies.forEach(function(body){
                        body.shape.border.setLineDash([]);
                    });

                    var bodies = GameEditor.findSelectedBodies(rect);
                    bodies.forEach(function(body){
                        body.shape.border.setLineDash([5, 5]);
                    });
                    self.selectedBodies = bodies;
                }
            });

            mouseReader.onmouseup(1,function(){
                if(self.selectedTool == 'move'){
                    drawLayer.clear();
                }
            });


            mouseReader.onmousedown(1,function(){
                switch(self.selectedTool){
                    case 'rect':
                        self.executeRectTool(this.lastDown.left);
                        break;
                    case 'convex':
                        self.executePolygonTool(this.lastDown.left);
                        break;
                    case 'regular':
                        self.executeRegularTool(this.lastDown.left);
                        break;
                }
                if(self.drawing){
                    drawLayer.clear().drawShape(self.shape);
                }
                else{
                    drawLayer.clear();
                    self.shape = null;
                }
            });

            mouseReader.onmousemove(function(){
                var reader = this;
                if(self.drawing){
                    var ca = reader.lastDown.left;
                    var cb = reader.lastMove;
                    switch(self.selectedTool){
                        case 'rect':
                            self.executeRectMove(ca,cb);
                            break;
                        case 'convex':
                            self.executePolygonMove(cb);
                            break;
                        case 'regular':
                            self.executeRegularMove(ca,cb);
                            break;
                    }
                    drawLayer.clear().drawShape(self.shape);
                }
            });

            React.render(
                React.createElement(ToolMenu, {items: self.tools, onItemCheck: self.onToolSelect}),
                document.getElementById('tool-menu')
            );

            $("#color").change(function(){
                self.color = $(this).val();
                if(self.shape != null){
                    self.shape.set({
                        color:self.color
                    });
                    drawLayer.clear().drawShape(self.shape);
                }
            });


            $("#friccao").change(function(){
                GameEditor.getGame().getWorld().setFriction($(this).val());
            });

            $("#gravidade").change(function(){
                GameEditor.getGame().getWorld().setGravity($(this).val());
            });

            $("#dinamico").change(function(){
                self.dinamic = $(this).is(':checked');
            });


            $("#show-quadtree").change(function(){
                GameEditor.getGame().setShowQuadTree($(this).is(':checked'))
            });

            $("#show-aabb").change(function(){
                GameEditor.getGame().setShowAABBS($(this).is(':checked'));
            });


            $("#play-btn").click(function(){
                GameEditor.getGame().start();
            });

            $('#pause-btn').click(function(){
                GameEditor.getGame().pause();
            });

        },
        executeRectTool:function(point){
            var self = this;
            if(!self.drawing){
                self.drawing = true;
                var scale = GameEditor.getGame().getCanvasEngine().scale;
                point = Math.sdv(scale,point);
                var center = [point.x,point.y];
                self.shape = new Rect({
                    center:center,
                    width:10,
                    height:10,
                    color:self.color
                });
            }
            else{
                self.drawing = false;
                var body = new Body({shape:self.shape,material:Material.Iron,dinamic:self.dinamic});
                self.getGame().getWorld().add(body);
            }
        },
        executePolygonTool:function(sp){
            var self = this;
            if(!self.drawing){
                self.drawing = true;
                var scale = GameEditor.getGame().getCanvasEngine().scale;
                sp = Math.sdv(scale,sp);
                var pa = [sp.x,sp.y];
                var pb = [sp.x,sp.y];
                var pc = [sp.x,sp.y+1];
                self.shape = new Polygon({
                    center:pa,
                    vertices:[pb,pc]
                });
            }
            else{
                var added = false;
                var vertices = self.shape.vertices;
                var pa = [sp.x-1,sp.y-1];
                var pb = [sp.x-1,sp.y+1];
                var pc = [sp.x+1,sp.y-1];
                var pd = [sp.x+1,sp.y+1];

                if(!self.shape.contains(pa)){
                    if(!Polygon.isConvex(vertices.concat([pa]))){
                        added =  self.shape.add(pa);
                    }
                }

                if(!added && !self.shape.contains(pb)){
                    if(!Polygon.isConvex(vertices.concat([pb]))){
                        added =  self.shape.add(pb);
                    }
                }

                if(!added && !self.shape.contains(pc)){
                    if(!Polygon.isConvex(vertices.concat([pc]))){
                        added =  self.shape.add(pc);
                    }
                }

                if(!added && !self.shape.contains(pd)){
                    if(!Polygon.isConvex(vertices.concat([pd]))){
                        added =  self.shape.add(pd);
                    }
                }
            }
        },
        executeRegularTool:function(sp){
            var self = this;
            if(!self.drawing){
                self.drawing = true;
                var scale = GameEditor.getGame().getCanvasEngine().scale;
                sp = Math.sdv(scale,sp);
                self.shape = new Regular({center:[sp.x,sp.y]});
            }
            else{
                self.drawing = false;
                var body = new Body({shape:self.shape,material:Material.Iron,dinamic:self.dinamic});
                self.getGame().getWorld().add(body);
            }
        },
        executeRegularMove:function(sp,ep){
            var self = this;
            var scale = self.getGame().getCanvasEngine().scale;
            sp = Math.sdv(scale,sp);
            ep = Math.sdv(scale,ep);
            var distance = Math.distance(sp,ep);
            self.shape.set({
                radius:distance
            });
        },
        executeRectMove:function(sp,ep){
            var scale = GameEditor.getGame().getCanvasEngine().scale;
            sp = Math.sdv(scale,sp);
            ep = Math.sdv(scale,ep);

            var dim = Math.vmv(ep, sp);
            var self = this;
            var halfW = dim.x/2;
            var halfH = dim.h/2;


            var x = sp.x + (dim.x/2);
            var y = sp.y + (dim.y/ 2);

            self.shape.set({
                width:Math.abs(dim.x),
                height:Math.abs(dim.y),
                center:[x,y]
            });

        },
        executePolygonMove:function(ep){
            var self = this;
            if(!self.shape.contains([ep.x-1,ep.y-1])){
                var last = self.shape.last();
                var x = last[0];
                var y = last[1];
                last[0] = ep.x-1;
                last[1] = ep.y-1;

                if(self.shape.isConvex()){
                    last[0] = x;
                    last[1] = y;
                }
            }
        },
        getGame:function(){
            var self = this;
            if(self.game == null){
                self.game = new Game({
                    container:'#canvas-container',
                    loopCallback:function(){
                        var fps = 0;
                        if(!self.lastCalledTime) {
                            self.lastCalledTime = Date.now();
                        }
                        else{
                            var delta = (new Date().getTime() - self.lastCalledTime)/1000;
                            self.lastCalledTime = Date.now();
                            fps = 1/delta;

                            var qtdBodies = self.game.getWorld().bodies.length;
                            var index = self.bodiesQtd.indexOf(qtdBodies);
                            if(index != -1){
                                self.times[index] = fps;
                                self.updateChart();
                            }
                        }
                    }
                });
            }
            return self.game;
        },
        onToolSelect:function(name){
            GameEditor.selectedTool = name;
        },
        findSelectedBodies:function(shape) {
            var self = this;
            var bodies = [];
            var i;
            var body;
            var aux_bodies = self.getGame().getWorld().bodies;
            var size = aux_bodies.length;
            for (i = 0; i < size; i++) {
                body = aux_bodies[i];
                if (FrictionPhysics.AABBoverlap(FrictionPhysics.getAABB2(shape.getVerticesInWorldCoords()), body.getAABB())) {
                    bodies.push(body);
                }
            }
            return bodies;
        },
        findSelectedBody:function() {
            var self = this;
            var game = GameEditor.getGame();
            var scale = game.getCanvasEngine().scale;
            var pos = game.getMouseReader().lastDown.left;
            pos = Math.sdv(scale,pos);
            var i;
            var body;
            var world = game.getWorld();
            var bodies = world.bodies;
            var sizeA = bodies.length;
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
        },
        getPerformanceChart:function(){
            var self = this;
            if(self.chart == null){
                var ctx = $("#chart")[0].getContext("2d");
                console.log(ctx);
                var chart = Chart.noConflict();
                self.chart = new chart(ctx);
            }
            return self.chart;
        },
        updateChart:function(){
            var self = this;
            self.getPerformanceChart().Line({
                labels:self.bodiesQtd,
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: self.times
                    }
                ]
            })
        }
    };

    return GameEditor;
});