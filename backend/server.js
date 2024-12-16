const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const Message = require('./models/Message');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connecté');
}).catch((err) => {
  console.log('Erreur de connexion à MongoDB:', err);
});


// Fonction pour charger les réponses depuis un fichier JSON
async function loadResponsesFromFile() {
  const filePath = path.join(__dirname, 'responses.json');
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Erreur de lecture du fichier JSON:', err);
    return [];
  }
}

// Fonction pour obtenir la réponse du chatbot
async function getChatbotResponse(userMessage) {
  const responses = await loadResponsesFromFile();

  const normalizedMessage = userMessage.toLowerCase().trim();
  const response = responses.find(r => normalizedMessage.includes(r.trigger.toLowerCase()));

  if (response) {
    return response.response;
  } else {
    return "Désolé, je n'ai pas compris. Pouvez-vous reformuler ?";
  }
}

// Route d'inscription
app.post('/api/auth/signup', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save();

    res.status(201).send('Utilisateur inscrit avec succès');
  } catch (err) {
    res.status(500).send('Erreur lors de l\'inscription');
  }
});

// Route de connexion
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email et mot de passe sont requis.' });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect.' });
    }

    res.json({ msg: 'Connexion réussie' });
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// Route pour le chatbot
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const chatbotReply = await getChatbotResponse(message);

    const newMessage = new Message({
      userMessage: message,
      chatbotReply: chatbotReply,
    });

    await newMessage.save();

    res.json({ reply: chatbotReply });
  } catch (error) {
    res.status(500).json({ reply: 'Désolé, il y a eu un problème avec l\'IA.' });
  }
});

// Route pour obtenir l'historique des messages
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ msg: 'Erreur serveur lors de la récupération des messages.' });
  }
});
// Route pour réinitialiser le mot de passe
app.post('/api/auth/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // Vérifiez si l'email est fourni
    if (!email || !newPassword) {
      return res.status(400).json({ msg: 'Email et mot de passe sont requis.' });
    }

    // Trouver l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Utilisateur non trouvé.' });
    }

    // Mettre à jour le mot de passe
    user.password = newPassword; // On garde le mot de passe en clair (non sécurisé)

    // Sauvegarder les modifications dans la base de données
    await user.save();

    res.status(200).json({ msg: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur lors de la réinitialisation du mot de passe.' });
  }
});
// Route pour supprimer un profil
app.delete('/api/auth/delete-profile', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérification que l'email et le mot de passe sont fournis
    if (!email || !password) {
      return res.status(400).json({ msg: 'Email et mot de passe sont requis.' });
    }

    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Utilisateur non trouvé.' });
    }

    // Vérification du mot de passe
    if (user.password !== password) {
      return res.status(400).json({ msg: 'Mot de passe incorrect.' });
    }

    // Suppression de l'utilisateur
    await user.deleteOne();  // Remplacer `remove()` par `deleteOne()`
    
    res.status(200).json({ msg: 'Profil supprimé avec succès.' });
  } catch (err) {
    console.error("Erreur serveur lors de la suppression du profil:", err);
    res.status(500).json({ msg: 'Erreur serveur lors de la suppression du profil.' });
  }
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
