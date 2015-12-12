define(['AppObject'],function(AppObject){
    var Border = function(properties) {
        var self = this;
        self.color = null;
        self.thickness = 1;
        self.lineDash = [];
        self.lineCap = 'butt';
        self.set(properties);
    };

    Border.prototype = new AppObject;

    Border.prototype.setLineDash = function(lineDash){
        var self = this;
        Border.validateLineDash(lineDash);
        self.lineDash = lineDash;
    };

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
    return Border;
});


