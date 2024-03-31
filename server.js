const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Nombre de "salt rounds" pour bcrypt
const saltRounds = 10;

// Utilisation de bodyParser pour analyser les corps des requêtes POST
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration de la connexion à la base de données MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'medieval_conquest'
});

// Établissement de la connexion à la base de données
connection.connect(error => {
  if (error) {
    console.error('Erreur de connexion à la base de données: ' + error.stack);
    return;
  }
  console.log('Connecté à la base de données.');
});

// Route pour gérer la soumission du formulaire
app.post('/submit', (req, res) => {
  const { username, password, level } = req.body;

  // Validation du mot de passe côté serveur
  if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}/.test(password)) {
    return res.status(400).send("Le mot de passe ne respecte pas les critères requis : au moins 8 caractères, dont une majuscule, une minuscule, un chiffre et un caractère spécial.");
  }

  // Vérifier d'abord si l'utilisateur existe déjà dans la base de données
  const checkUserQuery = 'SELECT * FROM players WHERE username = ?';
  connection.query(checkUserQuery, [username], (error, results) => {
    if (error) {
      console.error('Erreur lors de la vérification de l\'utilisateur: ' + error.stack);
      return res.status(400).send('Erreur lors de la vérification de l\'utilisateur');
    }
    if (results.length > 0) {
      // Si l'utilisateur existe déjà, demander de choisir un autre nom
      res.send('Le nom d\'utilisateur existe déjà, veuillez en choisir un autre.');
    } else {
      // Si l'utilisateur n'existe pas, hacher le mot de passe et insérer les nouvelles données
      bcrypt.hash(password, saltRounds, function(err, hash) {
        if (err) {
          console.error('Erreur lors du hachage du mot de passe: ' + err.stack);
          res.status(500).send('Erreur lors de l\'enregistrement des données');
          return;
        }
        const insertQuery = 'INSERT INTO players (username, password, level) VALUES (?, ?, ?)';
        connection.query(insertQuery, [username, hash, level], (error, results) => {
          if (error) {
            console.error('Erreur lors de l\'insertion des données: ' + error.stack);
            res.status(500).send('Erreur lors de l\'enregistrement des données');
            return;
          }
          console.log('Données insérées avec succès.');
          // Rediriger vers index.html après l'insertion réussie
          res.redirect('/index.html');
        });
      });
    }
  });
});

// Servir les fichiers statiques depuis le dossier 'Projet'
app.use(express.static('Projet'));

// Démarrage du serveur sur le port spécifié
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
