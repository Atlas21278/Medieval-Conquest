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
  let currentFrame = 0;
  let frameCount = 0;
  const frameInterval = 10;
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
    ctx.drawImage(castleLeftImage, -100 - cameraX, canvas.height - castleHeight - 80, castleWidth, castleHeight);
    ctx.drawImage(castleRightImage, levelWidth - castleWidth + 100 - cameraX, canvas.height - castleHeight - 80, castleWidth, castleHeight);
  }

  for (let i = 1; i <= knightFrames; i++) {
    const img = new Image();
    img.src = `soldat/knight_walk_${i}.png`;
    knightImages.push(img);
  }

  for (let i = EnnemisFrames; i > 0; i--) {
    const img = new Image();
    img.src = `Ennemis/E_${i}.png`;
    EnnemisImages.push(img);
  }


  function drawSoldiers() {
    friendlySoldiers.forEach((soldier) => {
      drawHealthBar(soldier.x - cameraX, soldier.y, soldier.hp, 'friendly');
      ctx.drawImage(knightImages[soldier.currentFrame], soldier.x - cameraX, soldier.y, soldierSize +30, soldierSize +30);
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
      // Limiter le mouvement des troupes amies une fois qu'elles sont au-delà du château ennemi
      if (soldier.x + soldierSize >= levelWidth - castleWidth + 100) {
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
      // Limiter le mouvement des troupes ennemies une fois qu'elles sont au-delà du château ami
      if (enemy.x <= castleWidth - 100) {
        enemy.x = castleWidth - 100;
      }
    });

  }


  function engageCombat(ally, enemy) {
    const attackInterval = 1000; // Interval de temps entre chaque attaque en millisecondes

    ally.inCombat = true; // Définir le soldat allié en combat

    let attackTimer = setInterval(() => {
      // Réduire les points de vie de l'ennemi
      enemy.hp -= 10; // Réduire de 10 points de vie à chaque attaque, ajustez selon vos besoins

      // Vérifier si l'ennemi est éliminé
      if (enemy.hp <= 0) {
        clearInterval(attackTimer); // Arrêter l'attaque
        // Supprimer l'ennemi du tableau des ennemis
        const index = enemySoldiers.indexOf(enemy);
        if (index !== -1) {
          enemySoldiers.splice(index, 1);
        }
        // Reprendre le mouvement après la fin du combat
        ally.moving = true;
        ally.inCombat = false; // Le soldat allié n'est plus en combat
      }

      // Réduire les points de vie de l'allié
      ally.hp -= 5; // Réduire de 5 points de vie à chaque attaque, ajustez selon vos besoins

      // Vérifier si l'allié est éliminé
      if (ally.hp <= 0) {
        clearInterval(attackTimer); // Arrêter l'attaque
        // Supprimer l'allié du tableau des alliés
        const index = friendlySoldiers.indexOf(ally);
        if (index !== -1) {
          friendlySoldiers.splice(index, 1);
        }
        ally.inCombat = false; // Le soldat allié n'est plus en combat
      }
    }, attackInterval);
  }

  function checkCollisions() {
    friendlySoldiers.forEach((friendlySoldier) => {
      if (!friendlySoldier.inCombat) { // Vérifier si le soldat allié n'est pas déjà en combat
        enemySoldiers.forEach((enemySoldier) => {
          if (!enemySoldier.inCombat) { // Vérifier si le soldat ennemi n'est pas déjà en combat
            if (checkCollision(friendlySoldier, enemySoldier)) {
              // Arrêter le mouvement des soldats lorsqu'ils entrent en collision
              friendlySoldier.moving = false;
              enemySoldier.moving = false;
              // Engager le combat entre les deux soldats
              engageCombat(friendlySoldier, enemySoldier);
            }
          }
        });
      }
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

  setInterval(updateGame, 1000 / 60);

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
});
