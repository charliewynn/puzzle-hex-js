function didLoad(){
	document.documentElement.style.overflow = 'hidden';
	document.body.scroll = 'no';
	
	var canvas = document.getElementById("canvas");
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);

	var w = 4, h = 21;
	var params = location.href.split('?')[1];
	if(params) {
		params = params.split('&');
		w=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'w'; })[0] || ['',w])[1];
		h=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'h'; })[0] || ['',h])[1];
	}

	new Game(pt(w,h), canvas);
}

function Game(numHex, canvas){
	var size = pt(window.innerWidth, window.innerHeight);
	this.Hexs = generateHex(size, numHex);
	this.Draw = new Drawing(canvas, canvas.getContext('2d'));

	this.Draw.render(this);
}
