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

const targetProducts = [
  { name: "Azzaro Wanted", folder: "azzaro_wanted", file: "azzaro_wanted.png" },
  { name: "Carolina Herrera CH Men", folder: "ch_men", file: "ch_men.png" },
  { name: "Bvlgari Pour Homme", folder: "bvlgari_pour_homme", file: "bvlgari_pour_homme.png" },
  { name: "Givenchy Gentleman Society", folder: "gentleman_society", file: "gentleman_society.png" }
];

async function run() {
  console.log("Fetching existing products...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = {};
  querySnapshot.forEach(doc => {
    products[doc.data().name] = doc.id;
  });

  for (const item of targetProducts) {
    console.log(`\nProcessing: ${item.name}`);
    const sourceFile = path.join('public', 'images', 'productos', item.folder, item.file);
    const optimizedFile = path.join('public', 'images', 'productos', item.folder, `${path.parse(item.file).name}_bg.webp`);

    if (!fs.existsSync(sourceFile)) {
      console.warn(`Source file not found: ${sourceFile}`);
      continue;
    }

    // 1. Add #EAEAEA background and optimize with ffmpeg
    try {
      console.log(`Adding solid background and optimizing image with ffmpeg to WebP...`);
      // Using lavfi to generate the background color and overlay the image over it.
      execSync(`ffmpeg -y -i "${sourceFile}" -f lavfi -i "color=c=#EAEAEA:s=1024x1024" -filter_complex "[1:v][0:v]overlay=shortest=1" -vframes 1 "${optimizedFile}"`, { stdio: 'pipe' });
    } catch (err) {
      console.error(`Error processing ${item.file}:`, err.message);
      continue;
    }

    // 2. Upload to Firebase
    const productId = products[item.name];
    if (!productId) {
      console.warn(`Product ID not found for "${item.name}"`);
      continue;
    }

    try {
      console.log(`Uploading to Firebase Storage...`);
      const fileBuffer = fs.readFileSync(optimizedFile);
      const storageRef = ref(storage, `products/${productId}/cover_${path.basename(optimizedFile)}`);
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

  console.log("\nDone replacing covers with solid backgrounds.");
  process.exit(0);
}

run();
