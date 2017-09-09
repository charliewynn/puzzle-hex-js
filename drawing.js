function Drawing(size, context)
{
	this.size = size;
	this.boardOffset = pt(0,0);
	this.boardSize = pt(this.size.x-this.boardOffset.x*2, this.size.y-this.boardOffset.y*2);
	this.context= context;
	this.render = function(game){
		this.rectangle(pt(0,0), this.size, colors.blue);
		this.rectangle(this.boardOffset, this.boardSize, colors.green);
		var hexSize = pt(90,76);

		var hex_cols = Math.floor(this.boardSize.x/(3*hexSize.x/2));
		var hex_rows = Math.floor((this.boardSize.y-hexSize.y/2)/(.5*hexSize.y));
	 console.log(hex_cols + " cols, " + hex_rows + " rows");
		var hexWidth = hex_cols * (3*hexSize.x/2) - hexSize.x/2;
		var hexHeight = hex_rows * ((hexSize.y*.5)+1) + hexSize.y/2;
		var hexOffset =
									pt((this.boardSize.x-hexWidth)/2,
													(this.boardSize.y-hexHeight)/2);

		this.rectangle(this.boardOffset,pt(hexOffset.x/2, this.boardSize.y), colors.blue);
		this.rectangle(pt(this.boardSize.x-hexOffset.x/2, this.boardOffset.y),this.boardSize, colors.blue);

		for(var i=0; i<hex_cols; i++){
			for(var j=0; j<hex_rows; j++){
				var x = hexOffset.x + (hexSize.x+hexSize.x/2)*i;
				var y = hexOffset.y + (hexSize.y/2)*j;
				if(j%2==1){
					x += 3*hexSize.x/4;
					if(i != hex_cols-1)
						this.hex(pt(x,y), hexSize, colors.blue);
				}
				else {
					this.hex(pt(x,y), hexSize, colors.blue);
				}
			}
		}
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
