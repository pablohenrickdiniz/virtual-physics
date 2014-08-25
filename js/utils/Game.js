function Game(){
	this.map = new Map(600, 600);
	this.fps = 0;
	this.count = 0;
	this.running = false;
	this.readFrame    = null;
    this.gametime = 0;

	this.start = function(){
        console.log('game started...');
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


	this.loop = function(game){
		if(game.running){
			setTimeout(function(){
				requestAnimationFrame(function(){game.loop(game);});
				game.step();
				game.count++;
			},1000/FPS);
		}
	};

	this.readFps = function(){
		var game = this;
		this.readFrame = setInterval(function() {
			game.fps = game.count;
            $("#fps").html(game.fps);
			game.count = 0;
		}, 1000);
	};

    this.step = function(){
        this.map.testColision();
        var events = this.map.getEvents();
        for(var i = 0; i < events.length;i++){
            for(var j = 0; j < events[i].length;j++){
                events[i][j].step();
            }
        }
        Graphics.render(this.map);
    };


	this.getMap = function(){
		return this.map;
	};

	this.setMap = function(map){
		if(map instanceof Map){
			this.pause();
			this.map = map;
		}
	};
}



