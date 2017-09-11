function Drawing(canvas, context)
{
	this.canvas = canvas;
	this.context = context;
	this.colors = new colors();
	this.render = function(game){
		this.canvas.width = this.canvas.width;
		for(h in game.Hexs)
			this.hex(game.Hexs[h], hexSize);

		if(game.swapping) {
			this.hex(game.lastSelected, hexSize, this.colors.yellow);
			this.hex(game.nextSelected, hexSize, this.colors.yellow);
		}
	};
	this.circle = function(loc, radius, color) {
		this.context.beginPath();
		this.context.fillStyle = color;
		this.context.arc(loc.x, loc.y, radius, 0, Math.PI*2, false);
		this.context.closePath();
		this.context.fill();
	};
	this.rectangle = function(pt1, pt2, color){
		this.context.beginPath();
		this.context.fillStyle = color;
		this.context.fillRect(pt1.x, pt1.y, pt2.x, pt2.y);
		this.context.closePath();
		this.context.fill();
	};
	this.hex = function(hex, size, color){
		var c = this.context;
		var x0 = hex.loc.x;
		var x1 = hex.loc.x + size.x/4;
		var x2 = hex.loc.x + 3*size.x/4;
		var x3 = hex.loc.x + size.x;

		var y0 = hex.loc.y;
		var y1 = hex.loc.y + size.y/2;
		var y2 = hex.loc.y + size.y;
		var coords = 
			[
			[x1,y0],
			[x2,y0],
			[x3,y1],
			[x2,y2],
			[x1,y2],
			[x0,y1]
				];

		c.beginPath();
		c.moveTo(coords[0][0],coords[0][1]);
		for(var i=1; i<coords.length; i++)
			c.lineTo(coords[i][0],coords[i][1]);
		c.closePath();
		c.stroke();

		if(hex.selected) {
			c.fillStyle = this.colors.white;
			c.fill();
		}
		//c.fill();

		//this.centerText(hex.center, 'X', this.colors.red);
		this.circle(hex.center, hex.size.y*.6/2+1, this.colors.black);
		this.circle(hex.center, hex.size.y*.6/2, color || hex.color);
		var textColor = this.colors.white;
		if(~[this.colors.white, this.colors.yellow].indexOf(hex.color)) textColor = this.colors.black;

		//this.centerText(hex.center, hex.ndx.join(' '), textColor);

	};
	this.centerText = function(loc, text, color, font)
	{
		var oldAlign = this.context.textAlign;
		this.context.textAlign = 'center';
		this.context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;

		this.context.fillStyle = color;
		this.context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;
		this.context.textBaseline = 'middle';
		this.context.fillText(text, loc.x, loc.y);
		this.context.textAlign = oldAlign;
	}
	this.drawText = function(loc, text, color, font)
	{
		context.fillStyle = color;
		context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;
		context.textBaseline = 'bottom';
		context.fillText(text, loc.x, loc.y);
	};
	this.strokeText = function(loc, text, color, font)
	{
		context.strokeStyle = color;
		context.font = typeof font == 'undefined' ? 'bold 15px sans-serif' : font;
		context.lineWidth = 9;
		context.textBaseline = 'bottom';

		context.fillStyle = this.colors.white;
		context.lineWidth = 3;
		context.fillText(text, loc.x, loc.y);

		context.strokeText(text, loc.x, loc.y);

	};
};
function colors() {
	this.red = "rgba(255,0,0,1)";
	this.green = "rgba(34,139,34,1)";
	this.blue = "rgba(0,0,255,1)";
	this.black = "rgba(0,0,0,1)";
	this.white = "rgba(255,255,255,1)";
	this.yellow = "rgba(200,200,0,1)";
}

