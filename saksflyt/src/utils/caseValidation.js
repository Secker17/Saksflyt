export function validateCase({ title, description }) {
  // Tittel og beskrivelse er de eneste feltene som må fylles ut.
  if (!title.trim() || !description.trim()) {
    return "Tittel og beskrivelse må fylles ut.";
  }

  return "";
}
