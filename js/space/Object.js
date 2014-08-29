function Object() {
	this.dinamic = false;
	this.friction = false;
	this.restituition = 0.5;
    this.gravityInfluence = true;
    this.linearInfluence = true;
    this.angularInfluence = true;
	this.mass = 10;
	this.density = 0;
	this.angularSpeed = 0;
	this.vector = new Vector(0, 0);

	this.isDinamic = function() {
		return this.dinamic;
	};

    this.getGravityInfluence = function(){
        return true;
    };

    this.setGravityInfluence = function(influence){
        this.gravityInfluence = influence;
    };

	this.getFriction = function() {
		return this.friction;
	};

	this.getRestituition = function() {
		return this.restituition;
	};

	this.getMass = function() {
		return this.mass;
	};

	this.getDensity = function() {
		return this.density;
	};

	this.getAngularSpeed = function() {
		return this.angularSpeed;
	};

	this.getVector = function() {
		return this.vector;
	};

	this.setDinamic = function(dinamic) {
		if (dinamic instanceof Boolean) {
			this.dinamic = dinamic;
		}
	};

	this.setFriction = function(friction) {
		if (!isNaN(friction)) {
			this.friction = friction;
		}
	};

	this.setRestituition = function(restituition) {
		if (!isNaN(restituition)) {
			this.restituition = restituition;
		}
	};

	this.setMass = function(mass) {
		if (!isNaN(mass)) {
			this.mass = mass;
		}
	};

	this.setDensity = function(density) {
		if (!isNaN(density)) {
			this.density = density;
		}
	};

	this.setAngularSpeed = function(angularSpeed) {
		if (!isNaN(angularSpeed)) {
			this.angularSpeed = angularSpeed;
		}
	};

	this.setVector = function(vector) {
		if (vector instanceof Vector) {
			this.vector = vector;
		}
	};

	this.setDegree = function(degree, origin) {
		this.contact.setDegree(degree, origin);
	};

	this.getId = function() {
		return this.id;
	};

	this.isMoving = function() {
		return (this.dinamic || this.vector.getX() != 0
				|| this.vector.getX() != 0 || this.angularSpeed != 0);
	};

	this.getVector = function() {
		return this.vector;
	};
}
