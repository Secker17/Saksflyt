import { X } from "lucide-react";

function SettingsModal({ email, onClose }) {
  return (
    <div className="modal-background" onMouseDown={onClose}>
      <section
        className="settings-panel"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <h2>Innstillinger</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <p>Innlogget bruker</p>
        <strong>{email}</strong>
        <button className="save-button settings-close" onClick={onClose}>
          Lukk
        </button>
      </section>
    </div>
  );
}

export default SettingsModal;
