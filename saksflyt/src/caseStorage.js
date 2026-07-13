// Henter sakene som er lagret i nettleseren.
export function getCases() {
  const savedCases = localStorage.getItem("cases");

  if (!savedCases) {
    return [];
  }

  return JSON.parse(savedCases);
}

// Lagrer hele listen med saker i nettleseren.
export function saveCases(cases) {
  localStorage.setItem("cases", JSON.stringify(cases));
}
