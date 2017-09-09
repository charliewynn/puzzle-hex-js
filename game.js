function didLoad(){
	document.documentElement.style.overflow = 'hidden';
	document.body.scroll = 'no';
	var size = pt(window.innerWidth, window.innerHeight);
	
	var canvas = document.getElementById("canvas");
	canvas.setAttribute('width', size.x);
	canvas.setAttribute('height', size.y);
	var game = {};
	var draw = new Drawing(size, canvas.getContext("2d"));
	draw.render(game);
}	
