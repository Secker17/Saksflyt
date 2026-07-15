import { BarChart3, CirclePlus, FileLock2, LogOut, Settings, Users } from "lucide-react";
import { useState } from "react";
import { signOut } from "firebase/auth";
import { NavLink } from "react-router-dom";
import { auth } from "../../config/firebase";
import { useTeam } from "../../context/TeamContext";
import TeamMembers from "./TeamMembers";
import TeamSettings from "./TeamSettings";
import "../../styles/DashboardExtras.css";

function Sidebar({ email }) {
  const { teams, activeTeam, activeRole, setActiveTeam, addTeam, joinWithCode } = useTeam();
  const [showMembers, setShowMembers] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

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
      try {
        await joinWithCode(code);
      } catch (error) {
        console.error(error);
        window.alert("Kunne ikke bli med. Sjekk koden og Firebase-reglene.");
      }
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
        <NavLink className="nav-item" to="/cases">
          <FileLock2 /> Saker
        </NavLink>

        <NavLink className="nav-item" to={`/new-case?team=${activeTeam?.id}`}>
          <CirclePlus /> Ny sak
        </NavLink>

        <NavLink className="nav-item" to="/reports">
          <BarChart3 /> Rapporter
        </NavLink>

        {activeRole === "owner" && (
          <>
            <button className="nav-item member-button" onClick={() => setShowMembers(true)}>
              <Users /> Medlemmer
            </button>
            <button className="nav-item member-button" onClick={() => setShowSettings(true)}>
              <Settings /> Innstillinger
            </button>
          </>
        )}
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

      {showMembers && <TeamMembers onClose={() => setShowMembers(false)} />}
      {showSettings && <TeamSettings onClose={() => setShowSettings(false)} />}
    </aside>
  );
}

export default Sidebar;
