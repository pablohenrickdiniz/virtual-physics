function Game() {
    this.world = new World();
    this.canvas = new Canvas('game');
    this.quad = new Canvas('quad');
    this.running = false;
    this.readFrame = null;
    this.reader = CanvasMouseReader;
    var game = this;

    this.start = function () {
        this.reader.start();
        this.restart();
    };

    this.pause = function () {
        if (this.running) {
            this.running = false;
            clearInterval(this.readFrame);
        }
    };

    this.restart = function () {
        if (!this.running) {
            this.running = true;
            this.loop(this);
        }
    };

    this.loop = function (game) {
        if (game.running) {
            setTimeout(function () {
                requestAnimationFrame(function () {
                    game.loop(game);
                });
                game.world.step();
                game.canvas.drawWorld(game.world);
                game.quad.drawQuadTree(game.world.quadTree);
            }, game.dt * 1000);
        }
    };

    this.getMouse = function () {
        var sum = MV.VpV(this.reader.vertex, this.canvas.min);
        var div = MV.VdV(sum, [this.canvas.scale, this.canvas.scale]);
        return div;
    };
}



