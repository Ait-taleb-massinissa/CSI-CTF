import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/api";
import PageContainer from "../components/PageContainer";
import "../styles/ChallengeDetails.css"; // make sure to have this file

export default function ChallengeDetails() {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [flag, setFlag] = useState("");
  const [solved, setSolved] = useState(false);
  const [profile, setProfile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const userId = JSON.parse(localStorage.getItem("user")).id;

  useEffect(() => {
    api.get(`/challenges/${id}`).then((res) => setChallenge(res.data));
    api.post("/auth/profile", { userId }).then((res) => setProfile(res.data));
  }, [id, userId]);

  useEffect(() => {
    if (profile) {
      const solvedIds = new Set(
        (profile.solved || [])
          .map((s) => (typeof s === "string" ? s : s?._id || s?.challengeId))
          .filter(Boolean)
      );
      setSolved(solvedIds.has(id));
    }
  }, [profile, id]);

  async function submitFlag() {
    try {
      const res = await api.post(
        "/submit",
        { challengeId: id, flag },
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );
      setMessage(res.data.message);
      setMessageType("success");
      setSolved(true);
      setFlag("");
      setTimeout(() => setMessage(""), 4000); // disappear after 4s
    } catch {
      setMessage("Wrong flag, try again!");
      setMessageType("error");
      setTimeout(() => setMessage(""), 4000);
    }
  }

  if (!challenge) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading challenge...</p>
      </div>
    );
  }

  return (
    <PageContainer>
      {/* Toast message */}
      {message && <div className={`toast ${messageType}`}>{message}</div>}

      <div className="challenge-box">
        <h2>{challenge.title}</h2>

        <div
          className="description"
          dangerouslySetInnerHTML={{ __html: challenge.description }}
        ></div>

        {!solved ? (
          <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
            <input
              className="flag-input"
              placeholder="Enter flag"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
            />
            <button className="submit-btn" onClick={submitFlag}>
              Submit
            </button>
          </div>
        ) : (
          <div className="solved-msg">✔ Challenge already solved!</div>
        )}
      </div>
    </PageContainer>
  );
}
