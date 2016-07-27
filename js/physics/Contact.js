(function(w){
    w.Contact = function (bodyA, pA, bodyB, pB, normal) {
        // convention: point pA (world coords) of body bodyA penetrates
        // bodyB at some surface; the projection of pA onto this surface
        // is point pB (world coords), and the outward pointing surface
        // normal is "normal".
        var self = this;
        self.bodyA = bodyA;
        self.pA = pA;
        self.bodyB = bodyB;
        self.pB = pB;
        self.normal = normal;
    };
})(window);
