/**
 * Created by Aluno on 30/04/14.
 */
function Vector(x, y) {
	this.x = x;
	this.y = y;
	this.degree = null;
	this.norm  = null;
	this.color   = new Color(0,0,0);
	
	
	this.getX = function() {
		return this.x;
	};

	this.getY = function() {
		return this.y;
	};

	this.setX = function(x) {
		if (!isNaN(x)) {
			this.x = x;
			this.norm  = null;
			this.degree = null;
		}
	};

	this.setY = function(y) {
		if (!isNaN(y)) {
			this.y = y;
			this.norm  = null;
			this.degree = null;
		}
	};

	this.normalizar = function() {
		var length = this.getNorm();
		this.x = this.x / length;
		this.y = this.y / length;
	};

	this.getNorm = function() {
		if (this.norm == null) {
			this.norm = hypotenuse(this.x, this.y);
		}
		return this.norm;
	};

	this.getDegree = function() {
		if(this.degree == null){
			this.degree = getDegree(this.x, this.y);
		}
		return this.degree;
	};

	this.invert = function() {
		this.x *= -1;
		this.y *= -1;
		this.degree = null;
	};
	
	this.setColor = function(cor){
		this.cor = cor;
	};
	
	this.getColor = function(){
		return this.cor;
	};
	
	this.proportionalX = function(y){
		return (this.x/this.y)*y;
	};
	
	this.proportionalY = function(x){
		return (this.y/this.x)*x;
	};
}

Vector.degreeBetweenVectors = function(vectorA, vectorB){
	var pe = Vector.scalarProduct(vectorA, vectorB);
	var na = vectorA.getNorm();
	var nb = vectorB.getNorm();
	return radiansToDegree(Math.acos(pe / (na * nb)));
};

Vector.scalarProduct = function(vectorA, vectorB){
	var vax = vectorA.getX();
	var vbx = vectorB.getX();
	var vay = vectorA.getY();
	var vby = vectorB.getY();
	return (vax * vbx) + (vay * vby);
};

Vector.multiply = function(vector, scalar){
	vector.setX(vector.getX()*scalar);
	vector.setY(vector.getY()*scalar);
};

Vector.sum = function(vectorA, vectorB){
	var vax = vectorA.getX();
	var vbx = vectorB.getX();
	var vay = vectorA.getY();
	var vby = vectorB.getY();
	return new Vector(vax + vbx, vay + vby);
};

Vector.sumLength = function(vector, length){
	var vx = vector.getX();
	var vy = vector.getY();
	var total = vx+vy;
	var cx = length*(((vx*100)/total)/100);
	var cy = length*(((vy*100)/total)/100);
	vector.setX(vx+cx);
	vector.setY(vy+cy);
};


