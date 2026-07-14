import { useState } from "react";
import { ArrowRight, LogIn, Plus, Users } from "lucide-react";
import "../styles/Auth.css";
import "../styles/Team.css";

function TeamStart({ onCreate, onJoin }) {
  const [showCreate, setShowCreate] = useState(true);
  const [teamName, setTeamName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);

  async function createTeam(event) {
    event.preventDefault();
    setError("");
    setLeaving(true);

    // Venter til animasjonen er ferdig før teamet opprettes.
    await new Promise((resolve) => setTimeout(resolve, 900));

    try {
      await onCreate(teamName);
    } catch {
      setLeaving(false);
      setError("Kunne ikke opprette teamet. Prøv igjen.");
    }
  }

  async function joinTeam(event) {
    event.preventDefault();
    setError("");

    try {
      await onJoin(code);
    } catch {
      setError("Fant ikke et team med denne koden.");
    }
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="visual-circle circle-one"></div>
        <div className="visual-circle circle-two"></div>
        <img className="login-logo" src="/Logo.png" alt="Saksflyt" />
      </section>

      <section className="login-form-side">
        <div className="login-form-card team-form-card">
          <div className="mobile-logo">
            <img src="/Logo.png" alt="Saksflyt" />
          </div>

          <div className="team-heading-icon">
            <Users />
          </div>
          <span className="welcome-label">VELG TEAM</span>
          <h2>Kom i gang med Saksflyt</h2>
          <p className="login-intro">
            Opprett et nytt team eller bli med i et team du er invitert til.
          </p>

          <div className="team-tabs">
            <button
              className={showCreate ? "active" : ""}
              onClick={() => setShowCreate(true)}
            >
              Opprett team
            </button>
            <button
              className={!showCreate ? "active" : ""}
              onClick={() => setShowCreate(false)}
            >
              Bli med
            </button>
          </div>

          {showCreate ? (
            <form className="team-form" onSubmit={createTeam}>
              <label htmlFor="team-name">Teamnavn</label>
              <div className="login-input">
                <Plus />
                <input
                  id="team-name"
                  value={teamName}
                  onChange={(event) => setTeamName(event.target.value)}
                  placeholder="For eksempel Kundeservice"
                  required
                />
              </div>

              <button className="login-submit" type="submit" disabled={leaving}>
                {leaving ? "Åpner team..." : "Opprett team"}
                {!leaving && <ArrowRight />}
              </button>
            </form>
          ) : (
            <form className="team-form" onSubmit={joinTeam}>
              <label htmlFor="invite-code">Invitasjonskode</label>
              <div className="login-input">
                <LogIn />
                <input
                  id="invite-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Skriv inn koden"
                  required
                />
              </div>

              <button className="login-submit" type="submit">
                Bli med i team <ArrowRight />
              </button>
            </form>
          )}

          {error && <p className="error">{error}</p>}
        </div>
      </section>

      {leaving && (
        <div className="team-transition-cover">
          <img src="/Logo.png" alt="Saksflyt" />
          <span></span>
          <p>Gjør teamet klart...</p>
        </div>
      )}
    </main>
  );
}

export default TeamStart;
