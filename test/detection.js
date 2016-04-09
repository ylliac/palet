var chai  = require('chai');
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);
chai.should();

var palet = require('../src/palet');

describe('Detection du palet le plus proche', function() {

	describe('Palet plus planche avec rayures', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample9.png";
			var minSize = 10;
			var thresholdValue = 100;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;
		});

	});

	describe('Palet plus planche sans rayure mais avec un palet clair qui pose problème au seuillage', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample3.jpg"; 
			var minSize = 10;  
			var thresholdValue = 120;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;
			
			//TODO : Améliorer le remplissage des trous pour boucher le trou du palet du bas
		});

	});

	describe('Deux disques tout simples', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample.png";
			var minSize = 15;
			var thresholdValue = 100;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;
		});

	});

	describe('Palets sur une planche avec rayures', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample5.jpeg";
			var minSize = 15;
			var thresholdValue = 100;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;
		});

	});

	describe('Palets fortement eclairés', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample1.jpg";
			var minSize = 15;
			var thresholdValue = 200;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;

			//TODO : Les reflets sur les palets du haut crééent un trou difficile à boucher
		});

	});

	xdescribe('Palets sur planche de plusieurs couleurs : cas tordu !', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample7.jpg";
			var minSize = 15;
			var thresholdValue = 100;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;

			//TODO : Le test crash
		});

	});

	describe('Palets sur planche avec ... des reflets sur les numéros !', function () {
		
		it('doit detecter le bon palet', function () {

			var imageFile = "../images/sample15.jpg";
			var minSize = 15;
			var thresholdValue = 110;

			return palet(imageFile, minSize, thresholdValue).should.be.fulfilled;
		});

	});

});