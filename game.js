function didLoad(){
	var canvas = document.getElementById("canvas");
	var game = {};
	var draw = new Drawing(canvas.getContext("2d"));
	draw.render(game);
}	
