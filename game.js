function didLoad(){
	document.documentElement.style.overflow = 'hidden';
	document.body.scroll = 'no';
	var size = pt(window.innerWidth, window.innerHeight);
	
	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');

	 // finally query the various pixel ratios
        devicePixelRatio = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

    // ensure we have a value set for auto.
    // If auto is set to false then we
    // will simply not upscale the canvas
    // and the default behaviour will be maintained
    if (typeof auto === 'undefined') {
        auto = true;
    }

    // upscale the canvas if the two ratios don't match
    if (auto && devicePixelRatio !== backingStoreRatio) {

        var oldWidth = canvas.width;
        var oldHeight = canvas.height;

        canvas.width = oldWidth * ratio;
        canvas.height = oldHeight * ratio;

        canvas.style.width = oldWidth + 'px';
        canvas.style.height = oldHeight + 'px';

        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        context.scale(ratio, ratio);

		console.log('ratio: ' + ratio);
    }

	size = pt(canvas.width, canvas.height);
	console.log('width: ' + size.x + ' height: ' + size.y);
	var game = {};
	var draw = new Drawing(size, context);
	draw.render(game);
}	
