// import 'priorityqueue.js' library
var PriorityQueue = require('priorityqueuejs');

var ACTION_TYPE = 'FIND_CLOSEST_BLOB';
module.exports.type = ACTION_TYPE;
module.exports.action = function(){
	return {
		type: ACTION_TYPE
	};
};

module.exports.apply = function(state, action){
	var closestBlob = findClosestBlob(state.get('image').bitmap.width,
	                                  state.get('image').bitmap.height,
									  state.get('blobBoundaries'),
									  state.get('referenceBlob'),
									  state.get('blobMap'));
	return state
		.set('closestBlob', closestBlob);
};

/**
 * Browse the current pixel neighborhood and add all neighbors to the queue,
 * taking care to update the distance map tracks.
 *
 * @param currentItem item including current pixel coordinates and distance to the reference blob center
 * @param width image width
 * @param width image height
 * @param neighborhoodDistances reference distance of the neighborhood to the current pixel
 * @param distanceMap distance map representing all known distances to the reference blob center
 * @param queue priority queue of all pixels to check
 */
function neighborhoodBrowsing(currentItem, width, height, neighborhoodDistances, distanceMap, queue) {
	// browse neighborhood
	for(y=-1; y<=1; y++) {
		for(x=-1; x<=1; x++) {
			// skip current item
			if(y===0 && x===0) continue;
			var neighborX = currentItem.x + x;
			var neighborY = currentItem.y + y;
			// outside the image? skip
			if( neighborX < 0 || neighborX>=width ||
				neighborY < 0 || neighborY>=height ) continue;
			// add neighbor with updated distance and coordinates to the queue
			var neighborItem = {distance: currentItem.distance + neighborhoodDistances[y+1][x+1],
								x: currentItem.x + x,
								y: currentItem.y + y};
			// only if it was not previously handled
			if(distanceMap[neighborItem.y][neighborItem.x]===-1) {
				queue.enq( neighborItem );
				distanceMap[neighborItem.y][neighborItem.x] = neighborItem.distance;
			}
		}
	}
}

/**
 * Find the closest pixel to the reference blob and its associated blob.
 * Build a distance map from the reference blob center and following
 * the shortest path to the closest blob using Fast Marching algorithm.
 *
 * @param width image width
 * @param width image height
 * @param boundaries list of blob boundaries
 * @param referenceBlobLabel label of the reference blob
 * @param blobMap map of the blobs identified in the image
 * @return Object containing the position of the closest pixel
 *         to the reference blob, its label and distance
 */
function findClosestBlob(width, height, boundaries, referenceBlobLabel, blobMap){
	// initialize neighborhood distance array
	console.log("initialize neighborhood distance array");
	var neighborhoodDistances = [];
	neighborhoodDistances.push( [] );
	neighborhoodDistances[0][0] = Math.sqrt(2);
	neighborhoodDistances[0][1] = 1;
	neighborhoodDistances[0][2] = Math.sqrt(2);
	neighborhoodDistances.push( [] );
	neighborhoodDistances[1][0] = 1;
	neighborhoodDistances[1][1] = 0;
	neighborhoodDistances[1][2] = 1;
	neighborhoodDistances.push( [] );
	neighborhoodDistances[2][0] = Math.sqrt(2);
	neighborhoodDistances[2][1] = 1;
	neighborhoodDistances[2][2] = Math.sqrt(2);
	
	// initialize distance map
	//////////////////////////
	console.log("initialize distance map");
	var x,y;
	var distanceMap = [];
	var closestBlob = {x:-1, y:-1, label:-1, distance: -1};
	// start by labeling every pixel as infinite distance (-1)
	for(y=0; y<height; y++) {
		distanceMap.push([]);
		for(x=0; x<width; x++) {
			distanceMap[y].push(-1);
		}
	}
		
	// define priority queue using shortest distance as comparison criteria
	console.log("create prioity queue");
	var queue = new PriorityQueue(function(a, b) {
	  return b.distance - a.distance;
	});
	
	// add neighborhood of the reference blob
	// center into the queue as a starting point
	////////////////////////////////////////////
	console.log("add neighborhood of the reference blob center into the queue");
	var referenceItem = {distance: 0,
	                     x: Math.round(boundaries[referenceBlobLabel].xcenter),
	                     y: Math.round(boundaries[referenceBlobLabel].ycenter)};
	distanceMap[referenceItem.y][referenceItem.x] = referenceItem.distance;
	// add reference neighborhood
	neighborhoodBrowsing(referenceItem, width, height, neighborhoodDistances, distanceMap, queue);
	
	// recursive shortest path browsing to find 
	// the closest pixel and its corresponding blob
	////////////////////////////////////////////////
	console.log("creation of distance map");
	// browse the queue until empty
	while(queue.size()>0) {
		var currentItem = queue.deq();
		// did we find a blob (different from reference one)?
		if( blobMap[currentItem.y][currentItem.x] > 0 && 
			blobMap[currentItem.y][currentItem.x]!=referenceBlobLabel) {
			// so this is the closest blob
			var closestBlob = {x: currentItem.x, y: currentItem.y,
			                   label: blobMap[currentItem.y][currentItem.x],
							   distance: currentItem.distance};
			console.log("Closest blob is :", closestBlob);
			// return the label of the closest blob and quit
			return closestBlob;
		}
		// else continue adding neighborhood
		else neighborhoodBrowsing(currentItem, width, height, neighborhoodDistances, distanceMap, queue);
	}
	
	console.log("Closest blob not found!");
	return closestBlob;
}