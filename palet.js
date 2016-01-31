/*
	Main.
*/

var app = require('./app');

//Register reducers 
var loadImageFile = require('./reducers/loadImageFile');
var loadImage = require('./reducers/loadImage');
var writeImage = require('./reducers/writeImage');
var greyscale = require('./reducers/greyscale');
var posterize = require('./reducers/posterize');
var threshold = require('./reducers/threshold');
var findBlobs = require('./reducers/findBlobs');
var findBlobBoundaries = require('./reducers/findBlobBoundaries');
var colorizeBlobs = require('./reducers/colorizeBlobs');
var drawBlobBoundaries = require('./reducers/drawBlobBoundaries');
var findReferenceBlob = require('./reducers/findReferenceBlob');
var findWinnerBlob = require('./reducers/findWinnerBlob');
var drawWinnerBlob = require('./reducers/drawWinnerBlob');

app.registerReducer(loadImageFile);
app.registerReducer(loadImage);
app.registerReducer(writeImage);
app.registerReducer(greyscale);
app.registerReducer(posterize);
app.registerReducer(threshold);
app.registerReducer(findBlobs);
app.registerReducer(findBlobBoundaries);
app.registerReducer(colorizeBlobs);
app.registerReducer(drawBlobBoundaries);
app.registerReducer(findReferenceBlob);
app.registerReducer(findWinnerBlob);
app.registerReducer(drawWinnerBlob);

//Apply actions

var imageFile = "./images/sample3.jpg"; //OK
//var imageFile = "./images/sample.png"; //KO
//var imageFile = "./images/sample9.png"; //KO

app.dispatch(loadImageFile.action(imageFile))
.then(function(){
	app.dispatch(writeImage.action("output/original.jpg"));
	app.dispatch(greyscale.action());
	app.dispatch(writeImage.action("output/greyscale.jpg"));
	app.dispatch(posterize.action());
	app.dispatch(writeImage.action("output/posterize.jpg"));
	app.dispatch(threshold.action());
	app.dispatch(writeImage.action("output/threshold.jpg"));
	app.dispatch(findBlobs.action());
	app.dispatch(findBlobBoundaries.action());
	app.dispatch(colorizeBlobs.action());
	app.dispatch(drawBlobBoundaries.action());
	app.dispatch(writeImage.action("output/blobs.jpg"));
	app.dispatch(findReferenceBlob.action());
	app.dispatch(findWinnerBlob.action());
	app.dispatch(drawWinnerBlob.action());
	app.dispatch(writeImage.action("output/result.jpg"));
});

//TODO ACY
//Autres liens intéressants :
// - https://github.com/mtschirs/js-objectdetect/

