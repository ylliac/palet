module.exports.type = FILL_HOLES;

//ACY 14/02 A améliorer

module.exports.apply = function(state, action){
	var pixelsToFill = fillHoles(state.get('image').bitmap.width, state.get('image').bitmap.height, state.get('image').bitmap.data);

	var scanner = drawPixelsToFill(pixelsToFill);
	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, scanner));
};

function fillHoles(width, height, pixels){

	var xSize = width,
	ySize = height,
	srcPixels = pixels,
	x, y;

	function isPixelVisible(x,y){
		var pos = (y*xSize+x)*4;

		// We're only looking at the red channel in this case but you can
		// use more complicated heuristics
		return (srcPixels[pos] < 127); 
	}

	var pixelsToFill = [];

	// Start by marking every pixel as 0 (keep)
	for(y=0; y<ySize; y++){
		pixelsToFill.push([]);
		for(x=0; x<xSize; x++){
			pixelsToFill[y].push(0);
		}
	}

	var isVisible;

	for( y=1; y<ySize-1; y++){
		for( x=1; x<xSize-1; x++){

			// We're only looking at the red channel in this case but you can
			// use more complicated heuristics
			isVisible = isPixelVisible(x, y); 

			//If the pixel is not visible 
			if(!isVisible){

				//Start checking if it is surronded by visible pixels 
				//ie. it is a single pixel hole 
				if(
					isPixelVisible(x+1, y) &&
					isPixelVisible(x, y+1) &&
					isPixelVisible(x, y-1) &&
					isPixelVisible(x-1, y) )
				{
					pixelsToFill[y][x] = 1; //Fill
				}

				//If not, enlarge the checked contour
				//ie. it is a 2 to 9 pixels hole 
				//TODO
				if(
					isPixelVisible(x-2, y) &&
					isPixelVisible(x-2, y+1) &&
					isPixelVisible(x-1, y+2) &&
					isPixelVisible(x, y+2) &&
					isPixelVisible(x+1, y+2) &&
					isPixelVisible(x+2, y+1) &&
					isPixelVisible(x+2, y) &&
					isPixelVisible(x+2, y-1) &&
					isPixelVisible(x+1, y-2) &&
					isPixelVisible(x, y-2) &&
					isPixelVisible(x-1, y-2) &&
					isPixelVisible(x-2, y-1) )
				{
					pixelsToFill[y][x] = 1; //Fill
				}
			}
		}
	}

	return pixelsToFill;
}

function drawPixelsToFill(pixelsToFill){

	return function(x, y, idx){
		var shouldFill = pixelsToFill[y][x];

		if(shouldFill){
			//If so, color it in black
			this.bitmap.data[idx] = 0;
			this.bitmap.data[idx+1] = 0;
			this.bitmap.data[idx+2] = 0;
			return;
		}
	};
}

