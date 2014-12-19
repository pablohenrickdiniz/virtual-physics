function Point(){};

Point.validatePoint = function(vertice){
    if(!(vertice instanceof Array) || isNaN(vertice[0]) || isNaN(vertice[1])){
        throw new TypeError('vertice must be a array of double values');
    }
};