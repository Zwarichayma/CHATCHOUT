import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import log from './assets/log.png'; // Import the logo image
import Login from './components/login.component';
import SignUp from './components/signup.component';
import ResetPassword from './components/ResetPassword'; // Importer le nouveau composant
import Chatbot from './components/ChatBot'; // Import du Chatbot
import DeleteProfile from './components/DeleteProfile'; // Import du composant DeleteProfile
import './App.css'; // Make sure App.css is imported

function Navbar() {
  const location = useLocation(); // Hook pour récupérer la localisation actuelle

  return (
    <nav className="navbar navbar-expand-lg navbar-light fixed-top navbar-custom">
      <div className="container">
        <Link className="navbar-brand" to={'/sign-in'}>
          {/* Logo */}
          <img
            src={log} // Use the imported logo here
            alt="Logo"
            className="navbar-logo" // Use the CSS class for styling
          />
          ChatChout
        </Link>
        
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
          <ul className="navbar-nav ml-auto">
            {/* Afficher les liens Login et Sign Up uniquement si on n'est pas sur /chat */}
            {location.pathname !== '/chat' && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-in'}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to={'/sign-up'}>
                    Sign Up
                  </Link>

                </li>
                
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar */}
        <Navbar />

        {/* Section d'authentification */}
        <div className="auth-wrapper">
          <div className="auth-inner">
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/reset-password" element={<ResetPassword />} /> {/* Ajouter la route de réinitialisation */}
              <Route path="/chat" element={<Chatbot />} /> {/* Chatbot */}
              <Route path="/delete-profile" element={<DeleteProfile />} /> {/* Route pour supprimer le profil */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
