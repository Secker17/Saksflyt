import { useState } from "react";
import { Archive, ListFilter, UserPlus, X } from "lucide-react";
import { useTeam } from "../../context/TeamContext";

function CaseDetails({ item, userEmail, userId, statuses, onUpdate, onDelete, onClose }) {
  const { activeTeam } = useTeam();
  const [showActivity, setShowActivity] = useState(false);

  function assignToMe() {
    const name = userEmail.split("@")[0];

    onUpdate({
      ...item,
      person: name,
      assignedTo: userId,
      initials: name.slice(0, 2).toUpperCase(),
      status: "Under arbeid",
    });
  }

  function changeAssignee(event) {
    const assignedTo = event.target.value;

    if (!assignedTo) {
      onUpdate({ ...item, assignedTo: "", person: "Ikke tildelt", initials: "--" });
      return;
    }

    const email = activeTeam.memberEmails?.[assignedTo] || "Ukjent bruker";
    const name = email.split("@")[0];
    onUpdate({
      ...item,
      assignedTo,
      person: name,
      initials: name.slice(0, 2).toUpperCase(),
      status: item.status === statuses[0] ? statuses[1] : item.status,
    });
  }

  function changeStatus(event) {
    onUpdate({ ...item, status: event.target.value });
  }

  function changePriority(event) {
    onUpdate({ ...item, priority: event.target.value });
  }

  function archiveCase() {
    if (window.confirm("Vil du arkivere denne saken? Den blir fortsatt synlig i rapporter.")) {
      onDelete(item.id);
    }
  }

  return (
    <aside className="case-details">
      <div className="details-heading">
        <h2>Sak {item.caseNumber}</h2>
        <button onClick={onClose} aria-label="Lukk detaljer">
          <X />
        </button>
      </div>

      <div className="details-badges">
        <span className="badge status-ny">{item.status}</span>
        <span className={`badge priority-${(item.priority || "Middels").toLowerCase()}`}>
          {item.priority || "Middels"} prioritet
        </span>
      </div>

      <h3>{item.title}</h3>
      <p className="detail-category">{item.category}</p>

      <Info title="Beskrivelse" text={item.description} />
      <Info
        title="Innmelder"
        text={`${item.customerName || "Ukjent"} · ${item.customerEmail || "Ingen e-post"}`}
      />

      <div className="detail-columns">
        <Info title="Opprettet" text={item.date} />
        <Info title="Frist" text={item.dueDate || "Ikke satt"} />
      </div>

      <section className="detail-section">
        <label className="status-label" htmlFor="case-assignee">Ansvarlig</label>
        <select id="case-assignee" value={item.assignedTo || ""} onChange={changeAssignee}>
          <option value="">Ikke tildelt</option>
          {activeTeam.members.filter((memberId) => (
            memberId === activeTeam.ownerId || activeTeam.verified?.[memberId] === true
          )).map((memberId) => (
            <option key={memberId} value={memberId}>
              {activeTeam.memberEmails?.[memberId] || "Ukjent bruker"}
            </option>
          ))}
        </select>

        {item.person === "Ikke tildelt" && (
          <button className="assign-button" onClick={assignToMe}>
            <UserPlus /> Tildel til meg
          </button>
        )}
      </section>

      <section className="detail-section">
        <label className="status-label" htmlFor="case-status">
          Status
        </label>
        <select id="case-status" value={item.status} onChange={changeStatus}>
          {statuses.map((status) => <option key={status}>{status}</option>)}
        </select>
      </section>

      <section className="detail-section">
        <label className="status-label" htmlFor="case-priority-details">
          Prioritet
        </label>
        <select
          id="case-priority-details"
          value={item.priority || "Middels"}
          onChange={changePriority}
        >
          <option>Lav</option>
          <option>Middels</option>
          <option>Høy</option>
        </select>
      </section>

      <button className="activity-button" onClick={() => setShowActivity(true)}>
        <ListFilter /> Se alle aktiviteter
      </button>

      <button className="delete-case-button" onClick={archiveCase}>
        <Archive /> Arkiver sak
      </button>

      {showActivity && (
        <div className="activity-overlay">
          <div className="activity-header">
            <h3>Aktiviteter</h3>
            <button onClick={() => setShowActivity(false)}>
              <X />
            </button>
          </div>
          <p>Saken ble opprettet {item.date}.</p>
          <p>Ansvarlig: {item.person}.</p>
          <p>Status: {item.status}.</p>
          <button
            className="activity-close"
            onClick={() => setShowActivity(false)}
          >
            Lukk
          </button>
        </div>
      )}
    </aside>
  );
}

function Info({ title, text }) {
  return (
    <section className="detail-section">
      <strong>{title}</strong>
      <p>{text || "Ikke oppgitt"}</p>
    </section>
  );
}

export default CaseDetails;
