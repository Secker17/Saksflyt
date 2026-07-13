import { useState } from "react";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Link } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import "../styles/Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      // Firebase sjekker om e-post og passord tilhører en registrert bruker.
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("Feil e-post eller passord.");
    }
  }

  async function handleGoogleLogin() {
    setError("");

    try {
      // Åpner Google-vinduet og logger brukeren inn gjennom Firebase.
      await signInWithPopup(auth, googleProvider);
    } catch (firebaseError) {
      console.error(firebaseError.code, firebaseError.message);

      if (firebaseError.code === "auth/unauthorized-domain") {
        setError("Dette domenet er ikke godkjent i Firebase.");
      } else if (firebaseError.code === "auth/popup-closed-by-user") {
        setError("Google-vinduet ble lukket før innloggingen var ferdig.");
      } else {
        setError("Google-innlogging feilet. Prøv igjen.");
      }
    }
  }

  async function handleForgotPassword() {
    setError("");
    setMessage("");

    if (!email) {
      setError("Skriv inn e-postadressen din først.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Vi har sendt deg en e-post for å lage nytt passord.");
    } catch {
      setError("Kunne ikke sende e-post. Kontroller adressen.");
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

          <span className="welcome-label">VELKOMMEN TILBAKE</span>
          <h2>Logg inn på kontoen din</h2>
          <p className="login-intro">
            Skriv inn opplysningene dine for å fortsette.
          </p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">E-post</label>
            <div className="login-input">
              <Mail />
              <input
                id="email"
                type="email"
                placeholder="navn@eksempel.no"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <div className="password-heading">
              <label htmlFor="password">Passord</label>
              <button type="button" onClick={handleForgotPassword}>
                Glemt passord?
              </button>
            </div>
            <div className="login-input">
              <LockKeyhole />
              <input
                id="password"
                type="password"
                placeholder="Skriv inn passord"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </div>

            {error && <p className="error">{error}</p>}
            {message && <p className="login-message">{message}</p>}

            <button className="login-submit" type="submit">
              Logg inn <ArrowRight />
            </button>
          </form>

          <div className="login-divider">
            <span>eller</span>
          </div>
          <button
            className="google-button"
            type="button"
            onClick={handleGoogleLogin}
          >
            <span className="google-letter">G</span>
            Logg inn med Google
          </button>

          <p className="login-signup-link">
            Har du ikke bruker? <Link to="/signup">Opprett bruker</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

export default Login;
