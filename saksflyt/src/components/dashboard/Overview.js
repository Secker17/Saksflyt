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
  statuses,
  priorities,
}) {
  const { activeTeam } = useTeam();
  const newCases = countCases(cases, statuses[0]);
  const activeCases = countCases(cases, statuses[1]);
  const finishedCases = countCases(cases, statuses[statuses.length - 1]);

  return (
    <>
      <section className="stats">
        <StatCard
          icon={<FileText />}
          color="blue"
          title={statuses[0]}
          number={newCases}
        />
        <StatCard
          icon={<Clock3 />}
          color="yellow"
          title={statuses[1] || "Under arbeid"}
          number={activeCases}
        />
        <StatCard
          icon={<Check />}
          color="green"
          title={statuses[statuses.length - 1]}
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
          options={["Alle", ...statuses]}
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
          options={["Alle", ...priorities]}
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
