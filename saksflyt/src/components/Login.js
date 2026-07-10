import { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    try {
      // Firebase sjekker om e-post og passord tilhører en registrert bruker.
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Feil e-post eller passord.');
    }
  }

  async function handleGoogleLogin() {
    setError('');

    try {
      // Åpner Google-vinduet og logger brukeren inn gjennom Firebase.
      await signInWithPopup(auth, googleProvider);
    } catch {
      setError('Google-innlogging ble avbrutt eller feilet.');
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
      <img className="auth-logo" src="/logo.png" alt="Saksflyt" />
      <h1>Velkommen tilbake</h1>
      <p className="auth-intro">Logg inn for å se og behandle saker.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="email">E-post</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Passord</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button className="primary-button" type="submit">Logg inn</button>
      </form>

      <div className="login-divider"><span>eller</span></div>
      <button className="google-button" type="button" onClick={handleGoogleLogin}>
        <span className="google-letter">G</span>
        Logg inn med Google
      </button>

      <p className="auth-link">Har du ikke bruker? <Link to="/signup">Opprett bruker</Link></p>
      </section>
    </main>
  );
}

export default Login;
