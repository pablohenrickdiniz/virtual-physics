function QuadTree(AABB, l) {
    this.AABB = AABB;
    this.l = l;
    this.bodies = [];
    this.AABBs = [];
    this.nodeA = null;
    this.nodeB = null;
    this.nodeC = null;
    this.nodeD = null;
    this.qtd = 0;

    this.clear = function () {
        this.nodeA = null;
        this.nodeB = null;
        this.nodeC = null;
        this.nodeD = null;
        this.bodies = [];
        this.AABBs = [];
    };

    this.getAABBsGroups = function (AABBsGroups) {
        AABBsGroups = AABBsGroups == undefined ? [] : AABBsGroups;
        if (this.bodies.length > 0 && this.qtd > 1) {
            AABBsGroups.push([this.bodies, this.AABBs]);
        }
        else {
            if (this.nodeA != null) {
                this.nodeA.getAABBsGroups(AABBsGroups);
            }
            if (this.nodeB != null) {
                this.nodeB.getAABBsGroups(AABBsGroups);
            }
            if (this.nodeC != null) {
                this.nodeC.getAABBsGroups(AABBsGroups);
            }
            if (this.nodeD != null) {
                this.nodeD.getAABBsGroups(AABBsGroups);
            }
        }

        return AABBsGroups;
    };


    this.addBody = function (body, AABB) {
        AABB = AABB == undefined ? getAABB(body) : AABB;

        if (this.qtd <= 10 || this.l == 5) {
            this.bodies.push(body);
            this.AABBs.push(AABB);
        }
        else {
            if (this.bodies.length > 0) {
                var quad = this;
                this.bodies.map(function(elem,index){
                    quad.processInsert(elem,quad.AABBs[index]);
                });
                this.bodies = [];
                this.AABBs = [];
            }
            this.processInsert(body, AABB);
        }
        this.qtd++;
    };

    this.removeBody = function (body) {
        var removed = false;
        if (this.bodies.length > 0 && this.qtd > 0) {
            var index = this.bodies.indexOf(body);
            if (index != -1) {
                this.bodies.splice(index, 1);
                this.AABBs.splice(index, 1);
                removed = true;
            }
        }
        else {
            if (this.nodeA != null) {
                if (this.nodeA.removeBody(body)) {
                    removed = true;
                    if (this.nodeA.qtd == 0) {
                        this.nodeA = null;
                    }
                }
            }
            if (this.nodeB != null) {
                if (this.nodeB.removeBody(body)) {
                    removed = true;
                    if (this.nodeB.qtd == 0) {
                        this.nodeB = null;
                    }
                }
            }
            if (this.nodeC != null) {
                if (this.nodeC.removeBody(body)) {
                    removed = true;
                    if (this.nodeC.qtd == 0) {
                        this.nodeC = null;
                    }
                }
            }
            if (this.nodeD != null) {
                if (this.nodeD.removeBody(body)) {
                    removed = true;
                    if (this.nodeD.qtd == 0) {
                        this.nodeD = null;
                    }
                }
            }
        }

        if (removed) {
            this.qtd--;
        }
        return removed;
    };

    this.processInsert = function (body, AABB) {
        if (AABBoverlap(this.getNodeA().AABB, AABB, 0)) {
            this.getNodeA().addBody(body, AABB);
        }
        if (AABBoverlap(this.getNodeB().AABB, AABB, 0)) {
            this.getNodeB().addBody(body, AABB);
        }
        if (AABBoverlap(this.getNodeC().AABB, AABB, 0)) {
            this.getNodeC().addBody(body, AABB);
        }
        if (AABBoverlap(this.getNodeD().AABB, AABB, 0)) {
            this.getNodeD().addBody(body, AABB);
        }
    };

    this.getNodeA = function () {
        if (this.nodeA == null) {
            var x0 = this.AABB[0];
            var y0 = this.AABB[1];
            var x1 = this.AABB[2];
            var y1 = this.AABB[3];
            this.nodeA = new QuadTree([x0, y0, x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2)], this.l + 1);
        }
        return this.nodeA;
    };

    this.getNodeB = function () {
        if (this.nodeB == null){
            var x0 = this.AABB[0];
            var y0 = this.AABB[1];
            var x1 = this.AABB[2];
            var y1 = this.AABB[3];
            this.nodeB = new QuadTree([x0 + ((x1 - x0) / 2), y0, x1, y0 + ((y1 - y0) / 2)], this.l + 1);
        }
        return this.nodeB;
    };

    this.getNodeC = function () {
        if (this.nodeC == null) {
            var x0 = this.AABB[0];
            var y0 = this.AABB[1];
            var x1 = this.AABB[2];
            var y1 = this.AABB[3];
            this.nodeC = new QuadTree([x0 + ((x1 - x0) / 2), y0 + ((y1 - y0) / 2), x1, y1], this.l + 1);
        }
        return this.nodeC;
    };

    this.getNodeD = function () {
        if (this.nodeD == null) {
            var x0 = this.AABB[0];
            var y0 = this.AABB[1];
            var x1 = this.AABB[2];
            var y1 = this.AABB[3];
            this.nodeD = new QuadTree([x0, y0 + ((y1 - y0) / 2), x0 + ((x1 - x0) / 2), y1], this.l + 1);
        }
        return this.nodeD;
    };
}


