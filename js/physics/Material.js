/**
 * Created by Pc-1 Agencia MIT on 01/10/2014.
 */

(function(ws){
    var Material = {
        data:[],
        set:function(name,obj){
            var self = this;
            if(self.data[name] == undefined){
                self.data[name] = {};
            }
            var default_obj = self.data[name];
            var keys = Object.keys(obj);
            for(var k = 0; k < keys.length;k++){
                var key = keys[k];
                default_obj[key] = obj[key];
            }
        },
        get:function(name){
            var self = this;
            if(self.data[name] != undefined){
                return self.data[name];
            }
            return null;
        }
    };

    Material.set('Aluminum',{density: 2.70});
    Material.set('Copper',{density: 8.93});
    Material.set('Gold',{density: 19.28});
    Material.set('Iron',{density: 7.87});
    Material.set('Lead',{density: 11.30});
    Material.set('Platine',{density: 21.45});
    Material.set('Rubber',{density: 1.23});
    Material.set('Silver',{density: 10.50});
    Material.set('Steel',{density: 7.86});
    Material.set('Chromium',{density: 7.10});
    Material.set('Titanium', {density: 4.55});
    Material.set('Vectram', {density: 1.41});

    w.Material = Material;
})(window);
