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

  backgroundImage.onload = function() {
    drawBackground();
  };

  function drawBackground() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  }

  function drawCastles() {
    ctx.drawImage(castleLeftImage, -100, canvas.height - castleHeight - 80, castleWidth, castleHeight);
    ctx.drawImage(castleRightImage, canvas.width - castleWidth +100, canvas.height - castleHeight - 80, castleWidth, castleHeight);
  }

  for (let i = 1; i <= knightFrames; i++) {
    const img = new Image();
    img.src = `soldat/knight_walk_${i}.png`;
    knightImages.push(img);
  }

  for (let i = 1; i <= EnnemisFrames; i++) {
    const img = new Image();
    img.src = `Ennemis/E_${i}.png`;
    EnnemisImages.push(img);
  }

  function drawSoldiers() {
    friendlySoldiers.forEach((soldier) => {
      // Dessiner la troupe alliée actuelle
      drawHealthBar(soldier.x, soldier.y, soldier.hp, 'friendly');
      ctx.drawImage(knightImages[currentFrame], soldier.x, soldier.y, soldierSize, soldierSize);
      let tooClose = false; // Variable pour vérifier si la troupe est trop proche d'une autre troupe
      friendlySoldiers.forEach(otherSoldier => {
        if (soldier !== otherSoldier) {
          const alignedVertically = Math.abs(otherSoldier.y - soldier.y) < soldierSize / 2;
          const closeHorizontally = Math.abs(otherSoldier.x - soldier.x) < 5 + soldierSize;
          if (alignedVertically && closeHorizontally) {
            tooClose = true;
          }
        }
      });
      // Si la troupe n'est pas trop proche d'une autre troupe, alors elle peut avancer
      if (!tooClose && soldier.moving) {
        soldier.x += soldierSpeed; // Par exemple, déplacement horizontal vers la droite
      }
    });

    enemySoldiers.forEach(enemy => {
      // Dessiner la troupe ennemie actuelle
      drawHealthBar(enemy.x, enemy.y, enemy.hp, 'enemy');
      ctx.drawImage(EnnemisImages[currentFrame], enemy.x, enemy.y, soldierSize, soldierSize);
      let tooClose = false; // Variable pour vérifier si la troupe ennemie est trop proche d'une autre troupe ennemie
      enemySoldiers.forEach(otherEnemy => {
        if (enemy !== otherEnemy) {
          const alignedVertically = Math.abs(otherEnemy.y - enemy.y) < soldierSize / 2;
          const closeHorizontally = Math.abs(otherEnemy.x - enemy.x) < 5 + soldierSize;
          if (alignedVertically && closeHorizontally) {
            tooClose = true; // Si une troupe ennemie est trop proche, définir tooClose sur true
          }
        }
      });
      // Si la troupe ennemie n'est pas trop proche d'une autre troupe ennemie, alors elle peut avancer
      if (!tooClose && enemy.moving) {
        enemy.x -= soldierSpeed; // Par exemple, déplacement horizontal vers la gauche
      }
    });

    frameCount++;
    if (frameCount >= frameInterval) {
      frameCount = 0;
      currentFrame = (currentFrame + 1) % knightFrames;
    }
  }

  function drawHealthBar(x, y, hp, type) {
    ctx.fillStyle = 'gray';
    ctx.fillRect(x, y, healthBarWidth, healthBarHeight);
    ctx.fillStyle = type === 'friendly' ? 'green' : 'darkred';
    ctx.fillRect(x, y, healthBarWidth * (hp / 100), healthBarHeight);
  }

  function updateSoldiers() {
    friendlySoldiers = friendlySoldiers.map(soldier => {
      if (soldier.x < (canvas.width - castleWidth + 100 - soldierSize - 5) && soldier.moving) {
        const collision = enemySoldiers.some(enemy => Math.abs(soldier.x - enemy.x) < 5 + soldierSize);
        const tooClose = friendlySoldiers.some(otherSoldier => soldier !== otherSoldier && Math.abs(soldier.x - otherSoldier.x) < 5 + soldierSize);
        if (!collision && !tooClose) {
          soldier.x += soldierSpeed;
        } else {
          // Arrêter le soldat lorsqu'il rencontre un ennemi ou un allié
          soldier.moving = false;
        }
      }
      return soldier;
    });

    enemySoldiers = enemySoldiers.map(enemy => {
      if (enemy.x > (100 + soldierSize + 5) && enemy.moving) {
        const collision = friendlySoldiers.some(soldier => Math.abs(enemy.x - soldier.x) < 5 + soldierSize);
        const tooClose = enemySoldiers.some(otherEnemy => enemy !== otherEnemy && Math.abs(enemy.x - otherEnemy.x) < 5 + soldierSize);
        if (!collision && !tooClose) {
          enemy.x -= soldierSpeed;
        } else {
          // Arrêter le soldat lorsqu'il rencontre un allié ou un ennemi
          enemy.moving = false;
        }
      }
      return enemy;
    });
  }


  function drawGoldCounter() {
    const goldCounter = document.getElementById('goldCounter');
    goldCounter.innerText = `Gold: ${gold}`;
  }


  function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCastles();
    drawSoldiers();
    drawGoldCounter();
    updateSoldiers();
  }

  setInterval(updateGame, 1000 / 60);

  setInterval(() => {
    gold += 10;
  }, 1000);

  setInterval(() => {
    enemySoldiers.push({ x: canvas.width - castleWidth + 100, y: 450, hp: 100, moving: true });
  }, 1000);

  document.getElementById('launchButton').addEventListener('click', function() {
    if (gold >= 10) {
      friendlySoldiers.push({ x: 120, y: 450, hp: 100, moving: true });
      gold -= 10;
    }
  });
});
