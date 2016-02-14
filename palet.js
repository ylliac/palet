/*
	Main.
*/

var app = require('./app');

//CHARGEMENT DES ACTIONS
//TODO ACY Charger le répertoire 'reducers' avec registerReducerDirectory

var loadImageFile = require('./reducers/loadImageFile');
var loadImage = require('./reducers/loadImage');
var writeImage = require('./reducers/writeImage');
var greyscale = require('./reducers/greyscale');
var posterize = require('./reducers/posterize');
var threshold = require('./reducers/threshold');
var fillHoles = require('./reducers/fillHoles');
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
app.registerReducer(fillHoles);
app.registerReducer(eliminateNoisePixels);
app.registerReducer(findBlobs);
app.registerReducer(findBlobBoundaries);
app.registerReducer(eliminateSmallBlobs);
app.registerReducer(colorizeBlobs);
app.registerReducer(drawBlobBoundaries);
app.registerReducer(findReferenceBlob);
app.registerReducer(findWinnerBlob);
app.registerReducer(drawWinnerBlob);

//JEUX DE TEST

//Palet plus planche avec rayures
var imageFile = "./images/sample9.png";
var minSize = 10;
var thresholdValue = 100;
//TODO : Améliorer la recherche du vainqueur parce que se baser sur les emprise des blobs
// ne marche pas quand un blob représente deux palets qui se chevauchent

//Palet plus planche sans rayure mais avec un palet clair qui pose problème au seuillage
// var imageFile = "./images/sample3.jpg"; 
// var minSize = 10;  
// var thresholdValue = 120;
//TODO : Améliorer le remplissage des trous pour boucher le trou du palet du bas

//Deux disques tout simples
// var imageFile = "./images/sample.png";
// var minSize = 15;
// var thresholdValue = 100;

//Palets sur une planche avec rayures
// var imageFile = "./images/sample5.jpeg";
// var minSize = 15;
// var thresholdValue = 100;

//Palets fortement eclairés
// var imageFile = "./images/sample1.jpg";
// var minSize = 15;
// var thresholdValue = 200;
//TODO : Les reflets sur les palets du haut crééent un trou difficile à boucher


//Palets sur planche de plusieurs couleurs : cas tordu !
// var imageFile = "./images/sample7.jpg";
// var minSize = 15;
// var thresholdValue = 100;

//Palets sur planche avec ... des reflets sur les numéros !
// var imageFile = "./images/sample15.jpg";
// var minSize = 15;
// var thresholdValue = 110;

//ALGORITHME

//On commence par charger l'image
app.dispatch(loadImageFile.action(imageFile))
.then(function(){
	app.dispatch(writeImage.action("output/1-original.jpg"));

	//Filtre noir et blanc
	app.dispatch(greyscale.action());
	app.dispatch(writeImage.action("output/2-greyscale.jpg"));
	
	//Posterize
	//ACY : Désactivé momentanément (ou pas), a tendance à ajouter les ombres des palets aux blobs
	//app.dispatch(posterize.action());
	//app.dispatch(writeImage.action("output/3-posterize.jpg"));
	
	//Seuillage
	app.dispatch(threshold.action(thresholdValue));
	app.dispatch(writeImage.action("output/4-threshold.jpg"));
	
	//Remplissage des trous créés par le seuillage
	app.dispatch(fillHoles.action());
	app.dispatch(writeImage.action("output/5-fillHoles.jpg"));	
	
	//Elimination du bruit (rayures de la planche)
	app.dispatch(eliminateNoisePixels.action(minSize));
	app.dispatch(writeImage.action("output/6-noise.jpg"));
	
	//Recherche des blobs et de leur emprise
	app.dispatch(findBlobs.action());
	app.dispatch(findBlobBoundaries.action());

	//Elimination des petits blobs
	app.dispatch(eliminateSmallBlobs.action(minSize));

	//DEBUG : Colorisation des blobs
	// app.dispatch(colorizeBlobs.action());
	//DEBUG : Dessin des emprises des blobs
	// app.dispatch(drawBlobBoundaries.action());
	// app.dispatch(writeImage.action("output/7-blobs.jpg"));
	
	//Recherche du petit
	app.dispatch(findReferenceBlob.action());
	
	//Recherche du vainqueur 
	app.dispatch(findWinnerBlob.action());
	
	//Dessin du vainqueur et du petit
	app.dispatch(drawWinnerBlob.action());

	app.dispatch(writeImage.action("output/8-result.jpg"));
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

