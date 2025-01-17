import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signUp } from "../services/authService";
import "../styles/Auth.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const { success, error } = await signUp(email, password);

    if (error) {
      setMessage(error);
      setIsLoading(false);
    } else if (success) {
      navigate("/");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-header">Sign Up for SummAIze</h2>
        <form onSubmit={handleSignUp} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && <p className="error-message">{message}</p>}

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-links">
          Already have an account?
          <Link to="/signin">Sign in here</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
