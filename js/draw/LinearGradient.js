define(['Color'],function(Color){
    var LinearGradient = function(px0, py0, px1, py1) {
        var self = this;
        self.px0 = isNaN(px0) || px0 < 0 || px0 > 100 ? 0 : px0;
        self.py0 = isNaN(py0) || py0 < 0 || py0 > 100 ? 0 : py0;
        self.px1 = isNaN(px1) || px1 < 0 || px1 > 100 ? 100 : px1;
        self.py1 = isNaN(py1) || py1 < 0 || py1 > 100 ? 100 : py1;
        self.colorsStop = [];
    };

    LinearGradient.prototype.addColorStop = function (stop, color) {
        var self = this;
        if (isNaN(stop) || stop < 0 || stop > 100) {
            throw new TypeError(
                'O indice de parada deve ser um numero entre 0 e 100');
        }
        if (!(color instanceof Color)) {
            color = Color.parse(color);
        }
        self.colorsStop[self.colorsStop.length] = [stop, color];
    };

    return LinearGradient;
});

