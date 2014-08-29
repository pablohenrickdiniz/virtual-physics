function Colision(){};



Colision.boundingBoxC = function(rectA, rectB) {
	if (rectA instanceof Rect && rectB instanceof Rect) {
		var pta = rectA.getPoints();
		var ptb = rectB.getPoints();
		var pa = null;
		var pb = null;
		var pc = null;
		var pd = null;

		if (pta[0].x > ptb[1].x) {
			pa = pta[0];
			pb = pta[3];
			pc = ptb[1];
			pd = ptb[2];
		} else if (ptb[0].x > pta[1].x) {
			pa = ptb[0];
			pb = ptb[3];
			pc = pta[1];
			pd = pta[2];
		} else if (pta[0].y > ptb[3].y) {
			pa = pta[0];
			pb = pta[1];
			pc = ptb[3];
			pd = ptb[4];
		} else if (ptb[0].y > pta[3].y) {
			pa = ptb[0];
			pb = ptb[1];
			pc = pta[3];
			pd = ptb[4];
		}
		if (pa != null && pb != null && pc != null && pd != null) {
			return obtainMinLine(pa, pb, pc, pd).getCenter();
		}
	}
	return null;
};

Colision.boundingBox = function(rectA, xb, yb, wb, hb) {
	var pta = rectA.getPoints();
	return (pta[0].x > xb + wb || xb > pta[1].x || pta[0].y > yb + hb || yb > pta[3].y);
};


Colision.circleLine = function(circle, line){
	if(circle instanceof Circle && line instanceof Line){
		var degree = line.getDegree();
		line.rotate(-degree,line.getPointA());
		circle.rotate(-degree,line.getPointA());
		var rc 	= circle.getRadius();
		var cx 	= circle.getCenter().getX();
		var cy 	= circle.getCenter().getY();
		var pax = line.getPointA().getX();
		var pay = line.getPointA().getY();
		var pbx = line.getPointB().getX();
		var pby = line.getPointB().getY();
		line.rotate(degree,line.getPointA());
		circle.rotate(degree,line.getPointA());

        var cpMiny =  Math.min(pay,pby);
        var cpMaxy =  Math.max(pay,pby);
        var cpMinx = Math.min(pax,pbx);
        var cpMaxx = Math.max(pax,pbx);
		var minX = cpMinx-rc;
		var minY = cpMiny-rc;
		var maxX = cpMaxx+rc;
		var maxY = cpMaxy+rc;
        var cfx = cx>cpMaxx?cpMaxx:cx<cpMinx?cpMinx:cx;
        var cfy = cy>cpMaxy?cpMaxy:cy<cpMiny?cpMiny:cy;;
	    if(((cx <= pax && cx >= minX)||(cx >=pax && cx <= maxX)) &&(cy <= maxY && cy >= minY)){
            return new Point(cfx, cfy);
        }
        return null;
	}
	else{
		throw new TypeError('Somente circulo e reta podem ser passados como par�metro');
	}
};

Colision.circlePolygon = function(circle, polygon){
	var points = polygon.getPoints();
	for(var i = 0; i < points.length;i++){
        var pos = i+1;
        pos = pos == points.length?0:pos;
		var line = new Line(points[i], points[pos]);
        var cp = Colision.circleLine(circle, line);

		if(cp != null){
			return cp;
		}
	}
	return false;
};

Colision.circles = function(circleA, circleB) {
	var ca = circleA.getCenter();
	var cb = circleB.getCenter();
	var ra = circleA.getRadius();
	var rb = circleB.getRadius();
	var d = Point.distance(ca, cb);
	return d <= (ra + rb);
};

Colision.lines = function(lineA, lineB){
    var point = Line.intersection(lineA, lineB);
    if(point != null &&  lineA.havePoint(point)){
        return point;
    }
    return null;
};

Colision.polygons = function(squareA, squareB){
    var pointsA = squareA.getPoints();
    var pointsB = squareB.getPoints();
    for(var i = 0; i < pointsA.length;i++){
        var lineA = new Line(pointsA[i],pointsA[i+1==pointsA.length?0:i+1]);
        for(var j = 0; j < pointsB.length;j++){
            var lineB = new Line(pointsB[j],pointsB[j+1==pointsA.length?0:j+1]);
            if(Colision.lines(lineA,lineB) != null){
                return true;
            }
        }
    }
    return false;
};

Colision.forms = function(formA, formB){
    if(formA instanceof Circle && formB instanceof Circle){
       return Colision.circles(formA, formB);
    }
    else if(formA instanceof Circle && formB instanceof Polygon){
        return Colision.circlePolygon(formA, formB);

    }
    else if(formA instanceof Polygon && formB instanceof Circle){
        return Colision.circlePolygon(formB, formA);
    }
    else if(formA instanceof Polygon && formB instanceof Polygon){
        return Colision.polygons(formA, formB);
    }
};

