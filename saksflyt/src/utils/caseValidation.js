export function validateCase({ title, description }) {
  if (!title.trim() || !description.trim()) {
    return "Tittel og beskrivelse må fylles ut.";
  }

  return "";
}
