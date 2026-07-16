export function formatDate(timestamp, fallback = "Ikke oppgitt") {
  if (timestamp?.toDate) {
    return timestamp.toDate().toLocaleDateString("no-NO");
  }

  return fallback;
}
