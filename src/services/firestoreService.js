import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export const createLead = async (data) => {
  return await addDoc(collection(db, 'leads'), {
    ...data,
    status: 'Baru',
    createdAt: serverTimestamp(),
  });
};

export const createMessage = async (data) => {
  return await addDoc(collection(db, 'messages'), {
    ...data,
    status: 'Baru',
    createdAt: serverTimestamp(),
  });
};

export const createApplication = async (data) => {
  return await addDoc(collection(db, 'applications'), {
    ...data,
    status: 'Review',
    createdAt: serverTimestamp(),
  });
};