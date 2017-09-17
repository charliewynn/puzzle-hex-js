(function() {

	if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
		window.requestAnimationFrame =
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(callback, element) {
		window.setTimeout(callback, 1000 / 60);
	}
	}

	function timestamp() {
		return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
	}

	var Hexs, MenuHexs;
	var toBeCleared = [];
	var ClearCountDown;
	var canvas;
	var animationLoop;
	function setup() {
		document.documentElement.style.overflow = 'hidden';
		document.body.scroll = 'no';
		if(navigator.userAgent.match(/Android/i)){
			window.scrollTo(0,1);
		}

		var background = document.getElementById("background");
		background.setAttribute('width', window.innerWidth);
		background.setAttribute('height', window.innerHeight);

		canvas = document.getElementById("canvas");
		canvas.setAttribute('width', window.innerWidth);
		canvas.setAttribute('height', window.innerHeight);
		var w = 4, h = 17;
		var debug = location.href.indexOf('file://') === 0;
		var params = location.href.split('?')[1];
		if(params) {
			params = params.split('&');
			w=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'w'; })[0] || ['',w])[1];
			h=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'h'; })[0] || ['',h])[1];
			debug=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'd'; })[0] || ['',false])[1];
		}

		Hexs = Geometry.GenerateHex(new Point(w, h));
		MenuHexs = Hexs[0];
		Hexs = Hexs[1];

		Drawing.RenderBackground(background, Hexs);
		Drawing.Render(canvas, Hexs, MenuHexs);

		canvas.addEventListener('mousedown', click, this.MouseDown, true);
	}

	setTimeout(setup,1);

	ClearCountDown = 0;

	function click(e) {
		if(ClearCountDown > 0) return;
		var clickPoint = new Point(getCursorPosition(e));
		var closestHex;
		//var closestDist = 1000;

		for(var hex in Hexs) {
			var dist = Hexs[hex].center.dist(clickPoint);
			if(/*dist < closestDist && */dist < Hexs[hex].size.x/2) {
				//closestDist = dist;
				closestHex = Hexs[hex];
			}
		}

		if(!closestHex || closestHex.selected) {
			if(this.selectedHex){
				this.selectedHex.selected = false;
				this.selectedHex = undefined;
				Drawing.Render(canvas, Hexs, MenuHexs);
				return;
			}
			for(var hex in MenuHexs) {
				var dist = MenuHexs[hex].center.dist(clickPoint);
				if(/*dist < closestDist && */dist < MenuHexs[hex].size.x/2) {
					if(MenuHexs[hex].type === 'color') {
						console.log(MenuHexs[hex].color + " menu clicked");
					}
					if(MenuHexs[hex].type === 'menu') {
						console.log("Menu Clicked");
					}
				}
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
				var numColor = {};
				for(var h in Hexs) {
					var hex = Hexs[h];
					if(hex.marked) {
						toBeCleared.push(hex);
						numColor[hex.color] = (numColor[hex.color] || 0) + 1;
						var upN = hex.neighbors.up;
						if(upN && !upN.marked) hex.next = upN;
						//hex.color = 'purple';
					}
				}
				console.log(numColor);
				for(var color in Object.getOwnPropertyNames(numColor))
				{
					var menuHex = MenuHexs.filter(function(h) { return h.color == Object.getOwnPropertyNames(numColor)[color]; })[0];
					menuHex.value += numColor[Object.getOwnPropertyNames(numColor)[color]];
				}
				for(var h in toBeCleared) {
					delete toBeCleared[h].marked;
				}
				delete hex.marked;

				this.selectedHex.selected = false;
				this.selectedHex = undefined;
				Drawing.Render(canvas, Hexs, MenuHexs);
				requestAnimationFrame(animate);
				return;
			}
		}
		if(this.selectedHex) {
			this.selectedHex.selected = false;
			this.selectedHex = undefined;
		}
		closestHex.selected = true;
		this.selectedHex = closestHex;
		Drawing.Render(canvas, Hexs, MenuHexs);
	}

	function animate() {
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
			for(var h in Hexs) {
				FoundMatch = Hexs[h].CheckMatch() || FoundMatch;
			}
			if(FoundMatch) {

				ClearCountDown = 7;
				var numColor = {};
				for(var h in Hexs) {
					var hex = Hexs[h];
					if(hex.marked) {
						toBeCleared.push(hex);
						numColor[hex.color] = (numColor[hex.color] || 0) + 1;
						var upN = hex.neighbors.up;
						if(upN && !upN.marked) hex.next = upN;
					}
				}
				console.log(numColor);
				for(var color in Object.getOwnPropertyNames(numColor))
				{
					var menuHex = MenuHexs.filter(function(h) { return h.color == Object.getOwnPropertyNames(numColor)[color]; })[0];
					menuHex.value += numColor[Object.getOwnPropertyNames(numColor)[color]];
				}
				for(var h in toBeCleared) {
					delete toBeCleared[h].marked;
				}
			}

		}
		//if we're done doing matches...
		if(ClearCountDown == 0) {
			//check for useable moves
			if(!Geometry.CheckForMoves(Hexs)) {
				alert("game over");
			}
			ClearCountDown --;
		}
		Drawing.Render(canvas, Hexs, MenuHexs);
		if(ClearCountDown > 0)
			requestAnimationFrame(animate);
		//console.log('tick');
	}
})();


function Game(width, height, canvas, debug){
	var ClearCountDown = 0;
	var toBeCleared = [];

	this.tick = function() {
	}

	this.MouseDown = function(e) {
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
