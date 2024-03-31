# Medieval-Conquest

## Commande pour :
* Lancer le projet.
  * Ouvrir le fichier accueil.html (ou index.html) dans un navigateur

## Concept du Jeu : Medieval Conquest

### Scénario :
Dans un monde médiéval en proie à la guerre et à la rivalité entre royaumes, vous incarnez un seigneur ambitieux cherchant à étendre son territoire et à asseoir sa domination sur la contrée. Votre objectif est de devenir le souverain le plus puissant de cette ère tourmentée.

### Objectif Principal :
Mener votre royaume à la victoire en conquérant les territoires voisins, en bâtissant une armée redoutable et en gérant habilement vos ressources, en particulier votre or.

### Mécaniques de Jeu :

- **Gestion de l'or :** gérez judicieusement vos ressources en or pour recruter des troupes et développer votre royaume.
- **Déploiement des troupes :** Utilisez stratégiquement votre armée pour défendre vos frontières, attaquer les royaumes adverses et dominer de nouveaux territoires.

### Expérience de Jeu :
* Medieval Conquest offre une expérience de jeu stratégique et immersive où chaque choix compte. La gestion habile de vos ressources et le déploiement judicieux de vos troupes seront essentiels pour remporter la victoire et bâtir votre empire médiéval.

### Public Cible :
* Les joueurs passionnés par les jeux de stratégie en temps réel, les amateurs d'histoire médiévale et ceux qui recherchent un défi intellectuel trouveront leur bonheur dans Medieval Conquest.

### Inspiration :

- **Age of War :** Nous nous sommes insipirée du but du jeu principal.

### Plateformes :
* PC

### Conclusion :
Medieval Conquest offre une aventure palpitante dans un monde médiéval brutal et impitoyable. Avec ses batailles épiques et sa gestion complexe des ressources, le jeu promet une expérience captivante pour les fans de stratégie sur PC.

## Fonctionnement du jeu:

- Les soldats amicaux apparaissent du château du joueur à chaque clic sur le bouton "Launch".
- Les soldats ennemis apparaissent du château ennemi à intervalles réguliers.
- Les soldats avancent vers l'autre château jusqu'à ce qu'ils rencontrent un ennemi, atteignent leur objectif ou soient abattus par les arbalètes.
- Les joueurs ont la possibilité d'envoyer des mineurs pour collecter de l'or en cliquant sur un bouton dédié.
- Les arbalètes des châteaux tirent automatiquement des projectiles sur les troupes ennemies proches.
- Les joueurs peuvent régler l'angle de l'arbalète de leur château pour viser les ennemis plus efficacement.

### Mécanismes du jeu :

- Les soldats amicaux et ennemis ont une jauge de santé. Ils se battent jusqu'à ce que l'un des deux perde toute sa santé ou atteigne son objectif.
- Les châteaux perdent de la santé lorsqu'ils sont attaqués par des soldats ennemis.
- 
### Objectif du jeu :
- L'objectif du jeu est de détruire le château ennemi tout en protégeant son propre château.
- Les joueurs doivent gérer leurs or pour financer leurs attaques et leurs défenses.
* Fin du jeu :
- Le jeu se termine lorsque le joueur à conquis les chateaux ennemis.


## Points de difficulté du code.
- L'attaque des troupes à été particulièrement difficile que ça soit pour les troupes ou les chateaux.

## Explication de l'identité graphique:

  - On a voulu s'inspirer de nos jeux d'enfance qui avait un graphisme assez simple et ajouter notre touche en le rendant médieval pour ajouter une identité spéciale à notre jeu

## Déroulement des étapes du developpement.

  - D'abord, il nous a fallu créer une maquette idéale du jeu avec les placements des différentes fonctionnalités immaginées, puis en commençant par des fonctions basiques telle que lancer une troupe en fonction d'un taux d'or augmentant toute les secondes (représenter par des carré bleu) et automatiser l'envoi de troupe ennemi (par un carré rouge), puis ajouter un fond.

## Construction de la Base de Données

CREATE TABLE players (
id INT AUTO_INCREMENT PRIMARY KEY,
username VARCHAR(191) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
level VARCHAR(50) NOT NULL
);

    
### Colonnes :
    - ID: Identifiant unique de chaque enregistrement (clé primaire).
    - Username: Nom du joueur qui a réalisé le score.
    - Level: Level choisi pour le jeu.

### Explication détaillée :
    * ID (Identifiant) :
        Type de données : Entier (Auto-incrémenté)
        Explication : Chaque score enregistré est identifié de manière unique par un numéro d'identification. Cela permet de différencier chaque score dans la base de données.
      
    * Username (Nom du joueur) :
        Type de données : Chaîne de caractères
        Explication : Cette colonne enregistre le nom du joueur qui a réalisé le score. Cela permet d'identifier le joueur associé à chaque meilleur temps.

    * Level :
        Type de données : Chaîne de caractères
        Explication : Cette colone enregistre le niveau de difficulté choisi.

### Date :

    31 mars 2024