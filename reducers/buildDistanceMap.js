var PriorityQueue = require('priorityqueuejs');

var ACTION_TYPE = 'BUILD_DISTANCE_MAP';
module.exports.type = ACTION_TYPE;
module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	var closestBlob = buildDistanceMap(state.get('image').bitmap.data, 
		                       state.get('image').bitmap.width,
							   state.get('image').bitmap.height,
							   state.get('blobBoundaries'),
							   state.get('referenceBlob'),
							   state.get('blobMap'));
	return state
		.set('closestBlob', closestBlob);
};

function buildDistanceMap(image, width, height, boundaries, referenceBlobLabel, blobMap){
	// Build a distance map to the reference blob center
	// using Fast Marching algorithm
	
	// get reference blob boundaries
	var referenceBlob = boundaries[referenceBlobLabel];
	
	// build distance array for neighbors
	console.log("build distance array");
	var neighborsDistances = [];
	neighborsDistances.push( [] );
	neighborsDistances[0][0] = Math.sqrt(2);
	neighborsDistances[0][1] = 1;
	neighborsDistances[0][2] = Math.sqrt(2);
	neighborsDistances.push( [] );
	neighborsDistances[1][0] = 1;
	neighborsDistances[1][1] = 0;
	neighborsDistances[1][2] = 1;
	neighborsDistances.push( [] );
	neighborsDistances[2][0] = Math.sqrt(2);
	neighborsDistances[2][1] = 1;
	neighborsDistances[2][2] = Math.sqrt(2);
	console.log(neighborsDistances);
	
	// define distance map
	console.log("build distance map");
	var distanceMap = [];
	var x,y;
	var closestBlob = {x:-1, y:-1, label:-1, distance: -1};
	// start by labeling every pixel as infinite distance (-1)
	for(y=0; y<height; y++) {
		distanceMap.push([]);
		for(x=0; x<width; x++) {
			distanceMap[y].push(-1);
		}
	}
		
	// define priority queue using distance as comparison criteria
	console.log("create prioity queue");
	var queue = new PriorityQueue(function(a, b) {
	  return b.distance - a.distance;
	});
	
	// add neighbor elements
	console.log("add reference blob center in queue");
	var referenceItem = {distance:0, x:Math.round(referenceBlob.xcenter), y:Math.round(referenceBlob.ycenter)};
	distanceMap[referenceItem.y][referenceItem.x] = referenceItem.distance;
	for(y=-1; y<=1; y++) {
		for(x=-1; x<=1; x++) {
			// skip reference item
			if(y===0 && x===0) continue;
			// outside the image? skip
			var neighborX = Math.round(referenceItem.x) + x;
			var neighborY = Math.round(referenceItem.y) + y;
			if( neighborX < 0 || neighborX >= width ||
			    neighborY < 0 || neighborY >= height ) continue;
			// add neighbor with updated distance and coordinates
			var neighborItem = {distance: referenceItem.distance + neighborsDistances[y+1][x+1],
			                    x: neighborX,
								y: neighborY};
			queue.enq( neighborItem );
			distanceMap[neighborItem.y][neighborItem.x] = neighborItem.distance;
		}
	}
	
	// recursive distance computation
	console.log("creation of distance map");
	while(queue.size()>0) {
		console.log(queue.size());
		var currentItem = queue.deq();
		// did we find a blob (different from reference one)?
		if( blobMap[currentItem.y][currentItem.x] > 0 && 
			blobMap[currentItem.y][currentItem.x]!=referenceBlobLabel) {
			// so this is the closest blob
			var closestBlob = {x: currentItem.x, y: currentItem.y,
			                   label: blobMap[currentItem.y][currentItem.x],
							   distance: currentItem.distance};
			console.log("Closest blob is :", closestBlob, "!");
			// return the label of the closest blob and quit
			return closestBlob;
		}
		// else continue looking at neighbors
		else {
			// browse neighbors
			for(y=-1; y<=1; y++) {
				for(x=-1; x<=1; x++) {
					// skip current item
					if(y===0 && x===0) continue;
					// outside the image? skip
					var neighborX = currentItem.x + x;
					var neighborY = currentItem.y + y;
					if( neighborX < 0 || neighborX>=width ||
						neighborY < 0 || neighborY>=height ) continue;
					// add neighbor with updated distance and coordinates
					var neighborItem = {distance: currentItem.distance + neighborsDistances[y+1][x+1],
										x: currentItem.x + x,
										y: currentItem.y + y};
					// this pixel was already handled previously so skip it!
					if(distanceMap[neighborItem.y][neighborItem.x]>=0) continue;
					else {
						queue.enq( neighborItem );
						distanceMap[neighborItem.y][neighborItem.x] = neighborItem.distance;
					}
				}
			}
		}
	}
	// TODO: factorize neighbor browsing
	console.log("build distance map done!");
	
	return closestBlob;
}