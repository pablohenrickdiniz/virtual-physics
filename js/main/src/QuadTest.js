define(['AppObject','Game','chart','Rect','Regular','Body','Color','Material','QuadTree'],function(AppObject,Game,Chart,Rect,Regular,Body,Color,Material,QuadTree){
    var QuadTest = function(){
        var self = this;
        self.time = null;
        self.lastDate = null;
        self.game = null;
        self.chart = null;
        self.bodiesQtd = [0,10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200];
        self.datasets = [];
        self.medias = [];
        self.labels = [];
        self.atualSet = 0;
        self.bodiesTest = [];
        self.gameOptions = {
            container:'#canvas-a',
            loopCallback:function(){
                if(!self.lastDate) {
                    self.set({
                        lastDate:Date.now(),
                        time:0
                    });
                }
                else{
                    var now = Date.now();
                    var delta = now - self.lastDate;
                    self.set({
                        time: delta,
                        lastDate:now
                    });

                    var qtdBodies = self.bodiesTest.length;
                    var index = self.bodiesQtd.indexOf(qtdBodies);
                    if(index != -1){
                        self.datasets[self.atualSet].data[index] = self.time;
                    }
                }
            }
        };
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
            self.game = new Game(self.gameOptions);
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
        var wall_1 = new Body({
            shape:new Rect({
                width:80,
                height:500,
                center:[100,300]
            }),
            material:Material.Iron,
            dinamic:false
        });

        var wall_2 = new Body ({
            shape:new Rect({
                width:80,
                height:500,
                center:[600,300]
            }),
            material:Material.Iron,
            dinamic:false
        });

        var ground_1 = new Body ({
            shape:new Rect({
                width:580,
                height:80,
                center:[350,590]
            }),
            material:Material.Iron,
            dinamic:false
        });

        var label =  "dataset - max objects-"+max_objects+' - level -'+level;

        var dataset = {
            label: label,
            fillColor: "transparent",
            strokeColor: Color.random(),
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        };

        self.datasets.push(dataset);
        self.atualSet = self.datasets.length - 1;
        game.initialize(self.gameOptions);
        game.start();

        self.updateChart();
        game.getWorld().add(wall_1).add(wall_1).add(wall_2).add(ground_1);

        var interval = setInterval(function(){
            var square =new Body ({
                shape:new Rect({
                    width:10,
                    height:10,
                    center:[300,200]
                }),
                material:Material.Iron,
                dinamic:true
            });

            game.getWorld().add(square);
            self.bodiesTest.push(square);

            $("#obj-qtd").html('qtd: '+self.bodiesTest.length);

            if(game.getWorld().bodies.length > 220){
                clearInterval(interval);
                game.getWorld().clear();
                game.pause();
                self.bodiesTest = [];

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


                    var media = Math.round(sum/21);
                    self.medias[self.atualSet] = media;
                    self.labels[self.atualSet] = label;
                    console.log(self.labels[self.atualSet]+' checked. average time is '+media);

                    var min = null;
                    var index = null;
                    self.medias.forEach(function(media,pos){
                        if(min == null || min > media){
                            min = media;
                            index = pos;
                        }
                    });
                    $("#best").html('atual best is '+self.labels[index]);
                    self.test(max_objects,level);
                }
                else{
                    var min = null;
                    var index = null;
                    self.medias.forEach(function(media,pos){
                        if(min == null || min > media){
                            min = media;
                            index = pos;
                        }
                    });
                    console.log('best is '+self.labels[index]+' with average time '+min);
                }
            }
        },50);
    };

    QuadTest.prototype.initialize = function(){
        var self = this;
        self.test();
    };

    return new QuadTest();
});