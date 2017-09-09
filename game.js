function didLoad(){
				document.documentElement.style.overflow = 'hidden';
				document.body.scroll = 'no';

				var canvas = document.getElementById("canvas");
				canvas.setAttribute('width', window.innerWidth);
				canvas.setAttribute('height', window.innerHeight);

				var w = 4, h = 21;
				var params = location.href.split('?')[1];
				if(params) {
								params = params.split('&');
								w=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'w'; })[0] || ['',w])[1];
								h=(params.map(function(p){ return p.split('='); }).filter(function(p){ return p[0] == 'h'; })[0] || ['',h])[1];
				}

				new Game(new pt(w,h), canvas);
}

function Game(numHex, canvas){
				var game = this;
				var size = new pt(window.innerWidth, window.innerHeight);
				this.Hexs = generateHex(size, numHex);
				this.Draw = new Drawing(canvas, canvas.getContext('2d'));

				this.Draw.render(this);

				this.MouseDown = function(e) {
								//console.log(event.type);
								var clickPoint = new pt(getCursorPosition(e));
								//touchPt = new Vector(clickPoint[0], clickPoint[1]);
								var closestHex;
								var closestDist = 1000;


								for(var hex in this.Hexs) {
												var dist = this.Hexs[hex].center.dist(clickPoint);
												if(dist < closestDist && dist < this.Hexs[hex].size.y) {
																closestDist = dist;
																closestHex = this.Hexs[hex];
												}
								}

								if(closestHex) {
												if(closestHex.selected)
												{
																this.selectedHex.selected = false;
																this.selectedHex = undefined;
																closestHex = undefined;
												}
												else
																closestHex.selected = true;
												if(this.selectedHex) {

																if(closestHex.center.dist(this.selectedHex.center) < (closestHex.size.y * 1.5)) {

																				var swpColor = closestHex.color;
																				closestHex.color = this.selectedHex.color;
																				this.selectedHex.color = swpColor;
																}
												}
								}
								if(this.selectedHex) {
												this.selectedHex.selected = false;
												this.selectedHex = undefined;
								}
								this.selectedHex = closestHex;

								this.Draw.render(this);
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
												false, false, false, 0/*left*/, null);

								first.target.dispatchEvent(simulatedEvent);
				}
				canvas.addEventListener('mousedown', makeListener(this, this.MouseDown), false);
				//canvas.addEventListener('mousemove', this.MouseMove, false);
				//canvas.addEventListener('mouseup',   this.MouseUp, false);

				document.addEventListener("touchstart", makeListener(this, this.TouchHandler), true);
				//document.addEventListener("touchmove", makeListener(this, this.TouchHandler), true);
				//document.addEventListener("touchend", makeListener(this, this.TouchHandler), true);
				//document.addEventListener("touchcancel", makeListener(this, this.TouchHandler), true);
				//document.addEventListener("touchmove", this.TouchHandler, true);
				//document.addEventListener("touchend", this.TouchHandler, true);
				//document.addEventListener("touchcancel", this.TouchHandler, true);
}

function makeListener(self, listener) {
				return function(e) {
								return listener.call(self, e);
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

				//x -= document.getElementById("theCanvas").offsetLeft;
				//y -= document.getElementById("theCanvas").offsetTop;
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
