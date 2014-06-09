function GradienteRadial(cx, cy, r,fx,fy) {
	this.r = isNaN(r) || r < 0 || r > 100?50 : r;
	this.cx = isNaN(cx) || cx < 0 || cx>100?50:cx;
	this.cy = isNaN(cy) || cy < 0 || cy>100?50:cy;
	this.fx = isNaN(fx) || fx < 0 || fx>100?50:fx;
	this.fy = isNaN(fy) || fy < 0 || fy>100?50:fy;
	this.colorsStop = new Array();
	this.id = idGenerator.getId();
	
	
	this.getR = function() {
		return this.r;
	};

	this.getCx = function() {
		return this.cx;
	};
	
	this.getCy = function(){
		return this.cy;
	};
	
	this.getFx = function(){
		return this.fx;
	};
	
	this.getFy = function(){
		return this.fy;
	};
	
	this.setCx = function(cx){
		if(!isNaN(cx) && cx >= 0 && cx <= 100){
			this.cx = cx;
		}
	};
	
	this.setCy = function(cy){
		if(!isNaN(cy) && cy >= 0 && cy <= 100){
			this.cy = cy;
		}
	};
	
	this.setFx = function(fx){
		if(!isNaN(fx) && fx >= 0 && fy <= 100){
			this.fx = fx;
		}
	};
	
	this.setFy = function(fy){
		if(!isNaN(fy) && fy >= 0 && fy <= 100){
			this.fy = fy;
		}
	};
	
	this.setR = function(r) {
		if (!isNaN(r) && r >= 0) {
			this.r = r;
		}
	};
	
	this.addColorStop = function(stop, color) {
		if (isNaN(stop) || stop < 0 || stop > 100) {
			throw new TypeError(
					'O indice de parada deve ser um numero entre 0 e 100');
		}
		if (!(color instanceof Color)) {
			color = Color.parse(color);
		}
		this.colorsStop.push(new Array(stop, color));
	};

	this.getColorsStop = function() {
		return this.colorsStop;
	};
	
	this.getId = function(){
		return this.id;
	};
}