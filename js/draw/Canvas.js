(function(w){
    var Canvas = function(options,canvas) {
        var self = this;
        CanvasLayer.apply(self,[options,canvas]);
        self.center = [self.width / 2, self.height / 2];
        self.min = [0, 0];
    };

    Canvas.prototype = Object.create(CanvasLayer.prototype);
    Canvas.constructor = Canvas;

    Canvas.prototype.drawShape = function (shape) {
        var self = this;
        if (shape instanceof Body) {
            self.drawBody(shape);
        }
        else if (shape instanceof Polygon) {
            self.drawPolygon(shape);
        }
    };

    Canvas.prototype.drawAABB = function (AABB) {
        var self = this;
        var context = self.getContext();
        context.fillStyle = 'transparent';
        context.strokeRect(AABB[0], AABB[1], AABB[2] - AABB[0], AABB[3] - AABB[1]);
    };

    Canvas.prototype.drawQuadTree = function (quad, sub) {
        var self = this;
        if (sub != true) {
            self.clear();
        }
        self.drawAABB(quad.AABB);
        var size = quad.nodes.length;
        var i;
        var node;
        for (i = 0; i < size; i++) {
            node = quad.nodes[i];
            if (node != undefined && node.qtd > 0) {
                self.drawQuadTree(node, true);
            }
        }
    };

    Canvas.prototype.drawWorld = function (world) {
        var self = this;
        self.clear();
        var size = world.bodies.length, bodies = world.bodies, i;
        for (i = 0; i < size; i++) {
            self.drawShape(bodies[i]);
        }
    };

    Canvas.prototype.drawCircle = function (circle) {
        var self = this;
        self.drawArc(circle);
    };

    Canvas.prototype.drawArc = function (arc) {
        var self = this;
        self.fillShadow(arc.shadow);
        self.fillShape(arc);
        var context = self.getContext();
        context.beginPath();
        context.arc(arc.center[0], arc.center[1],
            arc.radius, Math.PI * arc.start / 180,
            Math.PI * arc.end / 180);
        context.fill();
        self.fillBorder(arc.border);
    };

    Canvas.prototype.drawPolygon = function (polygon) {
        var self = this;
        var center = polygon.center;
        var vertices = polygon.vertices;
        var size = vertices.length;
        var i;
        var context = self.getContext();
        context.save();
        context.translate(center[0], center[1]);
        context.rotate(polygon.theta);
        context.beginPath();
        context.moveTo(vertices[0][0], vertices[0][1]);
        for (i = 1; i < size; i++) {
            context.lineTo(vertices[i][0], vertices[i][1]);
        }
        context.closePath();
        self.fillShape(polygon);
        context.fill();
        self.fillShadow(polygon.shadow);
        self.fillBorder(polygon.border);
        context.restore();
    };

    Canvas.prototype.drawBody = function (body) {
        var self = this;
        var polygon = body.shape;
        var center = body.center;
        var vertices = polygon.vertices;
        var i;
        var size = vertices.length;
        var context = self.getContext();
        context.save();
        context.translate(center[0], center[1]);
        context.rotate(polygon.theta);
        context.beginPath();
        context.moveTo(vertices[0][0], vertices[0][1]);
        for (i = 1; i < size; i++) {
            context.lineTo(vertices[i][0], vertices[i][1]);
        }
        context.closePath();
        self.fillShape(polygon);
        context.fill();
        self.fillShadow(polygon.shadow);
        self.fillBorder(polygon.border);
        context.restore();
    };

    Canvas.prototype.move = function (center) {
        var self = this;
        var xa = self.center[0] - center[0];
        var xb = self.center[1] - center[1];
        self.center = center;
        self.min = [center[0] - (self.width / 2), center[1] - (self.height / 2)];
        self.getContext().translate(xa, xb);
    };

    Canvas.prototype.fillGradient = function (shape) {
        var gradient = shape.color;
        var grad = null;
        var quad = shape.updateMinAndMax();
        var width = quad.max[0] - quad.min[0];
        var height = quad.max[1] - quad.min[1];
        var wm = width / 2;
        var hm = height / 2;
        var cx = quad.min[0] + (wm);
        var cy = quad.min[1] + (hm);
        var self = this;
        var context = self.getContext();
        if (gradient instanceof RadialGradient) {
            var r = gradient.r;
            cx = gradient.cx;
            cy = gradient.cy;
            var fx = gradient.fx;
            var fy = gradient.fy;

            var gxp = (cx - wm) + width * (cx / 100);
            var gyp = (cy - hm) + height * (cy / 100);
            var fxp = (cx - wm) + width * (fx / 100);
            var fyp = (cy - hm) + height * (fy / 100);
            var rp = width * (r / 100);
            grad = context.createRadialGradient(fxp, fyp, 0, gxp, gyp, rp);
        } else {
            var px0 = gradient.px0;
            var py0 = gradient.py0;
            var px1 = gradient.px1;
            var py1 = gradient.py1;
            var x0 = (cx - wm) + width * (px0 / 100);
            var y0 = (cy - hm) + height * (py0 / 100);
            var x1 = (cx - wm) + width * (px1 / 100);
            var y1 = (cy - hm) + height * (py1 / 100);
            grad = context.createLinearGradient(x0, y0, x1, y1);
        }
        var size = gradient.colorsStop.length;
        var i;
        for (i = 0; i < size; i++) {
            grad.addColorStop(gradient.colorsStop[i][0] / 100, self.fillColor(gradient.colorsStop[i][1]));
        }
        return grad;
    };

    Canvas.prototype.fillColor = function (color) {
        if (color instanceof Color) {
            return color.toRGBA();
        }
        return color;
    };

    Canvas.prototype.fillShadow = function (shadow) {
        if (shadow != null) {
            var self = this;
            var context = self.getContext();
            context.save();
            context.shadowOffsetX = shadow.x;
            context.shadowOffsetY = shadow.y;
            context.shadowBlur = shadow.blur;
            context.shadowColor = self.fillColor(shadow.color);
            context.fill();
            context.restore();
        }
    };

    Canvas.prototype.fillBorder = function (border) {
        if(border != null){
            var self = this;
            var context = self.getContext();
            context.setLineDash(border.lineDash);
            context.lineCap = border.lineCap;
            context.strokeStyle = self.fillColor(border.color);
            context.lineWidth = border.thickness;
            context.stroke();
        }
    };

    Canvas.prototype.fillShape = function (shape) {
        var color = shape.color;
        var self = this;
        var context = self.getContext();
        if (color instanceof LinearGradient || color instanceof RadialGradient) {
            context.fillStyle = self.fillGradient(shape);
        } else if (color instanceof Image) {
            context.fillStyle = color.getFillPattern(self.context);
        } else {
            context.fillStyle = self.fillColor(color);
        }
    };

    Canvas.prototype.drawImage = function (image) {
        if (image instanceof Image) {
            if (image.loaded) {
                var self = this;
                var img = image.getElement();
                var w = image.width;
                var h = image.height;
                var sx = image.sx;
                var sy = image.sy;
                var x = image.x;
                var y = image.y;
                self.getContext().drawImage(img, sx, sy, w, h, x, y, w, h);
                return true;
            }
        }
    };

    w.Canvas = Canvas;
})(window);
