import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const COLLECTION = 'site_config';

export const getSiteConfig = async (docId) => {
    const snap = await getDoc(doc(db, COLLECTION, docId));
    return snap.exists() ? snap.data() : null;
};

export const updateSiteConfig = async (docId, data) => {
    await setDoc(doc(db, COLLECTION, docId), data, { merge: true });
};

export const subscribeSiteConfig = (docId, callback) => {
    return onSnapshot(doc(db, COLLECTION, docId), (snap) => {
        callback(snap.exists() ? snap.data() : null);
    });
};
