// firebase
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "@firebase/firestore";

// base
import firebaseApp from "../auth/base";
const firestore = getFirestore(firebaseApp);

// doc containing admin list
export const adminListDoc = doc(firestore, "config", "adminList");
// collection of word lists
export const listsCollection = collection(getFirestore(firebaseApp), "lists");

export async function addAdmin(email: string) {
  await updateDoc(adminListDoc, {
    admins: arrayUnion(email),
  });
}

export async function removeAdmin(email: string) {
  await updateDoc(adminListDoc, {
    admins: arrayRemove(email),
  });
}

export async function createList(name: string, items?: string[]) {
  await addDoc(collection(firestore, "lists"), {
    name,
    items: items || [],
  });
}

export async function addItemToList(listId: string, value: string) {
  await updateDoc(_getListRef(listId), {
    items: arrayUnion(value),
  });
}

export async function removeItemFromList(listId: string, value: string) {
  await updateDoc(_getListRef(listId), {
    items: arrayRemove(value),
  });
}

function _getListRef(id: string) {
  return doc(firestore, "lists", id);
}
