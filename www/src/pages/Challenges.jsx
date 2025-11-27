import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import ChallengeCard from "../components/ChallengeCard";
import "../components/ChallengeCard.css";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?.id;

  useEffect(() => {
    async function fetchData() {
      try {
        const [chRes, profileRes] = await Promise.all([
          api.get("/challenges"),
          api.post("/auth/profile", { userId }),
        ]);

        setChallenges(chRes.data);
        setProfile(profileRes.data);
      } finally {
        setLoading(false); // stop loading even if error
      }
    }

    if (userId) fetchData();
  }, []);

  return (
    <PageContainer>
      <h2 style={{ color: "#01af5e", marginBottom: "1rem" }}>Challenges</h2>

      {loading ? (
        <div className="loading-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="challenge-grid">
          {profile &&
            challenges.map((c) => {
              const solvedIds = new Set(
                (profile.solved || [])
                  .map((s) =>
                    typeof s === "string" ? s : s?._id || s?.challengeId
                  )
                  .filter(Boolean)
              );

              const isSolved = solvedIds.has(c._id);

              return (
                <ChallengeCard key={c._id} challenge={c} solved={isSolved} />
              );
            })}
        </div>
      )}
    </PageContainer>
  );
}
