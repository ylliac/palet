var PriorityQueue = require('priorityqueuejs');

var ACTION_TYPE = 'BUILD_DISTANCE_MAP';
module.exports.type = ACTION_TYPE;
module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	var map = buildDistanceMap(state.get('image').bitmap.data, state.get('image').bitmap.width, state.get('image').bitmap.height, state.get('blobBoundaries'), state.get('referenceBlob'));
	return state
		.set('distanceMap', map);
};

function buildDistanceMap(image, width, height, boundaries, referenceBlobLabel){
	// Build a distance map to the reference blob center
	// using Fast Marching algorithm
	
	// get reference blob boundaries
	var referenceBlob = boundaries[referenceBlobLabel];
	// referenceBlob.xmin
	// referenceBlob.xmax
	// referenceBlob.ymin
	// referenceBlob.ymax
	// referenceBlob.width
	// referenceBlob.height
	// referenceBlob.xcenter
	// referenceBlob.ycenter
	
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
	// start by labeling every pixel as infinite distance (-1)
	for(x=0; x<width; x++) {
		distanceMap.push([]);
		for(y=0; y<height; y++) {
			distanceMap[x].push(-1);
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
	distanceMap[referenceItem.x][referenceItem.y] = referenceItem.distance;
	for(x=-1; x<=1; x++) {
		for(y=-1; y<=1; y++) {
			// outside the image? skip
			if( (referenceItem.x+x < 0 && referenceItem.x+x>=width) ||
			    (referenceItem.y+y < 0 && referenceItem.y+y>=height) ) continue;
			// add neighbor with updated distance and coordinates
			var neighborItem = {distance:neighborsDistances[x+1][y+1], x:Math.round(referenceItem.x+x), y:Math.round(referenceItem.y+y)};
			queue.enq( neighborItem );
			distanceMap[neighborItem.x][neighborItem.y] = neighborItem.distance;
		}
	}
	
	// recursive distance computation
	console.log("creation of distance map");
	while(queue.size()>0) {
		console.log(queue.size());
		var currentItem = queue.deq();
		for(x=-1; x<=1; x++) {
			for(y=-1; y<=1; y++) {
				// outside the image? skip
				if( (currentItem.x+x < 0 && currentItem.x+x>=width) ||
					(currentItem.y+y < 0 && currentItem.y+y>=height) ) continue;
				// add neighbor with updated distance and coordinates
				var neighborItem = {distance:neighborsDistances[x+1][y+1], x:Math.round(currentItem.x+x), y:Math.round(currentItem.y+y)};
				// this pixel was already handled previously so skip it!
				if(distanceMap[neighborItem.x][neighborItem.y]>=0) continue;
				else {
					queue.enq( neighborItem );
					distanceMap[neighborItem.x][neighborItem.y] = neighborItem.distance;
				}
			}
		}
	}

	/*
	// EXAMPLE
	queue.enq({ cash: 250, name: 'Valentina' });
	queue.enq({ cash: 300, name: 'Jano' });
	queue.enq({ cash: 150, name: 'Fran' });
	queue.size(); // 3
	queue.peek(); // { cash: 300, name: 'Jano' }
	queue.deq(); // { cash: 300, name: 'Jano' }
	queue.size(); // 2
	*/
	
	console.log("build distance map done!");
	
	return result;
}