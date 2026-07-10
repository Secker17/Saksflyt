import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Reports from "./components/Reports";
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
      <Routes>
        <Route
          path="/"
          element={user ? <Home user={user} /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/reports"
          element={user ? <Reports user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
