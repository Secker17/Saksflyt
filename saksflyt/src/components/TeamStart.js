import { useState } from "react";
import { LogIn, Plus, Users } from "lucide-react";
import "../styles/Team.css";

function TeamStart({ onCreate, onJoin }) {
  const [teamName, setTeamName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  async function create(event) {
    event.preventDefault();
    setError("");
    await onCreate(teamName);
  }

  async function join(event) {
    event.preventDefault();
    setError("");

    try {
      await onJoin(code);
    } catch {
      setError("Fant ikke et team med denne koden.");
    }
  }

  return (
    <main className="team-page">
      <section className="team-card">
        <div className="team-title">
          <Users />
          <h1>Velkommen til Saksflyt</h1>
          <p>Opprett et nytt team eller bli med i et team.</p>
        </div>

        <div className="team-options">
          <form onSubmit={create}>
            <h2>Opprett team</h2>
            <label>Teamnavn</label>
            <input
              value={teamName}
              onChange={(event) => setTeamName(event.target.value)}
              required
            />
            <button>
              <Plus /> Opprett team
            </button>
          </form>

          <form onSubmit={join}>
            <h2>Bli med i team</h2>
            <label>Invitasjonskode</label>
            <input
              value={code}
              onChange={(event) => setCode(event.target.value)}
              required
            />
            <button>
              <LogIn /> Bli med
            </button>
          </form>
        </div>

        {error && <p className="team-error">{error}</p>}
      </section>
    </main>
  );
}

export default TeamStart;
