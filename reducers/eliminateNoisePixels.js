//ACY 07/02 L'algo a tendance à agrandir les trous dans les blobs qui se trouvent près de la bordure, 
// il faudrait peut être boucher les trous avant d'appliquer cette étape 

var ACTION_TYPE = 'ELIMINATE_NOISE_PIXELS';

module.exports.type = ACTION_TYPE;

module.exports.action = function(minSize){
	return {
		type: ACTION_TYPE,
		minSize: minSize
	};
};

module.exports.apply = function(state, action){
	var pixelsToEliminate = eliminateNoisePixels(state.get('image').bitmap.width, state.get('image').bitmap.height, state.get('image').bitmap.data, action.minSize);

	var scanner = drawPixelsToDelete(pixelsToEliminate);
	return state
		.set('image', state.get('image').scan(0, 0, state.get('image').bitmap.width, state.get('image').bitmap.height, scanner));
};

function eliminateNoisePixels(width, height, pixels, minSize){

	var xSize = width,
	ySize = height,
	srcPixels = pixels,
	x, y, pos;

	var pixelsToDelete = [];

	// Start by marking every pixel as 0 (keep)
	for(y=0; y<ySize; y++){
		pixelsToDelete.push([]);
		for(x=0; x<xSize; x++){
			pixelsToDelete[y].push(0);
		}
	}

	var isVisible;

	for( y=1; y<ySize-1; y++){

		var firstVisiblePixelX = -1;

		for( x=1; x<xSize-1; x++){

			pos = (y*xSize+x)*4;

			// We're only looking at the red channel in this case but you can
			// use more complicated heuristics
			isVisible = (srcPixels[pos] < 127); 

			if(isVisible && firstVisiblePixelX === -1){
				firstVisiblePixelX = x;
			}

			//It's the last pixel of the loop
			if(isVisible && x === xSize-2){
				x++;
				isVisible = false;
			}

			if(!isVisible && firstVisiblePixelX > -1){
				if(x - firstVisiblePixelX < minSize){

					for( var xToDelete=firstVisiblePixelX; xToDelete<x; xToDelete++){
						pixelsToDelete[y][xToDelete] = 1; //Delete						
					}
				}
				firstVisiblePixelX = -1;
			}

		}
	}

	for( x=1; x<xSize-1; x++){

		var firstVisiblePixelY = -1;

		for( y=1; y<ySize-1; y++){

			pos = (y*xSize+x)*4;

			// We're only looking at the red channel in this case but you can
			// use more complicated heuristics
			isVisible = (srcPixels[pos] < 127); 

			if(isVisible && firstVisiblePixelY === -1){
				firstVisiblePixelY = y;
			}

			//It's the last pixel of the loop
			if(isVisible && y === ySize-2){
				y++;
				isVisible = false;
			}

			if(!isVisible && firstVisiblePixelY > -1){
				if(y - firstVisiblePixelY < minSize){

					for( var yToDelete=firstVisiblePixelY; yToDelete<y; yToDelete++){
						pixelsToDelete[yToDelete][x] = 2; //Delete						
					}
				}
				firstVisiblePixelY = -1;
			}

		}
	}

	return pixelsToDelete;
}

function drawPixelsToDelete(pixelsToDelete){

	return function(x, y, idx){
		var shouldDelete = pixelsToDelete[y][x];

		if(shouldDelete){
			//If so, color it in white
			this.bitmap.data[idx] = 255;
			this.bitmap.data[idx+1] = 255;
			this.bitmap.data[idx+2] = 255;
			return;
		}
	};
}
