function LinearGradient(px0, py0, px1, py1) {
	this.px0 = isNaN(px0) || px0 < 0 || px0 > 100? 0 : px0;
	this.py0 = isNaN(py0) || py0 < 0 || py0 > 100? 0 : py0;
	this.px1 = isNaN(px1) || px1 < 0 || px1 > 100? 100 : px1;
	this.py1 = isNaN(py1) || py1 < 0 || py1 > 100? 100 : py1;
	this.colorsStop = [];

	this.addColorStop = function(stop, color) {
		if (isNaN(stop) || stop < 0 || stop > 100) {
			throw new TypeError(
					'O indice de parada deve ser um numero entre 0 e 100');
		}
		if (!(color instanceof Color)) {
			color = Color.parse(color);
		}
		this.colorsStop.push([stop, color]);
	};
}