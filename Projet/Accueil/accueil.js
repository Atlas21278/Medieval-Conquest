const levels = ["Facile", "Normal", "Difficile"];
let currentLevelIndex = 0; // Commence par Facile

document.getElementById('levelNext').addEventListener('click', function() {
  if (currentLevelIndex < levels.length - 1) {
    currentLevelIndex++;
    updateLevelDisplay();
  }
});

document.getElementById('levelPrev').addEventListener('click', function() {
  if (currentLevelIndex > 0) {
    currentLevelIndex--;
    updateLevelDisplay();
  }
});

function updateLevelDisplay() {
  document.getElementById('levelDisplay').textContent = levels[currentLevelIndex];
}

updateLevelDisplay(); // Mise à jour initiale pour afficher 'Facile'
