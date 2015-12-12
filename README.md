Virtual-Physics
===============

Desenvolvimento de simulador de física

http://en.wikipedia.org/wiki/Second_moment_of_area


Instalação


para instalar utilize o bower

bower install https://github.com/pablohenrickdiniz/Virtual-Physics.git


utilização

utilize o requirejs para importar as classes necessárias, a configuração dos caminhos para essas classes está presente em paths.js

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



