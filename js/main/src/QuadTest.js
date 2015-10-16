define(['AppObject','Game','chart','Rect','Regular','Body','Color','Material','QuadTree'],function(AppObject,Game,Chart,Rect,Regular,Body,Color,Material,QuadTree){
    var QuadTest = function(){
        var self = this;
        self.fps = null;
        self.lastDate = null;
        self.game = null;
        self.chart = null;
        self.bodiesQtd = [0,50,100,150,200,250,300,350,400,450,500];
        self.datasets = [];
        self.medias = [];
        self.labels = [];
        self.atualSet = 0;
    };

    QuadTest.prototype = new AppObject;

    QuadTest.prototype.getChart = function(){
        var self = this;
        if(self.chart == null){
            var ctx = $("#chart")[0].getContext("2d");
            var chart = Chart.noConflict();
            self.chart = new chart(ctx);
        }
        return self.chart;
    };

    QuadTest.prototype.updateChart = function(){
        var self = this;
        self.getChart().Line({
            labels:self.bodiesQtd,
            datasets:self.datasets
        })
    };

    QuadTest.prototype.getGame = function(){
        var self = this;
        if(self.game == null){
            self.game = new Game({
                container:'#canvas-a',
                loopCallback:function(){
                    if(!self.lastDate) {
                        self.set({
                            lastDate:Date.now()
                        });
                    }
                    else{
                        var delta = (new Date().getTime() - self.lastDate)/1000;
                        self.set({
                            fps: 1/delta,
                            lastDate: Date.now()
                        });

                        var qtdBodies = self.game.getWorld().bodies.length;
                        var index = self.bodiesQtd.indexOf(qtdBodies);
                        if(index != -1){
                            self.datasets[self.atualSet].data[index] = self.fps;
                            self.updateChart();
                        }
                    }
                }
            });
        }
        return self.game;
    };

    QuadTest.prototype.test = function(max_objects,level){
        var self = this;
        max_objects = max_objects == undefined?1:max_objects;
        level = level == undefined?1:level;

        QuadTree.maxl = level;
        QuadTree.maxo = max_objects;

        var game = self.getGame();
        var wall_1 =new Body (new Rect({
            width:80,
            height:500,
            center:[100,300]
        }),Material.Iron,false);

        var wall_2 = new Body (new Rect({
            width:80,
            height:500,
            center:[600,300]
        }),Material.Iron,false);

        var ground_1 = new Body (new Rect({
            width:580,
            height:80,
            center:[350,590]
        }),Material.Iron,false);
        var label =  "dataset - max objects-"+max_objects+' - level -'+level;

        var dataset = {
            label: label,
            fillColor: "transparent",
            strokeColor: Color.random(),
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0,0,0,0,0,0,0,0,0,0,0]
        };

        self.datasets.push(dataset);
        self.atualSet = self.datasets.length - 1;
        game.start();


        game.getWorld().add(wall_1).add(wall_1).add(wall_2).add(ground_1);

        var interval = setInterval(function(){
            var square =new Body (new Rect({
                width:10,
                height:10,
                center:[300,200]
            }),Material.Iron,true);



            game.getWorld().add(square);
            if(game.getWorld().bodies.length == 500){
                clearInterval(interval);
                game.getWorld().clear();
                game.pause();

                level++;
                if(level > 5){
                    level = 1;
                    max_objects+=1;
                }
                if(max_objects <= 5){
                    var sum = 0;
                    self.datasets[self.atualSet].data.forEach(function(value){
                        sum+= value;
                    });
                    self.medias[self.atualSet] = sum/self.datasets[self.atualSet].data.length;
                    self.labels[self.atualSet] = label;
                    console.log(self.labels[self.atualSet]+' checked');
                    self.test(max_objects,level);
                }
                else{
                    var max = null;
                    var index = null;
                    self.medias.forEach(function(media,pos){
                        if(max == null || max < media){
                            max = media;
                            index = pos;
                        }
                    });
                    console.log('best is '+self.labels[index]);
                }
            }
        },100);
    };

    QuadTest.prototype.initialize = function(){
        var self = this;
        self.test();
    };

    return new QuadTest();
});