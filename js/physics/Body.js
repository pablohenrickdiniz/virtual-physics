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
    this.groups = ['A'];
    this.vertsAbsolute = null;
    // undefined is center of mass.

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    this.update = function () {
        this.mass = this.dinamic ? this.material.density * this.shape.area : 0;
        this.mInv = this.mass == 0 ? 0 : 1 / this.mass; // inverse of the mass
        this.moiInv = this.mass == 0 ? 0 : 1 / this.shape.moi(this.mass);// inverse of the moment of inertia
        this.forces = [];
        if (this.dinamic) {
            this.forces.push([0, 98.81 * this.mass]);
        }
        else {
            this.vLin = [0, 0];
            this.vAng = 0;
        }
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
        var theta = this.shape.theta;
        if (theta !== rotMatTheta || rotationMatrix == null) {
            rotationMatrix = [
                [Math.cos(theta), -Math.sin(theta)],
                [Math.sin(theta), Math.cos(theta)]
            ];
            rotMatTheta = theta;
        }
        return rotationMatrix;
    };

    this.getVerticesInWorldCoords = function () {
        if(this.vertsAbsolute == null){
            this.vertsAbsolute = [];
            var rotationMatrix = this.getRotationMatrix(), shape = this.shape,
                vertices = this.shape.vertices, size = vertices.length, center = shape.center, i;
            for (i = 0; i < size; i++) {
                this.vertsAbsolute.push(MV.VpV(center, MV.MxV(rotationMatrix, vertices[i])));
            }
        }

        return this.vertsAbsolute;
    };

    this.update();
    this.getRotationMatrix();
};