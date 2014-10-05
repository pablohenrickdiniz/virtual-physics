function Body(shape, material, dinamic, vLin, vAng) {
    this.shape = shape;
    this.dinamic = dinamic;
    this.material = material;
    this.mass = dinamic ? material.density * shape.area : 0;
    this.mInv = this.mass == 0 ? 0 : 1 / this.mass; // inverse of the mass
    this.moiInv = this.mass == 0 ? 0 : 1 / this.shape.moi(this.mass); // inverse of the moment of inertia
    this.vLin = vLin == undefined ? [0, 0] : vLin; // linear (translational) velocity
    this.vAng = vAng == undefined ? 0 : vAng; // angular (rotational) velocity
    this.forces = []; // array of forces...
    this.forcePoints = []; // ... and the vertex index of force application.
    // undefined is center of mass.

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    this.setShape = function(shape){
        this.shape = shape;
        this.mass = this.dinamic ? this.material.density * this.shape.area : 0;
        this.moiInv = this.mass == 0 ? 0 : 1 / this.shape.moi(this.mass);
    };

    this.setMaterial = function(material){
        this.material = material;
        this.mass = this.dinamic ? this.material.density * this.shape.area : 0;
    };

    this.addForce = function (force, forcePoint) {
        this.forces.push(force);
        this.forcePoints.push(forcePoint);
    };
    this.getRotationMatrix = function () {
        // only recompute if theta has changed since the last call.
        if (this.shape.theta !== rotMatTheta) {
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

    this.getRotationMatrix();
};