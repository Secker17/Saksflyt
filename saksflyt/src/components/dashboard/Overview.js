import {
  Check,
  ChevronDown,
  CirclePlus,
  Clock3,
  FileText,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTeam } from "../../context/TeamContext";

function Overview({
  cases,
  search,
  setSearch,
  status,
  setStatus,
  category,
  setCategory,
  priority,
  setPriority,
  categories,
}) {
  const { activeTeam } = useTeam();
  const newCases = countCases(cases, "Ny");
  const activeCases = countCases(cases, "Under arbeid");
  const finishedCases = countCases(cases, "Ferdig");

  return (
    <>
      <section className="stats">
        <StatCard
          icon={<FileText />}
          color="blue"
          title="Nye saker"
          number={newCases}
        />
        <StatCard
          icon={<Clock3 />}
          color="yellow"
          title="Under arbeid"
          number={activeCases}
        />
        <StatCard
          icon={<Check />}
          color="green"
          title="Ferdige"
          number={finishedCases}
        />
      </section>

      <section className="filters">
        <label className="search-box">
          <input
            type="search"
            placeholder="Søk etter sak"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Search />
        </label>

        <Filter
          label="Status"
          value={status}
          onChange={setStatus}
          options={["Alle", "Ny", "Under arbeid", "Ferdig"]}
        />
        <Filter
          label="Kategori"
          value={category}
          onChange={setCategory}
          options={["Alle", ...categories]}
        />
        <Filter
          label="Prioritet"
          value={priority}
          onChange={setPriority}
          options={["Alle", "Høy", "Middels", "Lav"]}
        />

        <Link
          className="new-case-button"
          to={`/new-case?team=${activeTeam.id}`}
        >
          <CirclePlus /> Ny sak
        </Link>
      </section>
    </>
  );
}

function countCases(cases, status) {
  return cases.filter((item) => item.status === status).length;
}

function StatCard({ icon, color, title, number }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div>
        <p>{title}</p>
        <strong>{number}</strong>
      </div>
    </article>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown />
    </label>
  );
}

export default Overview;
