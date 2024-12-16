const mongoose = require('mongoose');

// Connecter à MongoDB
const connectDB = async () => {
  try {
    // Remplacer 'mongodb://localhost:27017/login_signup' par l'URL de votre base de données MongoDB
    await mongoose.connect('mongodb://localhost:27017/login_signup', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);  // Quitter le processus si la connexion échoue
  }
};

module.exports = connectDB;
