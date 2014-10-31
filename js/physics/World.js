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
        var bodies = this.bodies, size1 = bodies.length, body, mInv, rotationMatrix, size2, forces,
            force, i, j, forcePoint, forcePoints, dt = this.dt;

        for (i = 0; i < size1; i++) {
            body = bodies[i];
            mInv = body.mInv;
            if (mInv != 0 && body.dinamic) {
                rotationMatrix = body.getRotationMatrix();
                // each force independently leads to a change in linear and angular
                // velocity; i.e., add up all these changes by iterating over forces
                forces = body.forces;
                size2 = forces.length;
                forcePoints = body.forcePoints;

                for (j = 0; j < size2; j++) {
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
        var i, index, body, size = this.removes.length, size2 = this.bodies.length, valid, nc, r, AABB, quadTree = this.quadTree, bodies = this.bodies, dt = this.dt, shape;

        for (i = 0; i < size; i++) {
            body = this.removes[i];
            index = bodies.indexOf(body);
            if (index != -1) {
                bodies.splice(index, 1);
            }
        }

        this.removes = [];

        for (i = 0; i < size2; i++) {
            body = bodies[i];
            body.index = i;
            valid = true;
            if (body.dinamic) {
                shape = body.shape;
                nc = MV.VpV(body.center, MV.SxV(dt, body.vLin));
                r = dt * body.vAng;
                body.center = nc;
                shape.center = nc;
                shape.theta += r;

                AABB = getAABB(body);
                if (!AABBoverlap(AABB, quadTree.AABB, 0)) {
                    bodies.splice(index, 1);
                    size2--;
                    i--;
                    valid = false;
                }
            }
            if (valid) {
                quadTree.addBody(body);
            }
        }
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
        var joints = this.joints, size = joints.size, i;
        for (i = 0; i < size; i++) {
            if (joints[i] == joint) {
                joints.splice(i, 1);
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

        var size = collisionCandidates.length, candidates, bodyA, bodyB;
        for (var i = 0; i < size; i++) {
            candidates = collisionCandidates[i];
            bodyA = this.bodies[candidates[0]];
            bodyB = this.bodies[candidates[1]];
            if (bodyA.dinamic || bodyB.dinamic) {
                var cs = getContactsFromBodyPair(bodyA, bodyB);
                this.contacts = this.contacts.concat(cs);
            }
        }
    }

    function applyJoints() {
        var MInv = [],bias = [],J = [],joint, joints = this.joints, pA, pB, i, cA, cB, bodyA, bodyB, j, size = joints.length, beta = this.beta, dt = this.dt, lambda,lambdaDenominator, v, C, n = this.nIterations, mInvA, mInvB, moiInvA, moiInvB, type, vertexA, vertexB, a, b, c, d,vLinA,vLinB,vAngA,vAngB;
        for (i = 0; i < size; i++) {
            // assemble the inverse mass vector (usually a matrix,
            // but a diagonal one, so I can replace it with a vector
            joint = joints[i];
            bodyA = joint.bodyA;
            bodyB = joint.bodyB;
            cA = bodyA.center;
            cB = bodyB.center;
            vertexA = joint.vertexA;
            vertexB = joint.vertexB;
            mInvA = bodyA.mInv;
            mInvB = bodyB.mInv;
            moiInvA = bodyA.moiInv;
            moiInvB = bodyB.moiInv;
            MInv[i] = [mInvB, mInvB, moiInvB, mInvA, mInvA, moiInvA];
            type = joint.type;
            if (type == 'vertex') {
                pA = bodyA.getVerticesInWorldCoords()[vertexA];
                pB = bodyB.getVerticesInWorldCoords()[vertexB];
            }
            else if (type = 'center') {
                pA = bodyA.getVerticesInWorldCoords()[vertexA];
                pB = cB;
            }
            else if (type == 'surface') {
                pA = vertexA;
                pB = vertexB;
            }
            // compute the Jacobians (they don't change in the iterations)
            a = MV.SxV(2, MV.VmV(pB, pA));
            b = MV.cross2(MV.VmV(pA, pB), MV.VmV(pB, cB));
            c = MV.VmV(pA, pB);
            d = MV.cross2(MV.VmV(pB, pA), MV.VmV(pA, cA));
            J[i] = [a[0], a[1], b, c[0], c[1], d];
            C = MV.dot(MV.VmV(pA, pB), MV.VmV(pA, pB));
            bias[i] = beta / dt * C;
        }
        for (i = 0; i < n; i++) {
            for (j = 0; j < size; j++) {
                lambdaDenominator = MV.dot(J[j], MV.VxV(MInv[j], J[j]));
                if (Math.abs(lambdaDenominator) <= 1e-15) continue;
                bodyA = joints[j].bodyA;
                bodyB = joints[j].bodyB;
                vLinA = bodyA.vLin;
                vLinB = bodyB.vLin;
                vAngA = bodyA.vAng;
                vAngB = bodyB.vAng;
                v = [vLinB[0],vLinB[1],vAngB,vLinA[0],vLinA[1],vAngA];
                lambda = -(MV.dot(J[j], v) + bias[j]) / lambdaDenominator;
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambda, J[j])));
                bodyB.vLin = [v[0], v[1]];
                bodyB.vAng = v[2];
                bodyA.vLin = [v[3], v[4]];
                bodyA.vAng = v[5];
            }
        }
    }


    function applyImpulses() {
        // precompute MInv and bias for each contact - they don't change
        // across iterations
        var MInv = [], bias = [], lambdaAccumulated = [], Jn = [], Jt = [], i, j, contacts = this.contacts,
            size = contacts.length, contact, bodyA, bodyB, vLinA, vLinB, vAngA, vAngB, mInvA, mInvB, moiInvA, moiInvB,
            normal, pA, pB, cA, cB, jAngA, jAngB, jLinB, tangent, beta = this.beta, dt = this.dt, C, vPreNormal,
            friction = this.friction, n = this.nIterations, v, lambdaFriction, lambda;

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
            MInv[i] = [mInvA, mInvA, moiInvA, mInvB, mInvB, moiInvB];
            normal = contact.normal;
            // compute the Jacobians (they don't change in the iterations)
            jAngA = MV.cross2(MV.VmV(pA, cA), normal);
            jLinB = MV.SxV(-1, normal);
            jAngB = -MV.cross2(MV.VmV(pB, cB), normal);
            Jn[i] = [normal[0], normal[1], jAngA, jLinB[0], jLinB[1], jAngB];
            // Jacobian for friction - like Jacobian for collision,
            // but with tangent in place of normal
            tangent = [-normal[1], normal[0]];
            jAngA = MV.cross2(MV.VmV(pA, cA), tangent);
            jLinB = MV.SxV(-1, tangent);
            jAngB = -MV.cross2(MV.VmV(pB, cB), tangent);
            Jt[i] = [tangent[0], tangent[1], jAngA, jLinB[0], jLinB[1], jAngB];
            /*
             var tmp = MV.VmV(contact.pB, contact.bodyB.shape.center);
             var vB = MV.VpV(contact.bodyB.vLin, MV.SxV(contact.bodyB.vAng, [-tmp[1], tmp[0]]));
             var tmp = MV.VmV(contact.pA, contact.bodyA.shape.center);
             var vA = MV.VpV(contact.bodyA.vLin, MV.SxV(contact.bodyA.vAng, [-tmp[1], tmp[0]]));
             */
            vPreNormal = 0; //MV.dot(MV.VmV(vA, vB), contact.normal);
            C = MV.dot(MV.VmV(pA, pB), normal);
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

                v = [vLinA[0], vLinA[1], vAngA, vLinB[0], vLinB[1], vAngB];
                lambda = -(MV.dot(Jn[j], v) + bias[j]) / MV.dot(Jn[j], MV.VxV(MInv[j], Jn[j]));
                // clamp accumulated impulse to 0
                if (lambdaAccumulated[j] + lambda < 0) {
                    lambda = -lambdaAccumulated[j];
                }

                lambdaAccumulated[j] += lambda;
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambda, Jn[j])));

                bodyA.vLin = [v[0], v[1]];
                bodyA.vAng = v[2];
                bodyB.vLin = [v[3], v[4]];
                bodyB.vAng = v[5];
                // friction stuff
                lambdaFriction = -(MV.dot(Jt[j], v) /*+ bias1[j]*/) / MV.dot(Jt[j], MV.VxV(MInv[j], Jt[j]));
                if (lambdaFriction > friction * lambda) {
                    lambdaFriction = friction * lambda;
                } else if (lambdaFriction < -friction * lambda) {
                    lambdaFriction = -friction * lambda;
                }
                v = MV.VpV(v, MV.VxV(MInv[j], MV.SxV(lambdaFriction, Jt[j])));
                bodyA.vLin = [v[0], v[1]];
                bodyA.vAng = v[2];
                bodyB.vLin = [v[3], v[4]];
                bodyB.vAng = v[5];
            }
        }
    }
};