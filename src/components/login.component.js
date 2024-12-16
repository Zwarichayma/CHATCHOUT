import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importer useNavigate

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook pour redirection

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email et mot de passe requis.');
      return;
    }

    try {
      // Appel API pour la connexion
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token } = response.data;
      localStorage.setItem('token', token); // Sauvegarder le token dans localStorage

      setSuccess('Connexion réussie !');
      setError(''); // Réinitialiser l'erreur

      // Rediriger vers la page du chat
      navigate('/chat');
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : 'Une erreur est survenue. Veuillez réessayer.';
      setError(errorMsg);
      setSuccess(''); // Réinitialiser le succès

      // Si le mot de passe est incorrect, rediriger vers la page de réinitialisation
      if (err.response && err.response.data.msg === 'Mot de passe incorrect') {
        navigate('/reset-password'); // Rediriger vers la page de réinitialisation
      }
    }
  };

  // Fonction pour rediriger vers la page de réinitialisation du mot de passe
  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h3>Connexion</h3>

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
          <label>Mot de passe</label>
          <input
            type="password"
            className="form-control"
            placeholder="Entrer votre mot de passe"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-primary">
            Se connecter
          </button>
        </div>

        {/* Lien vers la page de réinitialisation du mot de passe */}
        <div className="mt-3">
          <button type="button" className="btn btn-link" onClick={handleForgotPassword}>
            Mot de passe oublié ? Réinitialisez-le.
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
