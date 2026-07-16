import {
  addDoc,
  collection,
  deleteField,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export function watchCases(teamId, setCases) {
  // Følger med på sakene og oppdaterer siden når Firestore endres.
  const casesRef = collection(db, "teams", teamId, "cases");
  const casesQuery = query(casesRef, orderBy("createdAt", "desc"));

  return onSnapshot(casesQuery, (snapshot) => {
    const cases = snapshot.docs.map((caseDoc) => ({
      id: caseDoc.id,
      ...caseDoc.data(),
    }));

    setCases(cases);
  });
}

export function createCase(teamId, newCase) {
  // Lagrer saken under teamet den tilhører.
  const casesRef = collection(db, "teams", teamId, "cases");
  return addDoc(casesRef, {
    ...newCase,
    createdAt: serverTimestamp(),
  });
}

export function updateCase(teamId, caseId, changes) {
  const caseRef = doc(db, "teams", teamId, "cases", caseId);
  return updateDoc(caseRef, changes);
}

export function cleanupUnusedCaseFields(teamId, cases) {
  // Fjerner gamle felt som ikke lenger brukes på nettsiden.
  const unusedFields = ["customerEmail", "customerName", "dueDate", "initials", "person", "date"];
  const casesToClean = cases.filter((item) => (
    unusedFields.some((field) => Object.hasOwn(item, field))
  ));

  return Promise.all(casesToClean.map((item) => {
    const caseRef = doc(db, "teams", teamId, "cases", item.id);
    return updateDoc(caseRef, {
      customerEmail: deleteField(),
      customerName: deleteField(),
      dueDate: deleteField(),
      initials: deleteField(),
      person: deleteField(),
      date: deleteField(),
    });
  }));
}

export function archiveCase(teamId, caseId) {
  // Saken beholdes i databasen selv om den skjules fra sakslisten.
  const caseRef = doc(db, "teams", teamId, "cases", caseId);
  return updateDoc(caseRef, {
    archived: true,
    archivedAt: serverTimestamp(),
  });
}
