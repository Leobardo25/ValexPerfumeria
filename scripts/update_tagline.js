import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAmLxDzGdS0R776e18-fr2GAziHJXlYays",
  authDomain: "valexperfumeria-75c23.firebaseapp.com",
  projectId: "valexperfumeria-75c23",
  storageBucket: "valexperfumeria-75c23.firebasestorage.app",
  messagingSenderId: "32346089827",
  appId: "1:32346089827:web:58e24fb6d88e1d66194b56"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    try {
        const landingRef = doc(db, 'site_config', 'landing');
        const landingSnap = await getDoc(landingRef);
        if (landingSnap.exists()) {
            const data = landingSnap.data();
            if (data.heroBadge === 'Perfumería de Autor') {
                await updateDoc(landingRef, { heroBadge: 'Valex Perfumería' });
                console.log('Updated landing heroBadge in Firestore');
            }
        }

        const globalRef = doc(db, 'site_config', 'global');
        const globalSnap = await getDoc(globalRef);
        if (globalSnap.exists()) {
            const data = globalSnap.data();
            if (data.brandTagline === 'Perfumería de Autor') {
                await updateDoc(globalRef, { brandTagline: 'Valex Perfumería' });
                console.log('Updated global brandTagline in Firestore');
            }
        }
    } catch (e) {
        console.error("Error:", e);
    }
    process.exit(0);
}

run();
