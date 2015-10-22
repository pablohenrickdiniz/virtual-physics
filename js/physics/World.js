define(['QuadTree','MV','FrictionPhysics','AppObject'],function(QuadTree,MV,FrictionPhysics,AppObject){

    var World = function (properties) {
        var self = this;
        self.dt = 1 / 60;
        self.nIterations = 100;
        self.beta = 0.2;
        self.bodies = [];
        self.t = 0;
        self.friction = 1;
        self.contacts = [];
        self.gravity = 90.81;
        self.width = 4000;
        self.height = 4000;
        self.joints = [];
        self.quadTree = new QuadTree([0, 0, self.width, self.height], 1);
        self.removes = [];
        self.useQuadTree = true;
        self.debug = false;
        self.set(properties);
    };


    World.prototype = new AppObject;

    World.prototype.step = function () {
        var self = this;
        /***** 1. collision detection *****/
        self.computeContacts(self); // call private function computeContacts but give it the right this

        /***** 2. integrate forces/torques and compute tentative velocities *****/
        var bodies = self.bodies;
        var size1 = bodies.length;
        var body;
        var mInv;
        var rotMat;
        var size2;
        var forces;
        var force;
        var i;
        var j;
        var forcePoint;
        var forcePoints;
        var dt = self.dt;
        var torque;
        var scalar;
        var vertice;

        for (i = 0; i < size1; i++) {
            body = bodies[i];
            mInv = body.mInv;
            if (mInv != 0 && body.dinamic) {
                rotMat = body.getRotationMatrix();
                // each force independently leads to a change in linear and angular
                // velocity; i.e., add up all these changes by iterating over forces
                forces = body.forces;
                size2 = forces.length;
                forcePoints = body.forcePoints;

                for (j = 0; j < size2; j++) {
                    forcePoint = forcePoints[j];
                    force = forces[j];
                    // linear motion is simply the integrated force, divided by the mass
                    scalar = dt * mInv;

                    body.set({
                        vLin:[body.vLin[0]+force[0]*scalar,body.vLin[1]+force[1]*scalar]
                    });

                    // angular motion depends on the force application point as well via the torque

                    if (forcePoint !== undefined) { // 'undefined' means center of mass
                        vertice = body.shape.vertices[forcePoint];
                        torque = (rotMat[0][0]*vertice[0]+ rotMat[0][1]*vertice[1]) * force[1] - (rotMat[1][0]*vertice[0]+ rotMat[1][1]*vertice[1]) * force[0];
                    }
                }
            }
        }

        /***** 3. correct velocity errors *****/
        self.applyJoints();
        self.applyImpulses();

        /***** 4. update positions *****/
        self.move();
    };

    World.prototype.move = function(){
        var self = this;
        self.quadTree.clear();
        self.removes.forEach(function (f) {
            var index = self.bodies.indexOf(f);
            if(index != -1){
                self.bodies[index].destroy();
                self.bodies.splice(index, 1)
            }
        });

        self.removes = [];
        self.bodies.forEach(function (body, index, bodies) {
            body.index = index;
            var a = !0;
            if (body.dinamic) {
                var c = MV.VpV(body.center, MV.SxV(self.dt, body.vLin)), b = self.dt * body.vAng;

                body.center = c;
                body.shape.center = body.center;
                body.shape.theta += b;


                /*Debugger */
                //body.set({
                //    center:c
                //});
                //
                //body.shape.set({
                //    theta:body.shape.theta+b
                //});

                c = FrictionPhysics.getAABB(body);
                if(!FrictionPhysics.AABBoverlap(c, self.quadTree.AABB, 0)){
                    bodies[index].destroy();
                    bodies.splice(index, 1);
                    a = !1
                }
            }
            a && self.quadTree.add(body);
            body.vertsAbsolute = null;
            body.AABB = null;
        })
    };

    World.prototype.clear = function(){
        var self = this;
        var i;
        for(i = 0; i < self.bodies.length;i++){
            self.remove(self.bodies[i]);
        }
        return self;
    };

    World.prototype.add = function (body) {
        var self = this;
        if (body.dinamic) {
            body.set({
                forces:[[0,self.gravity*body.mass]],
                forcePoints:[]
            });
        }

        self.bodies.push(body);
        if(self.useQuadTree){
            self.quadTree.add(body);
        }

        body.set({
            index:self.bodies.length - 1
        });

        return self;
    };

    World.prototype.setGravity = function(gravity){
        gravity*=10;
        var self = this;
        var size = self.bodies.length;
        var i;
        var body;
        self.gravity = gravity;
        for(i = 0; i < size;i++){
            body = self.bodies[i];
            if(body.dinamic){
                body.set({
                    forces: [[0,self.gravity*body.mass]],
                    forcePoints : []
                });
            }
        }
    };

    World.prototype.remove = function (body,paused) {
        var self = this;
        paused = paused==undefined?false:paused;
        if(!paused){
            self.removes.push(body);
        }
        else{
            var index = self.bodies.indexOf(body);
            if(index != -1){
                self.bodies.splice(index,1);
                if(self.useQuadTree){
                    self.quadTree.remove(body);
                }
            }
        }
    };

    World.prototype.addJoint = function (joint) {
        var self = this;
        self.joints.push(joint);
    };

    World.prototype.removeJoint = function (joint) {
        var self = this;
        var joints = self.joints;
        var size = joints.length;
        var i;
        for (i = 0; i < size; i++) {
            if (joints[i] == joint) {
                joints.splice(i, 1);
                break;
            }
        }

    };

    World.prototype.setFriction = function(friction){
        var self = this;
        self.friction = friction;
    };

// private function. Make sure to call with apply() and pass in
// the right world object.
    World.prototype.computeContacts = function() {

        // broad phase - compute the axis aligned bounding box for each body and
        // determine overlapping boxes. These list of candidate collisions is then
        // pruned in the narrow phase. Note for an overlap of bodies A and B,
        // [Ai, Bi] and [Bi, Ai] are added to the result.
        var self = this;
        var collisionCandidates = FrictionPhysics.getCollisionCandidates(self);
        FrictionPhysics.computeFaceNormals(self.bodies, collisionCandidates);

        // later, reuse contacts?
        self.contacts = [];
        // narrow phase - for each collision candidate, do some geometry to determine
        // whether two bodies indeed intersect, and if yes, create a Contact object
        // that contains penetrating point, penetrated surface, and surface normal

        var size = collisionCandidates.length;
        var candidates;
        var bodyA;
        var bodyB;
        var i;
        var cs;
        for (i = 0; i < size; i++) {
            candidates = collisionCandidates[i];
            bodyA = self.bodies[candidates[0]];
            bodyB = self.bodies[candidates[1]];
            if (bodyA.dinamic || bodyB.dinamic) {
                cs = FrictionPhysics.getContactsFromBodyPair(bodyA, bodyB);
                self.contacts = self.contacts.concat(cs);
            }
        }
    };

    World.prototype.applyJoints = function() {
        var self = this;
        var joints = self.joints;
        var size = joints.length;
        if(size > 0){
            var MInv = [];
            var bias = [];
            var J = [];
            var joint;
            var pA;
            var pB;
            var i;
            var cA;
            var cB;
            var bodyA;
            var bodyB;
            var j;
            var beta = self.beta;
            var dt = self.dt;
            var lambda;
            var lambdaDenominator;
            var v;
            var k;
            var n = self.nIterations;
            var mInvA;
            var mInvB;
            var moiInvA;
            var moiInvB;
            var type;
            var vertexA;
            var vertexB;
            var vLinA;
            var vLinB;
            var vAngA;
            var vAngB;
            var pApB;
            var pBpA;
            var dot;
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
                else if (type == 'center') {
                    pA = bodyA.getVerticesInWorldCoords()[vertexA];
                    pB = cB;
                }
                else if (type == 'surface') {
                    pA = [vertexA[0]+cA[0],vertexA[1]+cA[1]];
                    pB = [vertexB[0]+cB[0],vertexB[1]+cB[1]];
                }

                // compute the Jacobians (they don't change in the iterations)

                pApB = [pA[0]-pB[0],pA[1]-pB[1]];
                pBpA = [pB[0]-pA[0],pB[1]-pA[1]];
                J[i] = [pBpA[0]*2,pBpA[1]*2,pApB[0]*(pB[1]-cB[1])-pApB[1]*(pB[0]-cB[0]),pApB[0],pApB[1],pBpA[0]*(pA[1]-cA[1])-pBpA[1]*(pA[0]-cA[0])];
                bias[i] = beta / dt * (pApB[0]*pApB[0]+pApB[1]*pApB[1]);
            }
            for (i = 0; i < n; i++) {
                for (j = 0; j < size; j++) {
                    lambdaDenominator = 0;
                    for(k=0;k<=5;k++){
                        lambdaDenominator += MInv[j][k]*J[j][k]*J[j][k];
                    }
                    if (Math.abs(lambdaDenominator) <= 1e-15) continue;
                    bodyA = joints[j].bodyA;
                    bodyB = joints[j].bodyB;
                    vLinA = bodyA.vLin;
                    vLinB = bodyB.vLin;
                    vAngA = bodyA.vAng;
                    vAngB = bodyB.vAng;


                    v = [vLinB[0],vLinB[1],vAngB,vLinA[0],vLinA[1],vAngA];
                    dot = 0;
                    for(k=0;k<=5;k++){
                        dot += J[j][k]*v[k];
                    }
                    lambda = -(dot + bias[j]) / lambdaDenominator;
                    for(k=0;k<=5;k++){
                        v[k] = lambda*J[j][k]*MInv[j][k]+v[k];
                    }


                    //
                    //bodyB.set({
                    //    vLin:[v[0], v[1]],
                    //    vAng:v[2]
                    //});
                    //
                    //bodyA.set({
                    //    vLin:[v[3], v[4]],
                    //    vAng:v[5]
                    //});

                    bodyB.vLin = [v[0], v[1]];
                    bodyB.vAng = v[2];
                    bodyA.vLin = [v[3], v[4]];
                    bodyA.vAng = v[5];

                }
            }
        }
    };

    World.prototype.applyImpulses = function() {
        // precompute MInv and bias for each contact - they don't change
        // across iterations
        var MInv = [];
        var bias = [];
        var lambdaAccumulated = [];
        var Jn = [];
        var Jt = [];
        var i;
        var j;
        var self=this;
        var contacts = self.contacts;
        var size = contacts.length;
        var contact;
        var bodyA;
        var bodyB;
        var vLinA;
        var vLinB;
        var vAngA;
        var vAngB;
        var mInvA;
        var mInvB;
        var moiInvA;
        var moiInvB;
        var normal;
        var pA;
        var pB;
        var cA;
        var cB;
        var beta = self.beta;
        var dt = self.dt;
        var C;
        var vPreNormal;
        var friction = self.friction;
        var n = self.nIterations;
        var v;
        var lambdaFriction;
        var lambda;
        var pAcA;
        var pBcB;
        var fl;
        var a;
        var b;
        var c;
        var d;
        var k;

        for (i = 0; i < size; i++) {
            // assemble the inverse mass vector (usually a matrix,
            // but a diagonal one, so I can replace it with a vector
            contact = contacts[i];
            pA = contact.pA;
            pB = contact.pB;
            bodyA = contact.bodyA;
            bodyB = contact.bodyB;
            vLinA = bodyA.vLin;
            vLinB = bodyB.vLin;
            vAngA = bodyA.vAng;
            vAngB = bodyB.vAng;
            cA = bodyA.center;
            cB = bodyB.center;
            mInvA = bodyA.mInv;
            mInvB = bodyB.mInv;
            moiInvA = bodyA.moiInv;
            moiInvB = bodyB.moiInv;
            MInv[i] = [mInvA, mInvA, moiInvA, mInvB, mInvB, moiInvB];
            normal = contact.normal;
            pAcA = [pA[0]-cA[0],pA[1]-cA[1]];
            pBcB = [pB[0]-cB[0],pB[1]-cB[1]];

            //
            //normal.forEach(function(val){
            //    if(isNaN(val)){
            //        console.log(normal);
            //        throw new TypeError('normal has Nan Values');
            //    }
            //});
            //
            //pAcA.forEach(function(val){
            //    if(isNaN(val)){
            //        throw new TypeError('pAcA has Nan Values');
            //    }
            //});
            //
            //pBcB.forEach(function(val){
            //    if(isNaN(val)){
            //        throw new TypeError('pAcB has Nan Values');
            //    }
            //});


            // compute the Jacobians (they don't change in the iterations)
            Jn[i] = [normal[0], normal[1], pAcA[0] * normal[1] - pAcA[1] * normal[0],-normal[0], -normal[1], -(pBcB[0] * normal[1] - pBcB[1] * normal[0])];


            //Jn[i].forEach(function(val){
            //    if(isNaN(val)){
            //        console.log(Jn[i]);
            //        throw new TypeError('Jn has nan values');
            //    }
            //});


            // Jacobian for friction - like Jacobian for collision,
            // but with tangent in place of normal
            Jt[i] = [-normal[1],normal[0],pAcA[0]*normal[0]-pAcA[1]*-normal[1],normal[1],-normal[0],-((pB[0]-cB[0])*-normal[1]-(pB[1]-cB[1])*-normal[1])];

            //
            //Jt[i].forEach(function(val){
            //    if(isNaN(val)){
            //        throw new TypeError('Jt has nan values');
            //    }
            //});



            vPreNormal = ((-(pA[1]-cA[1])*vAngA+vLinA[0])-(-(pB[1]-cB[1])*vAngB+vLinB[0])*normal[0])+(((pA[0]-cA[0])*vAngA+vLinA[1])-((pB[0]-cB[0])*vAngB+vLinB[1])*normal[1]);
            /*
             if(isNaN(vPreNormal)){
             throw new TypeError('vPreNormal is Nan');
             }*/


            C = (pA[0]-pB[0])*normal[0]+(pA[1]-pB[1])*normal[1];

            /*
             if(isNaN(C)){
             throw new TypeError('C is Nan');
             }


             if(isNaN(beta)){
             throw new TypeError('beta is Nan');
             }
             */

            bias[i] = beta / dt * ((C < 0) ? C : 0) + 0.1 * vPreNormal;
            lambdaAccumulated[i] = 0;
        }


        /*
         bias.forEach(function(val){
         if(isNaN(val)){
         throw new TypeError('bias has nan values');
         }
         });


         lambdaAccumulated.forEach(function(val){
         if(isNaN(val)){
         throw new TypeError('lambdaAcumulates has nan values');
         }
         });*/


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
                a = 0;
                b = 0;
                c = 0;
                d = 0;

                for(k=0;k<=5;k++){
                    a += Jn[j][k]*v[k];
                    b += MInv[j][k]*Jn[j][k]*Jn[j][k];
                    c += Jt[j][k]*v[k];
                    d += MInv[j][k]*Jt[j][k]*Jt[j][k];
                }

                lambda = -(a+bias[j])/b;
                lambdaFriction = -c/d;

                if (lambdaAccumulated[j] + lambda < 0) {
                    lambda = -lambdaAccumulated[j];
                }

                fl = friction * lambda;
                if (lambdaFriction > fl) {
                    lambdaFriction = fl;
                } else if (lambdaFriction < -fl) {
                    lambdaFriction = -fl;
                }

                lambdaAccumulated[j] += lambda;
                for(k=0;k<=5;k++){
                    v[k] = (MInv[j][k]*lambdaFriction*Jt[j][k])+((MInv[j][k]*lambda*Jn[j][k])+v[k]);
                }

                /*Debug vars*/
                /*

                 if(isNaN(a)){
                 throw new TypeError('a is NaN');
                 }

                 if(isNaN(b)){
                 throw new TypeError('b is NaN');
                 }

                 if(isNaN(c)){
                 throw new TypeError('c is NaN');
                 }

                 if(isNaN(d)){
                 throw new TypeError('d is NaN');
                 }

                 if(isNaN(bias[j])){
                 throw new TypeError('bias[j] is NaN');
                 }


                 if(isNaN(fl)){
                 throw new TypeError('fl is NaN');
                 }


                 if(isNaN(lambda)){
                 throw new TypeError('lambda is NaN');
                 }


                 if(isNaN(lambdaFriction)){
                 throw new TypeError('lambdaFriction is NaN');
                 }

                 lambdaAccumulated.forEach(function(val){
                 if(isNaN(val)){
                 throw new TypeError('lambda Acumulates has NaN values');
                 }
                 });

                 v.forEach(function(element){
                 if(element instanceof Array){
                 element.forEach(function(val){
                 if(isNaN(val)){
                 throw new TypeError('va has NaN values');
                 }
                 });
                 }
                 else if(isNaN(element)){
                 throw new TypeError('va has NaN values');
                 }
                 });


                 bodyA.set({
                 vLin:[v[0], v[1]],
                 vAng:v[2]
                 });

                 bodyB.set({
                 vLin:[v[3], v[4]],
                 vAng:v[5]
                 });
                 */

                bodyA.vLin = [v[0], v[1]];
                bodyA.vAng = v[2];
                bodyB.vLin = [v[3], v[4]];
                bodyB.vAng = v[5];

            }
        }
    };

    World.prototype.getAABBsGroups = function(){
        var self = this;
        var bodies = self.bodies;
        var AABBs = bodies.map(function(body){
            return FrictionPhysics.getAABB(body);
        });
        return [
            [bodies,AABBs]
        ];
    };

    return World;
});