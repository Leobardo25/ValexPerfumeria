import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import fs from 'fs';
import path from 'path';

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

const productsData = [
  {
    name: "Ariana Grande Cloud",
    category: "mujer",
    description: "Es conocida por ser un aroma dulce, cremoso y reconfortante.",
    notes: "crema batida, coco, praline, almizcle, lavanda y pera",
    price: 35000,
    ml: 100,
    currency: "CRC",
    imageFile: "ariana_grande_cloud.jpg"
  },
  {
    name: "Ariana Grande Cloud Pink",
    category: "mujer",
    description: "Es una fragancia femenina frutal gourmand que equilibra dulzura con frescura",
    notes: "pitahaya, bayas, orquidea de vainilla, coco, praline y almizcle",
    price: 40000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Ariana Grande Thank U Next",
    category: "mujer",
    description: "Es una fragancia floral frutal gourmand caracterizada por ser dulce, atrevida y moderna.",
    notes: "pera blanca, frambuesa, coco cremoso y macarrones.",
    price: 32000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Ariana Grande Thank U Next 2.0",
    category: "mujer",
    description: "Es una fragancia floral frutal vibrante y dulce.",
    notes: "manzana, fresa silvestre, granada, orquidea blanca, jazmin y malvavisco.",
    price: 38000,
    ml: 100,
    currency: "CRC",
    imageFile: "ariana_grande_thank_u_next_2_0.png"
  },
  {
    name: "Ariana Grande Sweet Like Candy",
    category: "mujer",
    description: "Es una fragancia floral frutal gourmand intensamente dulce y femenina.",
    notes: "mora escarchada, malvavisco y crema batida.",
    price: 30000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Ariana Grande Moonlight",
    category: "mujer",
    description: "Es una fragancia floral frutal descrita como luminosa y seductora.",
    notes: "ciruela, grosellas negras, malvavisco, vainilla, sandalo y ambar",
    price: 30000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Carolina Herrera Good Girl Blush",
    category: "mujer",
    description: "Es una fragancia descrita como una explosion empolvada, fresca y romantica de feminidad.",
    notes: "peonia, vainilla sostenible y ylang ylang",
    price: 72000,
    ml: 80,
    currency: "CRC"
  },
  {
    name: "Carolina Herrera Good Girl",
    category: "mujer",
    description: "Es una fragancia oriental floral iconica que equilibra notas seductoras y dulces con un toque fresco.",
    notes: "almendra, cafe, jazmin sambac, nardos y una base de haba tonka y vainilla.",
    price: 70000,
    ml: 80,
    currency: "CRC",
    imageFile: "good_girl_carolina_herrera.jpg"
  },
  {
    name: "Carolina Herrera 212 Heroes",
    category: "hombre",
    description: "Es una fragancia aromatica frutal masculina",
    notes: "pera, jengibre, geranio, cuero y almizcle",
    price: 60000,
    ml: 90,
    currency: "CRC"
  },
  {
    name: "Rasasi Hawas Fire",
    category: "unisex",
    description: "Es una fragancia acuatica para hombres o mujeres, caracterizada por un aroma intenso marino frutal, ambarado y mineral.",
    notes: "notas marinas, jazmin egipcio, ambar, notas minerales y ambar gris",
    price: 30000,
    ml: 100,
    currency: "CRC",
    imageFile: "hawas_for_him_fire.jpg"
  },
  {
    name: "Afnan 9 PM",
    category: "hombre",
    description: "Es una fragancia masculina de la familia oriental vainilla, es famosa por ser una alternativa seductora y potente a jean paul gaultier ultra male.",
    notes: "manzana, canela, lavanda silvestre y bergamota",
    price: 20000,
    ml: 100,
    currency: "CRC",
    imageFile: "afnan_9pm.jpg"
  },
  {
    name: "Afnan 9 AM Dive",
    category: "unisex",
    description: "Es una fragancia unisex de la familia aromatica acuatica, destacada por ser fresca, vibrante y moderna.",
    notes: "menta, limon, manzana y un toque de incienso.",
    price: 20000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Dolce & Gabbana Light Blue Men",
    category: "hombre",
    description: "Es una fragancia citrica diseñada para el hombre moderno y sensual.",
    notes: "toronja, bergamota, enebro, pimienta romero y palo de rosa, almizcle, incienso y musgo de roble.",
    price: 35000,
    ml: 100,
    currency: "CRC",
    imageFile: "dg_light_blue_pour_homme.jpg"
  },
  {
    name: "Dolce & Gabbana Light Blue Women",
    category: "mujer",
    description: "Es una fragancia frutal floral, famosa por capturar la esencia del verano mediterraneo.",
    notes: "limon siciliano, manzana verde, cedro, campanilla, bambu, jazmin, rosa blanca, cedro, almizcle y ambar.",
    price: 36000,
    ml: 100,
    currency: "CRC",
    imageFile: "dg_light_blue.jpg"
  },
  {
    name: "Lattafa The Kingdom",
    category: "hombre",
    description: "Es una fragancia aromatica para hombre, reconocida como un clon de jean paul gaultier elixir.",
    notes: "menta, lavanda, salvia, vainilla, tabaco, flor de azahar, haba tonka, benjui y ladano",
    price: 27500,
    ml: 100,
    currency: "CRC",
    imageFile: "lattafa_the_kingdom.jpg"
  },
  {
    name: "French Avenue Liquid Brun",
    category: "hombre",
    description: "Es una fragancia masculina amaderada, especiada, reconocida por ser un clon asequible de althair de parfums de marly.",
    notes: "vainilla bourbon, canela, cardamomo, flor de azahar del naranjo, bergamota, elemi, praline, ambroxan, madera de gaiac y almizcle.",
    price: 30000,
    ml: 100,
    currency: "CRC",
    imageFile: "liquid_brun.jpg"
  },
  {
    name: "Armaf Odyssey Homme Black",
    category: "hombre",
    description: "Es una fragancia oriental, ambarada para hombres reconocida por su aroma calido, dulce y especiado, a menudo comparado con tom ford noir extreme,",
    notes: "vainilla, ambar, especias, iris, notas orientales, cuero y jazmin.",
    price: 20000,
    ml: 100,
    currency: "CRC",
    imageFile: "odyssey_homme.jpg"
  },
  {
    name: "Rasasi Hawas For Him",
    category: "hombre",
    description: "Es fragancia aromática acuática, reconocida por ser fresca, frutal-dulce y de gran duración. creando un aroma versátil y moderno, ideal para climas cálidos y uso diario, siendo comparada con Invictus Aqua .",
    notes: "manzana, canela, bergamota, ciruela y ámbar gris.",
    price: 23000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Afnan 9 PM Night Out",
    category: "hombre",
    description: "Es una fragancia de familia oriental especiada, diseñado para la noche. Destaca por ser intenso, dulce y seductor, ofreciendo un aroma frutal licorado que busca destacar en fiestas y citas, con una duración de 7 a 8 horas.",
    notes: "con notas de pitahaya, coñac, gamuza, ámbar, tofe, cardomomo, haba tonka, ambrofix y pachuli.",
    price: 30000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Armaf Club de Nuit Untold",
    category: "unisex",
    description: "es una fragancia unisex de la familia olfativa floral ambarada, reconocida como una alternativa de alta calidad (dupe) del famoso Baccarat Rouge 540 .",
    notes: "azafran, jazmin, amberwood, ambar gris, resina de abeto y cedro.",
    price: 30000,
    ml: 100,
    currency: "CRC"
  },
  {
    name: "Marc Jacobs Daisy Eau So Fresh",
    category: "mujer",
    description: "es una fragancia floral-frutal juvenil, alegre y luminosa, ideal para primavera/verano. Es una versión más ligera y chispeante que la original, descrita como femenina, fresca y encantadoramente simple.",
    notes: "Toronja, notas verdes, frambuesa, pera, rosa silvestre, jazmin, violeta, lichi, flor de manzano, almizcle, cedro de virginia y ciruela.",
    price: 50000,
    ml: 125,
    currency: "CRC",
    imageFile: "daisy_eau_so_fresh.jpg"
  }
];

async function seed() {
  for (const product of productsData) {
    console.log(`Processing ${product.name}...`);
    try {
      const newDocRef = doc(collection(db, 'products'));
      const productId = newDocRef.id;
      let coverImage = '';

      if (product.imageFile) {
        const baseName = product.imageFile.split('.')[0];
        const filePath = path.join('public', 'images', 'productos', baseName, product.imageFile);
        if (fs.existsSync(filePath)) {
          const fileBuffer = fs.readFileSync(filePath);
          const storageRef = ref(storage, `products/${productId}/cover_${product.imageFile}`);
          await uploadBytes(storageRef, fileBuffer);
          coverImage = await getDownloadURL(storageRef);
          console.log(`Uploaded image for ${product.name}`);
        } else {
          console.warn(`File not found: ${filePath}`);
        }
      }

      await setDoc(newDocRef, {
        name: product.name,
        category: product.category,
        description: product.description,
        notes: product.notes,
        price: product.price,
        ml: product.ml,
        currency: product.currency,
        coverImage,
        galleryImages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        stock: 10
      });
      console.log(`Created document for ${product.name}`);
    } catch (e) {
      console.error(`Error processing ${product.name}:`, e);
    }
  }
  process.exit(0);
}

seed();
