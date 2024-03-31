document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const backgroundImage = new Image();
  backgroundImage.src = 'img/Background.png';

  const castleLeftImage = new Image();
  castleLeftImage.src = 'img/CastleLeft.png';

  const castleRightImage = new Image();
  castleRightImage.src = 'img/CastleRight.png';

  const castleWidth = 230;
  const castleHeight = 250;
  const soldierSize = 80;
  const soldierSpeed = 1;
  const healthBarWidth = soldierSize;
  const healthBarHeight = 5;
  const knightImages = [];
  const EnnemisImages = [];
  const knightFrames = 5;
  const EnnemisFrames = 6;
  const allyAttackImages = [];
  const allyAttackFrames = 8;
  const EnnemisAttackFrames = 5;
  const EnnemisAttackImages = [];
  const castleHealth = 500; // Points de vie initiaux des châteaux
  let leftCastleHP = castleHealth;
  let rightCastleHP = castleHealth;
  let castleDamageTimer = null;
  let frameCount = 0;
  let gameInterval;
  let friendlySoldiers = [];
  let enemySoldiers = [];
  let gold = 0;

  let cameraX = 0;
  const levelWidth = 2000;

  // Ajout des variables pour le déplacement gauche/droite
  let moveLeft = false;
  let moveRight = false;

  backgroundImage.onload = function () {
    drawBackground();
  };

  document.getElementById('launchButton').addEventListener('click', function () {
    launchSoldier();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === "ArrowLeft") {
      moveLeft = true;
    } else if (e.key === "ArrowRight") {
      moveRight = true;
    }
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === "ArrowLeft") {
      moveLeft = false;
    } else if (e.key === "ArrowRight") {
      moveRight = false;
    }
  });

  function updateCameraPosition() {
    const cameraSpeed = 10;
    const maxCameraX = levelWidth - canvas.width;

    if (moveLeft) {
      cameraX -= cameraSpeed;
      if (cameraX < 0) cameraX = 0;
    }
    if (moveRight) {
      cameraX += cameraSpeed;
      if (cameraX > maxCameraX) cameraX = maxCameraX;
    }
  }

  function drawBackground() {
    ctx.drawImage(backgroundImage, -cameraX, 0, levelWidth, canvas.height);
  }

  function launchSoldier() {
    if (gold >= 10) {
      friendlySoldiers.push({x: 120, y: 450, hp: 100, moving: true, currentFrame: 0, inCombat: false});
      gold -= 10;
    }
  }

  function drawCastles() {
    // Dessiner les châteaux
    ctx.drawImage(castleLeftImage, -100 - cameraX, canvas.height - castleHeight - 80, castleWidth, castleHeight);
    ctx.drawImage(castleRightImage, levelWidth - castleWidth + 100 - cameraX, canvas.height - castleHeight - 80, castleWidth, castleHeight);

    // Dessiner les barres de vie des châteaux
    const leftCastleHealthBarWidth = castleWidth * (leftCastleHP / castleHealth);
    const rightCastleHealthBarWidth = castleWidth * (rightCastleHP / castleHealth);

    // Barre de vie du château de gauche
    const leftCastleBarXOffset = 105; // Décalage vers l'intérieur du château
    const leftCastleBarY = canvas.height - castleHeight - 100;
    const leftCastleBarHeight = 10;
    const leftCastleBarWidth = castleWidth;
    const leftCastleBarBorderWidth = 1; // Largeur de la bordure noire

    // Dessiner la bordure noire
    ctx.fillStyle = 'black';
    ctx.fillRect(-100 - cameraX + leftCastleBarXOffset - leftCastleBarBorderWidth, leftCastleBarY - leftCastleBarBorderWidth, leftCastleBarWidth + 2 * leftCastleBarBorderWidth, leftCastleBarHeight + 2 * leftCastleBarBorderWidth);

    // Dessiner la barre de vie verte
    ctx.fillStyle = 'gray'; // Couleur de fond grise
    ctx.fillRect(-100 - cameraX + leftCastleBarXOffset, leftCastleBarY, leftCastleBarWidth, leftCastleBarHeight);
    ctx.fillStyle = 'green'; // Couleur verte pour la barre de vie
    ctx.fillRect(-100 - cameraX + leftCastleBarXOffset, leftCastleBarY, leftCastleHealthBarWidth, leftCastleBarHeight);

    // Barre de vie du château de droite
    const rightCastleBarX = levelWidth - castleWidth + 100 - cameraX;
    const rightCastleBarVisibleWidth = Math.min(rightCastleHealthBarWidth, castleWidth); // Assure que la barre reste dans les limites du château
    const rightCastleBarXOffset = -105; // Décalage vers l'intérieur du château
    ctx.fillStyle = 'gray';
    ctx.fillRect(rightCastleBarX + rightCastleBarXOffset, canvas.height - castleHeight - 100, castleWidth, 10);
    ctx.fillStyle = 'red';
    ctx.fillRect(rightCastleBarX + rightCastleBarXOffset, canvas.height - castleHeight - 100, rightCastleBarVisibleWidth, 10);
  }

  function drawSoldiers() {
    friendlySoldiers.forEach((soldier) => {
      drawHealthBar(soldier.x - cameraX, soldier.y, soldier.hp, 'friendly');
      if (soldier.inCombat) {
        ctx.drawImage(allyAttackImages[soldier.attackFrame], soldier.x - cameraX, soldier.y, soldierSize + 30, soldierSize + 30);
      } else {
        ctx.drawImage(knightImages[soldier.currentFrame], soldier.x - cameraX, soldier.y, soldierSize + 30, soldierSize + 30);
      }
    });

    enemySoldiers.forEach((enemy) => {
      drawHealthBar(enemy.x - cameraX, enemy.y, enemy.hp, 'enemy');
      if (enemy.inCombat) {
        ctx.drawImage(EnnemisAttackImages[enemy.attackFrame], enemy.x - cameraX, enemy.y, soldierSize, soldierSize);
      } else {
        ctx.drawImage(EnnemisImages[enemy.currentFrame], enemy.x - cameraX, enemy.y, soldierSize, soldierSize);
      }
    });
  }

  function drawHealthBar(x, y, hp, type) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(x, y, healthBarWidth, healthBarHeight);
    ctx.fillStyle = type === 'friendly' ? 'green' : 'red';
    ctx.fillRect(x, y, healthBarWidth * (hp / 100), healthBarHeight);
  }

  function updateSoldiers() {
    frameCount++; // Incrémenter le compteur de frames à chaque rafraîchissement

    friendlySoldiers.forEach((soldier) => {
      if (soldier.moving) {
        soldier.x += soldierSpeed;
        if (frameCount % 5 === 0) {
          soldier.currentFrame = (soldier.currentFrame + 1) % knightFrames;
        }
      }
      // Attaque du château ennemi lorsque les troupes amies atteignent le château ennemi
      if (soldier.x + soldierSize >= levelWidth - castleWidth + 100) {
        rightCastleHP -= 5; // Réduire la santé du château de droite
        soldier.x = levelWidth - castleWidth + 100 - soldierSize;
      }
    });

    enemySoldiers.forEach((enemy) => {
      // Code pour les troupes ennemies
      if (enemy.moving) {
        enemy.x -= soldierSpeed;
        if (frameCount % 5 === 0) {
          enemy.currentFrame = (enemy.currentFrame + 1) % EnnemisFrames;
        }
      }

      // Attaque du château lorsque les troupes ennemies atteignent le château
      if (enemy.x <= castleWidth - 100 && castleDamageTimer === null) {
        const castleDamageRate = 0.1; // Taux de dommages par intervalle de temps
        const castleDamageInterval = 1000; // Intervalle de temps entre chaque réduction de santé du château (en millisecondes)

        // Utiliser setInterval pour réduire progressivement la santé du château
        castleDamageTimer = setInterval(() => {
          leftCastleHP -= castleDamageRate;

          // Vérifier si le château est détruit
          if (leftCastleHP <= 0) {
            clearInterval(castleDamageTimer); // Arrêter le timer si le château est détruit
            leftCastleHP = 0; // S'assurer que la santé du château ne devient pas négative
          }
        }, castleDamageInterval);

        // Réinitialiser la position de l'ennemi
        enemy.x = castleWidth - 100;
      }

      // Limiter le mouvement des troupes ennemies une fois qu'elles sont au-delà du château ami
      if (enemy.x <= castleWidth - 100) {
        enemy.x = castleWidth - 100;
      }
    });

    // Vérifier si le jeu est terminé (victoire/défaite)
    if (leftCastleHP <= 0) {
      // Afficher une fenêtre de défaite pour le château de gauche
      const playAgain = confirm("Défaite : Le château de gauche a été détruit ! Voulez-vous rejouer ?");
      if (playAgain) {
        resetGame();
      } else {
        clearInterval(gameInterval);
      }
    } else if (rightCastleHP <= 0) {
      // Afficher une fenêtre de victoire pour le château de droite
      const playAgain = confirm("Victoire : Le château de droite a survécu ! Voulez-vous rejouer ?");
      if (playAgain) {
        resetGame();
      } else {
        clearInterval(gameInterval);
      }
    }
  }

  function engageCombat(ally, enemy) {
    const attackInterval = 100; // Intervalle de temps entre chaque attaque en millisecondes

    // Définir les troupes en combat
    ally.inCombat = true;
    enemy.inCombat = true;

    let allyAttackFrame = 0; // Frame actuelle de l'attaque de l'allié

    let allyAttackTimer = setInterval(() => {
      enemy.hp -= 2;
      // Vérifier si l'ennemi est éliminé
      if (enemy.hp <= 0 || ally.hp <= 0) {
        clearInterval(allyAttackTimer);
        clearInterval(enemyAttackTimer);
        // Supprimer l'ennemi du tableau des ennemis
        const index = enemySoldiers.indexOf(enemy);
        if (index !== -1) {
          enemySoldiers.splice(index, 1);
        }
        // Reprendre le mouvement après la fin du combat
        ally.inCombat = false;
        ally.moving = true;
      }

      // Afficher la frame d'attaque de l'allié
      ally.attackFrame = allyAttackFrame;
      allyAttackFrame = (allyAttackFrame + 1) % allyAttackFrames; // Passer à la prochaine frame
    }, attackInterval);

    let enemyAttackFrame = 0; // Frame actuelle de l'attaque de l'ennemi

    let enemyAttackTimer = setInterval(() => {
      ally.hp -= 2;

      // Vérifier si l'allié est éliminé
      if (ally.hp <= 0) {
        clearInterval(allyAttackTimer);
        clearInterval(enemyAttackTimer);
        // Supprimer l'allié du tableau des alliés
        const index = friendlySoldiers.indexOf(ally);
        if (index !== -1) {
          friendlySoldiers.splice(index, 1);
        }
        enemy.inCombat = false;
        enemy.moving = true; // La troupe ennemie peut également reprendre son mouvement
      }
      // Afficher la frame d'attaque de l'ennemi
      enemy.attackFrame = enemyAttackFrame;
      enemyAttackFrame = (enemyAttackFrame + 1) % EnnemisAttackFrames; // Passer à la prochaine frame
    }, attackInterval);
    ally.moving = true;
    enemy.moving = true;
  }

  function checkCollisions() {
    friendlySoldiers.forEach((friendlySoldier) => {
      enemySoldiers.forEach((enemySoldier) => {
        // Vérifier si le soldat allié est en collision avec l'ennemi
        if (checkCollision(friendlySoldier, enemySoldier)) {
          // Arrêter le mouvement des soldats
          friendlySoldier.moving = false;
          enemySoldier.moving = false;
          // Si aucun des soldats n'est déjà en combat, engager le combat
          if (!friendlySoldier.inCombat && !enemySoldier.inCombat) {
            engageCombat(friendlySoldier, enemySoldier);
            // Définir les soldats en combat
            friendlySoldier.inCombat = true;
            enemySoldier.inCombat = true;
          }
        }
      });
    });
  }

  function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + soldierSize &&
      obj1.x + soldierSize > obj2.x &&
      obj1.y < obj2.y + soldierSize &&
      obj1.y + soldierSize > obj2.y;
  }

  function updateGoldCounter() {
    const goldCounter = document.getElementById('goldCounter');
    goldCounter.textContent = 'Gold: ' + gold;
  }

  function updateGame() {
    updateCameraPosition(); // Confirmez que cette ligne est présente
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCastles();
    drawSoldiers();
    updateSoldiers();
    updateGoldCounter();
    checkCollisions();
  }

  function resetGame() {
    leftCastleHP = castleHealth;
    rightCastleHP = castleHealth;
    friendlySoldiers = [];
    enemySoldiers = [];
    gold = 0;
    frameCount = 0;
    clearInterval(gameInterval);
    if (castleDamageTimer !== null) {
      clearInterval(castleDamageTimer);
    }
    castleDamageTimer = null;
    gameInterval = setInterval(updateGame, 1000 / 60);
  }

  // Chargement des images des soldats
  for (let i = 1; i <= knightFrames; i++) {
    const img = new Image();
    img.src = `img/soldat/knight_walk_${i}.png`;
    knightImages.push(img);
  }

  // Chargement des images des ennemis
  for (let i = EnnemisFrames; i > 0; i--) {
    const img = new Image();
    img.src = `img/Ennemis/E_${i}.png`;
    EnnemisImages.push(img);
  }

  // Chargement des images d'attaque des alliés
  for (let i = 1; i <= allyAttackFrames; i++) {
    const img = new Image();
    img.src = `img/attack/knight_attack_${i}.png`;
    allyAttackImages.push(img);
  }

  // Chargement des images d'attaque des ennemis
  for (let i = EnnemisAttackFrames; i > 0; i--) {
    const img = new Image();
    img.src = `img/attackE/Attack_E_${i}.png`;
    EnnemisAttackImages.push(img);
  }
// Modifier le nombre d'ennemis générés toutes les 5 secondes
  setInterval(() => {
    const randomNumber = Math.random(); // Générer un nombre aléatoire entre 0 et 1
    if (randomNumber < 0.5 && enemySoldiers.length < 2) { // Générer 2 ennemis si le nombre aléatoire est inférieur à 0.5
      enemySoldiers.push({
        x: levelWidth - castleWidth + 100,
        y: 450,
        hp: 100,
        moving: true,
        currentFrame: 0,
        inCombat: false
      });
    } else if (enemySoldiers.length < 3) { // Générer 3 ennemis si le nombre aléatoire est supérieur ou égal à 0.5
      enemySoldiers.push({
        x: levelWidth - castleWidth + 100,
        y: 450,
        hp: 100,
        moving: true,
        currentFrame: 0,
        inCombat: false
      });
    }
  }, 5000);


  // Ajout d'un intervalle pour générer de l'or automatiquement
  setInterval(() => {
    gold += 5;
  }, 1000);

  // Démarrer le jeu
  gameInterval = setInterval(updateGame, 1000 / 60);

});
