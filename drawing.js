function Drawing(canvas, context)
{
	this.canvas = canvas;
	this.context = context;
	this.render = function(game){
		this.canvas.width = this.canvas.width;
		for(h in game.hexs)
			this.hex(game.hexs[h], hexSize, colors.blue);
	};
	this.rectangle= function(pt1, pt2, color){
		this.context.beginPath();
		this.context.fillStyle = color;
		this.context.fillRect(pt1.x, pt1.y, pt2.x, pt2.y);
		this.context.closePath();
		this.context.fill();
	};
	this.hex = function(pt, size, color){
		var c = this.context;
		var x0 = pt.x;
		var x1 = pt.x + size.x/4;
		var x2 = pt.x + 3*size.x/4;
		var x3 = pt.x + size.x;

		var y0 = pt.y;
		var y1 = pt.y + size.y/2;
		var y2 = pt.y + size.y;
		var coords = 
			[
			[x1,y0],
			[x2,y0],
			[x3,y1],
			[x2,y2],
			[x1,y2],
			[x0,y1]
				];
		c.strokeStyle = color;
		c.beginPath();
		c.moveTo(coords[0][0],coords[0][1]);
		for(var i=1; i<coords.length; i++)
			c.lineTo(coords[i][0],coords[i][1]);
		c.closePath();
		c.stroke();
	}

};

var colors = {
	red : "rgba(255,0,0,1)",
	green: "rgba(34,139,34,1)",
	blue: "rgba(0,0,255,1)",
	black: "rgba(1,1,1,1)",
	white: "rgba(0,0,0,1)"
}
