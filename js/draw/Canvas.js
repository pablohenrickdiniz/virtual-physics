/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
    if (document.getElementById(canvas) == null) {
        throw new TypeError('Element canvas doesn\'t exists');
    }
    this.canvas = canvas;
    this.width = MV.toInt($("#" + canvas).css('width'));
    this.height = MV.toInt($("#" + canvas).css('height'));
    this.context = $("#" + canvas).get(0).getContext('2d');
    this.scale = [1,1];
    this.x = 0;
    this.y=0;

    if (!this.context.setLineDash) {
        this.context.setLineDash = function (line) {
        };
    }

    this.setScale = function(x,y){
        this.scale = [x,y];
        this.context.scale(x,y);
    };

    this.drawShape = function (shape) {
        if (shape instanceof Polygon) {
            this.drawPolygon(shape);
        } else if (shape instanceof Circle) {
            this.drawCircle(shape);
        }
    };

    this.drawWorld = function(world){
        this.clearScreen();
        for(var i = 0; i < world.bodies.length;i++){
            this.drawPolygon(world.bodies[i].shape);
        }
    };

    this.drawCircle = function (circle) {
        if (circle instanceof Circle) {
            this.drawArc(circle);
        }
    };

    this.drawArc = function (arc) {
        if (arc instanceof Arc) {
            this.fillShadow(arc.shadow);
            this.fillShape(arc);
            this.context.beginPath();
            this.context.arc(arc.center[0], arc.center[1],
                arc.radius, Math.PI * arc.start / 180,
                Math.PI * arc.end / 180);
            this.context.fill();
            this.preencherBorda(arc.border);
        }
    };

    this.drawPolygon = function (polygon) {
        if (polygon instanceof Polygon) {
            this.fillShadow(polygon.shadow);
            this.fillShape(polygon);
            var center = polygon.center;
            this.context.save();
            this.context.translate(center[0],center[1]);
            this.context.rotate(polygon.theta);
            this.context.beginPath();
            this.context.moveTo(polygon.vertices[0][0], polygon.vertices[0][1]);
            for (var i = 1; i < polygon.vertices.length; i++) {
                this.context.lineTo(polygon.vertices[i][0],polygon.vertices[i][1]);
            }
            this.context.closePath();
            this.context.fill();
            this.preencherBorda(polygon.border);
            this.context.restore();
        }
    };


    this.clearScreen = function () {
        document.getElementById(this.canvas).width = this.width;
    };

    this.move = function(x,y){
        var xa = this.x-x;
        var xb = this.y-y;
        this.x = x;
        this.y = y;
        this.context.translate(xa,xb);
    };

    this.fillGradient = function (shape) {
        var gradient = shape.color;
        var grad = null;
        var quad = shape.updateMinAndMax()
        var width = quad.max[0] - quad.min[0];
        var height = quad.max[1] - quad.min[1];
        var wm = width / 2;
        var hm = height / 2;
        var cx = quad.min[0] + (wm);
        var cy = quad.min[1] + (hm);

        if (gradient instanceof RadialGradient) {
            var r = gradient.r;
            var cx = gradient.cx;
            var cy = gradient.cy;
            var fx = gradient.fx;
            var fy = gradient.fy;

            var gxp = (cx - wm) + width * (cx / 100);
            var gyp = (cy - hm) + height * (cy / 100);
            var fxp = (cx - wm) + width * (fx / 100);
            var fyp = (cy - hm) + height * (fy / 100);
            var rp = width * (r / 100);
            grad = this.context.createRadialGradient(fxp, fyp, 0, gxp, gyp, rp);
        } else {
            var px0 = gradient.px0;
            var py0 = gradient.py0;
            var px1 = gradient.px1;
            var py1 = gradient.py1;
            var x0 = (cx - wm) + width * (px0 / 100);
            var y0 = (cy - hm) + height * (py0 / 100);
            var x1 = (cx - wm) + width * (px1 / 100);
            var y1 = (cy - hm) + height * (py1 / 100);
            grad = this.context.createLinearGradient(x0, y0, x1, y1);
        }

        for (var i = 0; i < gradient.colorsStop.length; i++) {
            grad.addColorStop(gradient.colorsStop[i][0] / 100, this.fillColor(gradient.colorsStop[i][1]));
        }
        return grad;
    };

    this.fillColor = function (color) {
        if (color instanceof Color) {
            return color.toRGBA();
        }
        return color;
    };

    this.fillShadow = function (shadow) {
        this.context.save();
        if (shadow != null) {
            this.context.shadowOffsetX = shadow.x;
            this.context.shadowOffsetY = shadow.y;
            this.context.shadowBlur = shadow.blur;
            this.context.shadowColor = this.fillColor(shadow.color);
        }
        this.context.fill();
        this.context.restore();
    };

    this.preencherBorda = function (border) {
        this.context.setLineDash(border.lineDash);
        this.context.lineCap = border.lineCap;
        this.context.strokeStyle = this.fillColor(border.color);
        this.context.lineWidth = border.thickness;
        this.context.stroke();
    };

    this.fillShape = function (shape) {
        var color = shape.color;
        if (color instanceof LinearGradient || color instanceof RadialGradient) {
            this.context.fillStyle = this.fillGradient(shape);
        } else if (color instanceof Image) {
            this.context.fillStyle = color.getFillPattern(this.context);
        } else {

            this.context.fillStyle = this.fillColor(color);
        }
    };

    this.drawImage = function (image) {
        if (image instanceof Image) {
            if (image.loaded) {
                var img = image.getElement();
                var w = image.width;
                var h = image.height;
                var sx = image.sx;
                var sy = image.sy;
                var x = image.x;
                var y = image.y;
                console.log(" w: " + w + "\n h:" + h + "\n x:" + x + "\n y:" + y);
                this.context.drawImage(img, sx, sy, w, h, x, y, w, h);
                return true;
            }
        }
    };
}