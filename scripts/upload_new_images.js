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

const newImagesMap = [
  { file: "212_men_heroes_forever_young.png", name: "Carolina Herrera 212 Heroes", folder: "carolina_herrera_212_heroes" },
  { file: "afnan_9am_dive.png", name: "Afnan 9 AM Dive", folder: "afnan_9_am_dive" },
  { file: "afnan_9pm_night_out.png", name: "Afnan 9 PM Night Out", folder: "afnan_9_pm_night_out" },
  { file: "ariana_grande_cloud_pink.png", name: "Ariana Grande Cloud Pink", folder: "ariana_grande_cloud_pink" },
  { file: "ariana_grande_moonlight.png", name: "Ariana Grande Moonlight", folder: "ariana_grande_moonlight" },
  { file: "ariana_grande_sweet_like_candy.png", name: "Ariana Grande Sweet Like Candy", folder: "ariana_grande_sweet_like_candy" },
  { file: "ariana_grande_thank_u_next.png", name: "Ariana Grande Thank U Next", folder: "ariana_grande_thank_u_next" },
  { file: "club_de_nuit_untold_armaf.png", name: "Armaf Club de Nuit Untold", folder: "armaf_club_de_nuit_untold" },
  { file: "good_girl_blush_carolina_herrera.png", name: "Carolina Herrera Good Girl Blush", folder: "carolina_herrera_good_girl_blush" },
  { file: "hawas_for_him.png", name: "Rasasi Hawas For Him", folder: "rasasi_hawas_for_him" }
];

async function run() {
  console.log("Fetching existing products...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = {};
  querySnapshot.forEach(doc => {
    products[doc.data().name] = doc.id;
  });

  for (const item of newImagesMap) {
    console.log(`\nProcessing: ${item.name}`);
    const sourceFile = path.join('public', 'images', 'Descargas', item.file);
    const destFolder = path.join('public', 'images', 'productos', item.folder);
    const optimizedFile = path.join(destFolder, `${path.parse(item.file).name}.webp`);

    if (!fs.existsSync(sourceFile)) {
      console.warn(`Source file not found: ${sourceFile}`);
      continue;
    }

    if (!fs.existsSync(destFolder)) {
      fs.mkdirSync(destFolder, { recursive: true });
    }

    // 1. Optimize with ffmpeg
    try {
      console.log(`Optimizing image with ffmpeg to WebP...`);
      execSync(`ffmpeg -y -i "${sourceFile}" -q:v 80 "${optimizedFile}"`, { stdio: 'pipe' });
    } catch (err) {
      console.error(`Error optimizing ${item.file}:`, err.message);
      continue;
    }

    // 2. Upload to Firebase
    const productId = products[item.name];
    if (!productId) {
      console.warn(`Product ID not found for ${item.name}! Cannot upload to Firebase.`);
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
      console.log(`Successfully updated ${item.name}`);
    } catch (e) {
      console.error(`Error updating Firebase for ${item.name}:`, e);
    }
  }

  // Delete originals from Descargas after processing? We'll leave them or let user handle.
  console.log("\nDone processing new images.");
  process.exit(0);
}

run();
