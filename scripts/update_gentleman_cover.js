import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

const newImages = [
  {
    name: "Givenchy Gentleman Society",
    folder: "gentleman_society",
    sourcePath: "C:/Users/Leonardo/.gemini/antigravity/brain/3917a1ca-fae4-45d5-9d38-69c39c381134/gentleman_society_contextual_bg_1777843379053.png",
    destFilename: "gentleman_society_contextual_bg.webp"
  }
];

async function run() {
  console.log("Fetching existing products...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = {};
  querySnapshot.forEach(doc => {
    products[doc.data().name] = doc.id;
  });

  for (const item of newImages) {
    console.log(`\nProcessing: ${item.name}`);
    const destFolder = path.join('public', 'images', 'productos', item.folder);
    const optimizedFile = path.join(destFolder, item.destFilename);

    if (!fs.existsSync(item.sourcePath)) {
      console.warn(`Source file not found: ${item.sourcePath}`);
      continue;
    }

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    // 1. Optimize with ffmpeg directly from source to dest
    try {
      console.log(`Optimizing AI image with contextual background to WebP...`);
      execSync(`ffmpeg -y -i "${item.sourcePath}" -q:v 80 "${optimizedFile}"`, { stdio: 'pipe' });
    } catch (err) {
      console.error(`Error optimizing ${item.name}:`, err.message);
      continue;
    }

    // 2. Upload to Firebase
    const productId = products[item.name];
    if (!productId) {
      console.warn(`Product ID not found for "${item.name}"!`);
      continue;
    }

    try {
      console.log(`Uploading to Firebase Storage...`);
      const fileBuffer = fs.readFileSync(optimizedFile);
      const storageRef = ref(storage, `products/${productId}/cover_${item.destFilename}`);
      await uploadBytes(storageRef, fileBuffer);
      const coverImage = await getDownloadURL(storageRef);
      
      // 3. Update Firestore
      console.log(`Updating Firestore document...`);
      await updateDoc(doc(db, 'products', productId), {
        coverImage,
        updatedAt: new Date()
      });
      console.log(`Successfully updated cover for ${item.name}`);
    } catch (e) {
      console.error(`Error updating Firebase for ${item.name}:`, e);
    }
  }

  console.log("\nDone updating covers with contextual AI backgrounds.");
  process.exit(0);
}

run();
