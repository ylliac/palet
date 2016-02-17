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
	console.log("1");
	
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
	
	// build distance array
	console.log("build distance array");
	var distances = [];
	distances.push( [] );
	distances[0][0] = Math.sqrt(2);
	distances[0][1] = 1;
	distances[0][2] = Math.sqrt(2);
	distances.push( [] );
	distances[1][0] = 1;
	distances[1][1] = 0;
	distances[1][2] = 1;
	distances.push( [] );
	distances[2][0] = Math.sqrt(2);
	distances[2][1] = 1;
	distances[2][2] = Math.sqrt(2);
	console.log(distances);
		
	// define priority queue using distance as comparison criteria
	console.log("create prioity queue");
	var queue = new PriorityQueue(function(a, b) {
	  return b.distance - a.distance;
	});
	
	// add first elements
	console.log("add reference blob center in queue");
	var x,y;
	queue.enq( {distance:0, x:referenceBlob.xcenter, y:referenceBlob.ycenter} );
	for(x=-1; x<=1; x++) {
		for(y=-1; y<=1; y++) {
			queue.enq( {distance:distances[x+1][y+1], x:referenceBlob.xcenter+x, y:referenceBlob.ycenter+y} );
		}
	}
	console.log(queue);
	
	// recursive distance computation
	console.log("creation of distance map");
	while(queue.size()>0) {
		
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