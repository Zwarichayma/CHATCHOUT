const express = require('express');
const router = express.Router();
const { registerUser, loginUser, resetPasswordRequest, resetPassword, deleteProfileById, deleteProfileByEmail,deleteProfile } = require('../controllers/authController');

// Route pour l'inscription
router.post('/register', registerUser);

// Route pour la connexion
router.post('/login', loginUser);

// Route pour demander une réinitialisation du mot de passe
router.post('/reset-password-request', resetPasswordRequest);

// Route pour réinitialiser le mot de passe
router.post('/reset-password', resetPassword);

// Route pour supprimer un profil par ID
router.delete('/delete-profile/:userId', deleteProfileById);

// Route pour supprimer un profil par email
// Suppression du profil - méthode DELETE
router.delete('/delete-profile', deleteProfile);

module.exports = router;
