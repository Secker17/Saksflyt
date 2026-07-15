import { useState } from "react";
import { ListChecks, Settings2, Tags, X } from "lucide-react";
import { useTeam } from "../../context/TeamContext";
import { DEFAULT_CATEGORIES, DEFAULT_STATUSES } from "../../config/caseOptions";

function TeamSettings({ onClose }) {
  const { activeTeam, saveSettings } = useTeam();
  const [categories, setCategories] = useState(
    (activeTeam.settings?.categories || DEFAULT_CATEGORIES).join("\n"),
  );
  const [statuses, setStatuses] = useState(
    (activeTeam.settings?.statuses || DEFAULT_STATUSES).join("\n"),
  );
  const [error, setError] = useState("");
  const categoryCount = categories.split("\n").filter((item) => item.trim()).length;
  const statusCount = statuses.split("\n").filter((item) => item.trim()).length;

  async function handleSave(event) {
    event.preventDefault();
    const cleanCategories = categories.split("\n").map((item) => item.trim()).filter(Boolean);
    const cleanStatuses = statuses.split("\n").map((item) => item.trim()).filter(Boolean);

    if (cleanCategories.length === 0 || cleanStatuses.length < 3) {
      setError("Legg inn minst én kategori og tre statuser.");
      return;
    }

    setError("");
    await saveSettings({ categories: cleanCategories, statuses: cleanStatuses });
    onClose();
  }

  return (
    <div className="member-background" onClick={onClose}>
      <form className="member-window settings-window" onSubmit={handleSave} onClick={(event) => event.stopPropagation()}>
        <header>
          <div className="settings-heading">
            <span className="settings-icon"><Settings2 /></span>
            <div>
              <h2>Innstillinger</h2>
              <p>Tilpass valgene for {activeTeam.name}.</p>
            </div>
          </div>
          <button type="button" className="member-close" onClick={onClose}><X /></button>
        </header>

        <div className="settings-info">
          Endringene gjelder for alle medlemmene i teamet.
        </div>

        <section className="settings-field">
          <div className="settings-label">
            <span><Tags /> Kategorier</span>
            <small>{categoryCount} valg</small>
          </div>
          <p>Brukes når en ny sak opprettes.</p>
          <textarea id="settings-categories" aria-label="Kategorier" rows="6" value={categories} onChange={(event) => setCategories(event.target.value)} />
          <small>Skriv én kategori per linje.</small>
        </section>

        <section className="settings-field">
          <div className="settings-label">
            <span><ListChecks /> Statuser</span>
            <small>{statusCount} valg</small>
          </div>
          <p>Rekkefølgen går fra ny til ferdig sak.</p>
          <textarea id="settings-statuses" aria-label="Statuser" rows="5" value={statuses} onChange={(event) => setStatuses(event.target.value)} />
          <small>Du må ha minst tre statuser.</small>
        </section>

        {error && <p className="settings-error" role="alert">{error}</p>}

        <footer className="settings-actions">
          <button className="settings-cancel" type="button" onClick={onClose}>Avbryt</button>
          <button className="settings-save" type="submit">Lagre endringer</button>
        </footer>
      </form>
    </div>
  );
}

export default TeamSettings;
