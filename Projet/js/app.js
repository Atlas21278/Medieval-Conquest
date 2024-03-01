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
  const soldierSpeed = 2;
  const healthBarWidth = soldierSize;
  const healthBarHeight = 5;
  const knightImages = [];
  const knightFrames = 5;
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

  function drawSoldiers() {
    friendlySoldiers.forEach((soldier, index) => {
      // Dessiner la troupe actuelle
      drawHealthBar(soldier.x, soldier.y, soldier.hp, 'friendly');
      ctx.drawImage(knightImages[currentFrame], soldier.x, soldier.y, soldierSize, soldierSize);
        let tooClose = false; // Variable pour vérifier si la troupe est trop proche d'une autre troupe
        friendlySoldiers.forEach(otherSoldier => {
          if (soldier !== otherSoldier) {
            const distance = Math.sqrt(Math.pow(soldier.x - otherSoldier.x, 2) + Math.pow(soldier.y - otherSoldier.y, 2));
            if (distance < 5 + soldierSize) {
              tooClose = true;
            }
          }
        });

        // Si la troupe n'est pas trop proche d'une autre troupe, alors elle peut avancer
        if (!tooClose) {
          // Votre logique de déplacement ici
          soldier.x += soldierSpeed; // Par exemple, déplacement horizontal vers la droite
        }
      });



    enemySoldiers.forEach(soldier => {
      ctx.fillStyle = 'red';
      ctx.fillRect(soldier.x, soldier.y, soldierSize, soldierSize);
      drawHealthBar(soldier.x, soldier.y - healthBarHeight - 5, soldier.hp, 'enemy');
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
      // Les soldats alliés doivent s'arrêter juste avant d'atteindre le château ennemi à droite
      if (soldier.x < (canvas.width - castleWidth + 100 - soldierSize - 5) && soldier.moving) {
        const collision = enemySoldiers.some(enemy => Math.abs(soldier.x - enemy.x) < 5 + soldierSize);
        if (!collision) {
          soldier.x += soldierSpeed;
        } else {
          // Optionnel: Arrêter le soldat lorsqu'il rencontre un ennemi
          soldier.moving = false;
        }
      }
      return soldier;
    });

    enemySoldiers = enemySoldiers.map(enemy => {
      // Les soldats ennemis doivent s'arrêter juste avant d'atteindre le château allié à gauche
      if (enemy.x > (100 + soldierSize + 5) && enemy.moving) {
        const collision = friendlySoldiers.some(soldier => Math.abs(enemy.x - soldier.x) < 5 + soldierSize);
        if (!collision) {
          enemy.x -= soldierSpeed;
        } else {
          // Optionnel: Arrêter le soldat lorsqu'il rencontre un ennemi
          enemy.moving = false;
        }
      }
      return enemy;
    });
  }


  function drawGoldCounter() {
    ctx.fillStyle = 'gold';
    ctx.font = '20px Arial';
    ctx.fillText(`Gold: ${gold}`, 10, 30);
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
