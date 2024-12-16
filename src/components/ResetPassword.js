import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Utilisation de useNavigate pour rediriger

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'newPassword') setNewPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation de base
    if (!email || !newPassword) {
      setError('L\'email et le mot de passe sont requis.');
      return;
    }

    try {
      // Appel API pour réinitialiser le mot de passe
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        newPassword,
      });

      setSuccess('Mot de passe réinitialisé avec succès!');
      setError('');

      // Authentification de l'utilisateur après la réinitialisation
      // Vous pouvez ici envoyer une requête pour connecter l'utilisateur
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password: newPassword, // Utiliser le nouveau mot de passe
      });

      // Si la connexion est réussie, vous pouvez rediriger l'utilisateur vers le chat
      if (loginResponse.data.msg === 'Connexion réussie') {
        navigate('/chat'); // Redirection vers le chat
      }

    } catch (err) {
      setError('Une erreur est survenue lors de la réinitialisation du mot de passe.');
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h3>Réinitialisation du mot de passe</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Entrer votre email"
            name="email"
            value={email}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label>Nouveau mot de passe</label>
          <input
            type="password"
            className="form-control"
            placeholder="Entrer votre nouveau mot de passe"
            name="newPassword"
            value={newPassword}
            onChange={handleChange}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">Réinitialiser</button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
