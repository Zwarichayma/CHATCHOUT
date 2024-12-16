import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importer le hook de navigation
import './ChatBot.css';

const Chatbot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatbotReply, setChatbotReply] = useState('');
  const [messageHistory, setMessageHistory] = useState([]);
  const [loading, setLoading] = useState(false); // État pour gérer le chargement
  const navigate = useNavigate(); // Hook pour la navigation

  // Envoyer un message au chatbot
  const sendMessageToChatbot = async (message) => {
    setLoading(true); // Démarrer le chargement
    try {
      const response = await axios.post('http://localhost:5000/api/chat', { message });
      const reply = response.data.reply;
      setChatbotReply(reply);
      setMessageHistory((prevHistory) => [
        ...prevHistory,
        { userMessage: message, chatbotReply: reply },
      ]);
    } catch (error) {
      console.error('Erreur avec le chatbot:', error);
    } finally {
      setLoading(false); // Arrêter le chargement une fois la réponse reçue
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (userMessage.trim()) {
      setMessageHistory((prevHistory) => [
        ...prevHistory,
        { userMessage: userMessage, chatbotReply: '...' }, // Réponse temporaire
      ]);
      sendMessageToChatbot(userMessage);
      setUserMessage(''); // Réinitialiser le champ de saisie
    }
  };

  // Gérer la redirection vers la page de suppression de profil
  const handleDeleteProfile = () => {
    // Redirige l'utilisateur vers la page de suppression de profil
    navigate('/delete-profile');
  };

  return (
    <div className="chat-container">
      <h2>ChatChout</h2>
        
      {/* Affichage de l'historique des messages */}
      <div className="chat">
        {messageHistory.map((msg, index) => (
          <div key={index} className={`message ${index % 2 === 0 ? 'left' : 'right'}`}>
            <div className="message-content">
              <p>{index % 2 === 0 ? msg.userMessage : msg.chatbotReply}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie et bouton d'envoi */}
      <form onSubmit={handleSubmit} className="input-container">
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          className="text_input"
          placeholder="Entrez votre message"
        />
        <button type="submit" className="send_button" disabled={loading}>
          {loading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </form>

      {/* Affichage de la réponse en direct du chatbot */}
      {loading && (
        <div className="message right">
          <div className="message-content">
            <p><strong>Chatbot:</strong></p>
            <p>...</p> {/* Affichage temporaire de la réponse en cours */}
          </div>
        </div>
      )}
      <button onClick={handleDeleteProfile} className="btn btn-danger btn-sm delete-profile-button">
                      <i className="fas fa-trash-alt"></i> {/* Icône de suppression */}
                    </button>

    </div>
  );
};

export default Chatbot;
