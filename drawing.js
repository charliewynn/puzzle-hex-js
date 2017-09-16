function Drawing(canvas, context)
{
	var ver = '0.05';
	var canvas = canvas;
	var context = context;
	this.render = function(Hexs, debug){
		canvas.width = canvas.width;
		this.drawText(new Point(2,16), ver, 'black', '14px sans-serif');
		for(h in Hexs)
			this.hex(Hexs[h], hexSize, !Hexs[h].hideColor, debug);
		context.beginPath();
		context.fillStyle = colors.black;
		context.lineWidth=2;
		context.strokeStyle=colors.white;
		context.moveTo(0, canvas.height-85);
		context.lineTo(canvas.width,canvas.height-85);
		context.closePath();
		context.stroke();
		var HexColors = Object.getOwnPropertyNames(hexColors);
		var menuHexSize = new Point(80/.866, 80);
		var totalWidth = menuHexSize.x * (HexColors.length + 1);
		var margin = (canvas.width - totalWidth)/2;
		for(var i=0; i<HexColors.length; i++)
		{
			var hexRatio = .866;//76/90;
			this.hex(new fakeHex(new Point(margin + i*(menuHexSize.x), canvas.height - menuHexSize.y), menuHexSize, HexColors[i], colors[i]), menuHexSize, true, false);
		}
		this.hex(new fakeHex(new Point(margin + HexColors.length*menuHexSize.x, canvas.height - menuHexSize.y), menuHexSize, 'purple'), menuHexSize, true, false);
		
	};
	this.Renderer = function(Hexs, debug) {
		var _this = this;
		return function() {
			_this.render(Hexs, debug);
		}
	};
	this.circle = function(loc, radius, color) {
		context.beginPath();
		context.fillStyle = color;
		context.arc(loc.x, loc.y, radius, 0, Math.PI*2, false);
		context.closePath();
		context.fill();
	};
	this.rectangle = function(pt1, pt2, color){
		context.beginPath();
		context.fillStyle = color;
		context.fillRect(pt1.x, pt1.y, pt2.x, pt2.y);
		context.closePath();
		context.fill();
	};
	this.hex = function(hex, size, showColor, debug){
		var c = context;
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
			c.fillStyle = colors.white;
			c.fill();
		}

		if(showColor){
			this.circle(hex.center, hex.size.y*.6/2+1, colors.black);
			this.circle(hex.center, hex.size.y*.6/2, hex.color);
		}
		if(hex.highlight) {
			this.circle(hex.center, hex.size.y*.1*hex.highlight/2+1, colors.black);
			this.circle(hex.center, hex.size.y*.1*hex.highlight/2, hex.color);
			hex.highlight--;
			if(hex.highlight == 0) delete hex.highlight;
		}

		if(debug)
			this.centerText(hex.center, hex.ndx.join(' '), hex.color == hexColors.black ? 'white' : 'black');

	};
	this.centerText = function(loc, text, color, font)
	{
		var oldAlign = context.textAlign;
		context.textAlign = 'center';
		context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;

		context.fillStyle = color;
		context.font = typeof font == 'undefined' ? 'italic bold 15px sans-serif' : font;
		context.textBaseline = 'middle';
		context.fillText(text, loc.x, loc.y);
		context.textAlign = oldAlign;
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

		context.fillStyle = colors.white;
		context.lineWidth = 3;
		context.fillText(text, loc.x, loc.y);

		context.strokeText(text, loc.x, loc.y);

	};
};
var colors = {
	red : "rgba(255,0,0,1)",
	green : "rgba(34,139,34,1)",
	blue : "rgba(0,0,255,1)",
	black : "rgba(0,0,0,1)",
	white : "rgba(255,255,255,1)",
	yellow : "rgba(200,200,0,1)"
}
