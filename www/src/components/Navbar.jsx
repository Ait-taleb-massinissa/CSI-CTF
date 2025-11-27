import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
console.log("Navbar render - user:", user);
  return (
    <nav className="navbar">
      <h2 className="logo">CSI • CTF</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        {localStorage.getItem("token") && <Link to="/challenges">Challenges</Link>}
        <Link to="/scoreboard">Scoreboard</Link>

        {localStorage.getItem("token") && user?.avatar ? (
          <Link to="/profile">
            <img
              src={user.avatar}
              alt="Profile"
              className="profile-avatar"
            />
          </Link>
        ) : localStorage.getItem("token") ? (
          <Link to="/profile">Profile</Link>
        ) : null}

        {!localStorage.getItem("token") && <Link to="/login">Login</Link>}
      </div>
    </nav>
  );
}
