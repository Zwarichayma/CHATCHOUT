// src/components/SignUp.js
import React, { Component } from 'react';
import axios from 'axios'; // Assurez-vous d'avoir installé axios
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import icons for show/hide password

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: '',
      success: '',
      showPassword: false, // State to manage password visibility
    };
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission du formulaire
    const { firstName, lastName, email, password } = this.state;

    if (!firstName || !lastName || !email || !password) {
      this.setState({ error: 'Tous les champs sont requis.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        firstName,
        lastName,
        email,
        password
      });

      this.setState({ success: 'Utilisateur inscrit avec succès !', error: '' });

      // Vous pouvez rediriger l'utilisateur vers la page de connexion
      window.location.href = '/sign-in';
    } catch (err) {
      this.setState({ error: err.response ? err.response.data : 'Erreur lors de l\'inscription.', success: '' });
    }
  };

  // Function to toggle password visibility
  togglePasswordVisibility = () => {
    this.setState((prevState) => ({
      showPassword: !prevState.showPassword
    }));
  };

  render() {
    const { firstName, lastName, email, password, error, success, showPassword } = this.state;

    return (
      <div className="container">
        <form onSubmit={this.handleSubmit}>
          <h3>Inscription</h3>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="mb-3">
            <label>Prénom</label>
            <input
              type="text"
              className="form-control"
              placeholder="Entrer votre prénom"
              name="firstName"
              value={firstName}
              onChange={this.handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Nom</label>
            <input
              type="text"
              className="form-control"
              placeholder="Entrer votre nom"
              name="lastName"
              value={lastName}
              onChange={this.handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Entrer votre email"
              name="email"
              value={email}
              onChange={this.handleChange}
            />
          </div>

          <div className="mb-3">
            <label>Mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle between text and password
                className="form-control"
                placeholder="Entrer votre mot de passe"
                name="password"
                value={password}
                onChange={this.handleChange}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={this.togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Display eye icon */}
                </button>
              </div>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              S'inscrire
            </button>
          </div>
        </form>
      </div>
    );
  }
}
