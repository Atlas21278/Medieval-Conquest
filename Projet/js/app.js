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
  const castleHealth = 500; // Points de vie initiaux des châteaux
  let leftCastleHP = castleHealth;
  let rightCastleHP = castleHealth;
  let frameCount = 0;
  let gameInterval;
  let friendlySoldiers = [];
  let enemySoldiers = [];
  let gold = 0;

  let cameraX = 0;
  const levelWidth = 2000;

  backgroundImage.onload = function() {
    drawBackground();
  };

  function drawBackground() {
    ctx.drawImage(backgroundImage, -cameraX, 0, levelWidth, canvas.height);
  }

  canvas.addEventListener('wheel', function(e) {
    if (e.deltaX !== 0) {
      const maxCameraX = levelWidth - canvas.width;
      const scrollSpeed = 10; // Adjust this value as needed
      cameraX -= e.deltaX * scrollSpeed;
      if (cameraX < 0) cameraX = 0;
      if (cameraX > maxCameraX) cameraX = maxCameraX;
      e.preventDefault();
      updateGame();
    }
  });

  function drawCastles() {
    // Dessiner les châteaux
    ctx.drawImage(castleLeftImage, -100 - cameraX, canvas.height - castleHeight - 80, castleWidth, castleHeight);
    ctx.drawImage(castleRightImage, levelWidth - castleWidth + 100 - cameraX, canvas.height - castleHeight - 80, castleWidth, castleHeight);

    // Dessiner les barres de vie des châteaux
    const leftCastleHealthBarWidth = castleWidth * (leftCastleHP / castleHealth);
    const rightCastleHealthBarWidth = castleWidth * (rightCastleHP / castleHealth);

    // Barre de vie du château de gauche
    ctx.fillStyle = 'gray';
    ctx.fillRect(-100 - cameraX, canvas.height - castleHeight - 100, castleWidth, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(-100 - cameraX, canvas.height - castleHeight - 100, leftCastleHealthBarWidth, 10);

    // Barre de vie du château de droite
    ctx.fillStyle = 'gray';
    ctx.fillRect(levelWidth - castleWidth + 100 - cameraX, canvas.height - castleHeight - 100, castleWidth, 10);
    ctx.fillStyle = 'green';
    ctx.fillRect(levelWidth - castleWidth + 100 - cameraX, canvas.height - castleHeight - 100, rightCastleHealthBarWidth, 10);
  }

  for (let i = 1; i <= knightFrames; i++) {
    const img = new Image();
    img.src = `img/soldat/knight_walk_${i}.png`;
    knightImages.push(img);
  }

  for (let i = EnnemisFrames; i > 0; i--) {
    const img = new Image();
    img.src = `img/Ennemis/E_${i}.png`;
    EnnemisImages.push(img);
  }

  for (let i = 1; i <= allyAttackFrames; i++) {
    const img = new Image();
    img.src = `img/attack/knight_attack_${i}.png`;
    allyAttackImages.push(img);
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
      ctx.drawImage(EnnemisImages[enemy.currentFrame], enemy.x - cameraX, enemy.y, soldierSize, soldierSize);
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
      if (enemy.moving) {
        enemy.x -= soldierSpeed;
        if (frameCount % 5 === 0) {
          enemy.currentFrame = (enemy.currentFrame + 1) % EnnemisFrames;
        }
      }
      // Attaque du château lorsque les troupes ennemies atteignent le château
      if (enemy.x <= castleWidth - 100) {
        leftCastleHP -= 5; // Réduire la santé du château de gauche
        enemy.x = castleWidth - 100;
      }
      // Limiter le mouvement des troupes ennemies une fois qu'elles sont au-delà du château ami
      if (enemy.x <= castleWidth - 100) {
        enemy.x = castleWidth - 100;
      }
    });

    // S'assurer que la santé des châteaux ne descende pas en dessous de 0
    if (leftCastleHP < 0) leftCastleHP = 0;
    if (rightCastleHP < 0) rightCastleHP = 0;

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
      enemy.hp -= 10;
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

    let enemyAttackTimer = setInterval(() => {
      ally.hp -= 10;

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

  function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCastles();
    drawSoldiers();
    updateSoldiers();
    updateGoldCounter();
    checkCollisions();
  }

  function updateGoldCounter() {
    const goldCounter = document.getElementById('goldCounter');
    goldCounter.textContent = 'Gold: ' + gold;
  }

  gameInterval = setInterval(updateGame, 1000 / 60);

  setInterval(() => {
    gold += 10;
  }, 1000);

  setInterval(() => {
    enemySoldiers.push({ x: levelWidth - castleWidth + 100, y: 450, hp: 100, moving: true, currentFrame: 0, inCombat: false });
  }, 3000);

  document.getElementById('launchButton').addEventListener('click', function() {
    if (gold >= 10) {
      friendlySoldiers.push({ x: 120, y: 450, hp: 100, moving: true, currentFrame: 0, inCombat: false });
      gold -= 10;
    }
  });

  function resetGame() {
    leftCastleHP = castleHealth;
    rightCastleHP = castleHealth;
    friendlySoldiers = [];
    enemySoldiers = [];
    gold = 0;
    frameCount = 0;
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, 1000 / 60);
  }
});
