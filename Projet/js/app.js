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
    // Friendly soldiers
    friendlySoldiers.forEach(soldier => {
      ctx.fillStyle = 'blue';
      ctx.fillRect(soldier.x + 100, soldier.y + 125, soldierSize, soldierSize);
    });

    // Enemy soldiers
    enemySoldiers.forEach(soldier => {
      ctx.fillStyle = 'red';
      ctx.fillRect(soldier.x + 100, soldier.y + 125, soldierSize, soldierSize);
    });
  }

  function updateSoldiers() {
    friendlySoldiers.forEach((soldier, fIndex) => {
      let collision = enemySoldiers.some(enemy => Math.abs(soldier.x - enemy.x) < 5 + soldierSize);
      if (!collision && soldier.x < canvas.width - castleWidth - soldierSize && soldier.moving) {
        soldier.x += soldierSpeed;
      }
    });

    enemySoldiers.forEach((enemy, eIndex) => {
      let collision = friendlySoldiers.some(soldier => Math.abs(enemy.x - soldier.x) < 5 + soldierSize);
      if (!collision && enemy.x > castleWidth && enemy.moving) {
        enemy.x -= soldierSpeed;
      }
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
    gold += 10; // Augmente le nombre de pièces d'or avec le temps
  }, 1000);

  setInterval(() => {
    // Lors de l'ajout d'un soldat ennemi
    enemySoldiers.push({ x: canvas.width - castleWidth, y: canvas.height - castleHeight - soldierSize, hp: 100, moving: true });
  }, 10000);

  document.getElementById('launchButton').addEventListener('click', function() {
    // Lors de l'ajout d'un soldat allié
    if (gold >= 10) {
      friendlySoldiers.push({ x: 0, y: canvas.height - castleHeight - soldierSize, hp: 100, moving: true });
      gold -= 10;
    }
  });
});
