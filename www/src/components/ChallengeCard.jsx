import PageContainer from "../components/PageContainer";
import { useState, useEffect } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Challenges({ challenge , solved }) {
  const navigate = useNavigate();
  const [chal, setChallenge] = useState(null); // start with null
  const [loading, setLoading] = useState(true); // loading state

  const _id = challenge?._id;

  useEffect(() => {
    if (_id) {
      setLoading(true);
      api.get(`/challenges/${_id}`)
        .then((res) => setChallenge(res.data))
        .finally(() => setLoading(false));
    }
  }, [_id]);

  return (
    <PageContainer>
      <div className="challenge-grid">
        {loading ? (
          // Show a loading skeleton card
          <div className="card loading-card">
            <div className="category skeleton"></div>
            <h3 className="skeleton"></h3>
            <p className="skeleton short"></p>
            <p className="skeleton long"></p>
          </div>
        ) : chal ? (
          <div
            key={chal._id}
            className={solved ? "card_solved" : "card"}
            onClick={() => navigate(`/challenge/${chal._id}`)}
          >
            <div className="category">{chal.category}</div>
            <h3>{chal.title}</h3>
            <span className="points">{chal.points} points</span>
            <span className="difficulty">{chal.difficulty}</span>
          </div>
        ) : (
          <p>Challenge not found.</p>
        )}
      </div>
    </PageContainer>
  );
}
