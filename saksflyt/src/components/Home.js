import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import Sidebar from "./dashboard/Sidebar";
import Overview from "./dashboard/Overview";
import CaseTable from "./dashboard/CaseTable";
import NewCaseModal from "./dashboard/NewCaseModal";
import SettingsModal from "./dashboard/SettingsModal";
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
  const navigate = useNavigate();
  // Saker og verdier fra søkefeltene lagres i state.
  const savedCases = JSON.parse(localStorage.getItem("cases")) || [];
  const [cases, setCases] = useState(savedCases);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Alle");
  const [category, setCategory] = useState("Alle");
  const [priority, setPriority] = useState("Alle");
  const [showNewCase, setShowNewCase] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  useEffect(() => {
    localStorage.setItem("cases", JSON.stringify(cases));
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

  function addCase(formData) {
    const year = new Date().getFullYear();
    const caseNumber = String(cases.length + 1).padStart(4, "0");
    const newCase = {
      id: `${year}-${caseNumber}`,
      title: formData.title,
      category: formData.category,
      priority: formData.priority,
      description: formData.description,
      dueDate: formData.dueDate,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      status: "Ny",
      person: "Ikke tildelt",
      initials: "--",
      date: new Date().toLocaleDateString("no-NO"),
    };

    setCases([newCase, ...cases]);
    setSelectedCase(newCase);
    setShowNewCase(false);
  }

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

  function resetFilters() {
    setSearch("");
    setStatus("Alle");
    setCategory("Alle");
    setPriority("Alle");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function scrollToCases() {
    document
      .getElementById("case-table")
      ?.scrollIntoView({ behavior: "smooth" });
  }

  function handleLogout() {
    // signOut kommer fra Firebase og logger ut brukeren.
    signOut(auth);
  }

  return (
    <div className="dashboard">
      <Sidebar
        email={user.email}
        onOverview={resetFilters}
        onCases={scrollToCases}
        onNewCase={() => setShowNewCase(true)}
        onReport={() => navigate("/reports")}
        onSettings={() => setShowSettings(true)}
        onLogout={handleLogout}
      />

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
            onNewCase={() => setShowNewCase(true)}
          />

          <CaseTable
            cases={filteredCases}
            hasCases={cases.length > 0}
            onNewCase={() => setShowNewCase(true)}
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

      {showNewCase && (
        <NewCaseModal
          categories={categories}
          onSave={addCase}
          onClose={() => setShowNewCase(false)}
        />
      )}

      {showSettings && (
        <SettingsModal
          email={user.email}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

export default Home;
