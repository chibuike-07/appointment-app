import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { saveToken } from "../utils/auth";
import { LOGIN } from "../graphql/mutations/mutations";

interface LoginProps {
  onLogin: () => void;
  goToRegister: () => void;
}

const Login = ({ onLogin, goToRegister }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  interface LoginResponse {
    login: {
      access_token: string;
      firstName: string;
      lastName: string;
    };
  }

  const [loginMutation] = useMutation<LoginResponse>(LOGIN);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    try {
      setError("");
      const { data } = await loginMutation({
        variables: {
          email,
          password,
        },
      });

      if (data?.login) {
        saveToken(data.login.access_token);
        localStorage.setItem("firstName", data.login.firstName);
        localStorage.setItem("lastName", data.login.lastName);
      }

      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
            <polyline points="10 17 15 12 10 7"/>
            <line x1="15" y1="12" x2="3" y2="12"/>
          </svg>
          Welcome Back
        </h2>

        {error && (
          <div className="form-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>{error}</span>
          </div>
        )}

        <div className="auth-form-group">
          <div className="auth-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <div className="auth-input-wrapper">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
            />
          </div>

          <button className="auth-btn" onClick={handleLogin}>
            Sign In
          </button>
        </div>

        <p className="auth-switch-text">
          Don't have an account?
          <button className="auth-switch-btn" onClick={goToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;