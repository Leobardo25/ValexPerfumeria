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

const previousImagesMap = [
  { file: "afnan_9pm.jpg", name: "Afnan 9 PM", folder: "afnan_9pm" },
  { file: "ariana_grande_cloud.jpg", name: "Ariana Grande Cloud", folder: "ariana_grande_cloud" },
  { file: "ariana_grande_thank_u_next_2_0.png", name: "Ariana Grande Thank U Next 2.0", folder: "ariana_grande_thank_u_next_2_0" },
  { file: "daisy_eau_so_fresh.jpg", name: "Marc Jacobs Daisy Eau So Fresh", folder: "daisy_eau_so_fresh" },
  { file: "dg_light_blue.jpg", name: "Dolce & Gabbana Light Blue Women", folder: "dg_light_blue" },
  { file: "dg_light_blue_pour_homme.jpg", name: "Dolce & Gabbana Light Blue Men", folder: "dg_light_blue_pour_homme" },
  { file: "good_girl_carolina_herrera.jpg", name: "Carolina Herrera Good Girl", folder: "good_girl_carolina_herrera" },
  { file: "hawas_for_him_fire.jpg", name: "Rasasi Hawas Fire", folder: "hawas_for_him_fire" },
  { file: "lattafa_the_kingdom.jpg", name: "Lattafa The Kingdom", folder: "lattafa_the_kingdom" },
  { file: "liquid_brun.jpg", name: "French Avenue Liquid Brun", folder: "liquid_brun" },
  { file: "odyssey_homme.jpg", name: "Armaf Odyssey Homme Black", folder: "odyssey_homme" }
];

async function run() {
  console.log("Fetching existing products...");
  const querySnapshot = await getDocs(collection(db, 'products'));
  const products = {};
  querySnapshot.forEach(doc => {
    products[doc.data().name] = doc.id;
  });

  for (const item of previousImagesMap) {
    console.log(`\nProcessing: ${item.name}`);
    const sourceFile = path.join('public', 'images', 'productos', item.folder, item.file);
    const optimizedFile = path.join('public', 'images', 'productos', item.folder, `${path.parse(item.file).name}.webp`);

    if (!fs.existsSync(sourceFile)) {
      console.warn(`Source file not found: ${sourceFile}`);
      continue;
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
      console.warn(`Product ID not found for ${item.name}!`);
      continue;
    }

    try {
      console.log(`Uploading optimized WebP to Firebase Storage...`);
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

  console.log("\nDone optimizing and updating previous images.");
  process.exit(0);
}

run();
