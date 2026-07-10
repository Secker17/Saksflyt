import { useState } from 'react';
import { CheckCircle2, CircleDot, ListFilter, UserPlus, X } from 'lucide-react';

function CaseDetails({ item, onClose }) {
  const [showActivity, setShowActivity] = useState(false);

  return (
    <aside className="case-details">
      <div className="details-heading"><h2>Sak {item.id}</h2><button onClick={onClose}><X /></button></div>
      <div className="details-badges"><span className="badge status-ny">{item.status}</span><span className={`badge priority-${item.priority.toLowerCase()}`}>{item.priority} prioritet</span></div>
      <h3>{item.title}</h3><p className="detail-category">{item.category}</p>
      <section className="detail-section"><strong>Beskrivelse</strong><p>{item.description || 'Ingen beskrivelse.'}</p></section>
      <div className="detail-columns"><section><strong>Opprettet</strong><p>{item.date}</p></section><section><strong>Frist</strong><p>{item.dueDate || 'Ikke satt'}</p></section></div>
      <section className="detail-section"><strong>Ansvarlig</strong><div className="detail-person"><span className="avatar">{item.initials}</span>{item.person}</div></section>
      <section className="history"><strong>Sakshistorikk</strong><div><span></span><p><b>Sak opprettet</b><small>{item.date}</small></p></div><div><span></span><p><b>Status satt til {item.status}</b><small>{item.date}</small></p></div></section>
      <button className="activity-button" onClick={() => setShowActivity(true)}><ListFilter /> Se alle aktiviteter</button>
      {showActivity && <div className="activity-overlay"><div className="activity-header"><h3>Alle aktiviteter</h3><button onClick={() => setShowActivity(false)}><X /></button></div><p className="activity-case">Sak {item.id}</p><div className="activity-list"><article><CircleDot /><div><strong>Sak opprettet</strong><p>{item.date}</p></div></article><article><UserPlus /><div><strong>Ansvarlig valgt</strong><p>{item.person}</p></div></article><article><CheckCircle2 /><div><strong>Status satt til {item.status}</strong><p>{item.date}</p></div></article></div><button className="save-button activity-close" onClick={() => setShowActivity(false)}>Ferdig</button></div>}
    </aside>
  );
}

export default CaseDetails;
