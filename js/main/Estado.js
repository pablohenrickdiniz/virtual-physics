function Estado(label,objeto, animacao){
	this.label = label;
	this.objeto   = !(objeto instanceof Objeto)?null:objeto;
	this.animacao = !(animacao instanceof Animacao)?null:animacao;
	this.initAction = function(){};
	
	this.setAnimacao = function(animacao){
		if(animacao instanceof Animacao){
			this.animacao = animacao;
		}
	};
	
	this.getAnimacao = function(){
		return this.animacao;
	};
	
	this.getObjeto = function(){
		return this.bojeto;
	};
	
	this.setObjeto = function(objeto){
		this.objeto = objeto;
	};
	
	this.onInit = function(action){
		this.initAction = action;
	};
	
	this.init = function(){
		this.initAction.call();
	};
	
	this.getLabel = function(){
		return this.label;
	};
	
	this.setLabel = function(label){
		this.label = label;
	};
}