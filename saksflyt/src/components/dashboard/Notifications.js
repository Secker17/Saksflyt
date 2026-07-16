import { Bell, X } from "lucide-react";
import { useState } from "react";

function Notifications({ cases, userId, statuses, onSelect }) {
  const [open, setOpen] = useState(false);

  // Viser bare aktive saker som er tildelt den innloggede brukeren.
  const assignedCases = cases.filter(
    (item) => item.assignedTo === userId && item.status !== statuses[statuses.length - 1],
  );

  return (
    <div className="notifications">
      <button
        className="notification-button"
        onClick={() => setOpen(!open)}
        aria-label="Varsler"
      >
        <Bell />
        {assignedCases.length > 0 && <span>{assignedCases.length}</span>}
      </button>

      {open && (
        <div className="notification-panel">
          <header>
            <strong>Mine tildelte saker</strong>
            <button onClick={() => setOpen(false)} aria-label="Lukk varsler"><X /></button>
          </header>
          {assignedCases.length === 0 && <p>Du har ingen nye tildelte saker.</p>}
          {assignedCases.map((item) => (
            <button
              className="notification-case"
              key={item.id}
              onClick={() => {
                onSelect(item);
                setOpen(false);
              }}
            >
              <strong>{item.title}</strong>
              <small>{item.caseNumber} · {item.priority}</small>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notifications;
