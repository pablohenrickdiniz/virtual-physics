define(['jquery'],function($){
    var DebugElement = function(object){
        var self = this;
        self.element = document.createElement('tr');
        self.props = [];
        self.object = object;
    };

    DebugElement.prototype.debugProp = function(prop){
        var self = this;
        if(self.props[prop] == undefined){
            self.props[prop] = document.createElement('td');
            $(self.element).append(self.props[prop]);
            self.object.onChange(prop,function(value){
                $(self.props[prop]).html(value);
            });
        }
        return self;
    };

    DebugElement.prototype.removeDebugProp = function(prop){
        var self = this;
        if(self.props[prop] != undefined){
            $(self.props[prop]).remove();
            self.object.unbindChange(prop);
            delete self.props[prop];
        }
    };

    DebugElement.prototype.destroy = function(){
        var self = this;
        Object.keys(self.props).forEach(function(key){
            self.removeDebugProp(key);
        });
        $(self.element).remove();
        return self;
    };

    return DebugElement;
});