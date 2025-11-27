import { useState } from "react";
import api from "../api/api";
import PageContainer from "../components/PageContainer";
import "../styles/Login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });
      setMessage("Logged in successfully!");
      setMessageType("success");
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setTimeout(() => window.location.href = "/", 1500); // redirect after a short delay
    } catch {
      setMessage("Login failed. Check your credentials.");
      setMessageType("error");
    }

    // Clear the message after 3 seconds
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <PageContainer>
      <div className="login-box">
        <h2 className="login-title">Login</h2>

        {message && (
          <div className={`toast ${messageType}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleLogin} className="login-form">
          <input
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p className="login-footer">
          Don't have an account? <a href="/register">Register</a>
        </p>
      </div>
    </PageContainer>
  );
}
