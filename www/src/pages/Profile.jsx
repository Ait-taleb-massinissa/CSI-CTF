import { useEffect, useState } from "react";
import api from "../api/api";
import PageContainer from "../components/PageContainer";
import "../styles/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState("dark");
  const [message, setMessage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("profile");
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    api
      .post("/auth/profile", { userId })
      .then((res) => {
        setProfile(res.data);
        setEmail(res.data.email || "");
        setTheme(res.data.theme || "dark");
      })
      .catch(() =>
        setMessage({ text: "Failed to fetch profile.", type: "error" })
      )
      .finally(() => setLoading(false));
  }, [userId]);

  const handleCategoryClick = (cat) => setActiveCategory(cat);

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <PageContainer>
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      </PageContainer>
    );
  }

  if (!profile) {
    return (
      <PageContainer>
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          Failed to load profile.
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="profile-container">
        {/* Left Menu */}
        <div className="profile-menu">
          {["profile", "email", "password"].map((cat) => (
            <div
              key={cat}
              className={`menu-item ${activeCategory === cat ? "active" : ""}`}
              onClick={() => handleCategoryClick(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </div>
          ))}
        </div>

        {/* Right Content */}
        <div className="profile-content">
          {activeCategory === "profile" && (
            <div className="profile-box">
              <h2>Your Profile</h2>
              <p>
                Username: <span>{profile.username}</span>
              </p>
              <p>
                Points: <span>{profile.points}</span>
              </p>
              <p>
                Challenges Solved: <span>{profile.solved.length}</span>
              </p>
              <button
                className="logout-btn"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </div>
          )}

          {activeCategory === "email" && (
            <div className="profile-box">
              <h2>Update Email</h2>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={() => {
                  api
                    .post("/auth/update-profile", { userId, email })
                    .then(() => showMessage("Email updated!"))
                    .catch(() =>
                      showMessage("Failed to update email.", "error")
                    );
                }}
              >
                Update Email
              </button>
            </div>
          )}

          {activeCategory === "password" && (
            <div className="profile-box">
              <h2>Update Password</h2>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                onClick={() => {
                  api
                    .post("/auth/update-password", {
                      userId,
                      currentPassword,
                      newPassword,
                    })
                    .then(() => {
                      showMessage("Password updated!");
                      setCurrentPassword("");
                      setNewPassword("");
                    })
                    .catch(() =>
                      showMessage("Failed to update password.", "error")
                    );
                }}
              >
                Update Password
              </button>
            </div>
          )}

          {activeCategory === "theme" && (
            <div className="profile-box">
              <h2>Theme</h2>
              <button
                onClick={() => {
                  const newTheme = theme === "dark" ? "light" : "dark";
                  api
                    .post("/auth/update-theme", { userId, theme: newTheme })
                    .then(() => {
                      setTheme(newTheme);
                      showMessage(`Theme changed to ${newTheme}`);
                    })
                    .catch(() =>
                      showMessage("Failed to update theme.", "error")
                    );
                }}
              >
                Switch to {theme === "dark" ? "Light" : "Dark"} Mode
              </button>
            </div>
          )}
        </div>

        {/* Notification Toast */}
        {message && (
          <div
            className={`toast ${
              message.type === "error" ? "error" : "success"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
