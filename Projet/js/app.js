document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const backgroundImage = new Image();
  backgroundImage.src = 'img/Background3.webp';

  const castleLeftImage = new Image();
  castleLeftImage.src = 'img/CastleLeft.png';

  const castleRightImage = new Image();
  castleRightImage.src = 'img/CastleRight.png';

  const castleWidth = 230;
  const castleHeight = 250;
  const soldierSize = 20;
  const soldierSpeed = 2;
  const healthBarWidth = soldierSize;
  const healthBarHeight = 5;
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

  function drawSoldiers() {
    friendlySoldiers.forEach(soldier => {
      ctx.fillStyle = 'blue';
      ctx.fillRect(soldier.x, soldier.y, soldierSize, soldierSize);
      drawHealthBar(soldier.x, soldier.y - healthBarHeight - 5, soldier.hp, 'friendly');
    });

    enemySoldiers.forEach(soldier => {
      ctx.fillStyle = 'red';
      ctx.fillRect(soldier.x, soldier.y, soldierSize, soldierSize);
      drawHealthBar(soldier.x, soldier.y - healthBarHeight - 5, soldier.hp, 'enemy');
    });
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
