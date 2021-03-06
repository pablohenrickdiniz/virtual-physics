(function(w){
    var QuadTree = function(AABB, l) {
        var self = this;
        self.AABB = AABB;
        self.l = l;
        self.bodies = [];
        self.AABBs = [];
        self.nodes = [];
        self.qtd = 0;
    };

    QuadTree.prototype.clear = function () {
        var self = this;
        self.qtd = 0;
        self.bodies = [];
        self.AABBs = [];
        var size = self.nodes.length;
        var i;
        for(i = 0; i < size;i++){
            if(self.nodes[i] != undefined && self.nodes[i].qtd > 0){
                self.nodes[i].clear();
            }
        }
    };

    QuadTree.prototype.getAABBsGroups = function (AABBsGroups) {
        var self = this;
        AABBsGroups = AABBsGroups == undefined ? [] : AABBsGroups;
        if (self.bodies.length > 0 && self.qtd > 1) {
            AABBsGroups.push([self.bodies, self.AABBs]);
        }
        else {
            var size = self.nodes.length;
            var i;
            for (i = 0; i < size; i++) {
                self.nodes[i].getAABBsGroups(AABBsGroups);
            }
        }
        return AABBsGroups;
    };


    QuadTree.prototype.add = function (body, AABB) {
        var self = this;
        AABB = AABB == undefined ? FrictionPhysics.getAABB(body) : AABB;
        if (self.qtd <= QuadTree.maxo || self.l == QuadTree.maxl) {
            body.addLeaf(this);
            self.bodies.push(body);
            self.AABBs.push(AABB);
        }
        else {
            if (self.nodes[0] == undefined) {
                self.split();
            }
            var size = self.bodies.length;
            if (size > 0) {
                var i ;
                for (i = 0; i < size; i++) {
                    self.bodies[i].inLeaf = [];
                    self.insert(self.bodies[i], self.AABBs[i]);
                }
                self.bodies = [];
                self.AABBs = [];
            }
            self.insert(body, AABB);
        }
        self.qtd++;
    };

    QuadTree.prototype.remove = function (body) {
        var self = this;
        var removed = false;
        if (self.bodies.length > 0 && self.qtd > 0) {
            var index = self.bodies.indexOf(body);
            if (index != -1) {
                self.bodies.splice(index, 1);
                self.AABBs.splice(index, 1);
                removed = true;
            }
        }
        else {
            var size = self.nodes.length;
            var node;
            var i;
            for (i = 0; i < size; i++) {
                node = self.nodes[i];
                if (node != null && node.remove(body)) {
                    removed = true;
                }
            }
        }
        if (removed) {
            self.qtd--;
        }
        return removed;
    };

    QuadTree.prototype.insert = function (body, AABB) {
        var self = this;
        var i;
        var size = self.nodes.length;
        var node;
        for (i = 0; i < size; i++) {
            node = self.nodes[i];
            if (FrictionPhysics.AABBoverlap(node.AABB, AABB, 0)) {
                node.add(body, AABB);
            }
        }
    };

    QuadTree.prototype.split = function () {
        var self = this;
        var x0 = self.AABB[0];
        var y0 = self.AABB[1];
        var x1 = self.AABB[2];
        var y1 = self.AABB[3];
        var w = (x1 - x0) / 2;
        var h = (y1 - y0) / 2;
        var xw = x0 + w;
        var yh = y0 + h;
        var l = self.l + 1;
        self.nodes[0] = new QuadTree([x0, y0, xw, yh], l);
        self.nodes[1] = new QuadTree([xw, y0, x1, yh], l);
        self.nodes[2] = new QuadTree([xw, yh, x1, y1], l);
        self.nodes[3] = new QuadTree([x0, yh, xw, y1], l);
    };

    QuadTree.maxl = 8;
    QuadTree.maxo = 3;

    w.QuadTree = QuadTree;
})(window);


