import React, { useState } from 'react';
import { auth } from './firebase'; // Import auth from your firebase.js
import { signInWithEmailAndPassword } from 'firebase/auth'; // Import email/password authentication function

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // Use Firebase function to sign in with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccessMessage('Successfully signed in!');
      onLoginSuccess(); // Trigger successful login action (e.g., route to admin panel)
    } catch (error) {
      setError('Invalid email or password. Please try again.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>

      {/* Form to log in with email and password */}
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {successMessage && <p>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
