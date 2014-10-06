var World = function () {
    this.dt = 1 / 60;
    this.nIterations = 10;
    this.beta = 0.2;
    this.bodies = [];
    this.t = 0;
    this.friction = 0.2;
    this.contacts = [];
    this.gravity = 98.1;
    this.step = function () {

        /***** 1. collision detection *****/
        computeContacts.apply(this); // call private function computeContacts but give it the right this

        /***** 2. integrate forces/torques and compute tentative velocities *****/
        for (var i = 0; i < this.bodies.length; i++) {
            var mInv = this.bodies[i].mInv;
            if (mInv == 0)
                continue;
            var moiInv = this.bodies[i].moiInv;
            var rotationMatrix = this.bodies[i].getRotationMatrix();
            // each force independently leads to a change in linear and angular
            // velocity; i.e., add up all these changes by iterating over forces
            for (var j = 0; j < this.bodies[i].forces.length; j++) {
                var force = this.bodies[i].forces[j];
                var forcePoint = this.bodies[i].forcePoints[j];
                // linear motion is simply the integrated force, divided by the mass
                this.bodies[i].vLin = MV.VpV(this.bodies[i].vLin, MV.SxV(this.dt * mInv, force));
                // angular motion depends on the force application point as well via the torque
                if (forcePoint !== undefined) { // 'undefined' means center of mass
                    var torque = MV.cross2(MV.MxV(rotationMatrix, this.bodies[i].shape.vertices[forcePoint]), force);
                    this.bodies[i].vAng += this.dt * moiInv * torque;
                }
            }
        }

        /***** 3. correct velocity errors *****/
        applyImpulses.apply(this);

        /***** 4. update positions *****/
        for (var i = 0; i < this.bodies.length; i++) {
            this.bodies[i].shape.center = MV.VpV(this.bodies[i].shape.center, MV.SxV(this.dt, this.bodies[i].vLin));
            this.bodies[i].shape.theta += this.dt * this.bodies[i].vAng;
        }
    };

    this.addBody = function (body) {
        if (body.dinamic) {
            body.addForce([0, this.gravity * body.mass]);
        }
        this.bodies.push(body);
    };

    this.setFriction = function (friction) {
        this.friction = friction;
    };

    // private function. Make sure to call with apply() and pass in
    // the right world object.
    function computeContacts() {

        // broad phase - compute the axis aligned bounding box for each body and
        // determine overlapping boxes. These list of candidate collisions is then
        // pruned in the narrow phase. Note for an overlap of bodies A and B,
        // [Ai, Bi] and [Bi, Ai] are added to the result.

        var collisionCandidates = getCollisionCandidates(this.bodies);

        computeFaceNormals(this.bodies, collisionCandidates);

        // later, reuse contacts?
        this.contacts = [];
        // narrow phase - for each collision candidate, do some geometry to determine
        // whether two bodies indeed intersect, and if yes, create a Contact object
        // that contains penetrating point, penetrated surface, and surface normal
        for (var i = 0; i < collisionCandidates.length; i++) {
            // NB this function is asymmetrical - i.e., getContactFromBodyPair([A,B])
            // will return a different result than getContactFromBodyPair([B,A]) -
            // a returned contact presents a point of body A penetrating a face of
            // body B in the first example, and vice versa for the second invocation.
            var cs = getContactsFromBodyPair(this.bodies[collisionCandidates[i][0]],
                this.bodies[collisionCandidates[i][1]]);
            this.contacts = this.contacts.concat(cs);
        }

        for (var i = 0; i < this.contacts.length; i++) {
            var c = this.contacts[i];
        }
    };

    function applyImpulses() {

        var bias = [];
        // precompute MInv and bias for each contact - they don't change
        // across iterations
        var MInv = [];
        var bias = [];
        var lambdaAccumulated = [];
        var Jn = [];
        var Jt = [];


        for (var i = 0; i < this.contacts.length; i++) {
            // assemble the inverse mass vector (usually a matrix,
            // but a diagonal one, so I can replace it with a vector
            var contact = this.contacts[i];
            MInv[i] = [contact.bodyA.mInv,
                contact.bodyA.mInv]
                .concat(contact.bodyA.moiInv)
                .concat([contact.bodyB.mInv,
                    contact.bodyB.mInv])
                .concat(contact.bodyB.moiInv);
            // compute the Jacobians (they don't change in the iterations)
            var Jn_vLinA = contact.normal;
            //console.log(contact.normal);
            var Jn_vAngA = MV.cross2(MV.VmV(contact.pA, contact.bodyA.shape.center), contact.normal);
            var Jn_vLinB = MV.SxV(-1, contact.normal);
            var Jn_vAngB = -MV.cross2(MV.VmV(contact.pB, contact.bodyB.shape.center), contact.normal);
            Jn[i] = Jn_vLinA.concat(Jn_vAngA).concat(Jn_vLinB).concat(Jn_vAngB);

            // Jacobian for friction - like Jacobian for collision,
            // but with tangent in place of normal
            var tangent = [-contact.normal[1], contact.normal[0]];
            var Jt_vLinA = tangent;
            var Jt_vAngA = MV.cross2(MV.VmV(contact.pA, contact.bodyA.shape.center), tangent);
            var Jt_vLinB = MV.SxV(-1, tangent);
            var Jt_vAngB = -MV.cross2(MV.VmV(contact.pB, contact.bodyB.shape.center), tangent);
            Jt[i] = Jt_vLinA.concat(Jt_vAngA).concat(Jt_vLinB).concat(Jt_vAngB);


            /*
             var tmp = MV.VmV(contact.pB, contact.bodyB.shape.center);
             var vB = MV.VpV(contact.bodyB.vLin, MV.SxV(contact.bodyB.vAng, [-tmp[1], tmp[0]]));
             var tmp = MV.VmV(contact.pA, contact.bodyA.shape.center);
             var vA = MV.VpV(contact.bodyA.vLin, MV.SxV(contact.bodyA.vAng, [-tmp[1], tmp[0]]));
*/
            var vPreNormal = 0; //MV.dot(MV.VmV(vA, vB), contact.normal);

            var C = MV.dot(MV.VmV(contact.pA, contact.pB),
                contact.normal);
            bias[i] = this.beta / this.dt * ((C < 0) ? C : 0) + 0.2 * vPreNormal;
            lambdaAccumulated[i] = 0;
        }

        for (var i = 0; i < this.nIterations; i++) {
            for (var j = 0; j < this.contacts.length; j++) {
                var bodyA = this.contacts[j].bodyA;
                var bodyB = this.contacts[j].bodyB;
                var v = bodyA.vLin
                    .concat(bodyA.vAng)
                    .concat(bodyB.vLin)
                    .concat(bodyB.vAng);

                var lambda = -(MV.dot(Jn[j], v) + bias[j]) / MV.dot(Jn[j], MV.VxV(MInv[j], Jn[j]));

                // clamp accumulated impulse to 0
                if (lambdaAccumulated[j] + lambda < 0) {
                    lambda = -lambdaAccumulated[j];
                }

                lambdaAccumulated[j] += lambda;
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambda, Jn[j])));
                bodyA.vLin = v.slice(0, 2);
                bodyA.vAng = v[2];
                bodyB.vLin = v.slice(3, 5);
                bodyB.vAng = v[5];

                // friction stuff
                var lambdaFriction = -(MV.dot(Jt[j], v) + 0 * bias[j]) / MV.dot(Jt[j], MV.VxV(MInv[j], Jt[j]));
                if (lambdaFriction > this.friction * lambda) {
                    lambdaFriction = this.friction * lambda;
                } else if (lambdaFriction < -this.friction * lambda) {
                    lambdaFriction = -this.friction * lambda;
                }
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambdaFriction, Jt[j])));
                bodyA.vLin = v.slice(0, 2);
                bodyA.vAng = v[2];
                bodyB.vLin = v.slice(3, 5);
                bodyB.vAng = v[5];
            }
        }
    };
};