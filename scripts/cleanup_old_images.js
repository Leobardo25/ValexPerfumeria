import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';

const projectRoot = 'D:/PrecenciaDigitalCR/perfumeriaValex';
process.chdir(projectRoot);

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
const storage = getStorage(app);

const targetProducts = [
  "Azzaro Wanted",
  "Carolina Herrera CH Men",
  "Bvlgari Pour Homme",
  "Givenchy Gentleman Society"
];

async function run() {
  console.log("Fetching existing products...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = {};
  querySnapshot.forEach(doc => {
    products[doc.data().name] = doc.id;
  });

  for (const name of targetProducts) {
    const productId = products[name];
    if (!productId) continue;

    console.log(`\nChecking Storage for ${name} (${productId})...`);
    const folderRef = ref(storage, `products/${productId}`);
    
    try {
      const folderContents = await listAll(folderRef);
      for (const itemRef of folderContents.items) {
        // Delete everything EXCEPT the new ones containing '_bg'
        if (!itemRef.name.includes('_bg')) {
          console.log(`Deleting old image: ${itemRef.fullPath}`);
          await deleteObject(itemRef);
        } else {
          console.log(`Keeping new image: ${itemRef.fullPath}`);
        }
      }
    } catch (e) {
      console.error(`Error cleaning storage for ${name}:`, e.message);
    }
  }

  console.log("\nCleanup complete.");
  process.exit(0);
}

run();
