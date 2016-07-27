/**
 * Created by Pablo Henrick Diniz on 01/10/14.
 */

(function(w){
    var double_regex = /^[0-9]+(\.[0-9]+)?$/;

    var Friction = {
        data:[],
        set:function(matA,matB,value){
            var self = this;
            if(!double_regex.test(value)){
                return;
            }

            value = parseFloat(value);

            if(self.data[matA] != undefined){
                self.data[matA][matB] = value;
            }
            else if(self.data[matB] != undefined){
                self.data[matB][matA] = value;
            }
            else{
                self.data[matA] = [];
                self.data[matA][matB] = value;
            }
        },
        get:function(matA,matB){
            var self = this;
            if(self.data[matA] != undefined && self.data[matA][matB] != undefined){
                return self.data[matA][matB];
            }
            else if(self.data[matB] != undefined && self.data[matB][matA] != undefined){
                return self.data[matB][matA];
            }

            return null;
        }
    };

    Friction.set('Steel','Steel',0.12);
    Friction.set('Steel','Aluminum',0.14);
    Friction.set('Steel','CastIron',0.16);
    Friction.set('Steel','Bronze',0.16);
    Friction.set('Steel','Ice',0.014);
    Friction.set('Steel','Babbitt',0.22);
    Friction.set('Steel','Stone',0.5);
    Friction.set('Aluminum','Aluminum',1.05);
    Friction.set('Rubber','Wood',0.6);
    Friction.set('Rubber','Metal',0.6);
    Friction.set('Bronze','Bronze',0.2);
    Friction.set('Bronze','Iron',0.16);
    Friction.set('Bronze','CastIron',0.21);
    Friction.set('HempHore','Steel',0.25);
    Friction.set('HempHore','Wood',0.50);
    Friction.set('Leather','CastIron',0.28);
    Friction.set('Leather','Wood',0.30);
    Friction.set('Fiber','CastIron',0.4);
    Friction.set('CastIron','CastIron', 0.22);
    Friction.set('CastIron','HardWood', 0.32);
    Friction.set('Wood','Ice',0.03);
    Friction.set('HardWood','HardWood',0.25);
    Friction.set('Brick','Wood',0.6);
    Friction.set('Metal','HardWood',0.40);
    Friction.set('Stone','Wood',0.40);
    Friction.set('Stone','Brick',0.60);
    Friction.set('Tire','Road',0.60);
    Friction.set('Tire','Grass',0.35);
    Friction.set('Wheel','Rail',0.16);
    Friction.set('Ice','Ice',0.02);

    w.Friction = Friction;
})(window);

