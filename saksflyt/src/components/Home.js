import { useEffect, useState } from "react";
import { getCases, saveCases } from "../caseStorage";
import Sidebar from "./dashboard/Sidebar";
import Overview from "./dashboard/Overview";
import CaseTable from "./dashboard/CaseTable";
import CaseDetails from "./dashboard/CaseDetails";
import "../styles/Home.css";

const categories = [
  "IT og tilgang",
  "Kundeopplysninger",
  "Teknisk støtte",
  "Medlemskap",
  "Faktura",
];

function Home({ user }) {
  const [cases, setCases] = useState(getCases);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Alle");
  const [category, setCategory] = useState("Alle");
  const [priority, setPriority] = useState("Alle");
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    saveCases(cases);
  }, [cases]);

  // Lager en ny liste basert på søk og valgte filtre.
  const filteredCases = cases.filter((item) => {
    const title = item.title.toLowerCase();
    const searchText = search.toLowerCase();
    const textMatches = title.includes(searchText) || item.id.includes(search);

    const statusMatches = status === "Alle" || item.status === status;
    const categoryMatches = category === "Alle" || item.category === category;
    const priorityMatches = priority === "Alle" || item.priority === priority;

    return textMatches && statusMatches && categoryMatches && priorityMatches;
  });

  function updateCase(updatedCase) {
    const updatedCases = cases.map((item) => {
      return item.id === updatedCase.id ? updatedCase : item;
    });

    setCases(updatedCases);
    setSelectedCase(updatedCase);
  }

  function deleteCase(id) {
    const remainingCases = cases.filter((item) => item.id !== id);
    setCases(remainingCases);
    setSelectedCase(null);
  }

  return (
    <div className="dashboard">
      <Sidebar email={user.email} />

      <div className={`workspace ${selectedCase ? "has-details" : ""}`}>
        <main className="content">
          <header className="page-heading">
            <h1>Saksoversikt</h1>
            <p>Oversikt over registrerte saker og henvendelser</p>
          </header>

          <Overview
            cases={cases}
            search={search}
            setSearch={setSearch}
            status={status}
            setStatus={setStatus}
            category={category}
            setCategory={setCategory}
            priority={priority}
            setPriority={setPriority}
            categories={categories}
          />

          <CaseTable
            cases={filteredCases}
            hasCases={cases.length > 0}
            selectedCase={selectedCase}
            onSelect={setSelectedCase}
          />
        </main>

        {selectedCase && (
          <CaseDetails
            item={selectedCase}
            userEmail={user.email}
            onUpdate={updateCase}
            onDelete={deleteCase}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </div>
    </div>
  );
}

export default Home;
