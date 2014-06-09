$(document).ready(function() {
	var jogo = new Jogo();
	var universo = jogo.getUniverso();
	var loader = new ImgLoader();
	loader.addImages('img/0045.png','img/0052.png','img/0078.png');
	loader.loadImages();
	loader.onLoad(function(){
		var images = loader.getImages();
		var imagem1 = images[0];
		var animacao = new Animacao(imagem1,4,4);
		animacao.setLinhaAtual(1);
		animacao.execute();
		setInterval(function(){
			universo.canvas.limparTela();
			universo.canvas.desenharImagem(imagem1);
		},10);
	});
});