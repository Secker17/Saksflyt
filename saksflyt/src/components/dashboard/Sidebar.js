import { BarChart3, CirclePlus, FileLock2, Home, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase";

function Sidebar({ email }) {
  function logout() {
    signOut(auth);
  }

  return (
    <aside className="sidebar">
      <img className="logo" src="/Logo.png" alt="Saksflyt" />

      <nav className="main-nav">
        <NavLink className="nav-item" to="/" end>
          <Home /> Oversikt
        </NavLink>

        <NavLink className="nav-item" to="/cases">
          <FileLock2 /> Saker
        </NavLink>

        <NavLink className="nav-item" to="/new-case">
          <CirclePlus /> Ny sak
        </NavLink>

        <NavLink className="nav-item" to="/reports">
          <BarChart3 /> Rapporter
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <span className="sidebar-avatar">
            {email.slice(0, 2).toUpperCase()}
          </span>

          <span>
            <strong>{email.split("@")[0]}</strong>
            <small>Saksbehandler</small>
          </span>

          <button title="Logg ut" onClick={logout}>
            <LogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
