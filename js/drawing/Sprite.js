/**
 * Created by Pablo Henrick Diniz on 14/08/14.
 */
function Sprite(url,rows,cols){
    this.url = url;
    this.rows = rows;
    this.cols = cols;
    this.frames = new Array();
    this.image = null;
    this.width = 0;
    this.height = 0;
    this.id = idGenerator.getId();
    this.loaded = false;
    this.atualFrame = null;
    this.running = false;
    this.runner = null;

    this.load = function(){
        this.image = new Image();
        $(this.image).attr("src",this.url);
        $(this.image).prop("id",this.id);
        var spr = this;
        $(this.image).load(function(){
            this.loaded = true;
            spr.width = this.width;
            spr.height = this.height;
        });
    };

    this.getAtualFrame = function(){
        if(this.running == false && this.atualFrame == null){
            return this.getFrame(0,0);
        }
        return this.atualFrame;
    };

    this.stop = function(){
        clearInterval(this.runner);
        this.running = false;
    };

    this.getFrame = function(row,col){
        if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
            if(this.frames[row] == undefined){
                this.frames[row] = new Array();
            }
            if(this.frames[row][col] == undefined){
                var img = this.image;
                console.log(this.width);
                console.log(this.height);
                var sw = this.width/this.cols;
                var sh = this.height/this.rows;
                var sx = sw*row;
                var sy = sh*col;
                console.log(this.height+'/'+col+'='+sy);

                this.frames[row][col] = new Frame(img,sx, sy, sw, sh);
            }
            return this.frames[row][col];
        }
        throw new Error('Linha ou coluna inválidos');
    };

    this.getFrameWidth = function(){
        return this.image.getWidth()/this.cols;
    };

    this.isLoaded = function(){
        return this.loaded;
    };

    this.getImage = function(){
        return this.image;
    };

    this.load();
}