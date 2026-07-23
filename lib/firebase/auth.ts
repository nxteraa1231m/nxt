import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

export async function signInAdmin(
  email: string,
  password: string
): Promise<User> {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  
  // Grant instant admin status to the primary administrator email
  if (credential.user.email === "nxteraa953@gmail.com") {
    return credential.user;
  }

  // Check if user is in admins collection
  const adminDoc = await getDoc(doc(db, "admins", credential.user.uid));
  if (!adminDoc.exists()) {
    await firebaseSignOut(auth);
    throw new Error("Access denied. Not an admin account.");
  }
  return credential.user;
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export async function isAdmin(uid: string): Promise<boolean> {
  // If the user's email matches the primary admin email
  if (auth.currentUser?.email === "nxteraa953@gmail.com") {
    return true;
  }
  const adminDoc = await getDoc(doc(db, "admins", uid));
  return adminDoc.exists();
}

export { onAuthStateChanged, auth };
