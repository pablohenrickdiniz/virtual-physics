<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <title>Simulação</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/bootstrap.min.css"/>
    <script type="text/javascript" src="js/utils/jquery.min.js"></script>
    <script type="text/javascript" src="js/utils/bootstrap.min.js"></script>
</head>
<body>
<div class="row container-fluid">
    <div class="col-md-12">
        <canvas id="game" width="640px" height="480px">
        </canvas>
    </div>
</div>
<div class="row">
    <div class="col-md-12">
        <input id="action" type="button" class="btn btn-info" value="executar/pausar"/>
     </div>
</div>
<script type="text/javascript" src="js/utils/MouseReader.js"></script>
<script type="text/javascript" src="js/draw/Color.js"></script>
<script type="text/javascript" src="js/draw/RadialGradient.js"></script>
<script type="text/javascript" src="js/draw/LinearGradient.js"></script>
<script type="text/javascript" src="js/draw/Canvas.js"></script>
<script type="text/javascript" src="js/draw/Border.js"></script>
<script type="text/javascript" src="js/shapes/Shape.js"></script>
<script type="text/javascript" src="js/shapes/Polygon.js"></script>
<script type="text/javascript" src="js/shapes/Regular.js"></script>
<script type="text/javascript" src="js/shapes/Trapezius.js"></script>
<script type="text/javascript" src="js/shapes/Rect.js"></script>
<script type="text/javascript" src="js/physics/MV.js"></script>
<script type="text/javascript" src="js/physics/Body.js"></script>
<script type="text/javascript" src="js/physics/World.js"></script>
<script type="text/javascript" src="js/physics/friction_physics.js"></script>
<script type="text/javascript" src="js/main/Game.js"></script>
<script type="text/javascript" src="js/main/main.js"></script>
</body>