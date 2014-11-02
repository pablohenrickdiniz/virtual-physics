function Game() {
    var self = this;
    self.world = new World();
    self.canvas = new Canvas('game');
    self.quad = new Canvas('quad');
    self.running = false;
    self.readFrame = null;
    self.reader = CanvasMouseReader;
    var game = this;

    self.start = function () {
        var self = this;
        self.reader.start();
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
                self.canvas.drawWorld(self.world);
                self.quad.drawQuadTree(self.world.quadTree);
            }, self.dt * 1000);
        }
    };

    self.getMouse = function () {
        return MV.VdV(MV.VpV(self.reader.vertex, self.canvas.min), [self.canvas.scale, self.canvas.scale]);
    };
}



