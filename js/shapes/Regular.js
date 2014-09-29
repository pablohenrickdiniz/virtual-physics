Regular.prototype = new Polygon();
function Regular(center, radius, tips, thickness, theta) {
	Polygon.call(this, center, theta);
	this.radius = isNaN(radius) || radius < 0 ? 10 : radius;
	this.pontas = isNaN(tips) || tips < 3 ? 3 : tips;
	this.espessura = isNaN(thickness) || thickness < 1 ? 1 : thickness;

	this.updateVertices = function() {
		var ga = (360 / this.pontas);
		var gb = (360 / this.pontas) / 2;
		var vertices = [];

		var pa = [this.center[0], this.center[1] - this.radius* this.thickness];
		var pb = [this.center[0], this.center[1]  - this.radius];
		pa.girar(this.theta,this.centro);
		pb.girar(this.theta + gb,this.centro);

		vertices.push(pa);
		vertices.push(pb);

		for (var i = 1; i < this.pontas; i++) {
			pa = new Ponto(pa.getX(), pa.getY());
			pb = new Ponto(pb.getX(), pb.getY());
			pa.setDono(this);
			pb.setDono(this);
			pa.girar(ga,this.centro);
			pb.girar(ga,this.centro);
			vertices.push(pa);
			vertices.push(pb);
		}

		this.setPontos(vertices);
	};

	this.updateVertices();
}
