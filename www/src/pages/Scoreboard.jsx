import { useEffect, useState, useRef } from "react";
import api from "../api/api";
import PageContainer from "../components/PageContainer";
import "../styles/Scoreboard.css";

export default function Scoreboard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = JSON.parse(localStorage.getItem("user"))?.username;

  const myScoreRef = useRef(null);

  useEffect(() => {
    api.get("/scoreboard")
      .then((res) => setScores(res.data))
      .finally(() => setLoading(false));
  }, []);

  const scrollToMe = () => {
    if (myScoreRef.current) {
      myScoreRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <PageContainer>
      <h2 className="scoreboard-title">Leaderboard</h2>

      {username && !loading && (
        <button className="show-me-btn" onClick={scrollToMe}>
          Show Me
        </button>
      )}

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="scoreboard-grid">
          {scores.map((s, i) => {
            const isCurrentUser = s.username === username;
            return (
              <div
                key={i}
                ref={isCurrentUser ? myScoreRef : null}
                className={`score-row ${isCurrentUser ? "current-user" : ""}`}
              >
                <span className="rank">#{i + 1}</span>
                <span className="username">{s.username}</span>
                <span className="point">{s.points} pts</span>
              </div>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
