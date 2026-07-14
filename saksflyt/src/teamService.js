import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
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

export async function createTeam(name, user) {
  const code = Math.random().toString(36).slice(2, 8).toUpperCase();

  return addDoc(collection(db, "teams"), {
    name,
    code,
    ownerId: user.uid,
    members: [user.uid],
    roles: { [user.uid]: "owner" },
    verified: { [user.uid]: true },
    memberEmails: { [user.uid]: user.email },
    createdAt: serverTimestamp(),
  });
}

export async function joinTeam(code, user) {
  const teamsQuery = query(
    collection(db, "teams"),
    where("code", "==", code.trim().toUpperCase()),
    limit(1),
  );
  const result = await getDocs(teamsQuery);

  if (result.empty) {
    throw new Error("Fant ikke teamet");
  }

  const teamDoc = result.docs[0];
  const teamId = teamDoc.id;
  const team = teamDoc.data();
  const teamRef = doc(db, "teams", teamId);

  // Hele kartet lagres på nytt. Da fungerer det også for eldre team.
  await updateDoc(teamRef, {
    members: arrayUnion(user.uid),
    roles: { ...team.roles, [user.uid]: "guest" },
    verified: { ...team.verified, [user.uid]: false },
    memberEmails: { ...team.memberEmails, [user.uid]: user.email },
  });

  return teamId;
}

export function changeRole(teamId, userId, role) {
  const teamRef = doc(db, "teams", teamId);
  return updateDoc(teamRef, {
    [`roles.${userId}`]: role,
    [`verified.${userId}`]: role !== "guest",
  });
}

// Lagrer e-post slik at teameieren ser hvem medlemmet er.
export function saveMemberEmail(teamId, user) {
  const teamRef = doc(db, "teams", teamId);
  return updateDoc(teamRef, {
    [`memberEmails.${user.uid}`]: user.email,
  });
}
