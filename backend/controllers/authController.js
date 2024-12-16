const User = require('../models/User');
const nodemailer = require('nodemailer');

// Inscription d'un utilisateur
const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Vérification des champs requis
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    // Vérifiez si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Créer le nouvel utilisateur
    const newUser = new User({
      firstName,
      lastName,
      email,
      password, // Mot de passe stocké directement (pas recommandé pour la production)
    });

    // Sauvegarder l'utilisateur dans la base de données
    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (err) {
    console.error('Erreur lors de l\'inscription:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Connexion d'un utilisateur
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur dans la base de données
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ msg: 'Email ou mot de passe incorrect' });
    }

    // Connexion réussie
    res.status(200).json({ msg: 'Connexion réussie' });
  } catch (err) {
    console.error('Erreur lors de la connexion:', err.message);
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};
const sendResetPasswordEmail = async (user) => {
  const resetToken = Math.random().toString(36).substring(2, 15); // Jeton simple aléatoire

  // Enregistrez le jeton et la date d'expiration dans la base de données
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // Le jeton expire dans 1 heure
  await user.save();

  // Configuration de l'email (utilisez un vrai service d'email comme SendGrid ou Nodemailer avec un SMTP)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-email-password',
    },
  });

  const mailOptions = {
    to: user.email,
    from: 'no-reply@yourapp.com',
    subject: 'Réinitialisation du mot de passe',
    text: `Vous avez demandé une réinitialisation de votre mot de passe. Cliquez sur ce lien pour le réinitialiser : 
           http://localhost:5000/reset-password?token=${resetToken}`,
  };

  await transporter.sendMail(mailOptions);
};

// Route pour demander la réinitialisation du mot de passe
const resetPasswordRequest = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'Aucun utilisateur trouvé avec cet email.' });
    }

    // Envoyer l'email avec le lien de réinitialisation
    await sendResetPasswordEmail(user);
    res.status(200).json({ msg: 'Un email de réinitialisation a été envoyé.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};

// Route pour réinitialiser le mot de passe
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }, // Vérifie si le jeton n'a pas expiré
    });

    if (!user) {
      return res.status(400).json({ msg: 'Jeton invalide ou expiré.' });
    }

    // Mettre à jour le mot de passe de l'utilisateur
    user.password = newPassword; // Ici, nous stockons directement le mot de passe sans le hacher (non recommandé en production)
    user.resetPasswordToken = undefined;  // Supprimer le jeton après utilisation
    user.resetPasswordExpires = undefined; // Supprimer la date d'expiration
    await user.save();

    res.status(200).json({ msg: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erreur du serveur' });
  }
};
const deleteProfileById = async (req, res) => {
  const { userId } = req.params;
  console.log('Tentative de suppression avec ID:', userId); // Ajout d'un log pour déboguer

  try {
    // Recherche de l'utilisateur par ID
    const user = await User.findById(userId);
    console.log('Utilisateur trouvé:', user); // Log de l'utilisateur trouvé

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    // Suppression de l'utilisateur par ID
    await user.deleteOne();
    console.log('Utilisateur supprimé:', user); // Log de l'utilisateur supprimé
    return res.status(200).json({ msg: "Profil supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression par ID:", err);
    return res.status(500).json({ msg: "Erreur interne lors de la suppression du profil." });
  }
};

const deleteProfileByEmail = async (req, res) => {
  const { email, password } = req.body;
  console.log('Tentative de suppression avec email:', email); // Log pour vérifier l'email

  if (!email || !password) {
    return res.status(400).json({ msg: "L'email et le mot de passe sont nécessaires." });
  }

  try {
    console.log('Recherche de l\'utilisateur dans la base de données...');
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    console.log('Utilisateur trouvé:', user); // Log de l'utilisateur trouvé

    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    // Vérification du mot de passe (en clair ici)
    if (user.password !== password) {
      return res.status(400).json({ msg: "Mot de passe incorrect." });
    }

    console.log('Suppression de l\'utilisateur...');
    // Suppression de l'utilisateur
    await user.deleteOne();  // Utilisation de deleteOne() avec Mongoose pour supprimer le document
    console.log('Utilisateur supprimé:', user); // Log de l'utilisateur supprimé
    return res.status(200).json({ msg: "Profil supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression du profil:", err);  // Log de l'erreur
    return res.status(500).json({ msg: "Erreur serveur lors de la suppression du profil." });
  }
};

exports.deleteProfile = async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ msg: "L'email et le mot de passe sont nécessaires." });
  }

  try {
    // Recherche de l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé." });
    }

    // Vérification du mot de passe (en clair ici, mais assurez-vous d'adapter si vous avez un hashage)
    if (user.password !== password) {
      return res.status(400).json({ msg: "Mot de passe incorrect." });
    }

    // Suppression de l'utilisateur
    await user.deleteOne();  // Utilisation de deleteOne() avec Mongoose pour supprimer le document
    return res.status(200).json({ msg: "Profil supprimé avec succès." });
  } catch (err) {
    console.error("Erreur lors de la suppression du profil:", err);
    return res.status(500).json({ msg: "Erreur interne lors de la suppression du profil." });
  }
};

module.exports = { registerUser, loginUser,resetPassword,resetPasswordRequest,deleteProfileById,deleteProfileByEmail };
