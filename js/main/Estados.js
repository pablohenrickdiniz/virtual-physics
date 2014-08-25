function Estados() {
}

var Corpo = Objetos.player.corpo;

var me = new Estado('me', corpo, Animacoes.player['me']);
var md = new Estado('md', corpo, Animacoes.player['md']);
var ma = new Estado('ma', corpo, Animacoes.player['ma']);
var mb = new Estado('mb', corpo, Animacoes.player['mb']);
var pe = new Estado('pe', corpo, Animacoes.player['me']);
var pd = new Estado('pd', corpo, Animacoes.player['md']);
var pa = new Estado('pa', corpo, Animacoes.player['ma']);
var pb = new Estado('pb', corpo, Animacoes.player['mb']);

me.onInit(function(){
	this.objeto.setVetor(new Vetor(-20,0));
});

md.onInit(function(){
	this.objeto.setVetor(new Vetor(20,0));
});

ma.onInit(function(){
	this.objeto.setVetor(new Vetor(0,-20));
});

mb.onInit(function(){
	this.objeto.setVetor(new Vetor(0, 20));
});

var stop = function(){
	this.objeto.setVetor(new Vetor(0,0));
};

pe.onInit(stop);
pd.onInit(stop);
pa.onInit(stop);
pb.onInit(stop);

Estados.player = {
	'me' : me,
	'md' : md,
	'ma' : ma,
	'mb' : mb,
	'pe' : pe,
	'pd' : pd,
	'pa' : pa,
	'pb' : pb
};