import { useState } from "react";
import { FileText, Save, X } from "lucide-react";

function NewCaseModl({ categories, onSave, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState("Middels");
  const [dueDate, setDueDate] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    onSave({
      title,
      description,
      category,
      priority,
      dueDate,
      customerName,
      customerEmail,
    });
  }

  return (
    <div className="modal-background" onMouseDown={onClose}>
      <form
        className="case-form new-case-form"
        onSubmit={handleSubmit}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div className="modal-title-icon">
            <FileText />
            <span>
              <h2>Opprett ny sak</h2>
              <p>Fyll inn informasjon om saken</p>
            </span>
          </div>
          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>
        <label htmlFor="case-title">Tittel</label>
        <input
          id="case-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Kort og tydelig tittel"
          required
          autoFocus
        />
        <label htmlFor="description">Beskrivelse</label>
        <textarea
          id="description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Beskriv saken"
          rows="4"
          required
        />
        <div className="form-grid">
          <div>
            <label htmlFor="customer-name">Navn på innmelder</label>
            <input
              id="customer-name"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Ola Nordmann"
              required
            />
          </div>
          <div>
            <label htmlFor="customer-email">E-post til innmelder</label>
            <input
              id="customer-email"
              type="email"
              value={customerEmail}
              onChange={(event) => setCustomerEmail(event.target.value)}
              placeholder="ola@eksempel.no"
              required
            />
          </div>
        </div>
        <div className="form-grid">
          <div>
            <label htmlFor="new-category">Kategori</label>
            <select
              id="new-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="new-priority">Prioritet</label>
            <select
              id="new-priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option>Høy</option>
              <option>Middels</option>
              <option>Lav</option>
            </select>
          </div>
          <div>
            <label htmlFor="due-date">Frist</label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(event) => setDueDate(event.target.value)}
            />
          </div>
        </div>
        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={onClose}>
            Avbryt
          </button>
          <button type="submit" className="save-button">
            <Save /> Opprett sak
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewCaseModl;
