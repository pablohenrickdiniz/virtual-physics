Polygon.prototype = new Shape();

function Polygon(center, theta) {
	Shape.call(this, center, 'white', new Border('black', 1), theta);
	this.vertices = [];
    this.min = [];
    this.max = [];

    this.rotate = function(theta, origin){
        if(origin == undefined){
            origin = this.center;
        }
        else{
            this.center = MV.rotate(this.center,theta,origin);
        }
        for(var i = 0; i < this.vertices.length;i++){
            this.vertices[i] = MV.rotate(this.vertices[i],theta, origin);
        }
    };

    this.updateMinAndMax = function(){
        var min = this.vertices[0];
        var max = this.vertices[0];
        for(var i = 1; i < this.vertices.length;i++){
            for(var j = 0; j <= 1;j++){
                if(this.vertices[i][j] < min[j]){
                    min[j] = this.vertices[i][j];
                }
                else if(this.vertices[i][0] > max[0]) {
                    max[j] = this.vertices[i][j];
                }
            }
        }
        this.min = min;
        this.max = max;
    };
}
