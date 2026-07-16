import { useEffect, useState } from "react";
import { archiveCase, cleanupUnusedCaseFields, updateCase, watchCases } from "../services/caseService";
import { useTeam } from "../context/TeamContext";
import Sidebar from "../components/dashboard/Sidebar";
import Overview from "../components/dashboard/Overview";
import CaseTable from "../components/dashboard/CaseTable";
import CaseDetails from "../components/dashboard/CaseDetails";
import Notifications from "../components/dashboard/Notifications";
import { DEFAULT_CATEGORIES, DEFAULT_STATUSES, PRIORITIES } from "../config/caseOptions";
import "../styles/Cases.css";

function Cases({ user }) {
  const { activeTeam } = useTeam();
  const categories = activeTeam?.settings?.categories || DEFAULT_CATEGORIES;
  const statuses = activeTeam?.settings?.statuses || DEFAULT_STATUSES;
  const priorities = activeTeam?.settings?.priorities || PRIORITIES;
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Alle");
  const [category, setCategory] = useState("Alle");
  const [priority, setPriority] = useState("Alle");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    // Starter lytting når brukeren velger et team.
    if (!activeTeam) {
      return;
    }

    setSelectedCase(null);
    return watchCases(activeTeam.id, setCases);
  }, [activeTeam]);

  useEffect(() => {
    if (activeTeam && cases.length > 0) {
      cleanupUnusedCaseFields(activeTeam.id, cases).catch(console.error);
    }
  }, [activeTeam, cases]);

  // Lager en ny liste basert på søk og valgte filtre.
  const visibleCases = cases.filter((item) => !item.archived);
  const filteredCases = visibleCases.filter((item) => {
    const title = item.title.toLowerCase();
    const searchText = search.toLowerCase();
    const textMatches =
      title.includes(searchText) || item.caseNumber.includes(search);

    const statusMatches = status === "Alle" || item.status === status;
    const categoryMatches = category === "Alle" || item.category === category;
    const priorityMatches = priority === "Alle" || item.priority === priority;

    return textMatches && statusMatches && categoryMatches && priorityMatches;
  });

  async function saveCase(changes) {
    // Lagrer bare feltene som faktisk ble endret.
    await updateCase(activeTeam.id, selectedCase.id, changes);
    setSelectedCase({ ...selectedCase, ...changes });
  }

  async function removeCase(id) {
    await archiveCase(activeTeam.id, id);
    setSelectedCase(null);
  }

  return (
    <div className="dashboard">
      <Sidebar email={user.email} />

      <div className={`workspace ${selectedCase ? "has-details" : ""}`}>
        <main className="content">
          <header className="page-heading">
            <Notifications cases={visibleCases} userId={user.uid} statuses={statuses} onSelect={setSelectedCase} />
            <h1>Saksoversikt</h1>
            <p>Oversikt over registrerte saker og henvendelser</p>
          </header>

          <Overview
            cases={visibleCases}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            category={category}
            setCategory={setCategory}
            priority={priority}
            setPriority={setPriority}
            categories={categories}
            statuses={statuses}
            priorities={priorities}
          />

          <CaseTable
            cases={filteredCases}
            hasCases={visibleCases.length > 0}
            selectedCase={selectedCase}
            onSelect={setSelectedCase}
          />
        </main>

        {selectedCase && (
          <CaseDetails
            item={selectedCase}
            userId={user.uid}
            statuses={statuses}
            priorities={priorities}
            onUpdate={saveCase}
            onDelete={removeCase}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Cases;
