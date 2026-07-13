import { BarChart3, CirclePlus, FileLock2, Home, LogOut } from "lucide-react";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { auth } from "../../firebase";
import { useTeam } from "../../TeamContext";

function Sidebar({ email }) {
  const { teams, activeTeam, setActiveTeam, addTeam, useInvite } = useTeam();

  function logout() {
    signOut(auth);
  }

  async function makeTeam() {
    const name = window.prompt("Hva skal teamet hete?");
    if (name) {
      await addTeam(name);
    }
  }

  async function joinAnotherTeam() {
    const code = window.prompt("Skriv inn invitasjonskoden");
    if (code) {
      await useInvite(code);
    }
  }

  function changeTeam(event) {
    const team = teams.find((item) => item.id === event.target.value);
    setActiveTeam(team);
  }

  return (
    <aside className="sidebar">
      <img className="logo" src="/Logo.png" alt="Saksflyt" />

      <div className="team-picker">
        <label>Aktivt team</label>
        <select value={activeTeam?.id || ""} onChange={changeTeam}>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
        <small>Invitasjonskode: {activeTeam?.code}</small>
        <div>
          <button onClick={makeTeam}>Nytt team</button>
          <button onClick={joinAnotherTeam}>Bli med</button>
        </div>
      </div>

      <nav className="main-nav">
        <NavLink className="nav-item" to="/" end>
          <Home /> Oversikt
        </NavLink>

        <NavLink className="nav-item" to="/cases">
          <FileLock2 /> Saker
        </NavLink>

        <NavLink className="nav-item" to={`/new-case?team=${activeTeam?.id}`}>
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
