import { useState } from "react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { createCase } from "../services/caseService";
import { validateCase } from "../utils/caseValidation";
import "../styles/NewCase.css";

const categories = [
  "IT og tilgang",
  "Kundeopplysninger",
  "Teknisk støtte",
  "Medlemskap",
  "Faktura",
];

function NewCase() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("team");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [priority, setPriority] = useState("Middels");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [sent, setSent] = useState(false);
  const [caseId, setCaseId] = useState("");
  const [error, setError] = useState("");

  async function submitCase(event) {
    event.preventDefault();
    const validationError = validateCase({ title, description });

    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    const year = new Date().getFullYear();
    const number = String(Date.now()).slice(-6);
    const id = `${year}-${number}`;

    await createCase(teamId, {
      caseNumber: id,
      title,
      category,
      priority,
      description,
      dueDate: "",
      customerName: name,
      customerEmail: "",
      status: "Ny",
      person: "Ikke tildelt",
      initials: "--",
      date: new Date().toLocaleDateString("no-NO"),
    });

    setCaseId(id);
    setSent(true);
  }

  if (sent) {
    return (
      <main className="public-case-page">
        <section className="case-success">
          <CheckCircle2 />
          <h1>Saken er opprettet</h1>
          <p>
            Saksnummeret er <strong>{caseId}</strong>.
          </p>
          <Link className="success-link" to="/cases">Tilbake til saksoversikten</Link>
        </section>
      </main>
    );
  }

  if (!teamId) {
    return (
      <main className="public-case-page">
        <section className="case-success">
          <h1>Mangler team</h1>
          <p>Åpne skjemaet fra saksoversikten.</p>
          <Link to="/login">Gå til innlogging</Link>
        </section>
      </main>
    );
  }

  return (
    <main className="public-case-page">
      <section className="public-case-card">
        <header className="public-case-header">
          <img src="/Logo.png" alt="Saksflyt" />
          <Link to="/cases"><ArrowLeft /> Tilbake til saksoversikten</Link>
        </header>

        <div className="public-case-intro">
          <span>OPPRETT SAK</span>
          <h1>Registrer en ny sak</h1>
          <p>Beskriv saken kort. Status og prioritet kan endres senere.</p>
        </div>

        <form className="public-case-form" onSubmit={submitCase} noValidate>
          <Field
            id="case-title"
            label="Tittel"
            value={title}
            setValue={setTitle}
            placeholder="Kort forklart hva saken gjelder"
          />

          <div className="public-form-grid">
            <SelectField
              id="case-category"
              label="Kategori"
              value={category}
              setValue={setCategory}
              options={categories}
            />
            <SelectField
              id="case-priority"
              label="Prioritet"
              value={priority}
              setValue={setPriority}
              options={["Lav", "Middels", "Høy"]}
            />
          </div>

          <label htmlFor="case-description">Beskrivelse</label>
          <textarea
            id="case-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="6"
            placeholder="Beskriv problemet og hva som allerede er prøvd"
          />

          <Field
            id="case-reporter"
            label="Innmelder (valgfritt)"
            value={name}
            setValue={setName}
            placeholder="Navn på personen som meldte inn saken"
          />
          <small className="form-help">Du trenger ikke å skrive inn e-post.</small>

          {error && <p className="error" role="alert">{error}</p>}

          <button type="submit"><Send /> Opprett sak</button>
        </form>
      </section>
    </main>
  );
}

function Field({ id, label, value, setValue, placeholder }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function SelectField({ id, label, value, setValue, options }) {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => setValue(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </div>
  );
}

export default NewCase;
