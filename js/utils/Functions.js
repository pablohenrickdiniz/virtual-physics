const METERPIXEL = 1000;
const GRAVITY = new Vetor(0, 10);
const VELOCIDADETERMINAL = 1000;
const FPS = 60;

function obterAngulo(x, y) {
	var xabs = Math.abs(x);
	var yabs = Math.abs(y);
	if (x < 0 && y > 0) {
		return converterParaGraus(Math.atan(xabs / yabs));
	} else if (x < 0 && y < 0) {
		return 90 + converterParaGraus(Math.atan(yabs / xabs));
	} else if (x > 0 && y < 0) {
		return 180 + converterParaGraus(Math.atan(xabs / yabs));
	} else{
		return 270 + converterParaGraus(Math.atan(yabs / xabs));
	}
}

function obterMenorReta() {
	var reta = null;
	if (arguments.length >= 2) {
		reta = new Reta(arguments[0], arguments[1]);
		for (var i = 0; i < arguments.length; i++) {
			for (var j = i + 1; j < arguments.length; j++) {
				var aux = new Reta(arguments[i], arguments[j]);
				if (aux.getTamanho() < reta.getTamanho()) {
					reta = aux;
				}
			}
		}
	}
	return reta;
}

function obterHipotenusa(x, y) {
	return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}

function IdGenerator() {
	this.id = 0;
	this.disponibleIds = new Array();

	this.getId = function() {
		if (this.disponibleIds.length > 0) {
			return this.disponibleIds.pop();
		}
		this.id++;
		return this.id;
	};

	this.unlockId = function(id) {
		this.disponibleIds.push(id);
	};
}

var idGenerator = new IdGenerator();

function toInt(px) {
	return parseInt(px.substr(0, px.indexOf('px')));
}

function converterParaRadianos(graus) {
	return graus * (Math.PI / 180);
}

function converterParaGraus(radianos) {
	return radianos * (180 / Math.PI);
}

function indexOf(value) {
	for ( var index in this) {
		if (this[index] == value) {
			return index;
		}
	}
	return -1;
}

if (Array.prototype.indexOf == undefined) {
	Array.prototype.indexOf = indexOf;
}

function remove(element) {
	var index = this.indexOf(element);
	if (index != -1) {
		this.splice(index, 1);
	}
}

Array.prototype.remove = remove;

(function() {
	var lastTime = 0;
	var vendors = [ 'ms', 'moz', 'webkit', 'o' ];
	for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x]
				+ 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x]
				+ 'CancelAnimationFrame']
				|| window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame)
		window.requestAnimationFrame = function(callback, element) {
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function() {
				callback(currTime + timeToCall);
			}, timeToCall);
			lastTime = currTime + timeToCall;
			return id;
		};

	if (!window.cancelAnimationFrame)
		window.cancelAnimationFrame = function(id) {
			clearTimeout(id);
		};
}());

