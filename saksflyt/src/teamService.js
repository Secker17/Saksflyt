import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";

export function watchTeams(userId, setTeams) {
  const teamsQuery = query(
    collection(db, "teams"),
    where("members", "array-contains", userId),
  );

  return onSnapshot(teamsQuery, (snapshot) => {
    const teams = snapshot.docs.map((team) => ({
      id: team.id,
      ...team.data(),
    }));

    setTeams(teams);
  });
}

export async function createTeam(name, userId) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();

  return addDoc(collection(db, "teams"), {
    name,
    code,
    ownerId: userId,
    members: [userId],
  });
}

export async function joinTeam(code, userId) {
  const teamsQuery = query(
    collection(db, "teams"),
    where("code", "==", code.toUpperCase()),
    limit(1),
  );
  const result = await getDocs(teamsQuery);

  if (result.empty) {
    throw new Error("Fant ikke teamet");
  }

  const teamId = result.docs[0].id;
  const teamRef = doc(db, "teams", teamId);
  await updateDoc(teamRef, {
    members: arrayUnion(userId),
  });
}
