import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newChall, setNewChall] = useState({
    title: "",
    description: "",
    flag: "",
    points: 0,
    category: "",
    difficulty: "",
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // ---------------------------
  //   CHECK IF USER IS ADMIN
  // ---------------------------
  useEffect(() => {
    async function verifyAdmin() {
      if (!token || !user) {
        navigate("/"); // not logged in
        return;
      }

      try {
        const res = await api.post("/auth/profile", { userId: user.id });

        if (res.data.role !== "admin") {
          navigate("/"); // redirect if not admin
          return;
        }

        fetchChalls();
      } catch {
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    verifyAdmin();
  }, []);

  // ---------------------------
  //   FETCH CHALLENGES
  // ---------------------------
  async function fetchChalls() {
    api.get("/challenges").then((res) => setChallenges(res.data));
  }

  // ---------------------------
  //   ADD CHALLENGE
  // ---------------------------
  async function addChallenge() {
    await api.post("/challenges", newChall, {
      headers: { Authorization: "Bearer " + token },
    });
    fetchChalls();
  }

  // ---------------------------
  //   DELETE CHALLENGE
  // ---------------------------
  async function deleteChallenge(id) {
    await api.delete(`/admin/challenge/${id}`, {
      headers: { Authorization: "Bearer " + token },
    });
    fetchChalls();
  }

  // ---------------------------
  //   LOADING SCREEN
  // ---------------------------
  if (loading) {
    return (
      <div className="admin-container">
        <h2>Checking permissions...</h2>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Admin Dashboard</h1>

      <div className="form-box">
        <h2>Add Challenge</h2>

        <input
          className="form-input"
          placeholder="Title"
          onChange={(e) => setNewChall({ ...newChall, title: e.target.value })}
        />

        <textarea
          className="form-input big-textarea"
          placeholder="Description"
          onChange={(e) =>
            setNewChall({ ...newChall, description: e.target.value })
          }
        />

        <input
          className="form-input"
          placeholder="Flag"
          onChange={(e) => setNewChall({ ...newChall, flag: e.target.value })}
        />

        <input
          className="form-input"
          placeholder="Points"
          type="number"
          onChange={(e) =>
            setNewChall({ ...newChall, points: e.target.value })
          }
        />

        <select
          className="form-input"
          value={newChall.category}
          onChange={(e) =>
            setNewChall({ ...newChall, category: e.target.value })
          }
        >
          <option value="">Select category</option>
          <option value="Web Exploitation">Web Exploitation</option>
          <option value="Cryptography">Cryptography</option>
          <option value="Reverse Engineering">Reverse Engineering</option>
          <option value="Forensics">Forensics</option>
          <option value="General Skills">General Skills</option>
          <option value="Binary Exploitation">Binary Exploitation</option>
        </select>

        <select
          className="form-input"
          value={newChall.difficulty}
          onChange={(e) =>
            setNewChall({ ...newChall, difficulty: e.target.value })
          }
        >
          <option value="">Select difficulty</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        <button className="add-btn" onClick={addChallenge}>
          Add Challenge
        </button>
      </div>

      <h2>Challenges List</h2>

      {challenges.map((c) => (
        <div key={c._id} className="challenge-item">
          <p>{c.title}</p>
          <button className="delete-btn" onClick={() => deleteChallenge(c._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
