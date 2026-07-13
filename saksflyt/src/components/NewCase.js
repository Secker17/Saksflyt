import { useState } from "react";
import { ArrowLeft, CheckCircle2, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { getCases, saveCases } from "../caseStorage";
import "../styles/NewCase.css";

const categories = [
  "IT og tilgang",
  "Kundeopplysninger",
  "Teknisk støtte",
  "Medlemskap",
  "Faktura",
];

function NewCase() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [sent, setSent] = useState(false);
  const [caseId, setCaseId] = useState("");

  function submitCase(event) {
    event.preventDefault();

    const savedCases = getCases();
    const year = new Date().getFullYear();
    const number = String(savedCases.length + 1).padStart(4, "0");
    const id = `${year}-${number}`;

    const newCase = {
      id,
      title,
      category,
      priority: "Middels",
      description,
      dueDate: "",
      customerName: name,
      customerEmail: email,
      status: "Ny",
      person: "Ikke tildelt",
      initials: "--",
      date: new Date().toLocaleDateString("no-NO"),
    };

    saveCases([newCase, ...savedCases]);
    setCaseId(id);
    setSent(true);
  }

  if (sent) {
    return (
      <main className="public-case-page">
        <section className="case-success">
          <CheckCircle2 />
          <h1>Saken er sendt inn</h1>
          <p>
            Saksnummeret ditt er <strong>{caseId}</strong>.
          </p>
          <button onClick={() => setSent(false)}>Send inn en ny sak</button>
        </section>
      </main>
    );
  }

  return (
    <main className="public-case-page">
      <section className="public-case-card">
        <div className="public-case-header">
          <img src="/Logo.png" alt="Saksflyt" />
          <Link to="/login">
            <ArrowLeft /> Innlogging for saksbehandlere
          </Link>
        </div>

        <div className="public-case-intro">
          <span>NY HENVENDELSE</span>
          <h1>Hva kan vi hjelpe deg med?</h1>
          <p>Fyll ut skjemaet. Du får et saksnummer når saken er sendt inn.</p>
        </div>

        <form className="public-case-form" onSubmit={submitCase}>
          <div className="public-form-grid">
            <Field
              label="Navn"
              value={name}
              setValue={setName}
              placeholder="Ditt navn"
            />
            <Field
              label="E-post"
              type="email"
              value={email}
              setValue={setEmail}
              placeholder="navn@eksempel.no"
            />
          </div>

          <Field
            label="Tittel"
            value={title}
            setValue={setTitle}
            placeholder="Kort forklart hva saken gjelder"
          />

          <label>Kategori</label>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label>Beskrivelse</label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows="6"
            placeholder="Fortell oss mer om saken"
            required
          />

          <button type="submit">
            <Send /> Send inn sak
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({ label, type = "text", value, setValue, placeholder }) {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        required
      />
    </div>
  );
}

export default NewCase;
