function Colision(){}



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
			return obtainMinLine(pa, pb, pc, pd).getPontoMedio();
		}
	}
	return null;
};

Colision.boundingBox = function(retanguloA, xb, yb, wb, hb) {
	var pta = retanguloA.getPoints();

	if (pta[0].x > xb + wb || xb > pta[1].x || pta[0].y > yb + hb
			|| yb > pta[3].y) {
		return false;
	}

	return true;
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
		
		var minX = Math.min(pax,pbx)-rc;
		var minY = Math.min(pay,pby)-rc;
		var maxX = Math.max(pax,pbx)+rc;
		var maxY = Math.max(pay,pby)+rc;

		if(((cx <= pax && cx >= minX)||(cx >=pax && cx <= maxX)) &&(cy <= maxY && cy >= minY)){
			return true;
		}
		return false;
	}
	else{
		throw new TypeError('Somente circulo e reta podem ser passados como par�metro');
	}
};

Colision.circlePolygon = function(circle, polygon){
	if(polygon instanceof Polygon && circle instanceof Circle){
		var points = polygon.getPoints();
		for(var i = 0; i < points.length && i+1 < points.length;i++){
			var line = new Line(points[i], points[i+1]);
			if(Colision.circleLine(circle, line)){
				return true;
			}
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
        var pos = i+1;
        if(pos == pointsA.length){
            pos = 0;
        }
        var lineA = new Line(pointsA[i],pointsA[pos]);
        for(var j = 0; j < pointsB.length;j++){
            var pos = j+1;
            if(pos == pointsB.length){
                pos = 0;
            }
            var lineB = new Line(pointsB[j],pointsB[pos]);
            if(Colision.lines(lineA,lineB) != null){
                return true;
            }
        }
    }
};

Colision.circle = {};

Colision.circle.applyForces = function(evA, evB){
    var objA = evA.getObject();
    var objB = evB.getObject();
    var contA = evA.getContact();
    var contB = evB.getContact();
    var va = objA.getVector();
    var vb = objB.getVector();

    var vx1 = va.getX();
    var vx2 = vb.getX();
    var vy1 = va.getY();
    var vy2 = vb.getY();
    var m1 = objA.getMass();
    var m2 = objB.getMass();

    var a = Colision.circle.impactAngle(evA,evB);
    var Δvx2 = Colision.circle.Δvx2(evA, evB);

    var vx2f = vx2+Δvx2;
    var vy2f = vy2+(a*Δvx2);
    var vx1f = vx1 - (m2/(m1*Δvx2));
    var vy1f = vy1- (a*(m2/m1)*Δvx2);

    var t = Colision.circle.timeOfImpact(evA,evB);

    var ca = contA.getCenter();
    var cb = contB.getCenter();

    //movendo objetos para o tempo exato da colisao
    ca.setX(ca.getOldX()+(va.getX()*t));
    ca.setY(ca.getOldY()+(va.getY()*t));
    contA.setDegree(contA.getOldDegree()+(objA.getAngularSpeed()*t));
    cb.setX(cb.getOldX()+(vb.getX()*t));
    cb.setY(cb.getOldY()+(vb.getY()*t));
    contB.setDegree(contB.getOldDegree()+(objB.getAngularSpeed()*t));


    va.setX(vx1f);
    va.setY(vy1f);
    vb.setX(vx2f);
    vb.setY(vy2f);
};

//obter angulo de impacto
Colision.circle.impactAngle = function(evA, evB){
    var contA = evA.getContact();
    var contB = evB.getContact();
    var objA = evA.getObject();
    var objB = evB.getObject();
    var d = Point.distance(contA.getCenter(),contB.getCenter());
    var r1 = contA.getRadius();
    var r2 = contB.getRadius();
    var γxy = Colision.circle.γxy(objA, objB);
    var γv = Colision.circle.γv(objA, objB);
    return Math.asin(degreeToRadians(d*Math.sin(degreeToRadians(γxy-γv)/(r1+r2))));
};

//resolvendo γxy
Colision.circle.γxy = function(objA,objB){
    var x1 = objA.getVector().getX();
    var x2 = objB.getVector().getX();
    var y1 = objA.getVector().getY();
    var y2 = objB.getVector().getY();
    return Math.atan(degreeToRadians((y2-y1)/(x2-x1)));
};

//resolvendo γv
Colision.circle.γv = function(objA, objB){
    var vy1 = objA.getVector().getY();
    var vy2 = objB.getVector().getY();
    var vx1 = objA.getVector().getX();
    var vx2 = objB.getVector().getX();
    return Math.atan(degreeToRadians((vy1-vy2)/(vx1-vx2)));
};

//resolvendo Δvx2
Colision.circle.Δvx2 = function(evA, evB){
    var objA = evA.getObject();
    var objB = evB.getObject();
    var vx1 = objA.getVector().getX();
    var vx2 = objB.getVector().getX();
    var vy1 = objA.getVector().getY();
    var vy2 = objB.getVector().getY();
    var m1 = objA.getMass();
    var m2 = objB.getMass();
    var a = Colision.circle.impactAngle(evA, evB);
    return (2*((vx1-vx2)+(a*(vy1-vy2))))/((1+Math.pow(a,2))*(1+m2/m1));
};

//mover para o tempo de impacto
Colision.circle.timeOfImpact = function(evA, evB){
    var contA = evA.getContact();
    var contB = evB.getContact();
    var objA = evA.getObject();
    var objB = evB.getObject();
    var d = Point.distance(contA.getCenter(),contB.getCenter());
    var γxy = Colision.circle.γxy(objA, objB);
    var γv = Colision.circle.γv(objA, objB);
    var vx1 = objA.getVector().getX();
    var vx2 = objB.getVector().getX();
    var vy1 = objA.getVector().getY();
    var vy2 = objB.getVector().getY();
    var r1 = contA.getRadius();
    var r2 = contB.getRadius();

    var ta = (d*Math.cos(γxy)+Math.sqrt(Math.pow((r1+r2),2)-Math.pow(d*Math.sin(γxy-γv),2)));
    var tb = Math.sqrt(Math.pow(vx1-vx2,2)+Math.pow(vy1-vy2,2));
    var t = ta/tb;
    return t;
};


/*
function colisaoPoligono(poligonoA, poligonoB) {
	if (buscaSeparador(poligonoA, poligonoB)
			|| buscaSeparador(poligonoB, poligonoA)) {
		return false;
	}
	return true;
}

function colisaoProjecao(projecaoA, projecaoB) {
	if (projecaoA.getX() < projecaoB.getY()
			|| projecaoA.getY() > projecaoB.getX()) {
		return false;
	}
	return true;
}

function buscaSeparador(poligonoA, poligonoB) {
	var pontos = poligonoA.getPontos();
	for ( var i = 0; i < pontos.length; i++) {
		var pontoA = pontos[i];
		var pontoB = pontos[i + 1 < pontos.length ? i + 1 : 0];

		var vetor = new Ponto(pontoB.getX() - pontoA.getX(), pontoB.getY()
				- pontoA.getY());
		vetor.setY(vetor.getY() * -1);
		normalizeVetor(vetor);
		var projecao1 = projetarPoligono(poligonoA, vetor);
		var projecao2 = projetarPoligono(poligonoB, vetor);
		if (!colisaoProjecao(projecao1, projecao2)) {
			return true;
		}
	}
	return false;
	
	function projetarPoligono(poligono, vetor) {
	var pontos = poligono.getPontos();
	var pontoAtual = pontos[0];
	var produtoEscalar = (vetor.getX() * pontoAtual.getX())
			+ (vetor.getY() * pontoAtual.getY());
	var projecao = new Ponto(produtoEscalar, produtoEscalar);
	for ( var i = 1; i < pontos.length; i++) {
		pontoAtual = pontos[i];
		produtoEscalar = (vetor.getX() * pontoAtual.getX())
				+ (vetor.getY() * pontoAtual.getY());
		projecao.setX(Math.max(projecao.getX(), produtoEscalar));
		projecao.setY(Math.min(projecao.getY(), produtoEscalar));
	}
	return projecao;
}
*/

