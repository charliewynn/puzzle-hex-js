function didLoad(){
	document.documentElement.style.overflow = 'hidden';
	document.body.scroll = 'no';
	var size = pt(window.innerWidth, window.innerHeight);
	
	var canvas = document.getElementById("canvas");
	canvas.setAttribute('width', size.x);
	canvas.setAttribute('height', size.y);

	var w = 4;
	var h = 21;
	var params = location.href.split('?')[1];
	if(params) {
		params = params.split('&');
		w=params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'w'; })[0][1];
		h=params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'h'; })[0][1];
	}

	loadNewHexs(size, pt(w,h), canvas);
}	

function loadNewHexs(size, numHex, canvas, lastAdded){
	var game = {};

	game.hexs = generateHex(size, numHex);
	var draw = new Drawing(canvas, canvas.getContext("2d"));
	draw.render(game);


	return;
	setTimeout(function(){
		lastAdded = lastAdded == 'x' ? 'y' : 'x';
		var i = lastAdded == 'x' ? 1 : 2;

		if(numHex.x+numHex.y > 60)
			numHex[lastAdded] -= i;
		else
			numHex[lastAdded] += i;

		loadNewHexs(size, numHex, canvas, lastAdded);

	}, 500);
}
