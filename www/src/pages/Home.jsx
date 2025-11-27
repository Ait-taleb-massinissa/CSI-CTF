import PageContainer from "../components/PageContainer";

export default function Home() {
  return (
    <PageContainer>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>
        Welcome to the CSI CTF Platform
      </h1>

      <p>
        The <strong>CSI CTF Platform</strong> is your go-to hub for Capture The
        Flag competitions within our club.
      </p>

      <h2>How it Works</h2>
      <p>
        Participate in small, regular CTF events held <strong>weekly</strong>{" "}
        or
        <strong> bi-weekly</strong>. Challenges are crafted by members or
        inspired by popular cybersecurity platforms like <em>picoCTF</em>,{" "}
        <em>TryHackMe</em>, and <em>Hack The Box</em>.
      </p>

      <h2>Scoring & Rewards</h2>
      <p>
        Each challenge awards points based on difficulty and your performance.
        Points accumulate throughout the season. At the end, the highest-scoring
        member receives a <strong>symbolic reward</strong>!
      </p>

      <div
        style={{
          backgroundColor: "#1b1b1b", // dark background to match the page
          borderLeft: "4px solid #01af5e", // club green accent
          padding: "1rem 1.5rem ",
          borderRadius: "8px",
          fontStyle: "italic",
          color: "#ccc", // subtle text color
          transition: "background 0.2s ease, color 0.2s ease",
        }}
      >
        <p style={{ margin: 0 }}>
          Ready to test your skills? Jump into a challenge and start earning
          points today!
        </p>
      </div>
    </PageContainer>
  );
}
