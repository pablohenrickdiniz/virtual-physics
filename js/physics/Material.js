/**
 * Created by Pc-1 Agencia MIT on 01/10/2014.
 */

var Material = {
    Aluminum: {density: 2.70},
    Copper: {density: 8.93},
    Gold: {density: 19.28},
    Iron: {density: 7.87},
    Lead: {density: 11.30},
    Platine: {density: 21.45},
    Rubber: {density: 1.23},
    Silver: {density: 10.50},
    Steel: {density: 7.86},
    Chromium: {density: 7.10},
    Titanium: {density: 4.55},
    Vectram: {density: 1.41},
    validate:function(material){
        var self = this;
        if(!self.contains(material)){
            throw new TypeError('material is not a valid Material:material='+material);
        }
    },
    contains:function(material){
        var self = this;
        var index;
        var obj;
        for(index in self){
            obj = self[index];
            if((typeof obj != "function")){
                if(material == obj){
                    return true;
                }
            }
        }
        return false;
    }
};
