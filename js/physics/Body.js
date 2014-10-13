function Body(shape, material, dinamic, vLin, vAng) {
    this.shape = shape;
    this.center = shape.center;
    this.shape.parent = this;
    this.dinamic = dinamic;
    this.material = material;
    this.vLin = vLin == undefined ? [0, 0] : vLin; // linear (translational) velocity
    this.vAng = vAng == undefined ? 0 : vAng; // angular (rotational) velocity
    this.forces = []; // array of forces...
    this.forcePoints = []; // ... and the vertex index of force application.

    // undefined is center of mass.

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    this.update = function () {
        this.mass = this.dinamic ? this.material.density * this.shape.area : 0;
        this.mInv = this.mass == 0 ? 0 : 1 / this.mass; // inverse of the mass
        this.moiInv = this.mass == 0 ? 0 : 1 / this.shape.moi(this.mass);// inverse of the moment of inertia
        rotationMatrix = null;
    };

    this.setDinamic = function (dinamic) {
        this.dinamic = dinamic;
        this.update();
    };

    this.setMass = function (mass) {
        this.mass = mass;
        this.mInv = this.mass == 0 ? 0 : 1 / this.mass; // inverse of the mass
        this.moiInv = this.mass == 0 ? 0 : 1 / this.shape.moi(this.mass);// inverse of the moment of inertia
        rotationMatrix = null;
    };

    this.setShape = function (shape) {
        this.shape = shape;
        this.shape.parent = this;
        this.update();
    };

    this.setMaterial = function (material) {
        this.material = material;
        this.update();
    };

    this.addForce = function (force, forcePoint) {
        this.forces.push(force);
        this.forcePoints.push(forcePoint);
    };

    this.getRotationMatrix = function () {
        // only recompute if theta has changed since the last call.
        if (this.shape.theta !== rotMatTheta || rotationMatrix == null) {
            rotationMatrix = [
                [Math.cos(this.shape.theta), -Math.sin(this.shape.theta)],
                [Math.sin(this.shape.theta), Math.cos(this.shape.theta)]
            ];
            rotMatTheta = this.shape.theta;
        }
        return rotationMatrix;
    };

    this.getVerticesInWorldCoords = function () {
        var vertsAbsolute = [];
        var rotationMatrix = this.getRotationMatrix();
        for (var i = 0; i < this.shape.vertices.length; i++) {
            vertsAbsolute.push(MV.VpV(this.shape.center,
                MV.MxV(rotationMatrix, this.shape.vertices[i])));
        }
        return vertsAbsolute;
    };

    this.getVerticesInWorldCoords2 = function () {
        var vertsAbsolute = [];
        var rotationMatrix = this.getRotationMatrix();
        var vertices = [this.shape.min[0], this.shape.min[1], this.shape.max[0], this.shape.max[1]];
        for (var i = 0; i < vertices.length; i++) {
            vertsAbsolute.push(MV.VpV(this.shape.center,
                MV.MxV(rotationMatrix, vertices[i])));
        }
        return vertsAbsolute;
    };

    this.update();
    this.getRotationMatrix();
};