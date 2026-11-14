// ==========================================
// 1. KONFIGURASI FIREBASE
// ==========================================
const firebaseConfig = {
    apiKey: "AIzaSyCKG-pHGN3Wz7X9q9BnSL-dChSNX87EpyY",
    authDomain: "e-learning-sman-2-bayan.firebaseapp.com",
    projectId: "e-learning-sman-2-bayan",
    storageBucket: "e-learning-sman-2-bayan.firebasestorage.app",
    messagingSenderId: "715837451881",
    appId: "1:715837451881:web:48540594fe89d36d8c3cf8",
    measurementId: "G-TTVZ22Z4H5"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// ==========================================
// 2. DATA SEKOLAH (SESUAI DAPODIK / SEKOLAH KITA) & GURU
// ==========================================
const DATA_SEKOLAH = {
