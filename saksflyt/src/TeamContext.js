import { createContext, useContext, useEffect, useState } from "react";
import { createTeam, joinTeam, watchTeams } from "./teamService";
import TeamStart from "./components/TeamStart";

const TeamContext = createContext();

export function TeamProvider({ user, children }) {
  const [teams, setTeams] = useState([]);
  const [activeTeam, setActiveTeam] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
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

  async function addTeam(name) {
    await createTeam(name, user.uid);
  }

  async function useInvite(teamId) {
    await joinTeam(teamId, user.uid);
  }

  if (loading) {
    return <p className="loading">Laster team...</p>;
  }

  if (user && teams.length === 0) {
    return <TeamStart onCreate={addTeam} onJoin={useInvite} />;
  }

  return (
    <TeamContext.Provider
      value={{ teams, activeTeam, setActiveTeam, addTeam, useInvite }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  return useContext(TeamContext);
}
