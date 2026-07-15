import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Cases from "./pages/Cases";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Reports from "./pages/Reports";
import NewCase from "./pages/NewCase";
import { TeamProvider, useTeam } from "./context/TeamContext";
import NoTeamAccess from "./pages/NoTeamAccess";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase kjører denne funksjonen når brukeren logger inn eller ut.
    const stopListening = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    // Stopper lyttingen når komponenten ikke brukes lenger.
    return stopListening;
  }, []);

  if (loading) {
    return <p className="loading">Laster...</p>;
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
          <Route path="/new-case" element={<NewCase />} />
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
