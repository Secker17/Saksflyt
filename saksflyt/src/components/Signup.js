import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/Signup.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Passordet må ha minst 6 tegn.");
      return;
    }

    try {
      // Firebase oppretter en ny bruker med e-post og passord.
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Kunne ikke opprette bruker. E-posten kan være i bruk.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <img className="auth-logo" src="/logo.png" alt="Saksflyt" />
        <h1>Opprett bruker</h1>
        <p className="auth-intro">Fyll inn e-post og velg et passord.</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="signup-email">E-post</label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="signup-password">Passord</label>
          <input
            id="signup-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && <p className="error">{error}</p>}
          <button className="primary-button" type="submit">
            Opprett bruker
          </button>
        </form>

        <p className="auth-link">
          Har du allerede bruker? <Link to="/login">Logg inn</Link>
        </p>
      </section>
    </main>
  );
}

export default Signup;
