function Geometry()
{
 this.Hex = function(loc, ndx, size) {
	this.loc = loc;
	this.size = size;
	this.center = new Point(loc.x+size.x/2, loc.y+size.y/2);
	this.ndx = ndx;
	this.neighbors = {};

	//returns an array of hexes this is part of a match of
	this.CheckMatch = function(matchStyle) {
		var matches = [];
		var color = this.color;
		var NeighborPairs =
			[
			 ['up', 'ur'],
			 ['ur', 'dr'],
			 ['dr', 'down'],
			 ['down', 'dl'],
			 ['dl', 'ul'],
			 ['ul', 'up']
			];
		for(var neighborPair in NeighborPairs) {
			var np = NeighborPairs[neighborPair];

		 	//is this neighbor pair worth checking?
			if(this.neighbors[np[0]] && this.neighbors[np[1]]) {
			 if(this.neighbors[np[0]].color == this.neighbors[np[1]].color &&
					this.neighbors[np[0]].color == color) {
				//start of group found!
				console.log('Group Found');
			 }

			}
		}
	}
 }


 this.GenerateHex = function(size, numHex) {
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

	log("Canvas Size: ", size);
	log(proposedHexWidth, proposedHexHeight);

	//ratio for a hexagon
	var hexRatio = .866;//76/90;
	//var hexSize = Point(90,76);

	//using proposed width puts us over height
	if(proposedHexWidth * hexRatio > proposedHexHeight){
	 log('limit width');
	 hexSize = new Point(proposedHexHeight*(1/hexRatio), proposedHexHeight);
	}
	else
	{
	 log('limit height');
	 hexSize = new Point(proposedHexWidth, proposedHexWidth * hexRatio);
	}
	log("Hex Size: ", hexSize);
	var boardSize = new Point(hexSize.x*(hex_cols*3-1)/2, hexSize.y*Math.ceil(hex_rows/2));
	log("boardSize", boardSize);
	var boardOffset = new Point((size.x-boardSize.x)/2,(size.y-boardSize.y)/2);
	log(boardOffset);

	var hexs = [];
	var hexPlots = [];
	for(var i=0; i<hex_cols; i++) {
	 hexPlots[i] = [];
	 for(var j=0; j<hex_rows; j++) {
		var x = boardOffset.x + (hexSize.x+hexSize.x/2)*i;
		var y = boardOffset.y + (hexSize.y/2)*j;

		if(j%2==0) {
		 var hex = new this.Hex(new Point(x,y), new Point(i,j,0), hexSize);
		 hexs.push(hex);
		 hexPlots[i][j] = hex
		}
		else if(i < hex_cols - 1) {
		 var hex = new this.Hex(new Point(x+hexSize.x*3/4,y), new Point(i,j,1), hexSize);
		 hexs.push(hex);
		 hexPlots[i][j] = hex;
		}
	 }
	}

	//let's go through each hex, and if it's close to another hex we'll add it as a neighbor
	for(var hex in hexs) {
	 var ndx = hexs[hex].ndx;

	 var up = ['up', ndx.x, ndx.y - 2];
	 var down = ['down', ndx.x, ndx.y + 2];

	 var ur = ['ur', ndx.x + ndx.z, ndx.y - 1];
	 var dr = ['dr', ndx.x + ndx.z, ndx.y + 1];

	 var ul = ['ul', ndx.x - (1 - ndx.z), ndx.y - 1];
	 var dl = ['dl', ndx.x - (1 - ndx.z), ndx.y + 1];

	 var neighbors = [up, down, ur, dr, ul, dl];

	 for(var n in neighbors) {
		n = neighbors[n];
		if(hexPlots[n[1]] && hexPlots[n[1]][n[2]])
		 hexs[hex].neighbors[n[0]] = hexPlots[n[1]][n[2]];
	 }
	}
	for(var hex in hexs){
	 var hex = hexs[hex];
	 var neighborColors = {};
	 var colorArr = Object.getOwnPropertyNames(hexColors);
	 for(var c in colorArr) {
		neighborColors[hexColors[colorArr[c]]] = 0;
	 }
	 for(var n in hex.neighbors) {
		neighborColors[hex.neighbors[n].color]++;
	 }
	 var randomColor = undefined;
	 var doubleULColor = undefined;
	 var doubleDLColor = undefined;
	 var doubleUPColor = undefined;

	 if(hex.neighbors.up) {
		if(hex.neighbors.up.neighbors.up) {
		 if(hex.neighbors.up.color == hex.neighbors.up.neighbors.up.color) {
			doubleUPColor = hex.neighbors.up.color;
		 }
		}
	 }
	 if(hex.neighbors.dl) {
		if(hex.neighbors.dl.neighbors.dl) {
		 if(hex.neighbors.dl.color == hex.neighbors.dl.neighbors.dl.color) {
			doubleDLColor = hex.neighbors.dl.color;
		 }
		}
	 }
	 if(hex.neighbors.ul) {
		if(hex.neighbors.ul.neighbors.ul) {
		 if(hex.neighbors.ul.color == hex.neighbors.ul.neighbors.ul.color) {
			doubleULColor = hex.neighbors.ul.color;
		 }
		}
	 }
	 while(randomColor == undefined ||
		neighborColors[randomColor] >=2 ||
		doubleULColor == randomColor ||
		doubleUPColor == randomColor ||
		doubleDLColor == randomColor) {
		randomColor = hexColors[colorArr[Math.floor(Math.random()*colorArr.length)]];
	 }
	 hex.color = randomColor;
	}
	return hexs;
 }
 function log() {
	//console.log.apply(null,arguments);
 }
 var hexColors = {
	red : "rgba(255,0,0,1)",
	green : "rgba(34,139,34,1)",
	blue : "rgba(0,0,255,1)",
	black : "rgba(0,0,0,1)",
	white : "rgba(255,255,255,1)",
	yellow : "rgba(200,200,0,1)"
 };
}

function Point() {
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
Point.prototype.join = function(s) {
 if(this.z===undefined)
	return [this.x, this.y].join(s);
 return [this.x, this.y, this.z].join(s);
}
Point.prototype.dist =  function(p2) {
 if(this.z !== undefined || p2.z !== undefined)
	console.log("Tried to dist 3d point");
 return Math.sqrt(Math.pow(p2.x - this.x,2) + Math.pow(p2.y - this.y,2));
}
