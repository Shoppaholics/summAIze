import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { signUp } from '../services/authService';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  
  const navigate = useNavigate()

  const handleSignUp = async (event) => {
    event.preventDefault();

    const { success, error } = await signUp(email, password)

    if (error) {
      setMessage(error);
    } else if (success) {
      navigate('/');
    }
  };

  return (
    <form onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
      <p>{message}</p>
    </form>
  );
};

export default SignUp;
