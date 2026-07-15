import { CheckCircle2, Clock3, FileText } from "lucide-react";
import { useEffect, useState } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import { watchCases } from "../services/caseService";
import { useTeam } from "../context/TeamContext";
import { DEFAULT_STATUSES } from "../config/caseOptions";
import "../styles/Reports.css";

function Reports({ user }) {
  const { activeTeam } = useTeam();
  const statuses = activeTeam?.settings?.statuses || DEFAULT_STATUSES;
  const [cases, setCases] = useState([]);

  useEffect(() => {
    return watchCases(activeTeam.id, setCases);
  }, [activeTeam]);
  const active = cases.filter((item) => !item.archived && item.status === statuses[1]).length;
  const finished = cases.filter((item) => !item.archived && item.status === statuses[statuses.length - 1]).length;

  return (
    <div className="dashboard">
      <Sidebar email={user.email} />
      <main className="reports-content">
        <header className="reports-header">
          <div>
            <h1>Rapporter</h1>
            <p>Oppsummering av registrerte saker</p>
          </div>
        </header>
        <section className="report-cards">
          <ReportCard
            icon={<FileText />}
            color="blue"
            title="Totalt antall saker"
            number={cases.length}
          />
          <ReportCard
            icon={<Clock3 />}
            color="yellow"
            title={statuses[1] || "Under arbeid"}
            number={active}
          />
          <ReportCard
            icon={<CheckCircle2 />}
            color="green"
            title={statuses[statuses.length - 1]}
            number={finished}
          />
        </section>
        <section className="report-panel">
          <h2>Siste saker</h2>
          {cases.length === 0 && (
            <div className="report-empty">
              <FileText />
              <h3>Ingen data ennå</h3>
              <p>Opprett saker for å se dem i rapporten.</p>
            </div>
          )}
          {cases.map((item) => (
            <div className="report-row" key={item.id}>
              <span>
                <strong>{item.title}</strong>
                <small>
                  {item.caseNumber} · {item.category}
                </small>
              </span>
              <span
                className={`badge status-${item.status.toLowerCase().replace(" ", "-")}`}
              >
                {item.archived ? "Arkivert" : item.status}
              </span>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

function ReportCard({ icon, color, title, number }) {
  return (
    <article className="report-card">
      <span className={color}>{icon}</span>
      <div>
        <p>{title}</p>
        <strong>{number}</strong>
      </div>
    </article>
  );
}

export default Reports;
