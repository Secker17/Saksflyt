import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import "../styles/Auth.css";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Passordet må ha minst 6 tegn.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passordene er ikke like.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Kunne ikke opprette bruker. E-posten kan være i bruk.");
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
        <div className="login-form-card">
          <div className="mobile-logo">
            <img src="/Logo.png" alt="Saksflyt" />
          </div>

          <span className="welcome-label">NY BRUKER</span>
          <h2>Opprett en konto</h2>
          <p className="login-intro">
            Fyll inn opplysningene dine for å komme i gang.
          </p>

          <form onSubmit={handleSubmit}>
            <AuthInput
              label="E-post"
              id="signup-email"
              type="email"
              placeholder="navn@eksempel.no"
              value={email}
              setValue={setEmail}
              icon={<Mail />}
            />
            <AuthInput
              label="Passord"
              id="signup-password"
              type="password"
              placeholder="Minst 6 tegn"
              value={password}
              setValue={setPassword}
              icon={<LockKeyhole />}
            />
            <AuthInput
              label="Bekreft passord"
              id="confirm-password"
              type="password"
              placeholder="Skriv passordet på nytt"
              value={confirmPassword}
              setValue={setConfirmPassword}
              icon={<LockKeyhole />}
            />

            {error && <p className="error">{error}</p>}

            <button className="login-submit" type="submit">
              Opprett bruker <ArrowRight />
            </button>
          </form>

          <p className="login-signup-link">
            Har du allerede bruker? <Link to="/login">Logg inn</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function AuthInput({ label, id, type, placeholder, value, setValue, icon }) {
  return (
    <div className="signup-field">
      <label htmlFor={id}>{label}</label>
      <div className="login-input">
        {icon}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          required
        />
      </div>
    </div>
  );
}

export default Signup;
