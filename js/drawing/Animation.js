function Animation(sprite, sr,sc,er,ec) {
	this.sprite = sprite;
    this.ar = sr;//linha atual
    this.ac = sc;//coluna atual
    this.sr = sr;//linha inicial
    this.sc = sc;//coluna inicial
    this.er = er;//linha final
    this.ec = ec;//coluna final
    this.speed = Animation.frequency.NORMAL;//velocidade de animação
    this.runner = null;//
    this.running = false;//indica se a animação está sendo executada
    this.repeat = false;
    this.finalized = false;
    this.frame = 0;

	this.nextFrame = function() {
       this.frame++;
       this.nextCol();
	};

    this.getAtualFrame = function(){
        return this.sprite.getFrame(this.ar,this.ac);
    };

    this.getFrameIndex = function(){
        return this.frame;
    };

    this.isLastFrame = function(){
        return (this.er == this.ar && this.ec == this.ac);
    };

    this.getFrameWidth = function(){
        return this.sprite.getFrameWidth();
    };

    this.nextCol = function(){
        this.ac++;
        if(this.ac > this.ec){
            this.ac = this.sc;
            this.nextRow();
        }
    };

    this.nextRow = function(){
        this.ar++;
        if(this.ar > this.er){
            this.ar = this.sr;
            this.frame = 0;
        }
    };

	this.setSpeed = function(speed) {
		this.stop();
		this.speed = speed;
		this.execute();
	};

	this.execute = function(){
        console.log('executando animação');
		if(!this.running && this.speed != 0){
			var anim = this;
			this.runner = setInterval(function(){
				anim.nextFrame();
                if(anim.repeat == false && anim.isLastFrame()){
                    anim.stop();
                }
			},700/anim.speed);
		}
	};

	this.stop = function(){
		clearInterval(this.runner);
        this.running = false;
	};

	this.setAtualRow = function(ar){
        this.ar = ar;
    };

    this.setAtualCol = function(ac){
        this.ac = ac;
    };

    this.setStartRow = function(sr){
        this.sr = sr;
    };

    this.setStartCol = function(sc){
        this.sc =sc;
    };

    this.setEndRow = function(er){
        this.er = er;
    };

    this.setEndCol= function(ec){
        this.ec = ec;
    };

    this.setRepeat = function(repeat){
        this.repeat = repeat;
    };

    this.isFinalized = function(){
        return this.finalized;
    };
}

Animation.frequency = {
	STOP : 0,//parado
	VERYSLOW : 1,//velocidade muito lenta
	SLOW : 2,//velocidade lenta
	NORMAL : 3,//velocidade normal
	FAST : 4,//velocidade rápida
	VERYFAST : 5//velocidade muito rápida
};
