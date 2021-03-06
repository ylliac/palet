# Test de reconnaissance automatique du plus proche palet

TODO :  
- Tester PouchDB pour stocker le store ?
- Ajouter Chai-immutable
- Créer l'appli Android
- Ajouter MaterialUI (http://www.material-ui.com/#/)

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
- ```npm run start``` - démarre un serveur avec Hot Module Replacement et devtools.
- ```npm run start:prod``` - démarre un serveur avec react model replacement et minification du fichier html et js.


## Hot Module Replacement

Derrière ce nom se cache un truc de ouf.

Lancez l'application avec ```npm run start```, ouvrez votre navigateur à l'adresse ```http://localhost:3000``` et mettez le sur la moitié gauche de votre écran (touche windows + flèche gauche).

Ouvrez votre IDE, ouvrez le fichier ```MainSection.jsx``` et mettez la fenêtre sur la partie droite.

Prêts ? Maintenant dans ```MainSection.jsx```modifiez un des textes, sauvegardez et attendez quelques secondes... magie !
La page s'est remise à jour sans que vous ayez eu besoin de rafraichir votre navigateur !

Encore mieux ? Ajoutez ```{toto}``` dans l'un des textes et sauvegardez. Bien sur cette variable toto n'existe pas et la page rouge qui vient de s'afficher dans votre navigateur est la pour vous le rappeler !  

## Dev Tools

Ce sont les outils de developpement Redux qui permettent de visualiser l'évolution de l'état directement dans le navigateur.
Pour les afficher / masquer, tapez ```alt + h```. 


# Application Android 

## Comment exécuter ?

Dans une invite de commande, au même niveau que `package.json`, executer une des commandes suivantes :

- ```npm run build:cordova``` : Build le projet (single html file and single js file) en mode Cordova.
- ```cordova run browser``` : Lance l'application dans le navigateur.
- ```cordova run android``` : Lance l'application dans l'émulateur android (*).

(*) Relancer la commande sans fermer l'émulateur si ca bloque


## Mettre en place l'environnement pour Android

(https://cordova.apache.org/docs/en/latest/guide/platforms/android/index.html#installing-the-requirements)

- Installer le JDK 7 ou plus
- Installer Android Studio
- Lancer Android Studio et le laisser télécharger ses trucs
- Setter la variable JAV_HOME et ANDROID_HOME sur le dossier d'installation du JDK et du SDK Android
- Ajouter %ANDROID_HOME%\platform-tools et %ANDROID_HOME%\tools à la variable PATH 
- Verifier que le projet peut se lancer sous Android en tapant `cordova run android --list`

## Je n'arrive pas à lancer l'application sur mon téléphone

Dans une invite de commande, tapez ```adb devices -l```.
Si la liste des devices attachés est vide, votre téléphone n'est pas reconnu.

Commencez par activer les options développeurs sur votre téléphone et activez le déboguage USB (Google it).

Si cela ne marche toujours pas, allez dans le gestionnaire de périphériques de Windows : il se peut que votre téléphone soit marqué d'une icône warning indiquant que les drivers n'ont pas été trouvé.
Dans ce cas, tapez dans une invite de commande ```android```. Dans la liste des packages proposée, installez `Extras / Google USB driver`.
Une fois terminé, retournez dans le gestionnaire de périphériques, faites un clic droit sur le téléphone et cliquez sur `mettre à jour le pilote`.
Choisissez l'option `Rechercher un pilote sur mon ordinateur` et sélectionnez le chemin suivant :
```[SDK Android]/extras/google/usb_driver``` (par exemple, ```C:/Users/MyUser/AppData/Local/Android/Sdk/extras/google/usb_driver```) et validez.

Retapez la commande ```adb devices -l``` dans l'invite de commande, votre téléphone devrait s'y trouver.


# SOURCES 

https://github.com/unimonkiez/react-cordova-boilerplate
http://teropa.info/blog/2015/09/10/full-stack-redux-tutorial.html#writing-the-application-logic-with-pure-functions
https://github.com/reactjs/react-router
https://github.com/gaearon/redux-devtools/blob/master/docs/Walkthrough.md

