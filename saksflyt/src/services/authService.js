import {
  isSignInWithEmailLink,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";
import { auth } from "../config/firebase";

const EMAIL_KEY = "emailForSignIn";
const WAITING_KEY = "waitingForEmailLink";

export async function checkPasswordAndSendLoginLink(email, password) {
  window.sessionStorage.setItem(WAITING_KEY, "true");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    await signOut(auth);
    await sendSignInLinkToEmail(auth, email, {
      url: `${window.location.origin}/login`,
      handleCodeInApp: true,
    });
    window.localStorage.setItem(EMAIL_KEY, email);
  } catch (error) {
    window.sessionStorage.removeItem(WAITING_KEY);
    throw error;
  }
}

export async function finishLoginFromEmailLink() {
  if (!isSignInWithEmailLink(auth, window.location.href)) {
    return;
  }

  let email = window.localStorage.getItem(EMAIL_KEY);

  if (!email) {
    email = window.prompt("Skriv inn e-postadressen din");
  }

  if (!email) {
    return;
  }

  await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem(EMAIL_KEY);
  window.sessionStorage.removeItem(WAITING_KEY);
  window.history.replaceState({}, document.title, "/cases");
}

export function isWaitingForEmailLink() {
  return window.sessionStorage.getItem(WAITING_KEY) === "true";
}