Colision.applyForces = function(objA, objB, contA, contB,cp){
    var cA = contA.getCenter();
    var cB = contB.getCenter();
    var vA = objA.getVector();
    var vB = objB.getVector();
    var m1  = objA.getMass();
    var m2  = objB.getMass();
    var x1  = cA.getX();
    var y1  = cA.getY();
    var x2  = cB.getX();
    var y2  = cB.getY();
    var a1  = contA.getDegree();
    var a2  = contB.getDegree();
    var vx1 = vA.getX();
    var vy1 = vA.getY();
    var vx2 = vB.getX();
    var vy2 = vB.getY();
    var va1 = objA.getAngularSpeed();
    var va2 = objB.getAngularSpeed();

    var result = false;
    if(contA instanceof Circle && contB instanceof Circle){
        var r1 = contA.getRadius();
        var r2 = contB.getRadius();
        result = Colision.solve('a',0,0.5,m1,m2,r1,r2,x1,y1,x2,y2,vx1,vy1,vx2,vy2);
    }
    else if(contA instanceof Circle && contB instanceof Polygon || contA instanceof Polygon && contB instanceof Circle){
        var cpx = cp.getX();
        var cpy = cp.getY();

        var inverse = (contA instanceof Polygon);
        var angle= 0;
        if(inverse){
            var r2 = contB.getRadius();
            result = Colision.solve('a',0,1,m1,m2,0,r2,cpx,cpy,x2,y2,vx1,vy1,vx2,vy2);
            angle = getAngle(cA.getX()-cB.getX(),cA.getY()-cB.getY());
            console.log("angulo:"+angle);
            angle = angle>45?angle-45:angle;
            var sgn = angle >45?-1.0:1.0;
            var percent = (100*angle)/45;
            var linearForce = ((100-percent)/100)*sgn;
            var angularForce = (percent/100)*sgn;
            console.log("linearForece:"+linearForce);
            console.log("angularForce:"+angularForce);

            result.vx2 *= linearForce;
            result.vy2 *= linearForce;
            result.va2 *= angularForce;

        }
        else{
            var r1 = contA.getRadius();
            result = Colision.solve('a',0,1,m1,m2,r1,0,x1,y1,cpx,cpy,vx1,vy1,vx2,vy2);
            angle = getAngle(cA.getX()-cB.getX(),cA.getY()-cB.getY());
            console.log(angle);
            var sgn = angle >45?-1.0:1.0;
            angle = angle>45?angle-45:angle;
            var percent = (100*angle)/45;
            var linearForce = ((100-percent)/100)*sgn;
            var angularForce = (percent/100)*sgn;

            result.vx1 *= linearForce;
            result.vy1 *= linearForce;
            result.va1 *= angularForce;

        }




        var circle = new Circle(cp,2);
        circle.setColor('Blue');
        CanvasList.canvas[4].drawCircle(circle);
        //Controller.game.stop();

    }
    else if(contA instanceof Polygon && contB instanceof Polygon){

    }


    if(result != false){
        if(objA.dinamic){
            cA.setX(result.x1);
            cA.setY(result.y1);
            vA.setX(result.vx1);
            vA.setY(result.vy1);
            objA.setAngularSpeed(result.va1);
        }
        if(objB.dinamic){
            cB.setX(result.x2);
            cB.setY(result.y2);
            vB.setX(result.vx2);
            vB.setY(result.vy2);
            objB.setAngularSpeed(result.va2);
        }
    }
};


Colision.calcCirclePolygon = function(R,m1,m2,x1,x2,y1,y2,vx1,vx2,vy1,vy2){
    var m21=m2/m1;
    var x21=x2-x1;
    var y21=y2-y1;
    var vx21=vx2-vx1;
    var vy21=vy2-vy1;

    var vx_cm = (m1*vx1+m2*vx2)/(m1+m2) ;
    var vy_cm = (m1*vy1+m2*vy2)/(m1+m2) ;

    if ((vx21*x21 + vy21*y21) >= 0) return false;

    var fy21 = 1.0E-12*Math.abs(y21);
    if (Math.abs(x21)< fy21) {
        x21=fy21*(x21<0?-1:1);
    }

    var a=y21/x21;
    var  dvx2= -2*(vx21 +a*vy21)/((1+a*a)*(1+m21)) ;
    var vx2=vx2+dvx2;
    var vy2=vy2+a*dvx2;
    var vx1=vx1-m21*dvx2;
    var vy1=vy1-a*m21*dvx2;

    vx1=(vx1-vx_cm)*R + vx_cm;
    vy1=(vy1-vy_cm)*R + vy_cm;
    vx2=(vx2-vx_cm)*R + vx_cm;
    vy2=(vy2-vy_cm)*R + vy_cm;

    return {x1:x1,y1:y1,x2:x2,y2:y2,vx1:vx1,vy1:vy1,vx2:vx2,vy2:vy2};
};

