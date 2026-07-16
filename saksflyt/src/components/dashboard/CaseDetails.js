import { useState } from "react";
import { Archive, ListFilter, UserPlus, X } from "lucide-react";
import { useTeam } from "../../context/TeamContext";
import { formatDate } from "../../utils/formatDate";

function CaseDetails({ item, userId, statuses, priorities, onUpdate, onDelete, onClose }) {
  const { activeTeam } = useTeam();
  const [showActivity, setShowActivity] = useState(false);

  function assignToMe() {
    onUpdate({
      assignedTo: userId,
      status: statuses[1],
    });
  }

  function changeAssignee(event) {
    // Lagrer brukerens id slik at saken kan vises i varslene deres.
    const assignedTo = event.target.value;

    if (!assignedTo) {
      onUpdate({ assignedTo: "" });
      return;
    }

    onUpdate({
      assignedTo,
      status: item.status === statuses[0] ? statuses[1] : item.status,
    });
  }

  function changeStatus(event) {
    onUpdate({ status: event.target.value });
  }

  function changePriority(event) {
    onUpdate({ priority: event.target.value });
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
        <span className={`badge priority-${(item.priority || priorities[0]).toLowerCase()}`}>
          {item.priority || priorities[0]} prioritet
        </span>
      </div>

      <h3>{item.title}</h3>
      <p className="detail-category">{item.category}</p>

      <Info title="Beskrivelse" text={item.description} />
      <Info title="Opprettet" text={formatDate(item.createdAt)} />

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

        {!item.assignedTo && (
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
          value={item.priority || priorities[0]}
          onChange={changePriority}
        >
          {priorities.map((priority) => <option key={priority}>{priority}</option>)}
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
          <p>Saken ble opprettet {formatDate(item.createdAt)}.</p>
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
