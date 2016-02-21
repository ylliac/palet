/*
	Main.
*/

var app = require('./app');
require('./actions');

//CHARGEMENT DES REDUCERS
app.registerReducerDirectory('./reducers');

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
app.doAsync(LOAD_IMAGE_FILE, imageFile)
.then(function(){
	app
	.do(WRITE_IMAGE, "output/1-original.jpg")

	//Filtre noir et blanc
	.do(GREYSCALE)
	.do(WRITE_IMAGE,"output/2-greyscale.jpg")
	
	//Seuillage
	.do(THRESHOLD, thresholdValue)
	.do(WRITE_IMAGE, "output/4-threshold.jpg")
	
	//Remplissage des trous créés par le seuillage
	.do(FILL_HOLES)
	.do(WRITE_IMAGE, "output/5-fillHoles.jpg")
	
	//Elimination du bruit (rayures de la planche)
	.do(ELIMINATE_NOISE_PIXELS, minSize)
	.do(WRITE_IMAGE, "output/6-noise.jpg")
	
	//Recherche des blobs et de leur emprise
	.do(FIND_BLOBS)
	.do(FIND_BLOB_BOUNDARIES)

	//Elimination des petits blobs
	.do(ELIMINATE_NOISE_PIXELS, minSize)

	//DEBUG : Colorisation des blobs
	// .do(COLORIZE_BLOBS)
	//DEBUG : Dessin des emprises des blobs
	// .do(DRAW_BLOB_BOUNDARIES)
	// .do(WRITE_IMAGE, "output/7-blobs.jpg")
	
	//Recherche du petit
	.do(FIND_REFERENCE_BLOB)
	
	//Find the closest blob and its closest pixel position
	.do(FIND_CLOSEST_BLOB)
	
	//Dessin du vainqueur et du petit
	.do(DRAW_WINNER_BLOB)

	.do(WRITE_IMAGE, "output/8-result.jpg");
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

