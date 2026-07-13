import { CirclePlus, Folder, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { useTeam } from "../../TeamContext";

function CaseTable({ cases, hasCases, selectedCase, onSelect }) {
  const { activeTeam } = useTeam();
  return (
    <section className="table-card" id="case-table">
      <table>
        <thead>
          <tr>
            <th>Saksnr</th>
            <th>Tittel</th>
            <th>Kategori</th>
            <th>Prioritet</th>
            <th>Status</th>
            <th>Ansvarlig</th>
            <th>Opprettet</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((item) => (
            <tr
              key={item.id}
              className={selectedCase?.id === item.id ? "selected-row" : ""}
              onClick={() => onSelect(item)}
            >
              <td>{item.caseNumber}</td>
              <td className="case-title">{item.title}</td>
              <td>{item.category}</td>
              <td>
                <span
                  className={`badge priority-${item.priority.toLowerCase()}`}
                >
                  {item.priority}
                </span>
              </td>
              <td>
                <span
                  className={`badge status-${item.status.toLowerCase().replace(" ", "-")}`}
                >
                  {item.status}
                </span>
              </td>
              <td>
                <span className="person">
                  {item.person !== "Ikke tildelt" && (
                    <span className="avatar">{item.initials}</span>
                  )}
                  {item.person}
                </span>
              </td>
              <td>{item.date}</td>
              <td className="menu-dots">
                <MoreHorizontal />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {cases.length === 0 && (
        <div className="empty-message">
          <Folder />
          <h3>{hasCases ? "Ingen saker funnet" : "Ingen saker enda"}</h3>
          <p>
            {hasCases
              ? "Prøv et annet søk eller endre filtrene."
              : "Opprett den første saken for å komme i gang."}
          </p>
          {!hasCases && (
            <Link to={`/new-case?team=${activeTeam.id}`}>
              <CirclePlus /> Opprett sak
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

export default CaseTable;
