Rect.prototype = new Polygon();
function Rect(center, width, height) {
	Polygon.call(this, center);
	this.width = isNaN(width) || width <= 0 ? 10: width;
	this.height =  isNaN(height) || height <= 0 ? 10: height;

	this.updateVertices = function() {
		var x = this.center[0];
		var y = this.center[1];
        var mw = this.width * 0.5;
        var mh =this.height *0.5;
        var xa = x - mw;
        var xb = x + mw;
        var ya = y - mh;
        var yb = y + mh;
        this.vertices = [[xa,ya],[xb,ya],[xb,yb],[xa,yb]];
	};

    this.updateVertices();
}
