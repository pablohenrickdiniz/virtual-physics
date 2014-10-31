if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
            return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
            n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
            return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
            var kValue;
            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the
            //    HasProperty internal method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            //    i.  Let elementK be the result of calling the Get
            //        internal method of O with the argument ToString(k).
            //   ii.  Let same be the result of applying the
            //        Strict Equality Comparison Algorithm to
            //        searchElement and elementK.
            //  iii.  If same is true, return k.
            if (k in O && O[k] === searchElement) {
                return k;
            }
            k++;
        }
        return -1;
    };
}


var World = function () {
    this.dt = 1 / 60;
    this.nIterations = 20;
    this.beta = 0.2;
    this.bodies = [];
    this.t = 0;
    this.friction = 0.5;
    this.contacts = [];
    this.gravity = 200;
    this.width = 5000;
    this.height = 5000;
    this.joints = [];
    this.quadTree = new QuadTree([0, 0, this.width, this.height], 1);
    this.removes = [];

    this.step = function () {
        /***** 1. collision detection *****/
        computeContacts.apply(this); // call private function computeContacts but give it the right this

        /***** 2. integrate forces/torques and compute tentative velocities *****/
        var bodies = this.bodies,size1 = bodies.length,body,mInv,rotationMatrix,size2,forces,
        force, i, j,forcePoint,forcePoints,dt = this.dt;

        for(i = 0; i < size1;i++){
            body = bodies[i];
            mInv = body.mInv;
            if (mInv != 0 && body.dinamic){
                rotationMatrix = body.getRotationMatrix();
                // each force independently leads to a change in linear and angular
                // velocity; i.e., add up all these changes by iterating over forces
                forces = body.forces;
                size2 = forces.length;
                forcePoints = body.forcePoints;

                for(j=0;j<size2;j++){
                    forcePoint = forcePoints[j];
                    force = forces[j];
                    // linear motion is simply the integrated force, divided by the mass
                    body.vLin = MV.VpV(body.vLin, MV.SxV(dt * mInv, force));
                    // angular motion depends on the force application point as well via the torque
                    if (forcePoint !== undefined) { // 'undefined' means center of mass
                        var torque = MV.cross2(MV.MxV(rotationMatrix, body.shape.vertices[forcePoint]), force);
                        body.vAng += dt * body.moiInv * torque;
                    }
                }
            }
        }

        /***** 3. correct velocity errors *****/
        applyJoints.apply(this);
        applyImpulses.apply(this);

        /***** 4. update positions *****/
        move.apply(this);
    };


    function move() {
        this.quadTree.clear();
        var world = this;
        this.removes.forEach(function(body){
            var index = world.bodies.indexOf(body);
            if (index != -1) {
                world.bodies.splice(index, 1);
            }
        });
        this.removes = [];

        this.bodies.forEach(function(body,index,array){
            body.index = index;
            var valid = true;
            if (body.dinamic) {
                var nc = MV.VpV(body.center, MV.SxV(world.dt, body.vLin));
                var r = world.dt * body.vAng;
                body.center = nc;
                body.shape.center = body.center;
                body.shape.theta += r;

                var AABB = getAABB(body);
                if (!AABBoverlap(AABB, world.quadTree.AABB, 0)) {
                    array.splice(index, 1);
                    valid = false;
                }
            }
            if (valid) {
                world.quadTree.addBody(body);
            }
        });
    }

    this.addBody = function (body) {
        if (body.dinamic) {
            body.addForce([0, this.gravity * body.mass]);
        }

        this.bodies.push(body);
        this.quadTree.addBody(body);
        body.index = this.bodies.length - 1;
    };

    this.removeBody = function (body) {
        this.removes.push(body);
    };

    this.addJoint = function (joint) {
        this.joints.push(joint);
    };

    this.removeJoint = function (joint) {
        for (var i = 0; i < this.joints.length; i++) {
            if (this.joints[i] == joint) {
                this.joints.splice(i, 1);
                break;
            }
        }

    };

    // private function. Make sure to call with apply() and pass in
    // the right world object.
    function computeContacts() {

        // broad phase - compute the axis aligned bounding box for each body and
        // determine overlapping boxes. These list of candidate collisions is then
        // pruned in the narrow phase. Note for an overlap of bodies A and B,
        // [Ai, Bi] and [Bi, Ai] are added to the result.

        var collisionCandidates = getCollisionCandidates(this);

        computeFaceNormals(this.bodies, collisionCandidates);

        // later, reuse contacts?
        this.contacts = [];
        // narrow phase - for each collision candidate, do some geometry to determine
        // whether two bodies indeed intersect, and if yes, create a Contact object
        // that contains penetrating point, penetrated surface, and surface normal

        var size = collisionCandidates.length,candidates,bodyA,bodyB;
        for(var i = 0; i < size;i++){
            candidates = collisionCandidates[i];
            bodyA = this.bodies[candidates[0]];
            bodyB = this.bodies[candidates[1]];
            if (bodyA.dinamic || bodyB.dinamic) {
                var cs = getContactsFromBodyPair(bodyA, bodyB);
                this.contacts = this.contacts.concat(cs);
            }
        }
    };

    function applyJoints() {
        var MInv = [];
        var bias2 = [];
        var J = [];
        for (var i = 0; i < this.joints.length; i++) {
            // assemble the inverse mass vector (usually a matrix,
            // but a diagonal one, so I can replace it with a vector
            var joint = this.joints[i];

            MInv[i] = [joint.bodyB.mInv,
                joint.bodyB.mInv]
                .concat(joint.bodyB.moiInv)
                .concat([joint.bodyA.mInv,
                    joint.bodyA.mInv])
                .concat(joint.bodyA.moiInv);
            if (joint.type == 'vertex') {
                var pA = joint.bodyA.getVerticesInWorldCoords()[joint.vertexA];
                var pB = joint.bodyB.getVerticesInWorldCoords()[joint.vertexB];
            }
            else if (joint.type = 'center') {
                var pA = joint.bodyA.getVerticesInWorldCoords()[joint.vertexA];
                var pB = joint.bodyB.center;
            }
            else if (joint.type == 'surface') {
                var pA = joint.vertexA;
                var pB = joint.vertexB;
            }
            var cA = joint.bodyA.center;
            var cB = joint.bodyB.center;
            // compute the Jacobians (they don't change in the iterations)
            J[i] = MV.SxV(2, MV.VmV(pB, pA)
                .concat(MV.cross2(MV.VmV(pA, pB), MV.VmV(pB, cB)))
                .concat(MV.VmV(pA, pB))
                .concat(MV.cross2(MV.VmV(pB, pA), MV.VmV(pA, cA))));
            var C = MV.dot(MV.VmV(pA, pB), MV.VmV(pA, pB));
            bias2[i] = this.beta / this.dt * C;
        }

        for (var i = 0; i < this.nIterations; i++) {
            for (var j = 0; j < this.joints.length; j++) {
                var bodyA = this.joints[j].bodyA;
                var bodyB = this.joints[j].bodyB;
                var v = bodyB.vLin
                    .concat(bodyB.vAng)
                    .concat(bodyA.vLin)
                    .concat(bodyA.vAng);
                var lambdaDenominator = MV.dot(J[j], MV.VxV(MInv[j], J[j]))
                if (Math.abs(lambdaDenominator) <= 1e-15) continue;
                var lambda = -(MV.dot(J[j], v) + bias2[j]) / lambdaDenominator;
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambda, J[j])));
                bodyB.vLin = v.slice(0, 2);
                bodyB.vAng = v[2];
                bodyA.vLin = v.slice(3, 5);
                bodyA.vAng = v[5];
            }
        }
    }


    function applyImpulses() {
        // precompute MInv and bias for each contact - they don't change
        // across iterations
        var MInv = [],bias = [],lambdaAccumulated = [],Jn = [],Jt = [], i, j,contacts = this.contacts,
        size = contacts.length,contact,bodyA,bodyB,vLinA,vLinB,vAngA,vAngB,mInvA,mInvB,moiInvA,moiInvB,
        normal,pA,pB,cA,cB,jAngA,jAngB,jLinB,tangent,beta = this.beta,dt = this.dt, C,vPreNormal,
        friction = this.friction,n = this.nIterations, v,lambdaFriction,lambda;

        for (i = 0; i < size; i++) {
            // assemble the inverse mass vector (usually a matrix,
            // but a diagonal one, so I can replace it with a vector
            contact = contacts[i];
            pA = contact.pA;
            pB = contact.pB;
            bodyA = contact.bodyA;
            bodyB = contact.bodyB;
            cA = bodyA.center;
            cB = bodyB.center;
            mInvA = bodyA.mInv;
            mInvB = bodyB.mInv;
            moiInvA = bodyA.moiInv;
            moiInvB = bodyB.moiInv;
            MInv[i] = [mInvA, mInvA,moiInvA,mInvB,mInvB,moiInvB];
            normal = contact.normal;
            // compute the Jacobians (they don't change in the iterations)
            jAngA = MV.cross2(MV.VmV(pA,cA),normal);
            jLinB = MV.SxV(-1, normal);
            jAngB = -MV.cross2(MV.VmV(pB,cB),normal);
            Jn[i] = [normal[0],normal[1],jAngA,jLinB[0],jLinB[1],jAngB];
            // Jacobian for friction - like Jacobian for collision,
            // but with tangent in place of normal
            tangent = [-normal[1], normal[0]];
            jAngA = MV.cross2(MV.VmV(pA, cA), tangent);
            jLinB = MV.SxV(-1, tangent);
            jAngB = -MV.cross2(MV.VmV(pB, cB), tangent);
            Jt[i] = [tangent[0],tangent[1],jAngA,jLinB[0],jLinB[1],jAngB];
            /*
             var tmp = MV.VmV(contact.pB, contact.bodyB.shape.center);
             var vB = MV.VpV(contact.bodyB.vLin, MV.SxV(contact.bodyB.vAng, [-tmp[1], tmp[0]]));
             var tmp = MV.VmV(contact.pA, contact.bodyA.shape.center);
             var vA = MV.VpV(contact.bodyA.vLin, MV.SxV(contact.bodyA.vAng, [-tmp[1], tmp[0]]));
             */
            vPreNormal = 0; //MV.dot(MV.VmV(vA, vB), contact.normal);
            C = MV.dot(MV.VmV(pA, pB),normal);
            bias[i] = beta / dt * ((C < 0) ? C : 0) + 0.2 * vPreNormal;
            lambdaAccumulated[i] = 0;
        }

        for (i = 0; i < n; i++) {
            for (j = 0; j < size; j++) {
                contact = contacts[j];
                bodyA = contact.bodyA;
                bodyB = contact.bodyB;
                vLinA = bodyA.vLin;
                vLinB = bodyB.vLin;
                vAngA = bodyA.vAng;
                vAngB = bodyB.vAng;

                v = [vLinA[0],vLinA[1],vAngA,vLinB[0],vLinB[1],vAngB];
                lambda = -(MV.dot(Jn[j], v) + bias[j]) / MV.dot(Jn[j], MV.VxV(MInv[j], Jn[j]));
                // clamp accumulated impulse to 0
                if (lambdaAccumulated[j] + lambda < 0) {
                    lambda = -lambdaAccumulated[j];
                }

                lambdaAccumulated[j] += lambda;
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambda, Jn[j])));

                bodyA.vLin = [v[0],v[1]];
                bodyA.vAng = v[2];
                bodyB.vLin = [v[3],v[4]];
                bodyB.vAng = v[5];
                // friction stuff
               lambdaFriction = -(MV.dot(Jt[j], v) /*+ bias1[j]*/) / MV.dot(Jt[j], MV.VxV(MInv[j], Jt[j]));
                if (lambdaFriction > friction * lambda) {
                    lambdaFriction = friction * lambda;
                } else if (lambdaFriction < -friction * lambda) {
                    lambdaFriction = -friction * lambda;
                }
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambdaFriction, Jt[j])));
                bodyA.vLin = [v[0],v[1]];
                bodyA.vAng = v[2];
                bodyB.vLin = [v[3],v[4]];
                bodyB.vAng = v[5];
            }
        }
    }
}