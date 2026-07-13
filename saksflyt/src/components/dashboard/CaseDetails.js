import { useState } from "react";
import { ListFilter, Trash2, UserPlus, X } from "lucide-react";

function CaseDetails({ item, userEmail, onUpdate, onDelete, onClose }) {
  const [showActivity, setShowActivity] = useState(false);

  function assignToMe() {
    const name = userEmail.split("@")[0];

    onUpdate({
      ...item,
      person: name,
      initials: name.slice(0, 2).toUpperCase(),
      status: "Under arbeid",
    });
  }

  function changeStatus(event) {
    onUpdate({ ...item, status: event.target.value });
  }

  function deleteCase() {
    if (window.confirm("Vil du slette denne saken?")) {
      onDelete(item.id);
    }
  }

  return (
    <aside className="case-details">
      <div className="details-heading">
        <h2>Sak {item.id}</h2>
        <button onClick={onClose} aria-label="Lukk detaljer">
          <X />
        </button>
      </div>

      <div className="details-badges">
        <span className="badge status-ny">{item.status}</span>
        <span className={`badge priority-${item.priority.toLowerCase()}`}>
          {item.priority} prioritet
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
        <strong>Ansvarlig</strong>
        <p>{item.person}</p>

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
          <option>Ny</option>
          <option>Under arbeid</option>
          <option>Ferdig</option>
        </select>
      </section>

      <button className="activity-button" onClick={() => setShowActivity(true)}>
        <ListFilter /> Se alle aktiviteter
      </button>

      <button className="delete-case-button" onClick={deleteCase}>
        <Trash2 /> Slett sak
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
