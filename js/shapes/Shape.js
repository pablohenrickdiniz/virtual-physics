function Shape(center, color, border, degree) {
	this.center = !(center instanceof Point) ? new Point(10, 10) : center;
	this.center.setFather(this);
	this.color = color == undefined ? new Color(255,255,255) : color;
	this.border = !(border instanceof Border) ? new Border(new Color(0,0,0), 1) : border;
	this.shadow = null;
	this.degree = isNaN(degree) ? 0 : degree;
	this.oldDegree = this.degree;
	this.father = null;
	this.layer = 1;
	this.id = idGenerator.getId();
	this.drawType = "CANVAS";
	
	this.getColor = function() {
		return this.color;
	};

	this.getBorder = function() {
		return this.border;
	};

	this.getDegree = function() {
		return this.degree;
	};

	this.getOldDegree = function() {
		return this.oldDegree;
	};

	this.getCenter = function() {
		return this.center;
	};

	this.setColor = function(color) {
		if (color != this.color) {
			this.color = color;
		}
	};

	this.setBorder = function(border) {
		if (border instanceof Border) {
			this.border = border;
		}
	};

	this.setDegree = function(degree) {
		if (!isNaN(degree)) {
			if (degree != this.degree) {
				this.oldDegree = this.degree;
				this.degree = degree;
			}
		}
	};

	this.setCenter = function(center) {
		if (center instanceof Point) {
			if (this.center.getX() != center.getX()|| this.center.getY() != center.getY()) {
				this.center = center;
				this.center.setFather(this);
			}
		}
	};

	this.setFather = function(father) {
		this.father = father;
	};
	
	this.setShadow = function(shadow){
		if(shadow instanceof Shadow){
			this.shadow = shadowa;
		}
	};
	
	this.getShadow = function(){
		return this.shadow;
	};
	
	this.getFather = function() {
		return this.father;
	};

	this.getLayer = function() {
		return this.layer;
	};

	this.setLayer = function(layer) {
		this.layer = layer;
	};
	
	this.getId = function() {
		return this.id;
	};
}
