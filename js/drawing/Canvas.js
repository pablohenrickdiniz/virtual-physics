/**
 * Created by Pablo Henrick Diniz on 26/04/14.
 */

function Canvas(canvas) {
    if (document.getElementById(canvas) == null) {
        throw new TypeError('Elemento canvas não existe');
    }
    this.canvas = canvas;
    this.width = toInt($("#" + canvas).css('width'));
    this.height = toInt($("#" + canvas).css('height'));
    this.context = $("#" + canvas).get(0).getContext('2d');

    if (!this.context.setLineDash) {
        this.context.setLineDash = function () {
        };
    }

    this.drawShape = function (shape) {
        if (shape instanceof Polygon) {
            this.drawPolygon(shape);
        } else if (shape instanceof Circle) {
            this.drawCircle(shape);
        } else if (shape instanceof Line) {
            this.drawLine(shape);
        }
    };

    this.drawCircle = function (circle) {
        if (circle instanceof Circle) {
            this.drawArc(circle);
        }
    };

    this.drawCapsule = function(capsule){
        if(capsule instanceof Capsule){
            this.fillShadow(capsule.getShadow());
            this.fillShape(capsule);
            var arcA = capsule.getCircleA();
            var arcB = capsule.getCircleB();
            var lineA = capsule.getLineA();
            var lineB = capsule.getLineB();
            this.context.beginPath();
            this.drawArcPath(arcA);
            this.drawLinePath(lineA,false);
            this.drawArcPath(arcB);
            this.drawLinePath(lineB,true);
            this.context.fill();
            this.stroke(capsule);
        }
    };



    this.drawArcPath = function(arc){
        this.context.arc(arc.getCenter().getX(), arc.getCenter().getY(),
            arc.getRadius(), Math.PI * arc.getStartDegree() / 180,
            Math.PI * arc.getEndDegree() / 180);
    };

    this.drawArc = function (arc) {
        if (arc instanceof Arc) {
            this.fillShadow(arc.getShadow());
            this.fillShape(arc);
            this.context.beginPath();
            this.drawArcPath(arc);
            this.context.fill();
            this.stroke(arc);
        }
    };

    this.drawText = function(text){
        if(text instanceof Text){
            this.fillShadow(text.getShadow());
            this.fillShape(text);
            this.context.font = text.getFontSize()+'px '+text.getFontStyle();
            this.context.fillText(text.getText(), text.getCenter().getX(), text.getCenter().getY());
            this.stroke(text);
        }
    };

    this.drawRect = function(rect){
        if(rect instanceof Rect){
            this.drawPolygon(rect);
        }
    };

    this.drawLine = function (line) {
        if (line instanceof Line) {
            this.fillShadow(line.getShadow());
            this.context.beginPath();
            this.drawLinePath(line,true);
            this.stroke(line);
        }
    };

    this.drawLinePath = function(line,move){
        if(move){
            this.context.moveTo(line.getPointA().getX(), line.getPointA()
                .getY());
        }
        this.context.lineTo(line.getPointB().getX(), line.getPointB()
            .getY());
    };

    this.drawPolygon = function (polygon) {
        if (polygon instanceof Polygon) {
            var points = polygon.getPoints();
            this.fillShadow(polygon.getShadow());
            this.fillShape(polygon);
            this.context.beginPath();
            this.context.moveTo(points[0].getX(), points[0].getY());
            for (var i = 1; i < points.length; i++) {
                this.context.lineTo(points[i].getX(), points[i].getY());
            }
            this.context.closePath();
            this.context.fill();
            this.stroke(polygon);
        }
    };

    this.draw = function (drawing) {
        if (drawing instanceof Drawing) {
            var shapes = drawing.getShapes();
            for (var i = 0; i < shapes.length; i++) {
                this.drawShape(shapes[i]);
            }
        }
    };

    this.clearScreen = function () {
        document.getElementById(this.canvas).width =  this.width;
    };

    this.drawPoint = function (point) {
        if (point instanceof Point) {
            this.context.strokeStyle = 'black';
            this.context.beginPath();
            this.context.moveTo(point.getX(), point.getY());
            this.context.lineTo(point.getX() + point.getX(), point.getY()
                + point.getY());
            this.context.stroke();
        }
    };

    this.fillGradient = function (shape) {
        var gradient = shape.getColor();
        var grad = null;
        console.log(shape);
        var quad = shape.getCircumscribedSquare();
        var cx = quad.getCenter().getX();
        var cy = quad.getCenter().getY();
        var w = quad.getWidth();
        var h = quad.getHeigth();
        if (gradient instanceof RadialGradient) {
            var r = gradient.getR();
            var gcx = gradient.getCx();
            var gcy = gradient.getCy();
            var fx = gradient.getFx();
            var fy = gradient.getFy();

            var gxp = (cx - w / 2) + w * (gcx / 100);
            var gyp = (cy - h / 2) + h * (gcy / 100);
            var fxp = (cx - w / 2) + w * (fx / 100);
            var fyp = (cy - h / 2) + h * (fy / 100);
            var rp = w * (r / 100);
            grad = this.context
                .createRadialGradient(fxp, fyp, 0, gxp, gyp, rp);
        } else {
            var px0 = gradient.getPx0();
            var py0 = gradient.getPy0();
            var px1 = gradient.getPx1();
            var py1 = gradient.getPy1();
            var x0 = (cx - w / 2) + w * (px0 / 100);
            var y0 = (cy - h / 2) + h * (py0 / 100);
            var x1 = (cx - w / 2) + w * (px1 / 100);
            var y1 = (cy - h / 2) + h * (py1 / 100);
            grad = this.context.createLinearGradient(x0, y0, x1, y1);
        }

        var colorsStop = gradient.getColorsStop();
        for (var i = 0; i < colorsStop.length; i++) {
            grad.addColorStop(colorsStop[i][0] / 100, this
                .fillColor(colorsStop[i][1]));
        }
        return grad;
    };

    this.fillColor = function (color) {
        if (color instanceof Color) {
            return color.getRgba();
        }
        return color;
    };

    this.fillShadow = function (shadow) {
        this.context.save();
        if (shadow != null) {
            this.context.shadowOffsetX = shadow.getX();
            this.context.shadowOffsetY = shadow.getY();
            this.context.shadowBlur = shadow.getBlur();
            this.context.shadowColor = this.fillColor(shadow.getColor());
        }
        this.context.fill();
        this.context.restore();
    };

    this.strokeBorder = function (border) {
        this.context.setLineDash(border.getLineDash());
        this.context.lineCap = border.getLineCap();
        this.context.strokeStyle = this.fillColor(border.getColor());
        this.context.lineWidth = border.getThickness();
    };

    this.stroke = function(shape){
        var border = shape.getBorder();
        this.strokeBorder(border);
        if(shape instanceof Text){
            this.context.strokeText(shape.getText(), shape.getCenter().getX(), shape.getCenter().getY());
        }
        else{
            this.context.stroke();
        }
    };


    this.fillShape = function (shape) {
        var color = shape.getColor();
        if (color instanceof LinearGradient || color instanceof RadialGradient) {
            this.context.fillStyle = this.fillGradient(shape);
        } else if (color instanceof Image) {
            this.context.fillStyle = color.getFillPattern(this.context);
        } else {
            this.context.fillStyle = this.fillColor(color);
        }
    };

    this.drawFrame = function (x, y, frame) {
        var img = frame.getImage();
        var sx = frame.getSx();
        var sy = frame.getSy();
        var swidth = frame.getSwidth();
        var sheight = frame.getSheight();
        this.context.drawImage(img, sx, sy, swidth, sheight, x-(swidth/2), y-(sheight/2), swidth, sheight);
    };
}