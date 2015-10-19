define(['Shape','Material','MV','FrictionPhysics','AppObject'],function(Shape,Material,MV,FrictionPhysics,AppObject){
    var Body = function(properties) {
        var self = this;
        self.shape = new Shape();
        self.center = [0,0];
        self.dinamic = true;
        self.material = Material.Iron;
        self.vLin =  [0, 0]; // linear (translational) velocity
        self.vAng = 0; // angular (rotational) velocity
        self.forces = []; // array of forces...
        self.forcePoints = []; // ... and the vertex index of force application.
        self.groups = ['A'];
        self.AABB = null;
        self.vertsAbsolute = null;
        self.inLeaf = [];
        // undefined is center of mass.
        self.rotMatTheta = null; // used to avoid unnecessary rotation matrix computations
        self.rotationMatrix = null;
        self.bindProperties();
        self.set(properties);
        self.getRotationMatrix();
    };

    Body.prototype = new AppObject;
    
    Body.prototype.bindProperties = function(){
        var self = this;
        self.onChange('shape',function(shape){
            self.center = shape.center;
            shape.parent = self;
            self.update();
        });

        self.onChange('dinamic',function(dinamic){
            self.update();
        });

        self.onChange('mass',function(mass){
            self.mInv = mass == 0 ? 0 : 1 / mass; // inverse of the mass
            self.moiInv = mass == 0 ? 0 : 1 / self.shape.moi(mass);// inverse of the moment of inertia
            self.rotationMatrix = null;
        });

        self.onChange('material',function(material){
            self.update();
        });
    };

    Body.prototype.addLeaf = function(quad){
        var self = this;
        self.inLeaf.push(quad);
    };

    Body.prototype.update = function () {
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
        self.rotationMatrix = null;
    };


    Body.prototype.addForce = function (force, forcePoint) {
        var self = this;
        self.forces.push(force);
        self.forcePoints.push(forcePoint);
    };

    Body.prototype.removeForce = function(index){
        var self = this;
        self.forces.splice(index,1);
        self.forcePoints.splice(index,1);
    };

    Body.prototype.getRotationMatrix = function () {
        var self = this;
        // only recompute if theta has changed since the last call.
        var theta = self.shape.theta;
        if (theta !== self.rotMatTheta || self.rotationMatrix == null) {
            self.rotationMatrix = [
                [Math.cos(theta), -Math.sin(theta)],
                [Math.sin(theta), Math.cos(theta)]
            ];
            self.rotMatTheta = theta;
        }
        return self.rotationMatrix;
    };

    Body.prototype.getAABB = function(){
        var self = this;
        if(self.AABB == null){
            self.AABB = FrictionPhysics.getAABB2(self.getVerticesInWorldCoords());
        }
        return self.AABB;
    };

    Body.prototype.getVerticesInWorldCoords = function () {
        var self = this;
        if(self.vertsAbsolute == null){
            self.vertsAbsolute = [];
            var rotationMatrix = self.getRotationMatrix(), shape = self.shape,
                vertices = shape.vertices, size = vertices.length, center = self.center, i;
            for (i = 0; i < size; i++) {
                self.vertsAbsolute.push(MV.VpV(center, MV.MxV(rotationMatrix, vertices[i])));
            }
        }

        return self.vertsAbsolute;
    };


    return Body;
});

