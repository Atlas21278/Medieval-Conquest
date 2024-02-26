# Medieval-Conquest

## Commande pour :
* Lancer le projet.
  * Ouvrir le fichier index.html dans un navigateur

## Concept du Jeu : Medieval Conquest

### Scénario :
Dans un monde médiéval en proie à la guerre et à la rivalité entre royaumes, vous incarnez un seigneur ambitieux cherchant à étendre son territoire et à asseoir sa domination sur la contrée. Entre alliances et trahisons, votre objectif est de devenir le souverain le plus puissant de cette ère tourmentée.

### Objectif Principal :
Mener votre royaume à la victoire en conquérant les territoires voisins, en bâtissant une armée redoutable et en gérant habilement vos ressources, en particulier votre or, pour financer vos campagnes militaires.

### Mécaniques de Jeu :

- **Gestion de l'or :** Collectez et gérez judicieusement vos ressources en or pour recruter des troupes, construire des défenses et développer votre royaume.
- **Déploiement des troupes :** Utilisez stratégiquement votre armée pour défendre vos frontières, attaquer les royaumes adverses et capturer de nouveaux territoires.
- **Recrutement de troupes :** Entraînez une variété d'unités militaires, telles que des archers, des lanciers et des cavaliers, chacune ayant des coûts et des capacités spécifiques.
- **Conquête de territoires :** Envahissez les châteaux et les cités ennemis, établissez des avant-postes et étendez votre influence à travers la carte du jeu.

### Caractéristiques Principales :

- **Campagne solo immersive :** Plongez dans une campagne solo riche en rebondissements, où chaque décision influence le destin de votre royaume.
- **Personnalisation de l'armée :** Personnalisez votre armée avec différentes unités, équipements et stratégies de combat pour vous adapter à chaque situation.

### Expérience de Jeu :
* Medieval Conquest offre une expérience de jeu stratégique et immersive où chaque choix compte. La gestion habile de vos ressources et le déploiement judicieux de vos troupes seront essentiels pour remporter la victoire et bâtir votre empire médiéval.

### Public Cible :
* Les joueurs passionnés par les jeux de stratégie en temps réel, les amateurs d'histoire médiévale et ceux qui recherchent un défi intellectuel trouveront leur bonheur dans Medieval Conquest.

### Inspiration :

- **Age of War :** Nous nous sommes insipirée du but du jeu principal.

### Plateformes :
* PC

### Conclusion :
Medieval Conquest offre une aventure palpitante dans un monde médiéval brutal et impitoyable. Avec ses batailles épiques, sa gestion complexe des ressources et ses options de personnalisation étendues, le jeu promet une expérience captivante pour les fans de stratégie sur PC.

## Fonctionnement du jeu:

- Les soldats amicaux apparaissent du château du joueur à chaque clic sur le bouton "Launch".
- Les soldats ennemis apparaissent du château ennemi à intervalles réguliers.
- Les soldats avancent vers l'autre château jusqu'à ce qu'ils rencontrent un ennemi, atteignent leur objectif ou soient abattus par les arbalètes.
- Les joueurs ont la possibilité d'envoyer des mineurs pour collecter de l'or en cliquant sur un bouton dédié.
- Les arbalètes des châteaux tirent automatiquement des projectiles sur les troupes ennemies proches.
- Les joueurs peuvent régler l'angle de l'arbalète de leur château pour viser les ennemis plus efficacement.

### Mécanismes du jeu :

- Les soldats amicaux et ennemis ont une jauge de santé. Ils se battent jusqu'à ce que l'un des deux perde toute sa santé ou atteigne son objectif.
- Les châteaux perdent de la santé lorsqu'ils sont attaqués par des soldats ennemis ou lorsqu'ils sont touchés par des projectiles ennemis.
### Objectif du jeu :
- L'objectif du jeu est de détruire le château ennemi tout en protégeant son propre château.
- Les joueurs doivent collecter de l'or pour financer leurs attaques et améliorer leurs défenses.
* Fin du jeu :
- Le jeu se termine lorsque le joueur à conquis toute les terres du continent en s'emparant des chateaux environant.


## Points de difficulté du code.

## Explication de l'identité graphique:

  - On a voulu s'inspirer de nos jeux d'enfance qui avait un graphisme assez simple et ajouter notre touche en le rendant médieval pour ajouter une identité spéciale à notre jeu

## Déroulement des étapes du developpement.

  - D'abord, il nous a fallu créer une maquette idéale du jeu avec les placements des différentes fonctionnalités immaginées, puis en commençant par des fonctions basiques telle que lancer une troupe en fonction d'un taux d'or augmentant toute les secondes (représenter par des carré bleu) et automatiser l'envoi de troupe ennemi (par un carré rouge), puis ajouter un fond et

## Construction de la Base de Données


### Table "Scores" :
    Cette table enregistre les meilleurs temps des joueurs.
    Chaque enregistrement dans cette table correspond à un score réalisé par un joueur.
    
### Colonnes :
    - ID: Identifiant unique de chaque enregistrement (clé primaire).
    - PlayerName: Nom du joueur qui a réalisé le score.
    - Time: Temps réalisé par le joueur (en secondes ou dans le format approprié pour votre jeu).

### Explication détaillée :
    * ID (Identifiant) :
        Type de données : Entier (Auto-incrémenté)
        Explication : Chaque score enregistré est identifié de manière unique par un numéro d'identification. Cela permet de différencier chaque score dans la base de données.
      
    * PlayerName (Nom du joueur) :
        Type de données : Chaîne de caractères
        Explication : Cette colonne enregistre le nom du joueur qui a réalisé le score. Cela permet d'identifier le joueur associé à chaque meilleur temps.
    * Time (Temps réalisé) :
        Type de données : Entier ou Décimal
        Explication : Cette colonne enregistre le temps réalisé par le joueur pour atteindre un certain objectif ou terminer une partie. Par exemple, il peut s'agir du temps écoulé pour terminer un niveau ou pour battre un record.