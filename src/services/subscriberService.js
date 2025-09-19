import { db } from "../firebaseConfig/firebaseCore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Save subscriber email for a university
export const saveSubscriber = async (university, email) => {
  try {
    const docRef = await addDoc(collection(db, `subscribers_${university}`), {
      email,
      subscribedAt: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
