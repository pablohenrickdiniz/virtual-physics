function Body(shape, material, dinamic, vLin, vAng) {
    var self = this;
    self.shape = shape;
    self.center = shape.center;
    self.shape.parent = this;
    self.dinamic = dinamic;
    self.material = material;
    self.vLin = vLin == undefined ? [0, 0] : vLin; // linear (translational) velocity
    self.vAng = vAng == undefined ? 0 : vAng; // angular (rotational) velocity
    self.forces = []; // array of forces...
    self.forcePoints = []; // ... and the vertex index of force application.
    self.groups = ['A'];
    self.vertsAbsolute = null;
    // undefined is center of mass.

    var rotMatTheta; // used to avoid unnecessary rotation matrix computations
    var rotationMatrix;

    this.update = function () {
        var self = this;
        self.mass = self.dinamic ? self.material.density * self.shape.area : 0;
        self.mInv = self.mass == 0 ? 0 : 1 / self.mass; // inverse of the mass
        self.moiInv = self.mass == 0 ? 0 : 1 / self.shape.moi(self.mass);// inverse of the moment of inertia
        self.forces = [];
        if (self.dinamic) {
            self.forces.push([0, 98.81 * self.mass]);
        }
        else {
            self.vLin = [0, 0];
            self.vAng = 0;
        }
        rotationMatrix = null;
    };

    this.setDinamic = function (dinamic) {
        var self = this;
        self.dinamic = dinamic;
        self.update();
    };

    this.setMass = function (mass) {
        var self = this;
        self.mass = mass;
        self.mInv = self.mass == 0 ? 0 : 1 / self.mass; // inverse of the mass
        self.moiInv = self.mass == 0 ? 0 : 1 / self.shape.moi(self.mass);// inverse of the moment of inertia
        rotationMatrix = null;
    };

    this.setShape = function (shape) {
        var self = this;
        self.shape = shape;
        self.shape.parent = self;
        self.update();
    };

    this.setMaterial = function (material) {
        var self = this;
        self.material = material;
        self.update();
    };

    this.addForce = function (force, forcePoint) {
        var self = this;
        self.forces.push(force);
        self.forcePoints.push(forcePoint);
    };

    this.getRotationMatrix = function () {
        var self = this;
        // only recompute if theta has changed since the last call.
        var theta = self.shape.theta;
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
        var self = this;
        if(self.vertsAbsolute == null){
           self.vertsAbsolute = [];
            var rotationMatrix = self.getRotationMatrix(), shape = self.shape,
                vertices = self.shape.vertices, size = vertices.length, center = shape.center, i;
            for (i = 0; i < size; i++) {
                self.vertsAbsolute.push(MV.VpV(center, MV.MxV(rotationMatrix, vertices[i])));
            }
        }

        return self.vertsAbsolute;
    };

    self.update();
    self.getRotationMatrix();
};