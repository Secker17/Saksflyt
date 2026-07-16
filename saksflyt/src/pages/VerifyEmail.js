import { useState } from "react";
import { CheckCircle2, LogOut, Mail } from "lucide-react";
import { getIdToken, reload, sendEmailVerification, signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import "../styles/Auth.css";

function VerifyEmail({ user }) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function checkVerification() {
    setError("");
    await reload(user);

    if (user.emailVerified) {
      await getIdToken(user, true);
      window.location.reload();
      return;
    }

    setError("E-postadressen er ikke bekreftet ennå.");
  }

  async function resendEmail() {
    setError("");

    try {
      await sendEmailVerification(user);
      setMessage("En ny bekreftelsesmail er sendt.");
    } catch {
      setError("Kunne ikke sende ny e-post. Vent litt og prøv igjen.");
    }
  }

  return (
    <main className="verify-page">
      <section className="verify-card">
        <span className="verify-icon"><Mail /></span>
        <p className="welcome-label">BEKREFT E-POST</p>
        <h1>Sjekk innboksen din</h1>
        <p>
          Vi har sendt en bekreftelseslenke til <strong>{user.email}</strong>.
          Åpne lenken før du fortsetter.
        </p>

        {message && <p className="login-message">{message}</p>}
        {error && <p className="error" role="alert">{error}</p>}

        <button className="login-submit" onClick={checkVerification}>
          <CheckCircle2 /> Jeg har bekreftet e-posten
        </button>
        <button className="verify-secondary" onClick={resendEmail}>
          Send bekreftelsesmail på nytt
        </button>
        <button className="verify-logout" onClick={() => signOut(auth)}>
          <LogOut /> Logg ut
        </button>
      </section>
    </main>
  );
}

export default VerifyEmail;
