Virtual-Physics
===============

Desenvolvimento de simulador de física

http://en.wikipedia.org/wiki/Second_moment_of_area


Instalação


para instalar utilize o bower

bower install https://github.com/pablohenrickdiniz/Virtual-Physics.git


utilização

utilize o requirejs para importar as classes necessárias, a configuração dos caminhos para essas classes está presente em paths.js

/*paths.js*/

requirejs.config({
    "urlArgs": "bust=" + (new Date()).getTime(),
    "paths":{
        "Border":"js/draw/Border.min",
        "Canvas":"js/draw/Canvas.min",
        "Color":"bower_components/CanvasEngine/src/core/Color.min",
        "Imagem":"js/draw/Imagem.min",
        "LinearGradient":"js/draw/LinearGradient.min",
        "RadialGradient":"js/draw/RadialGradient.min",
        "Shadow":"js/draw/Shadow.min",
        "Game":"js/main/Game.min",
        "Body":"js/physics/Body.min",
        "Contact":"js/physics/Contact.min",
        "DistanceJoin":"js/physics/DistanceJoint.min",
        "Friction":"js/physics/Friction.min",
        "FrictionPhysics":"js/physics/FrictionPhysics.min",
        "Join":"js/physics/Joint.min",
        "Material":"js/physics/Material.min",
        "MouseBody":"js/physics/MouseBody.min",
        "MV":"js/physics/MV.min",
        "QuadTree":"js/physics/QuadTree.min",
        "RevolutionJoint":"js/physicis/RevolutionJoint.min",
        "SurfaceJoint":"js/physics/SurfaceJoint.min",
        "World":"js/physics/World.min",
        "Arc":"js/shapes/Arc.min",
        "Circle":"js/shapes/Circle.min",
        "Polygon":"js/shapes/Polygon",
        "Rect":"js/shapes/Rect.min",
        "Regular":"js/shapes/Regular.min",
        "Shape":"js/shapes/Shape.min",
        "Trapezius":"js/shapes/Trapezius.min",
        "Triangle":"js/shapes/Triangle.min",
        "jquery-tmp":"bower_components/jquery/dist/jquery.min",
        "jquery":"js/utils/jquery",
        "main":"js/main/main.min",
        "MouseReader":"bower_components/CanvasEngine/src/Reader/MouseReader.min",
        "KeyReader":"bower_components/CanvasEngine/src/Reader/KeyReader.min",
        "CanvasEngine":"bower_components/CanvasEngine/src/core/CanvasEngine.min",
        "CanvasLayer":"bower_components/CanvasEngine/src/core/CanvasLayer.min",
        "AppObject":"bower_components/CanvasEngine/src/core/AppObject.min",
        "Math":"bower_components/MathLib/src/Math.min",
        "GameEditor":"js/main/build/GameEditor",
        "ToolMenu":"bower_components/ReactElements/build/ToolMenu",
        "react":"bower_components/react/react.min",
        "InputNumberMixin":"bower_components/ReactElements/build/mixins/inputNumberMixin",
        "InputNumberVertical":"bower_components/ReactElements/build/InputNumberVertical",
        "SetIntervalMixin":"bower_components/ReactElements/build/mixins/setIntervalMixin",
        "chart":"bower_components/AdminLTE/plugins/chartjs/Chart.min",
        "lodash":"bower_components/lodash/lodash.min",
        "QuadTest":"js/main/build/QuadTest.min",
        "DebugElement":"js/debug/DebugElement.min",
        "reactDom":"bower_components/react/react-dom.min"
    },
    "shim":{
        "LinearGradient":{
            deps:["Color"]
        },
        "RadialGradient":{
            deps:["Color"]
        },
        "Game":{
            deps:['World','Canvas','MV']
        },
        "main":{
            deps:[
                'jquery',
                'GameEditor'
            ]
        },
        "Body":{
            deps:['Shape','Material','MV','FrictionPhysics','DebugElement']
        },
        "DistanceJoint":{
            deps:["Joint"]
        },
        "MouseBody":{
            deps:['Body','Material','Shape','MV','Rect']
        },
        "QuadTree":{
            deps:['Body','FrictionPhysics']
        },
        "World":{
            deps:['QuadTree','MV','FrictionPhysics']
        },
        "Arc":{
            deps:['Border','Shape']
        },
        "Circle":{
            deps:["Arc"]
        },
        "Polygon":{
            deps:['Shape','Color','Border','MV']
        },
        "Rect":{
            deps:['Polygon']
        },
        "Regular":{
            deps:['Polygon','MV']
        },
        "Shape":{
            deps:['Color']
        },
        "Trapezius":{
            deps:["Polygon"]
        },
        "Triangle":{
            deps:["Polygon"]
        },
        "KeyReader":{
            deps:["jquery"]
        },
        "MouseReader":{
            deps:["jquery"]
        },
        "jquery":{
            deps:["jquery-tmp"]
        },
        "FrictionPhysics":{
            deps:["MV",'Contact']
        },
        "Canvas":{
            deps:['MV','Body','Polygon','LinearGradient','RadialGradient','Color']
        },
        "CanvasEngine":{
            deps:['AppObject','Math','MouseReader','CanvasLayer']
        },
        "CanvasLayer":{
            deps:['jquery','AppObject']
        },
        "InputNumberVertical":{
            deps:["InputNumberMixin",'react']
        },
        "InputNumberMixin":{
            deps:["SetIntervalMixin",'react']
        },
        "GameEditor":{
            deps:['Game','react','ToolMenu','Rect','Math','Body','Material','Polygon']
        },
        "AppObject":{
            deps:["lodash"]
        },
        "QuadTest":{
            deps:['AppObject','Game']
        },
        "DebugElement":{
            deps:["jquery"]
        },
        "reactDom":{
            deps:["react"]
        }
    }
});

/*index.html*/
<script type="text/javascript" src="bower_components/requirejs/require.js"></script>


require(['paths'],function(){
    require(['jquery','Game'], function($,Game){
        $(document).ready(function(){
            var jogo = new Game({
              container:'#div'
            });
        });
    });
});

<body>
  <div id="container">
  </div>
</body>



