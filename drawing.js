function Drawing(canvas, context)
{
	this.canvas = canvas;
	this.context = context;
	this.colors = new colors();
	this.ClearCountDown = 0;
	this.toBeCleared = [];
	this.render = function(game){
		if(this.ClearCountDown > 0) this.ClearCountDown--;
		this.canvas.width = this.canvas.width;
		for(h in game.Hexs)
			this.hex(game.Hexs[h], hexSize, this.toBeCleared.indexOf(game.Hexs[h]) < 0, game.debug);

		if(this.ClearCountDown == 1) {
			var nextToBeCleared = [];
			for(var h in this.toBeCleared) {
				var hex = this.toBeCleared[h];
				if(hex.swap){
					var swpColor = hex.color;
					hex.color = hex.swap.color;
					hex.swap.color = swpColor;
					delete hex.swap;
				}
				else if(hex.next) {
					hex.color = hex.next.color;
					nextToBeCleared.push(hex.next);
					delete hex.next;
				}
				else if(hex.neighbors.up){
					//has up neighbor, but must have been marked
					if(!hex.neighbors.up.next) hex.next = hex.neighbors.up
					nextToBeCleared.push(hex);
				}
				else {
					if(!hex.neighbors.down.next) hex.color = randomHexColor();
				}
			}
			this.toBeCleared = nextToBeCleared;
			if(this.toBeCleared.length)
			{
				this.ClearCountDown = 6;}
		} else if (this.ClearCountDown == 0) {
			//we're done swapping, time to check for 'free' groups
			var FoundMatch = false;
			for(var h in game.Hexs) {
				FoundMatch = game.Hexs[h].CheckMatch() || FoundMatch;
			}
			if(FoundMatch) {

				game.Draw.ClearCountDown = 7;
				for(var h in game.Hexs) {
					var hex = game.Hexs[h];
					if(hex.marked) {
						this.toBeCleared.push(hex);
						var upN = hex.neighbors.up;
						if(upN && !upN.marked) hex.next = upN;
					}
				}
				for(var h in this.toBeCleared) {
					delete this.toBeCleared[h].marked;
				}
			}

		}
		//if we're done doing matches...
		if(this.ClearCountDown == 0) {
			//check for useable moves
			if(!game.Geometry.CheckForMoves(game.Hexs)) {
				alert("game over");
			}
			this.ClearCountDown --;
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
	this.hex = function(hex, size, showColor, debug){
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

		if(showColor){
			this.circle(hex.center, hex.size.y*.6/2+1, this.colors.black);
			this.circle(hex.center, hex.size.y*.6/2, hex.color);
		}
		if(hex.highlight) {
			this.circle(hex.center, hex.size.y*.1*hex.highlight/2+1, this.colors.black);
			this.circle(hex.center, hex.size.y*.1*hex.highlight/2, hex.color);
			hex.highlight--;
			if(hex.highlight == 0) delete hex.highlight;
		}
		
		if(debug)
			this.centerText(hex.center, hex.ndx.join(' '), hex.color == hexColors.black ? 'white' : 'black');

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
