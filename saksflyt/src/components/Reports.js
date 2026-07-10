import { CheckCircle2, Clock3, Download, FileText } from 'lucide-react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import Sidebar from './dashboard/Sidebar';
import '../styles/Reports.css';

function Reports({ user }) {
  const navigate = useNavigate();
  const cases = JSON.parse(localStorage.getItem('cases')) || [];
  const active = cases.filter((item) => item.status === 'Under arbeid').length;
  const finished = cases.filter((item) => item.status === 'Ferdig').length;

  function downloadCsv() {
    const heading = 'Saksnr,Tittel,Kategori,Prioritet,Status,Ansvarlig,Opprettet';
    const rows = cases.map((item) => [item.id, item.title, item.category, item.priority, item.status, item.person, item.date].join(','));
    const file = new Blob([[heading, ...rows].join('\n')], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(file);
    link.download = 'saksrapport.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  }

  return (
    <div className="dashboard">
      <Sidebar email={user.email} onOverview={() => navigate('/')} onCases={() => navigate('/')} onNewCase={() => navigate('/')} onReport={() => {}} onSettings={() => navigate('/')} onLogout={() => signOut(auth)} />
      <main className="reports-content">
        <header className="reports-header"><div><h1>Rapporter</h1><p>Oppsummering av registrerte saker</p></div><button onClick={downloadCsv}><Download /> Last ned CSV</button></header>
        <section className="report-cards">
          <ReportCard icon={<FileText />} color="blue" title="Totalt antall saker" number={cases.length} />
          <ReportCard icon={<Clock3 />} color="yellow" title="Under arbeid" number={active} />
          <ReportCard icon={<CheckCircle2 />} color="green" title="Ferdig behandlet" number={finished} />
        </section>
        <section className="report-panel">
          <h2>Siste saker</h2>
          {cases.length === 0 && <div className="report-empty"><FileText /><h3>Ingen data ennå</h3><p>Opprett saker for å se dem i rapporten.</p></div>}
          {cases.map((item) => <div className="report-row" key={item.id}><span><strong>{item.title}</strong><small>{item.id} · {item.category}</small></span><span className={`badge status-${item.status.toLowerCase().replace(' ', '-')}`}>{item.status}</span></div>)}
        </section>
      </main>
    </div>
  );
}

function ReportCard({ icon, color, title, number }) {
  return <article className="report-card"><span className={color}>{icon}</span><div><p>{title}</p><strong>{number}</strong></div></article>;
}

export default Reports;
