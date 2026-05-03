import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, listAll, deleteObject } from 'firebase/storage';

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

async function deleteRecent() {
  const querySnapshot = await getDocs(collection(db, 'products'));
  const thresholdDate = new Date();
  thresholdDate.setHours(0, 0, 0, 0); // Start of today

  for (const productDoc of querySnapshot.docs) {
    const data = productDoc.data();
    let createdAt = null;
    
    if (data.createdAt) {
      if (data.createdAt.toDate) {
        createdAt = data.createdAt.toDate();
      } else if (data.createdAt instanceof Date) {
        createdAt = data.createdAt;
      } else {
        createdAt = new Date(data.createdAt);
      }
    }

    if (createdAt && createdAt > thresholdDate) {
      console.log(`Deleting product: ${data.name} (${productDoc.id})`);
      
      // Try to delete images in storage
      try {
        const folderRef = ref(storage, `products/${productDoc.id}`);
        const folderContents = await listAll(folderRef);
        for (const itemRef of folderContents.items) {
          await deleteObject(itemRef);
          console.log(`Deleted image: ${itemRef.fullPath}`);
        }
      } catch (storageError) {
        console.log(`No images found or error deleting images for ${productDoc.id}:`, storageError.message);
      }

      // Delete the Firestore document
      await deleteDoc(doc(db, 'products', productDoc.id));
      console.log(`Deleted document: ${productDoc.id}`);
    }
  }
  
  console.log("Deletion complete.");
  process.exit(0);
}

deleteRecent();
