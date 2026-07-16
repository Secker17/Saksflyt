import { createContext, useContext, useEffect, useState } from "react";
import {
  changeRole,
  createTeam,
  joinTeam,
  saveMemberEmail,
  updateTeamSettings,
  watchTeams,
} from "../services/teamService";
import TeamStart from "../pages/TeamStart";

const TeamContext = createContext();

export function TeamProvider({ user, children }) {
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    // Henter teamene til brukeren etter innlogging.
    if (!user) {
      setLoading(false);
      return;
    }

    const stopWatching = watchTeams(user.uid, (newTeams) => {
      setTeams(newTeams);
      setActiveTeam((currentTeam) => {
        return (
          newTeams.find((team) => team.id === currentTeam?.id) ||
          newTeams[0] ||
          null
        );
      });
      setLoading(false);
    });

    return stopWatching;
  }, [user]);

  useEffect(() => {
    if (!user?.email) {
      return;
    }

    teams.forEach((team) => {
      if (!team.memberEmails?.[user.uid]) {
        saveMemberEmail(team.id, user).catch(console.error);
      }
    });
  }, [teams, user]);

  async function addTeam(name) {
    await createTeam(name, user);
  }

  async function joinWithCode(teamId) {
    const joinedTeamId = await joinTeam(teamId, user);
    return joinedTeamId;
  }

  async function setRole(userId, role) {
    await changeRole(activeTeam.id, userId, role);
  }

  async function saveSettings(settings) {
    await updateTeamSettings(activeTeam.id, settings);
  }

  const activeRole = activeTeam?.ownerId === user?.uid
    ? "owner"
    : activeTeam?.roles?.[user?.uid] || "guest";
  const verified = activeTeam?.ownerId === user?.uid
    || activeTeam?.verified?.[user?.uid] === true;

  if (loading) {
    return <p className="loading">Laster team...</p>;
  }

  if (user && teams.length === 0) {
    return <TeamStart onCreate={addTeam} onJoin={joinWithCode} />;
  }

  return (
    // Gjør teaminformasjonen tilgjengelig for resten av løsningen.
    <TeamContext.Provider
      value={{
        teams,
        activeTeam,
        activeRole,
        verified,
        setActiveTeam,
        addTeam,
        joinWithCode,
        setRole,
        saveSettings,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
