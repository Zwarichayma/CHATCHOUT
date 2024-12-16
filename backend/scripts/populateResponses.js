const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const ChatbotResponse = require('./models/ChatbotResponse');  // Assurez-vous que le chemin du modèle est correct
require('dotenv').config();

// Fonction pour se connecter à MongoDB
async function connectToDatabase() {
  try {
    // Connexion avec l'URI de MongoDB récupéré depuis .env
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connexion à MongoDB réussie');
  } catch (err) {
    console.error('Erreur de connexion à MongoDB:', err);
    process.exit(1); // Arrêter le script si la connexion échoue
  }
}

// Fonction pour lire le fichier JSON et obtenir les réponses
async function loadResponsesFromFile() {
  const responsesFilePath = path.join(__dirname, 'responses.json');  // Assurez-vous que le fichier est dans le bon répertoire
  try {
    const data = await fs.promises.readFile(responsesFilePath, 'utf8');
    return JSON.parse(data);  // Analyser le contenu du fichier JSON
  } catch (err) {
    console.error('Erreur lors de la lecture ou de l\'analyse du fichier JSON:', err);
    return [];
  }
}

// Fonction pour insérer les réponses dans la base de données MongoDB
async function addResponsesToDatabase(responses) {
  const responsesToInsert = [];
  for (const response of responses) {
    // Vérifier si la réponse existe déjà dans la base de données
    const existingResponse = await ChatbotResponse.findOne({ trigger: response.trigger });
    if (!existingResponse) {
      // Ajouter la réponse à la liste des réponses à insérer si elle n'existe pas déjà
      responsesToInsert.push(response);
    }
  }

  // Si de nouvelles réponses sont trouvées, les insérer dans la base de données
  if (responsesToInsert.length > 0) {
    try {
      await ChatbotResponse.insertMany(responsesToInsert);  // Insérer dans MongoDB
      console.log(`${responsesToInsert.length} réponses ajoutées.`);
    } catch (err) {
      console.error('Erreur lors de l\'insertion des réponses dans MongoDB:', err);
    }
  } else {
    console.log('Aucune nouvelle réponse à ajouter.');
  }
}

// Fonction principale pour exécuter les étapes de connexion, lecture et insertion
async function main() {
  await connectToDatabase();  // Connexion à MongoDB
  const responses = await loadResponsesFromFile();  // Charger les réponses du fichier JSON
  if (responses.length > 0) {
    await addResponsesToDatabase(responses);  // Ajouter les réponses dans la base de données
  } else {
    console.log('Aucune réponse à ajouter.');
  }
}

// Lancer le script
main();
