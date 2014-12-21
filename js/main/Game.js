Game.MAX_SCALE = 20;
Game.MIN_SCALE = 0.1;

function Game() {
    var self = this;
    self.world = new World();
    self.canvas = new Canvas('game');
    self.quad = new Canvas('quad');
    self.drawing =  new Canvas('drawing');
    self.running = false;
    self.readFrame = null;
    self.scalevar = 1;
    self.showQuadTree = false;
    self.showAABBS = false;

    self.refreshDraw = function(){
        var self = this;
        self.drawWorld();
        if(self.showQuadTree){
            self.drawQuadTree();
        }
        if(self.showAABBS){
            self.drawAABBS();
        }
    };

    self.setShowQuadTree = function(show){
        var self = this;
        self.showQuadTree = show;
        self.quad.clearScreen();
    };

    self.setShowAABBS = function(show){
        var self = this;
        self.showAABBS = show;
        if(!self.running){
            self.canvas.clearScreen();
        }
    };


    self.scale = function(qtd){
        var self = this;
        var scale = self.scalevar+qtd;
        if(scale <= Game.MAX_SCALE && scale >= Game.MIN_SCALE){
            self.canvas.scale += qtd;
            self.quad.scale += qtd;
            self.drawing.scale += qtd;
            self.scalevar += qtd;
            if(!self.running){
                self.refreshDraw();
            }
        }
    };

    self.moveCamera = function(center){
        var self = this;
        self.canvas.move(center);
        self.drawing.move(center);
        self.quad.move(center);

        if (!game.running) {
            self.refreshDraw();
        }
    };

    self.add = function(body){
        var self = this;
        self.world.add(body);
        if(!self.running){
            self.refreshDraw();
        }
    };

    self.remove = function(body){
        var self = this;
        self.world.remove(body,!self.running);
        if(!self.running){
            self.refreshDraw();
        }
    };

    self.removeAll = function(bodies){
        var self = this;
        bodies.forEach(function(body){
            self.world.remove(body,!self.running);
        });
        if(!self.running){
            self.refreshDraw();
        }
    };

    self.drawWorld = function(){
        var self = this;
        self.canvas.drawWorld(self.world);
    };

    self.drawAABBS = function(){
        var self = this;
        self.world.bodies.forEach(function(body){
            self.canvas.drawAABB(body.getAABB());
        });
    };


    self.drawQuadTree = function(){
        var self  = this;
        self.quad.drawQuadTree(self.world.quadTree);
    };

    self.start = function () {
        var self = this;
        self.restart();
    };

    self.pause = function () {
        var self = this;
        if (self.running) {
            self.running = false;
            clearInterval(self.readFrame);
        }
    };

    self.restart = function () {
        var self = this;
        if (!self.running) {
            self.running = true;
            self.loop(self);
        }
    };

    self.loop = function (self) {
        if (self.running) {
            setTimeout(function () {
                requestAnimationFrame(function () {
                    self.loop(self);
                });
                self.world.step();
                self.refreshDraw();
            }, self.dt * 1000);
        }
    };

    self.getPosition = function () {
        var self = this;
        return MV.VdV(MV.VpV(Reader.vertex, self.canvas.min), [self.scalevar, self.scalevar]);
    };
}



