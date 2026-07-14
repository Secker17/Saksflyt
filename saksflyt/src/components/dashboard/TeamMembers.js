import { X } from "lucide-react";
import { useTeam } from "../../TeamContext";

const roleNames = {
  owner: "Eier",
  admin: "Admin",
  member: "Medlem",
  guest: "Gjest",
};

function TeamMembers({ onClose }) {
  const { activeTeam, setRole } = useTeam();

  return (
    <div className="member-background" onClick={onClose}>
      <section className="member-window" onClick={(event) => event.stopPropagation()}>
        <header>
          <div>
            <h2>Teammedlemmer</h2>
            <p>Velg hva hvert medlem kan gjøre.</p>
          </div>
          <button className="member-close" onClick={onClose}><X /></button>
        </header>

        <div className="role-help">
          Admin kan behandle og slette saker. Medlem kan behandle saker.
          Gjest kan ikke se saker.
        </div>

        <div className="member-list">
          {activeTeam.members.map((userId) => {
            const isOwner = userId === activeTeam.ownerId;
            const role = isOwner ? "owner" : activeTeam.roles?.[userId] || "guest";
            const verified = isOwner || activeTeam.verified?.[userId] === true;
            const email = activeTeam.memberEmails?.[userId] || "E-post ikke registrert ennå";

            return (
              <div className="member-row" key={userId}>
                <span className="member-avatar">
                  {email === "E-post ikke registrert ennå"
                    ? "?"
                    : email.slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <strong>{email}</strong>
                  <small>{roleNames[role]} · {verified ? "Verifisert" : "Ikke verifisert"}</small>
                </div>

                <select
                  value={role}
                  disabled={isOwner}
                  onChange={(event) => setRole(userId, event.target.value)}
                >
                  {isOwner && <option value="owner">Eier</option>}
                  <option value="admin">Admin</option>
                  <option value="member">Medlem</option>
                  <option value="guest">Gjest</option>
                </select>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default TeamMembers;
