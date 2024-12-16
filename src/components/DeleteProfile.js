import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importation de useNavigate

const DeleteProfile = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Utilisation du hook useNavigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError('L\'email et le mot de passe sont requis.');
      return;
    }
  
    try {
      // Envoi de la requête DELETE pour supprimer le profil
      const response = await axios.delete('http://localhost:5000/api/auth/delete-profile', {
        data: { email, password }, // Données envoyées dans la requête DELETE
      });
  
      // Si la suppression réussit
      setSuccess(response.data.msg);
      setError('');
      
      // Rediriger vers la page d'inscription après une brève attente
      setTimeout(() => {
        navigate('/sign-up'); // Redirige vers la page d'inscription
      }, 2000); // Délai de 2 secondes pour permettre à l'utilisateur de voir le message de succès
    } catch (err) {
      // Gérer l'erreur de suppression
      setError(err.response ? err.response.data.msg : "Une erreur s'est produite.");
      setSuccess('');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <h3>Suppression du profil</h3>

        {/* Affichage des erreurs */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            placeholder="Entrez votre email"
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
            placeholder="Entrez votre mot de passe"
            name="password"
            value={password}
            onChange={handleChange}
          />
        </div>

        <div className="d-grid">
          <button type="submit" className="btn btn-danger">Supprimer mon profil</button>
        </div>
      </form>
    </div>
  );
};

export default DeleteProfile;
