/*
	Main.
*/

var app = require('./app');

//Debug
/*var vorlonWrapper = require("vorlon-node-wrapper");
var serverUrl = "http://localhost:1337";
var dashboardSession = "default";
vorlonWrapper.start(serverUrl, dashboardSession, false);*/

//Register reducers 
var loadImageFile = require('./reducers/loadImageFile');
var loadImage = require('./reducers/loadImage');
var writeImage = require('./reducers/writeImage');
var greyscale = require('./reducers/greyscale');
var posterize = require('./reducers/posterize');
var threshold = require('./reducers/threshold');
var eliminateNoisePixels = require('./reducers/eliminateNoisePixels');
var findBlobs = require('./reducers/findBlobs');
var findBlobBoundaries = require('./reducers/findBlobBoundaries');
var eliminateSmallBlobs = require('./reducers/eliminateSmallBlobs');
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
app.registerReducer(eliminateNoisePixels);
app.registerReducer(findBlobs);
app.registerReducer(findBlobBoundaries);
app.registerReducer(eliminateSmallBlobs);
app.registerReducer(colorizeBlobs);
app.registerReducer(drawBlobBoundaries);
app.registerReducer(findReferenceBlob);
app.registerReducer(findWinnerBlob);
app.registerReducer(drawWinnerBlob);

//Apply actions

//var imageFile = "./images/sample3.jpg"; var minSize = 15;  var thresholdValue = 0x44444444;
//OK

//var imageFile = "./images/sample.png"; var minSize = 15;  var thresholdValue = 0x44444444;
//OK

//var imageFile = "./images/sample5.jpeg"; var minSize = 15;  var thresholdValue = 0x44444444;
//OK

//var imageFile = "./images/sample4.jpg"; var minSize = 30;  var thresholdValue = 0x44444444;
//KO : palets collés

var imageFile = "./images/sample9.png"; var minSize = 10; var thresholdValue = 100;
//KO : Rayures sur la planche, bug avec le petit ???

//var imageFile = "./images/sample16.jpg"; var minSize = 15;  var thresholdValue = 0x44444444;
//KO : l'exterieur de la planche perturbe

//var imageFile = "./images/sample14.jpg"; var minSize = 5;  var thresholdValue = 0x44444444;
//KO : le seuillage est pas adapté à la couleur de la photo

//var imageFile = "./images/blob2.png"; var minSize = 5;  var thresholdValue = 0x44444444;
//KO : image test pour la detection de cercles

app.dispatch(loadImageFile.action(imageFile))
.then(function(){
	app.dispatch(writeImage.action("output/original.jpg"));
	app.dispatch(greyscale.action());
	app.dispatch(writeImage.action("output/greyscale.jpg"));
	
	//ACY : Désactivé momentanément (ou pas), a tendance à ajouter les ombres des palets aux blobs
	//app.dispatch(posterize.action());
	//app.dispatch(writeImage.action("output/posterize.jpg"));
	
	app.dispatch(threshold.action(thresholdValue));
	app.dispatch(writeImage.action("output/threshold.jpg"));
	app.dispatch(eliminateNoisePixels.action(minSize));
	app.dispatch(writeImage.action("output/noise.jpg"));
	app.dispatch(findBlobs.action());
	app.dispatch(findBlobBoundaries.action());
	app.dispatch(eliminateSmallBlobs.action(minSize));
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

// - http://www.aforgenet.com/articles/shape_checker/
//		Quelques astuces pour détecter des cercles		

// - http://basic-eng.blogspot.fr/2006/01/hough-transform-for-circle-detection_23.html
// - http://basic-eng.blogspot.fr/2006/02/hough-transform-for-circle-detection.html
// - https://www.cis.rit.edu/class/simg782.old/talkHough/HoughLecCircles.html
//		Explication de Hough Transform, ca me parait gourmand...

// - http://www.nlpr.ia.ac.cn/2011papers/kz/gh16.pdf
//		Algo plus rapide que Hough Transform, prometteur...
// - http://www.jiancool.com/article/5663482189/
// 		Explication sur ce qu'est un gradient vector


// - https://github.com/mtschirs/js-objectdetect/
//		Reconnaissance de pattern, c'est de l'artillerie lourde, à utiliser en dernier recours 

