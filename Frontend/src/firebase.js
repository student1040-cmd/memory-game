import { initializeApp } from "firebase/app";
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  onValue, 
  query, 
  orderByChild, 
  limitToLast 
} from "firebase/database";

// Твоя конфігурація з Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDW6-5CL9cibLXoZFU2R2V-eni-xBimYbg",
  authDomain: "memory-game-project30.firebaseapp.com",
  // Обов'язково додаємо цей URL, який ми знайшли в розділі Realtime Database
  databaseURL: "https://memory-game-project30-default-rtdb.europe-west1.firebasedatabase.app/",
  projectId: "memory-game-project30",
  storageBucket: "memory-game-project30.firebasestorage.app",
  messagingSenderId: "403755039454",
  appId: "1:403755039454:web:5a62a410954392cad0a04f",
  measurementId: "G-8Z3FLYSGRZ"
};

// Ініціалізуємо Firebase
const app = initializeApp(firebaseConfig);

// Ініціалізуємо базу даних
const db = getDatabase(app);

// Експортуємо все необхідне для використання в App.vue або інструментах гри
export { 
  db, 
  ref, 
  push, 
  set, 
  onValue, 
  query, 
  orderByChild, 
  limitToLast 
};