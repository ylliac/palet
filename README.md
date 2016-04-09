# Test de reconnaissance automatique du plus proche palet

TODO :  
- Tester PouchDB pour stocker le store ?
- Ajouter Chai-immutable
- Créer l'appli Android
- Ajouter MaterialUI (http://www.material-ui.com/#/)
- Ajouter Webpack
- Ajouter React

## Mettre en place l'environnement

- Installer Node et Git
- Récupérez les sources
- ```npm install``` : télécharge les dépendances
- ```npm install -g cordova``` : installe Cordova
  
Si vous utilisez l'IDE Sublime Text 3, installez les packages suivants :

- ```SublimeLinter``` et ```SublimeLinter-contrib-eslint``` : Vérification syntaxique avec ESLint
- ```Babel``` : Coloration syntaxique des fichiers JS et JSX de React (voir https://github.com/babel/babel-sublime pour la configuration)
- ```Sass``` : Coloration syntaxique des fichiers SASS

## Comment exécuter ?

Dans une invite de commande, au même niveau que `package.json`, executer une des commandes suivantes :

- ```npm run lint``` : Lance ESLint sur le dossier src.
- ```npm run test``` : Lance les tests.
- ```npm run build``` : Build le projet (single html file and single js file) en mode dev.
- ```npm run build:prod``` : Build le projet (single html file and single js file) en mode production.
- ```npm run build:cordova``` : Build le projet (single html file and single js file) en mode Cordova.
- ```npm run start``` - démarre un serveur avec react model replacement et devtools.
- ```npm run start:prod``` - démarre un serveur avec react model replacement et minification du fichier html et js.

# Application Android (TODO outdated)

## Lancer l'application dans le navigateur

Dans le répertoire paletApp :

> cordova run browser

## Mettre en place l'environnement pour Android

(https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#installing-the-requirements)

- Installer le JDK 7 ou plus
- Installer Android Studio
- Lancer Android Studio et le laisser télécharger ses trucs
- Setter la variable JAV_HOME et ANDROID_HOME sur le dossier d'installation du JDK et du SDK Android
- Ajouter %ANDROID_HOME%\platform-tools et %ANDROID_HOME%\tools à la variable PATH 
- Verifier que le projet peut se lancer sous Android en tapant `cordova run android --list`

## Lancer l'application sur le simulateur Android

Dans le répertoire paletApp :

> cordova run android

(Relancer la commande sans fermer l'émulateur si ca bloque)



# SOURCES 

https://github.com/unimonkiez/react-cordova-boilerplate
http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html#writing-the-application-logic-with-pure-functions
https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md

