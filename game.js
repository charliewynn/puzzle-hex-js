function didLoad(){
	document.documentElement.style.overflow = 'hidden';
	document.body.scroll = 'no';
	var size = pt(window.innerWidth, window.innerHeight);
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	console.log("dpr = " + window.devicePixelRatio);
	alert("dpr = " + window.devicePixelRatio);
	if(window.devicePixelRatio == 2){
		console.log("did 2x");
		size.x /=2;
		size.y /=2;
		context.scale(2,2);
	}
	canvas.setAttribute('width', size.x);
	canvas.setAttribute('height', size.y);
	var game = {};
	var draw = new Drawing(size, context);
	draw.render(game);
}	
