function Jogo(){
	this.mapa = new Mapa(new Ponto(300, 300), 600, 600);
	this.fps = 0;
	this.count = 0;
	this.running = false;
	this.readFrame    = null;

	this.start = function(){
		this.continue();
	};
	
	this.pause = function(){
		if(this.running){
			this.running = false;
			clearInterval(this.readFrame);
		}
	};
	
	this.continue = function(){
		if(!this.running){
			this.running = true;
			this.loop(this);
			this.readFps();
		}
	};
	
	this.save  = function(){
		
	};
	
	this.getFps = function(){
		return this.fps;
	};
	
	
	this.loop = function(jogo){
		if(jogo.running){
			setTimeout(function(){
				requestAnimationFrame(function(){jogo.loop(jogo);});
				jogo.mapa.step();
				jogo.count++;
			},1000/FPS);
		}
	};
	
	this.readFps = function(){
		var jogo = this;
		this.readFrame = setInterval(function() {
			jogo.fps = jogo.count;
			jogo.count = 0;
		}, 1000);
	};
	
	this.getMapa = function(){
		return this.mapa;
	};
	
	this.setMapa = function(mapa){
		if(mapa instanceof Mapa){
			this.pause();
			this.mapa = mapa;
		}
	};
}



