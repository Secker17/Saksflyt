import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, authReady } from "./config/firebase";
import Cases from "./pages/Cases";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reports from "./pages/Reports";
import NewCase from "./pages/NewCase";
import { TeamProvider, useTeam } from "./context/TeamContext";
import NoTeamAccess from "./pages/NoTeamAccess";
import VerifyEmail from "./pages/VerifyEmail";
import "./styles/App.css";
import {
  finishLoginFromEmailLink,
  isWaitingForEmailLink,
} from "./services/authService";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stopListening;

    authReady.then(async () => {
      try {
        await finishLoginFromEmailLink();
      } catch (error) {
        console.error("Kunne ikke fullføre innlogging med e-postlenke", error);
      }

      // Firebase kjører denne funksjonen når brukeren logger inn eller ut.
      stopListening = onAuthStateChanged(auth, (firebaseUser) => {
        setUser(isWaitingForEmailLink() ? null : firebaseUser);
        setLoading(false);
      });
    });

    // Stopper lyttingen når komponenten ikke brukes lenger.
    return () => stopListening?.();
  }, []);

  if (loading) {
    return <p className="loading">Laster...</p>;
  }

  if (user && !user.emailVerified) {
    return <VerifyEmail user={user} />;
  }

  return (
    <BrowserRouter>
      <TeamProvider user={user}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={user ? "/cases" : "/login"} replace />}
          />
          <Route
            path="/cases"
            element={user ? <TeamPage user={user}><Cases user={user} /></TeamPage> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/signup"
            element={user ? <Navigate to="/" /> : <Signup />}
          />
          <Route
            path="/reports"
            element={user ? <TeamPage user={user}><Reports user={user} /></TeamPage> : <Navigate to="/login" />}
          />
          <Route
            path="/new-case"
            element={user ? <TeamPage user={user}><NewCase /></TeamPage> : <Navigate to="/login" />}
          />
        </Routes>
      </TeamProvider>
    </BrowserRouter>
  );
}

function TeamPage({ user, children }) {
  const { activeRole, verified } = useTeam();
  const hasRole = ["owner", "admin", "member"].includes(activeRole);
  const hasAccess = verified && hasRole;
  return hasAccess ? children : <NoTeamAccess user={user} />;
}

export default App;
