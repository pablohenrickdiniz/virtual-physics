define(['World','CanvasEngine','MV','AppObject','Canvas'],function(World,CanvasEngine,MV,AppObject,Canvas){
    var Game = function(options) {
        var self = this;
        self.canvasEngine = null;
        self.container = null;
        self.world = null;
        self.objectsLayer = null;
        self.quadLayer = null;
        self.drawLayer =  null;
        self.running = false;
        self.readFrame = null;
        self.scalevar = 1;
        self.showQuadTree = false;
        self.showAABBS = false;
        self.loopCallback = null;
        self.useQuadTree = true;
        self.set(options);
    };

    Game.prototype = new AppObject;

    Game.prototype.getDrawLayer = function(){
        var self = this;
        if(self.drawLayer == null){
            self.drawLayer = self.getCanvasEngine().createLayer({width:10000, height:10000},Canvas);
        }
        return self.drawLayer;
    };

    Game.prototype.getQuadLayer = function(){
        var self = this;
        if(self.quadLayer == null){
            self.quadLayer = self.getCanvasEngine().createLayer({width:10000, height:10000},Canvas);
        }
        return self.quadLayer;
    };

    Game.prototype.getObjectsLayer = function(){
        var self = this;
        if(self.objectsLayer == null){
            self.objectsLayer = self.getCanvasEngine().createLayer({width:10000, height:10000},Canvas);
        }
        return self.objectsLayer;
    };

    Game.prototype.getWorld = function(){
        var self = this;
        if(self.world == null){
            self.world = new World({
                useQuadTree:self.useQuadTree
            });
        }
        return self.world;
    };

    Game.prototype.getCanvasEngine = function(){
        var self = this;
        if(self.canvasEngine == null){
            self.canvasEngine = CanvasEngine.createEngine({
                width:'100%',
                height:600,
                container:self.container,
                scalable:true
            });
        }
        return self.canvasEngine;
    };

    Game.prototype.refreshDraw = function(){
        var self = this;
        self.drawWorld();
        if(self.showQuadTree){
            self.drawQuadTree();
        }
        if(self.showAABBS){
            self.drawAABBS();
        }
    };

    Game.prototype.setShowQuadTree = function(show){
        var self = this;
        self.showQuadTree = show;
        self.getQuadLayer().clear();
        if(!self.running && show){
            self.drawQuadTree();
        }
    };

    Game.prototype.setShowAABBS = function(show){
        var self = this;
        self.showAABBS = show;
        self.refreshDraw();
    };

    Game.prototype.scale = function(qtd){
        var self = this;
        var scale = self.scalevar+qtd;
        if(scale <= Game.MAX_SCALE && scale >= Game.MIN_SCALE){
            self.getCanvasEngine().set({
                scale:scale
            });
        }
    };
    Game.prototype.add = function(body){
        var self = this;
        self.getWorld().add(body);
        if(!self.running){
            self.refreshDraw();
        }
    };

    Game.prototype.remove = function(body){
        var self = this;
        self.getWorld().remove(body,!self.running);
        if(!self.running){
            self.refreshDraw();
        }
    };

    Game.prototype.removeAll = function(bodies){
        var self = this;
        var world = self.getWorld();
        bodies.forEach(function(body){
            world.remove(body,!self.running);
        });
        if(!self.running){
            self.refreshDraw();
        }
    };

    Game.prototype.drawWorld = function(){
        var self = this;
        self.getObjectsLayer().drawWorld(self.world);
    };

    Game.prototype.drawAABBS = function(){
        var self = this;
        var canvas = self.getObjectsLayer();
        self.world.bodies.forEach(function(body){
            canvas.drawAABB(body.getAABB());
        });
    };

    Game.prototype.drawQuadTree = function(){
        var self  = this;
        self.getQuadLayer().drawQuadTree(self.world.quadTree);
    };

    Game.prototype.start = function(){
        var self = this;
        self.restart();
    };

    Game.prototype.pause = function(){
        var self = this;
        if (self.running) {
            self.running = false;
            clearInterval(self.readFrame);
        }
        return self;
    };

    Game.prototype.restart = function(){
        var self = this;
        if (!self.running) {
            self.running = true;
            self.loop(self);
        }
    };

    Game.prototype.loop = function(self){
        if (self.running) {
            setTimeout(function () {
                requestAnimationFrame(function () {
                    self.loop(self);
                });
                self.getWorld().step();
                self.refreshDraw();
                if(self.loopCallback != null){
                    self.loopCallback();
                }
            }, self.dt * 1000);
        }
    };


    Game.prototype.getPosition = function(vertex){
        var self = this;
        return MV.VdV(MV.VpV(vertex, self.canvas.min), [self.scalevar, self.scalevar]);
    };

    Game.MAX_SCALE = 20;
    Game.MIN_SCALE = 0.1;


    return Game;
});

