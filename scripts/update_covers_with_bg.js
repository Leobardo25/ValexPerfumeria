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

// Update this with the exact paths returned by the generation
const generatedImages = [
  {
    name: "Azzaro Wanted",
    folder: "azzaro_wanted",
    sourcePath: "C:/Users/Leonardo/.gemini/antigravity/brain/3917a1ca-fae4-45d5-9d38-69c39c381134/azzaro_wanted_bg_1777613515783.png",
    newFilename: "azzaro_wanted_bg.png"
  },
  {
    name: "Carolina Herrera CH Men",
    folder: "ch_men",
    sourcePath: "C:/Users/Leonardo/.gemini/antigravity/brain/3917a1ca-fae4-45d5-9d38-69c39c381134/ch_men_bg_1777613529343.png",
    newFilename: "ch_men_bg.png"
  },
  {
    name: "Bvlgari Pour Homme",
    folder: "bvlgari_pour_homme",
    sourcePath: "C:/Users/Leonardo/.gemini/antigravity/brain/3917a1ca-fae4-45d5-9d38-69c39c381134/bvlgari_pour_homme_bg_1777613544282.png",
    newFilename: "bvlgari_pour_homme_bg.png"
  },
  {
    name: "Givenchy Gentleman Society",
    folder: "gentleman_society",
    sourcePath: "C:/Users/Leonardo/.gemini/antigravity/brain/3917a1ca-fae4-45d5-9d38-69c39c381134/gentleman_society_bg_1777613558778.png",
    newFilename: "gentleman_society_bg.png"
  }
];

async function run() {
  console.log("Fetching existing products...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = {};
  querySnapshot.forEach(doc => {
    products[doc.data().name] = doc.id;
  });

  for (const item of generatedImages) {
    console.log(`\nProcessing: ${item.name}`);
    const destFolder = path.join('public', 'images', 'productos', item.folder);
    const destRawFile = path.join(destFolder, item.newFilename);
    const optimizedFile = path.join(destFolder, `${path.parse(item.newFilename).name}.webp`);

    if (!fs.existsSync(item.sourcePath)) {
      console.warn(`Source file not found: ${item.sourcePath}`);
      continue;
    }

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    // Copy raw generated image to the folder
    fs.copyFileSync(item.sourcePath, destRawFile);
    console.log(`Copied generated image to ${destRawFile}`);

    // 1. Optimize with ffmpeg
    try {
      console.log(`Optimizing image with ffmpeg to WebP...`);
      execSync(`ffmpeg -y -i "${destRawFile}" -q:v 80 "${optimizedFile}"`, { stdio: 'pipe' });
    } catch (err) {
      console.error(`Error optimizing ${item.newFilename}:`, err.message);
      continue;
    }

    // 2. Upload to Firebase
    const productId = products[item.name];
    if (!productId) {
      console.warn(`Product ID not found for "${item.name}"! Available products:`, Object.keys(products).filter(k => k.includes("Carolina") || k.includes("Azzaro") || k.includes("Bvlgari") || k.includes("Givenchy")));
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

  console.log("\nDone updating covers with backgrounds.");
  process.exit(0);
}

run();
