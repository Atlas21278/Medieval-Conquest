document.getElementById('gameForm').addEventListener('submit', function(event) {
  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;
  let errorMessages = [];

  // Vérifiez les critères de mot de passe
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
    errorMessages.push("Le mot de passe ne respecte pas les critères requis.");
  }

  // Ajouter plus de validations si nécessaire

  if (errorMessages.length > 0) {
    event.preventDefault(); // Empêche la soumission du formulaire
    alert(errorMessages.join("\n"));
  }
});
