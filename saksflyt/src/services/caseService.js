import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase";

export function watchCases(teamId, setCases) {
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

export function deleteCase(teamId, caseId) {
  const caseRef = doc(db, "teams", teamId, "cases", caseId);
  return deleteDoc(caseRef);
}
