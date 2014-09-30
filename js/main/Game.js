function Game(){
	this.world = new World();
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
		}
	};

	this.loop = function(game){
		if(game.running){
			setTimeout(function(){
				requestAnimationFrame(function(){game.loop(game);});
				game.world.step();
				game.count++;
			},1000*game.world.dt);
		}
	};
}



