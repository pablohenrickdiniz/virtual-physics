Trapezius.prototype = new Polygon();
function Trapezius(center,ba, bb, height){
	Polygon.call(this, center);
	this.ba = isNaN(ba) || ba <= 0?20:ba;
	this.bb = isNaN(bb) || ba <= 0?15:bb;
	this.height = isNaN(height) || height <= 0 ? 10: height;
	

	this.updateVertices = function() {
		var x = this.center[0];
		var y = this.center[1];
        var bbm = this.bb * 0.5;
        var bam = this.ba * 0.5;
        var hm = this.height * 0.5;
        var ya = y-hm;
        var yb = y+hm;
        this.vertices = [[x-bbm,ya],[x+bbm,ya],[x+bam,yb],[x-bam,yb]];
	};
	
	this.updateVertices();
}