function Hex(loc, ndx, size) {
	this.loc = loc;
	this.size = size;
	this.center = new pt(loc.x+size.x/2, loc.y+size.y/2);
	this.ndx = ndx;
	var Colors = Object.getOwnPropertyNames(new colors());
	this.color = new colors()[Colors[Math.floor(Math.random()*Colors.length)]];
}
pt.prototype.join = function(s){
	if(this.z == 'undefined')
		return [this.x, this.y].join(s);
	return [this.x, this.y, this.z].join(s);
}

function pt(){
	var x,y,z;
	if(arguments.length >= 2){
		x = arguments[0];
		y = arguments[1];
		z = arguments[2];
	}
	if(arguments.length == 1) {
		x = arguments[0][0];
		y = arguments[0][1];
		z = arguments[0][2];
	}
	this.x = x;
	this.y = y;
	this.z = z;
}

pt.prototype.dist = function(v2)
{
	return Math.sqrt(Math.pow(v2.x - this.x,2) + Math.pow(v2.y - this.y,2));
}

function generateHex(size, numHex){
	//I want this many rows/cols
	var hex_rows = numHex.y;
	var hex_cols = numHex.x;

	//I count every other column column,
	//and every other row
	//So I want an odd number of columns
	//but any number of rows is fine

	//max side-by-side I can put hexagons
	var proposedHexWidth = size.x/(hex_cols*3-1)*2;


	//max hexagons I can stack
	var proposedHexHeight = size.y/(hex_rows/2+.5);

	console.log("Canvas Size: ", size);
	console.log(proposedHexWidth, proposedHexHeight);


	//ratio for a hexagon
	var hexRatio = .866;//76/90;
	//var hexSize = pt(90,76);

	//using proposed width puts us over height
	if(proposedHexWidth * hexRatio > proposedHexHeight){
		console.log('limit width');
		hexSize = new pt(proposedHexHeight*(1/hexRatio), proposedHexHeight);
	}
	else
	{
		console.log('limit height');
		hexSize = new pt(proposedHexWidth, proposedHexWidth * hexRatio);
	}
	console.log("Hex Size: ", hexSize);
	var boardSize = new pt(hexSize.x*(hex_cols*3-1)/2, hexSize.y*Math.ceil(hex_rows/2));
	console.log("boardSize", boardSize);
	var boardOffset = new pt((size.x-boardSize.x)/2,(size.y-boardSize.y)/2);
	console.log(boardOffset);

	var hexs = [];
	for(var i=0; i<hex_cols; i++) {
		for(var j=0; j<hex_rows; j++) {
			var x = boardOffset.x + (hexSize.x+hexSize.x/2)*i;
			var y = boardOffset.y + (hexSize.y/2)*j;

			if(j%2==0)
				hexs.push(new Hex(new pt(x,y), new pt(i,j), hexSize));
			else if(i < hex_cols - 1)
				hexs.push(new Hex(new pt(x+hexSize.x*3/4,y), new pt(i,j), hexSize));
		}
	}
	return hexs;
}
