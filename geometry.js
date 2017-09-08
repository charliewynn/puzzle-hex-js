function pt(){
	var x,y;
	if(arguments.length == 2){
		x = arguments[0];
		y = arguments[1];
	}
	if(arguments.length == 1) {
		x = arguments[0][0];
		y = arguments[0][1];
	}
	return {
		x:x,
		y:y
	};
}
