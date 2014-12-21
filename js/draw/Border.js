function Border(color, thickness) {
    var self = this;
    self.color = color == undefined ? null : color;
    self.thickness = thickness == undefined ? 1 : thickness;
    self.lineDash = [];
    self.lineCap = 'butt';

    self.setLineDash = function(lineDash){
        var self = this;
        Border.validateLineDash(lineDash);
        self.lineDash = lineDash;
    };
}

Border.BUTT = 'butt';
Border.ROUND = 'round';
Border.SQUARE = 'square';
Border.validateLineDash = function(lineDash){
    var valid = true;
    if(lineDash instanceof Array){
        var i;
        var size = lineDash.length;
        for(i = 0; i < size;i++){
            if(isNaN(lineDash[i])){
                valid = false;
                break;
            }
        }
    }
    else{
        valid = false;
    }
    if(!valid){
        throw new TypeError('linedash must be a arrau with double values:linedash='+linedash);
    }
};