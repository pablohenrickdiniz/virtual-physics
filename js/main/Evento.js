Evento.prototype = new KeyReader();

function Evento(){
	KeyReader.call('#canvas');
	this.estados = new Array();
	this.estadoAtual = null;
	this.init = function(){};
	this.clickAction = function(){};
	this.camada = 3;

	this.addEstado = function(label,estado){
		this.estados['label'] = estado;
	};
	
	this.onInit = function(init){
		this.init = init;
	};
	
	this.start = function(){
		this.init;
	};
	
	this.mudaEstado = function(label){
		if(this.estados[label] instanceof Estado){
			this.estadoAtual = this.estados[label];
			this.estadoAtual.init();
		}
	};
	
	this.onClick = function(action){
		this.clickAction = action;
	};
	
	this.click = function(){
		this.clickAction.call();
	};
	
	this.setCamada = function(camada){
		if(!isNaN(camada) && camada > 0 && camada <= 5){
			this.camada = parseInt(camada);
		}
	};
	
	this.getEstadoAtual = function(){
		return this.estadoAtual;
	};
}