import {
  BarChart3,
  CirclePlus,
  Home,
  LogOut,
  FileLock2,
  Settings,
} from "lucide-react";

function Sidebar({
  email,
  onOverview,
  onCases,
  onNewCase,
  onReport,
  onSettings,
  onLogout,
}) {
  return (
    <aside className="sidebar">
      <img className="logo" src="/logo.png" alt="Saksflyt" />

      <nav className="main-nav">
        <button className="nav-item active" onClick={onOverview}>
          <Home /> Oversikt
        </button>
        <button className="nav-item" onClick={onCases}>
          <FileLock2 /> Saker
        </button>
        <button className="nav-item" onClick={onNewCase}>
          <CirclePlus /> Ny sak
        </button>
        <button className="nav-item" onClick={onReport}>
          <BarChart3 /> Rapporter
        </button>
      </nav>

      <div className="sidebar-bottom">
        <button className="nav-item" onClick={onSettings}>
          <Settings /> Innstillinger
        </button>
        <div className="sidebar-user">
          <span className="sidebar-avatar">
            {email.slice(0, 2).toUpperCase()}
          </span>
          <span>
            <strong>{email.split("@")[0]}</strong>
            <small>Saksbehandler</small>
          </span>
          <button title="Logg ut" onClick={onLogout}>
            <LogOut />
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
