
var fs = require('fs');
var path = require('path');
var app = require('./app');
require('./actions');

app.registerReducerDirectory(path.resolve(__dirname, 'reducers'));

var run = function(imageFile, minSize, thresholdValue){

	//On créé le répertoire du résultat
	var basename = path.basename(imageFile, path.extname(imageFile));
	var outputDir = path.resolve(__dirname, '../output', basename);
	try {
	    fs.accessSync(outputDir, fs.F_OK);
	} catch (e) {
	    fs.mkdirSync(outputDir);
	}
	

	//On commence par charger l'image
	return app.doAsync(LOAD_IMAGE_FILE, path.resolve(__dirname, imageFile))
	.then(function(){
		app
		.do(WRITE_IMAGE, path.resolve(outputDir, '1-original.jpg'))

		//Filtre noir et blanc
		.do(GREYSCALE)
		.do(WRITE_IMAGE, path.resolve(outputDir, '2-greyscale.jpg'))
		
		//Seuillage
		.do(THRESHOLD, thresholdValue)
		.do(WRITE_IMAGE, path.resolve(outputDir, '4-threshold.jpg'))
		
		//Remplissage des trous créés par le seuillage
		.do(FILL_HOLES)
		.do(WRITE_IMAGE, path.resolve(outputDir, '5-fillHoles.jpg'))
		
		//Elimination du bruit (rayures de la planche)
		.do(ELIMINATE_NOISE_PIXELS, minSize)
		.do(WRITE_IMAGE, path.resolve(outputDir, '6-noise.jpg'))
		
		//Recherche des blobs et de leur emprise
		.do(FIND_BLOBS)
		.do(FIND_BLOB_BOUNDARIES)

		//Elimination des petits blobs
		.do(ELIMINATE_NOISE_PIXELS, minSize)

		//DEBUG : Colorisation des blobs
		// .do(COLORIZE_BLOBS)
		//DEBUG : Dessin des emprises des blobs
		// .do(DRAW_BLOB_BOUNDARIES)
		// .do(WRITE_IMAGE, path.resolve(outputDir, '7-blobs.jpg'))
		
		//Recherche du petit
		.do(FIND_REFERENCE_BLOB)
		
		//Find the closest blob and its closest pixel position
		.do(FIND_CLOSEST_BLOB)
		
		//Dessin du vainqueur et du petit
		.do(DRAW_WINNER_BLOB)

		.do(WRITE_IMAGE, path.resolve(outputDir, '8-result.jpg'));
	});
};

module.exports = run;

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

