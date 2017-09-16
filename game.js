function didLoad(){
	document.documentElement.style.overflow = 'hidden';
	document.body.scroll = 'no';
	if(navigator.userAgent.match(/Android/i)){
		window.scrollTo(0,1);
	}

	var canvas = document.getElementById("canvas");
	canvas.setAttribute('width', window.innerWidth);
	canvas.setAttribute('height', window.innerHeight);

	var w = 4, h = 21;
	var debug = location.href.indexOf('file://') === 0;
	var params = location.href.split('?')[1];
	if(params) {
		params = params.split('&');
		w=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'w'; })[0] || ['',w])[1];
		h=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'h'; })[0] || ['',h])[1];
		debug=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'd'; })[0] || ['',false])[1];
	}

	if(debug) {
		window.game = new Game(w, h, canvas);
		window.game.debug = true;
	} else {
		new Game(w,h,canvas);
	}
}

function Game(width, height, canvas){
	var game = this;
	game.ver = '0.04';

	this.Geometry = new Geometry();
	var size = new Point(window.innerWidth, window.innerHeight);
	this.Hexs = this.Geometry.GenerateHex(size, new Point(width, height));
	this.Draw = new Drawing(canvas, canvas.getContext('2d'));

	var ClearCountDown = 0;
	var toBeCleared = [];

	setInterval(this.Draw.Renderer(this), 20);
	this.tick = function() {
		if(ClearCountDown > 0) ClearCountDown--;
		if(ClearCountDown == 1) {
			var nextToBeCleared = [];
			for(var h in toBeCleared) {
				var hex = toBeCleared[h];
				hex.hideColor = false;
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
			toBeCleared = nextToBeCleared;
			if(toBeCleared.length)
			{
				ClearCountDown = 3;
				for(var h in toBeCleared) {
					toBeCleared[h].hideColor = true;					
				}
			}
		} else if (ClearCountDown == 0) {
			//we're done swapping, time to check for 'free' groups
			var FoundMatch = false;
			for(var h in game.Hexs) {
				FoundMatch = game.Hexs[h].CheckMatch() || FoundMatch;
			}
			if(FoundMatch) {

				ClearCountDown = 7;
				for(var h in game.Hexs) {
					var hex = game.Hexs[h];
					if(hex.marked) {
						toBeCleared.push(hex);
						var upN = hex.neighbors.up;
						if(upN && !upN.marked) hex.next = upN;
					}
				}
				for(var h in toBeCleared) {
					delete toBeCleared[h].marked;
				}
			}

		}
		//if we're done doing matches...
		if(ClearCountDown == 0) {
			//check for useable moves
			if(!game.Geometry.CheckForMoves(game.Hexs)) {
				alert("game over");
			}
			ClearCountDown --;
		}
		//console.log('tick');
	}
	setInterval(this.tick,20);

	this.MouseDown = function(e) {
		if(ClearCountDown > 0) return;
		var clickPoint = new Point(getCursorPosition(e));
		var closestHex;
		var closestDist = 1000;

		for(var hex in this.Hexs) {
			var dist = this.Hexs[hex].center.dist(clickPoint);
			if(dist < closestDist && dist < this.Hexs[hex].size.y) {
				closestDist = dist;
				closestHex = this.Hexs[hex];
			}
		}

		if(!closestHex || closestHex.selected) {
			if(this.selectedHex){
				this.selectedHex.selected = false;
				this.selectedHex = undefined;
			}
			return;
		}

		if(this.selectedHex) {
			if(closestHex.center.dist(this.selectedHex.center) < (closestHex.size.y * 1.5)) {

				var swpColor = closestHex.color;
				closestHex.color = this.selectedHex.color;
				this.selectedHex.color = swpColor;
				//swapped
				//check if valid
				var anyMatches = closestHex.CheckMatch();
				anyMatches = this.selectedHex.CheckMatch() || anyMatches;
				if(!anyMatches) {
					closestHex.swap = this.selectedHex;
					this.selectedHex.swap = closestHex;
					toBeCleared.push(closestHex);
				}

				ClearCountDown = 7;
				for(var h in this.Hexs) {
					var hex = this.Hexs[h];
					if(hex.marked) {
						toBeCleared.push(hex);
						var upN = hex.neighbors.up;
						if(upN && !upN.marked) hex.next = upN;
						//hex.color = 'purple';
					}
				}
				for(var h in toBeCleared) {
					delete toBeCleared[h].marked;
				}
				delete hex.marked
					//otherwise undo

					this.selectedHex.selected = false;
				this.selectedHex = undefined;
				return;
			}
		}
		if(this.selectedHex) {
			this.selectedHex.selected = false;
			this.selectedHex = undefined;
		}
		closestHex.selected = true;
		this.selectedHex = closestHex;

	}
	this.MouseMove = function(e) {
	}
	this.MouseUp = function(e) {

	}
	this.TouchHandler = function(e) {
		return;
		var touches = event.changedTouches,
			first = touches[0],
			type = "";

		switch(event.type)
		{
			case "touchstart": type = "mousedown"; break;
			case "touchmove":  type="mousemove"; break;
			case "touchend":   type="mouseup"; break;
			default: return;
		}

		var simulatedEvent = document.createEvent("MouseEvent");
		simulatedEvent.initMouseEvent(type, true, true, window, 1, 
				first.screenX, first.screenY, 
				first.clientX, first.clientY, false, 
				false, false, false, 0, null);

		first.target.dispatchEvent(simulatedEvent);
	}
	canvas.addEventListener('mousedown', makeListener(this, this.MouseDown), false);

	document.addEventListener("touchstart", makeListener(this, this.TouchHandler), true);
	function makeListener(self, listener) {
		return function(e) {
			return listener.call(self, e);
		}
	}
}


function getCursorPosition(e) {
	var x, y;
	if (e.pageX || e.pageY)
	{
		x = e.pageX;
		y = e.pageY;
	}
	else {
		x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}

	return [x,y];
}

function touchHandler(event)
{
	var touches = event.changedTouches,
		first = touches[0],
		type = "";

	switch(event.type)
	{
		case "touchstart": type = "mousedown"; break;
		case "touchmove":  type="mousemove"; break;
		case "touchend":   type="mouseup"; break;
		default: return;
	}

	var simulatedEvent = document.createEvent("MouseEvent");
	simulatedEvent.initMouseEvent(type, true, true, window, 1, 
			first.screenX, first.screenY, 
			first.clientX, first.clientY, false, 
			false, false, false, 0/*left*/, null);

	first.target.dispatchEvent(simulatedEvent);
	event.preventDefault();
	event.stopPropagation();
}	
