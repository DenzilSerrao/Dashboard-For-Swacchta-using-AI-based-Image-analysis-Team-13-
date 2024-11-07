import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
      });
      // Assuming the server responds with a success message or user data
      console.log('Login successful:', response.data);
      closeModal();
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login failed:', err);
    }
  };

  return (
    <div>
        {/* <div id="login-modal" className="modal">
          <div className="modal-content">
            <span className="close-button">&times;</span>
            <h2>Login</h2>
            <form id="login-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div> */}
                <div id="login-modal" className="modal">
          <div className="modal-content">
            <span className="close-button">&times;</span>
            <h2>Login</h2>
            <form id="login-form" onSubmit={handleSubmit}>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="error">{error}</p>}
              <button type="submit">Login</button>
            </form>
          </div>
        </div>
    </div>
    
  );
};

export default Login;
