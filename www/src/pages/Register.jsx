import { useState } from "react";
import api from "../api/api";
import PageContainer from "../components/PageContainer";
import "../styles/Login.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  async function handleRegister(e) {
    e.preventDefault();
    try {
      await api.post("/auth/register", { email, username, password });
      setMessage("Account created successfully!");
      setMessageType("success");

      // Redirect after short delay
      setTimeout(() => window.location.href = "/login", 1500);
    } catch {
      setMessage("Registration failed. Please try again.");
      setMessageType("error");
    }

    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <PageContainer>
      <div className="login-box">
        <h2 className="login-title">Create an account</h2>

        {message && (
          <div className={`toast ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="login-form">
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-btn">
            Register
          </button>
        </form>

        <p className="login-footer">
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </PageContainer>
  );
}
