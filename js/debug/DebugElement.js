define(['jquery','lodash'],function($,_){
    var DebugElement = function(object){
        var self = this;
        self.element = document.createElement('tr');
        self.props = [];
        self.object = object;
    };

    DebugElement.prototype.debug = function(prop){
        var self = this;
        if(self.props[prop] == undefined){
            self.props[prop] = document.createElement('td');
            $(self.element).append(self.props[prop]);
            self.object.onChange(prop,function(value){
                if(_.isArray(value)){
                    value = value.map(function(val){
                        return parseInt(val);
                    });
                }
                else if(_.isNumber(value)){
                    value = parseInt(value);
                }

                $(self.props[prop]).html(value.toString());
            });
        }
        return self;
    };

    DebugElement.prototype.removeDebug = function(prop){
        var self = this;
        if(self.props[prop] != undefined){
            $(self.props[prop]).remove();
            self.object.unbindChange(prop);
            delete self.props[prop];
        }
        return self;
    };

    DebugElement.prototype.destroy = function(){
        var self = this;
        Object.keys(self.props).forEach(function(key){
            self.removeDebug(key);
        });
        $(self.element).remove();
        return self;
    };

    return DebugElement;
});