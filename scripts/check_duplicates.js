import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function checkTimestamps() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = querySnapshot.docs.map(doc => {
    const data = doc.data();
    let date = "N/A";
    if (data.createdAt) {
      // Check if it's a Firestore Timestamp or a JS Date
      if (data.createdAt.toDate) {
        date = data.createdAt.toDate().toISOString();
      } else if (data.createdAt instanceof Date) {
        date = data.createdAt.toISOString();
      } else {
        date = data.createdAt.toString();
      }
    }
    return { id: doc.id, name: data.name, createdAt: date };
  });

  console.log("--- PRODUCT LIST WITH TIMESTAMPS ---");
  products.sort((a, b) => a.name.localeCompare(b.name)).forEach(p => {
    console.log(`[${p.createdAt}] ${p.name} (${p.id})`);
  });
  process.exit(0);
}

checkTimestamps();
