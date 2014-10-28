(function () {
    var lastTime = 0;
    var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]
            + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]
            + 'CancelAnimationFrame']
            || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function (callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function () {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function (id) {
            clearTimeout(id);
        };
}());

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
        this.continue();
    };

    this.pause = function () {
        if (this.running) {
            this.running = false;
            clearInterval(this.readFrame);
        }
    };

    this.continue = function () {
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



