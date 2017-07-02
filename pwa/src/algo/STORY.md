
## CPU naive

Pour tous les points et pour chaque radius on regarde si c'est un cercle

Lent !

## CPU Hough Transform

Inspiré par https://blogs.dropbox.com/tech/2016/08/fast-and-accurate-document-detection-for-scanning/

Bien plus rapide ! Assez rapide sur PC mais pas sur GPU

## GPU : Préambule : A la mano

Expliquer les shaders
Expliquer comment on s'en sert en JS

Difficultés : 
- Fastidieux
- Autre language

## GPU opération par opération

Ici on utilise la méthode brute force au lieu du hough transform parce que je n'ai pas trouvé comment l'exprimer sur le GPU

Les premiers tests montrent que le calcul pour un rayon donné est bien plus rapide

Le souci que l'on voit en débugguant est que sur 140ms, on a une majorité du temps (3 * 40ms) passée dans les set et les from pour envoyer les tableaux au GPU et les reconvertir en sortie

Le gaspillage est d'autant plus grand que l'on doit dupliquer quelques opérations comme l'application du seuil pour l'appliquer sur l'accumulation et sur l'accummulationRadius etant donné que le kernel GPU ne renvoie qu'un résultat --> Double gaspillage

Difficultés : 
- reconvertir les tableaux de sortie qui sont des typed array en array normaux, car la lib ne gère pas bien les typed array en entrée de l'algo suivant 
- pas de debug

## GPU Toutes les opérations d'un coup

Difficultés : 
- les tableaux manipulés entre les kernels ne sont plus des tableaux à 2 dimensions mais à 1 dimension
- encore moins de débug entre les différentes phases

TODO 

