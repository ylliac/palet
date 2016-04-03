# Test de reconnaissance automatique du plus proche palet

TODO :  
- Tester PouchDB pour stocker le store ?
- Ajouter Chai-immutable
- Cr�er l'appli Android

## Mettre en place l'environnement

Installer Git pour récupérer les sources.

Installer NodeJS pour exécute l'appli.

Installer Iron-Node pour débugger.

## Récupérer les dépendances

Dans une invite de commande, au même niveau que `package.json`, executer la commande suivante :

> npm install

## Comment exécuter ?

Dans une invite de commande, au même niveau que `package.json`, executer la commande suivante :

> npm start


# Application Android

## Installer Cordova

> npm install -g cordova

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



