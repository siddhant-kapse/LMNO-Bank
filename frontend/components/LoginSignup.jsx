// LoginSignup.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginSignup({ setIsLoggedIn }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:3000/auth/login' : 'http://localhost:3000/auth/signup';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (data.errors) {
      setErrors(data.errors); // Display validation errors
    } else if (data.token) {
      localStorage.setItem('token', data.token);
      setIsLoggedIn(true);
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" onClick={() => setIsLogin(true)}>Sign In</button>
        <button type="submit" onClick={() => setIsLogin(false)}>Sign Up</button>
      </div>
    </form>
  );
  
}

export default LoginSignup;