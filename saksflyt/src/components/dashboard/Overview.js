import { Check, ChevronDown, CirclePlus, Clock3, FileText, Search } from 'lucide-react';

function Overview(props) {
  const newCases = props.cases.filter((item) => item.status === 'Ny').length;
  const activeCases = props.cases.filter((item) => item.status === 'Under arbeid').length;
  const finishedCases = props.cases.filter((item) => item.status === 'Ferdig').length;

  return (
    <>
      <section className="stats">
        <StatCard icon={<FileText />} color="blue" title="Nye saker" number={newCases} change="+0 fra i går" />
        <StatCard icon={<Clock3 />} color="yellow" title="Under arbeid" number={activeCases} change="+0 fra i går" />
        <StatCard icon={<Check />} color="green" title="Ferdige" number={finishedCases} change="+0 fra i går" />
      </section>

      <section className="filters">
        <label className="search-box">
          <input
            type="search"
            placeholder="Søk etter sak"
            value={props.search}
            onChange={(event) => props.setSearch(event.target.value)}
          />
          <Search />
        </label>

        <Filter label="Status" value={props.status} onChange={props.setStatus} options={['Alle', 'Ny', 'Under arbeid', 'Ferdig']} />
        <Filter label="Kategori" value={props.category} onChange={props.setCategory} options={['Alle', ...props.categories]} />
        <Filter label="Prioritet" value={props.priority} onChange={props.setPriority} options={['Alle', 'Høy', 'Middels', 'Lav']} />

        <button className="new-case-button" onClick={props.onNewCase}><CirclePlus /> Ny sak</button>
      </section>
    </>
  );
}

function StatCard({ icon, color, title, number, change }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>{icon}</div>
      <div><p>{title}</p><strong>{number}</strong><small>{change}</small></div>
    </article>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <label className="filter-select">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown />
    </label>
  );
}

export default Overview;
