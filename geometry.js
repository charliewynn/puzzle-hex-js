function Hex(loc, ndx, size) {
	this.loc = loc;
	this.size = size;
	this.center = pt(loc.x+size.x/2, loc.y+size.y/2);
	this.ndx = ndx;
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
	return {
		x:x,
		y:y,
		z:z
	};
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
		hexSize = pt(proposedHexHeight*(1/hexRatio), proposedHexHeight);
	}
	else
	{
		console.log('limit height');
		hexSize = pt(proposedHexWidth, proposedHexWidth * hexRatio);
	}
	console.log("Hex Size: ", hexSize);
	var boardSize = pt(hexSize.x*(hex_cols*3-1)/2, hexSize.y*Math.ceil(hex_rows/2));
	console.log("boardSize", boardSize);
	var boardOffset = pt((size.x-boardSize.x)/2,(size.y-boardSize.y)/2);
	console.log(boardOffset);

	var hexs = [];
	for(var i=0; i<hex_cols; i++) {
		for(var j=0; j<hex_rows; j++) {
			var x = boardOffset.x + (hexSize.x+hexSize.x/2)*i;
			var y = boardOffset.y + (hexSize.y/2)*j;

			if(j%2==0)
				hexs.push(new Hex(pt(x,y), pt(i,j,0), hexSize));
			else if(i < hex_cols - 1)
				hexs.push(new Hex(pt(x+hexSize.x*3/4,y), pt(i,j,1), hexSize));
		}
	}
	return hexs;
}