Colision.solve = function(mode,alpha,R,m1,m2,r1,r2,x1,y1,x2,y2,vx1,vy1,vx2,vy2){
    var pi2=2*Math.acos(-1.0E0);
    var r12=r1+r2;
    var m21=m2/m1;
    var x21=x2-x1;
    var y21=y2-y1;
    var vx21=vx2-vx1;
    var vy21=vy2-vy1;

    var vx_cm = (m1*vx1+m2*vx2)/(m1+m2) ;
    var vy_cm = (m1*vy1+m2*vy2)/(m1+m2) ;

    //return old positions and velocities if relative velocity =0 ****
    if (vx21==0 && vy21==0 ) {return false};
    //calculate relative velocity angle
    var gammav=Math.atan2(-vy21,-vx21);
    //this block only if initial positions are given *********
    if (mode != 'f') {
        var d=Math.sqrt(x21*x21 +y21*y21);
        //return if distance between balls smaller than sum of radii ***
        //if (d<r12) {;return false;}
        //calculate relative position angle and normalized impact parameter ***
        var gammaxy=Math.atan2(y21,x21);
        var dgamma=gammaxy-gammav;
        if (dgamma>pi2) {
            dgamma=dgamma-pi2;
        }
        else if (dgamma<-pi2) {
            dgamma=dgamma+pi2;
        }
        var dr=d*Math.sin(dgamma)/r12;
        //return old positions and velocities if balls do not collide ***
        if (  (Math.abs(dgamma)>pi2/4 && Math.abs(dgamma)<0.75*pi2) || Math.abs(dr)>1 )
        {return false;}
        //calculate impact angle if balls do collide ***
        alpha=Math.asin(dr);
        //calculate time to collision ***
        var dc=d*Math.cos(dgamma);
        var sqs = 0;
        if(dc>0){sqs=1.0;}else{sqs=-1.0;}
        var t=(dc-sqs*r12*Math.sqrt(1-dr*dr))/Math.sqrt(vx21*vx21+ vy21*vy21);
        //update positions
        x1=x1+vx1*t;
        y1=y1+vy1*t;
        x2=x2+vx2*t;
        y2=y2+vy2*t;
    }
    //END 'this block only if initial positions are given' *********
    //update velocities ***
    alpha= alpha==0?360:alpha;
    var a=Math.tan( gammav +alpha);
    var dvx2=-2*(vx21 +a*vy21) /((1+a*a)*(1+m21));
    vx2=vx2+dvx2;
    vy2=vy2+a*dvx2;
    vx1=vx1-m21*dvx2;
    vy1=vy1-a*m21*dvx2;
    //velocity correction for inelastic collisions ***
    vx1=(vx1-vx_cm)*R + vx_cm;
    vy1=(vy1-vy_cm)*R + vy_cm;
    vx2=(vx2-vx_cm)*R + vx_cm;
    vy2=(vy2-vy_cm)*R + vy_cm;
    return {x1:x1,x2:x2,y1:y1,y2:y2,vx1:vx1,vy1:vy1,vx2:vx2,vy2:vy2,va1:0,va2:0};
}



Colision.collision2Ds = function(m1, m2, R, x1, y1, x2, y2, vx1, vy1, vx2, vy2){
    var m21=m2/m1;
    var x21=x2-x1;
    var y21=y2-y1;
    var vx21=vx2-vx1;
    var vy21=vy2-vy1;

    var vx_cm = (m1*vx1+m2*vx2)/(m1+m2) ;
    var vy_cm = (m1*vy1+m2*vy2)/(m1+m2) ;

    if ((vx21*x21 + vy21*y21) >= 0) return false;

    var fy21 = 1.0E-12*Math.abs(y21);
    if (Math.abs(x21)< fy21) {
        x21=fy21*(x21<0?-1:1);
    }

    var a=y21/x21;
    var  dvx2= -2*(vx21 +a*vy21)/((1+a*a)*(1+m21)) ;
    vx2=vx2+dvx2;
    vy2=vy2+a*dvx2;
    vx1=vx1-m21*dvx2;
    vy1=vy1-a*m21*dvx2;

    vx1=(vx1-vx_cm)*R + vx_cm;
    vy1=(vy1-vy_cm)*R + vy_cm;
    vx2=(vx2-vx_cm)*R + vx_cm;
    vy2=(vy2-vy_cm)*R + vy_cm;

    return {x1:x1,y1:y1,x2:x2,y2:y2,vx1:vx1,vy1:vy1,vx2:vx2,vy2:vy2};
};

