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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// Login Anonim Otomatis untuk Siswa agar memiliki izin baca dari database
firebase.auth().signInAnonymously().catch((error) => console.error("Auth failed:", error));


// ==========================================
// 2. DATA UTAMA & STATE APLIKASI
// ==========================================
// Konfigurasi Guru Fisika
const GURU = {
    nama: "Rianti, S.Pd.",
    mapel: "Fisika",
    whatsapp: "6281234567890" 
};

// Variabel penampung data dinamis dari Firebase
let currentMateriList = []; 
let activeAssessment = { type: '', title: '' };
const contentDiv = document.getElementById('app-content');

// Data Seluruh Mata Pelajaran beserta Ikon & Warna (Statis untuk UI Utama)
const subjectsList = [
    { name: "Pend. Agama", icon: "fa-book-quran", grad: "linear-gradient(135deg, #05cd99, #02946d)", active: false },
    { name: "Pend. Pancasila", icon: "fa-landmark", grad: "linear-gradient(135deg, #ff5b5c, #d93839)", active: false },
    { name: "Bahasa Indonesia", icon: "fa-book-open", grad: "linear-gradient(135deg, #4318ff, #290bb4)", active: false },
    { name: "Matematika", icon: "fa-calculator", grad: "linear-gradient(135deg, #ff416c, #ff4b2b)", active: false },
    { name: "Bahasa Inggris", icon: "fa-language", grad: "linear-gradient(135deg, #00c6ff, #0072ff)", active: false },
    { name: "Sejarah", icon: "fa-hourglass-half", grad: "linear-gradient(135deg, #cb2d3e, #ef473a)", active: false },
    { name: "PJOK", icon: "fa-volleyball", grad: "linear-gradient(135deg, #f7971e, #ffd200)", active: false },
    { name: "Seni & Prakarya", icon: "fa-palette", grad: "linear-gradient(135deg, #8e2de2, #4a00e0)", active: false },
    { name: "Informatika", icon: "fa-laptop-code", grad: "linear-gradient(135deg, #11998e, #38ef7d)", active: false },
    { name: "Biologi", icon: "fa-leaf", grad: "linear-gradient(135deg, #56ab2f, #a8e063)", active: false },
    { name: "Kimia", icon: "fa-flask", grad: "linear-gradient(135deg, #f2994a, #f2c94c)", active: false },
    { name: "Fisika", icon: "fa-atom", grad: "linear-gradient(135deg, #ff9f43, #ff6b6b)", active: true }, // Hanya Fisika yg aktif sementara
    { name: "MTK Lanjut", icon: "fa-square-root-variable", grad: "linear-gradient(135deg, #ec008c, #fc6767)", active: false },
    { name: "Sosiologi", icon: "fa-users", grad: "linear-gradient(135deg, #3a1c71, #d76d77)", active: false },
    { name: "Ekonomi", icon: "fa-chart-line", grad: "linear-gradient(135deg, #159957, #155799)", active: false },
    { name: "Geografi", icon: "fa-earth-asia", grad: "linear-gradient(135deg, #2193b0, #6dd5ed)", active: false },
    { name: "Antropologi", icon: "fa-masks-theater", grad: "linear-gradient(135deg, #cc2b5e, #753a88)", active: false },
    { name: "PKWU", icon: "fa-lightbulb", grad: "linear-gradient(135deg, #e65c00, #f9d423)", active: false }
];


// ==========================================
// 3. RENDER BERANDA & KELAS
// ==========================================
function renderHome() {
    const heroImagePlaceholder = "https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80";

    let html = `
        <div class="hero-banner">
            <img src="${heroImagePlaceholder}" alt="Hero Image" class="hero-img">
            <div class="hero-overlay">
                <h2>Selamat Belajar!</h2>
                <p>E-Learning SMAN 2 Bayan Fase E & F</p>
            </div>
        </div>
        <h3 class="section-title">Semua Mata Pelajaran</h3>
        <div class="grid-container">
    `;

    subjectsList.forEach(sub => {
        const onClickAction = sub.active ? `onclick="renderKelas()"` : `onclick="alert('Materi belum ditambahkan.')"`;
        const statusBadge = sub.active ? "Tersedia" : "Segera Hadir";
        
        html += `
            <div class="subject-card" style="background: ${sub.grad}; opacity: ${sub.active ? '1' : '0.8'}" ${onClickAction}>
                <i class="fa-solid ${sub.icon} bg-icon"></i>
                <h3>${sub.name}</h3>
                <p class="status">${statusBadge}</p>
            </div>
        `;
    });

    html += `</div>`;
    contentDiv.innerHTML = html;
}

function renderKelas() {
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <h3 class="section-title">Pilih Kelas (Fisika)</h3>
        <div class="grid-container">
            <div class="subject-card" style="background: linear-gradient(135deg, #11998e, #38ef7d);" onclick="renderMateri('Kelas 10')">
                <i class="fa-solid fa-users bg-icon"></i>
                <h3>Kelas 10</h3>
                <p class="status">Fase E</p>
            </div>
            <div class="subject-card" style="background: linear-gradient(135deg, #4318ff, #290bb4);" onclick="renderMateri('Kelas 11')">
                <i class="fa-solid fa-users bg-icon"></i>
                <h3>Kelas 11</h3>
                <p class="status">Fase F</p>
            </div>
            <div class="subject-card" style="background: linear-gradient(135deg, #ff9f43, #ff6b6b);" onclick="renderMateri('Kelas 12')">
                <i class="fa-solid fa-user-graduate bg-icon"></i>
                <h3>Kelas 12</h3>
                <p class="status">Fase F</p>
            </div>
        </div>
    `;
}


// ==========================================
// 4. MENGAMBIL DATA DARI FIREBASE (DINAMIS)
// ==========================================
function renderMateri(kelas) {
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <h3 class="section-title" style="color:#a3aed1;">Mengambil materi dari server... <i class="fa-solid fa-spinner fa-spin"></i></h3>
    `;
    
    // Menarik data langsung dari Firestore berdasarkan Mapel dan Kelas
    db.collection("materi_pelajaran")
      .where("mapel", "==", "Fisika")
      .where("kelas", "==", kelas)
      .orderBy("timestamp", "asc")
      .get()
      .then((querySnapshot) => {
          let html = `
              <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
              <h3 class="section-title">Materi Fisika - ${kelas}</h3>
              <div class="material-list">
          `;
          
          if (querySnapshot.empty) {
              html += `<p style="color:var(--text-light); text-align:center; padding: 20px;">Belum ada materi dari guru untuk kelas ini.</p>`;
          } else {
              currentMateriList = []; // Reset list sementara
              querySnapshot.forEach((doc) => {
                  const data = doc.data();
                  currentMateriList.push(data);
                  const index = currentMateriList.length - 1;
                  
                  html += `
                      <div class="material-item" onclick="renderDetailMateriDinamis('${kelas}', ${index})">
                          <div style="font-weight:600;">${index + 1}. ${data.bab}</div>
                          <i class="fa-solid fa-chevron-right" style="color:#a3aed1;"></i>
                      </div>
                  `;
              });
          }
          html += `</div>`;
          contentDiv.innerHTML = html;
      })
      .catch((error) => {
          console.error("Gagal menarik data:", error);
          contentDiv.innerHTML += `<p style="color:red; text-align:center;">Gagal memuat materi. Pastikan perangkat terhubung ke internet.</p>`;
      });
}

function renderDetailMateriDinamis(kelas, index) {
    const babData = currentMateriList[index];
    let isiHtml = babData.isi.map(sub => `<li style="margin-bottom:8px;"><i class="fa-solid fa-check" style="color:#05cd99; margin-right:8px;"></i>${sub}</li>`).join('');
    
    // Fitur: Cek apakah guru menyertakan link Google Drive
    let lampiranFileHtml = '';
    if (babData.fileUrl && babData.fileUrl !== "") {
        lampiranFileHtml = `
            <div style="margin-bottom: 20px; padding: 15px; background: #eef2ff; border-radius: 10px; border-left: 4px solid #4318ff;">
                <p style="margin-bottom: 5px; font-weight: bold; color: #2b3674;"><i class="fa-solid fa-paperclip"></i> Lampiran Dokumen dari Guru:</p>
                <a href="${babData.fileUrl}" target="_blank" style="color: #4318ff; text-decoration: none; font-weight: 600; font-size: 0.9rem;">
                    Buka / Unduh Lampiran Materi (via Google Drive)
                </a>
            </div>
        `;
    }
    
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderMateri('${kelas}')"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="detail-box" id="pdf-content">
            <h2 style="color:var(--text-dark);">${babData.bab}</h2>
            <p style="color:var(--text-light); font-size:0.9rem; margin-top:5px;">Mata Pelajaran: Fisika | Guru: ${GURU.nama}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
            
            ${lampiranFileHtml}

            <p style="font-weight:600; margin-bottom:10px;">Ringkasan Materi:</p>
            <ul style="list-style:none;">
                ${isiHtml}
            </ul>
        </div>
        
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
            <button class="btn-primary" onclick="downloadMateriPDF('${babData.bab}')"><i class="fa-solid fa-print"></i> Cetak PDF Catatan Ini</button>
            <button class="btn-success" onclick="openModal('Kuis', '${babData.bab}')"><i class="fa-solid fa-pen"></i> Kerjakan Kuis</button>
        </div>

        <div class="detail-box">
            <h3 style="margin-bottom:15px; font-size:1.1rem;">Ruang Diskusi</h3>
            <div id="comments-${index}" style="margin-bottom:15px; max-height: 200px; overflow-y:auto;"></div>
            <textarea id="input-diskusi" rows="3" style="width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:10px;" placeholder="Tulis pertanyaan Anda..."></textarea>
            <button class="btn-primary" style="margin-top:10px;" onclick="tambahDiskusi('${kelas}_${index}')">Kirim Pesan</button>
        </div>
    `;
    loadDiskusi(`${kelas}_${index}`, index);
}


// ==========================================
// 5. FITUR DISKUSI (LOCAL STORAGE)
// ==========================================
function loadDiskusi(id, index) {
    const commentsDiv = document.getElementById(`comments-${index}`);
    const data = JSON.parse(localStorage.getItem(`diskusi_${id}`)) || [];
    commentsDiv.innerHTML = data.length === 0 ? "<p style='color:grey; font-size:0.8rem;'>Belum ada diskusi.</p>" : "";
    data.forEach(c => {
        commentsDiv.innerHTML += `<div style="border-bottom:1px solid #eee; padding:10px 0; font-size:0.9rem;"><strong style="color:#4318ff;">Siswa:</strong> ${c}</div>`;
    });
}

function tambahDiskusi(id) {
    const text = document.getElementById('input-diskusi').value;
    if (!text) return;
    let data = JSON.parse(localStorage.getItem(`diskusi_${id}`)) || [];
    data.push(text);
    localStorage.setItem(`diskusi_${id}`, JSON.stringify(data));
    const index = id.split('_')[1];
    loadDiskusi(id, index);
    document.getElementById('input-diskusi').value = "";
}


// ==========================================
// 6. LATIHAN SOAL & UNDUH PDF
// ==========================================
function renderLatihanSoal() {
    contentDiv.innerHTML = `
        <div class="hero-banner" style="height:120px;">
            <div class="hero-overlay" style="background: linear-gradient(to right, #4318ff, #868cff);">
                <h2>Latihan Soal</h2>
                <p>Uji kemampuan Anda kapan saja.</p>
            </div>
        </div>
        <div class="detail-box" style="text-align:center;">
            <i class="fa-solid fa-file-signature" style="font-size:3rem; color:#4318ff; margin-bottom:15px;"></i>
            <h3>Evaluasi Mandiri</h3>
            <p style="color:var(--text-light); margin:10px 0 20px 0;">Buat latihan soal mandiri untuk mengukur pemahaman materi yang telah dipelajari.</p>
            <button class="btn-primary" onclick="openModal('Soal', 'Latihan Mandiri')">Mulai Latihan Baru</button>
        </div>
    `;
}

function openModal(type, title) {
    activeAssessment = { type, title };
    document.getElementById('student-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('student-modal').classList.add('hidden');
}

function startAssessment() {
    const name = document.getElementById('student-name').value;
    const cls = document.getElementById('student-class').value;
    if(!name || !cls) return alert("Harap isi Nama dan Kelas!");
    closeModal();
    renderUjian(name, cls, activeAssessment.type, activeAssessment.title);
}

function renderUjian(nama, kelas, jenis, judul) {
    contentDiv.innerHTML = `
        <div id="lembar-ujian" class="detail-box" style="background:white; padding:30px;">
            <h2 style="text-align:center; color:#4318ff;">Lembar ${jenis}</h2>
            <h4 style="text-align:center; margin-bottom: 20px;">${judul}</h4>
            <table style="width:100%; margin-bottom:20px; font-size:14px;">
                <tr><td style="width:30%;"><strong>Nama</strong></td><td>: ${nama}</td></tr>
                <tr><td><strong>Kelas</strong></td><td>: ${kelas}</td></tr>
                <tr><td><strong>Tanggal</strong></td><td>: ${new Date().toLocaleDateString('id-ID')}</td></tr>
            </table>
            <hr style="margin-bottom:20px;">
            
            <p style="font-weight:bold;">1. Jelaskan pemahaman Anda mengenai materi ini dengan singkat!</p>
            <textarea style="width:100%; margin:10px 0 20px; border:1px solid #ddd; padding:10px; border-radius:8px;" rows="4"></textarea>
            
            <p style="font-weight:bold;">2. Sebutkan contoh penerapannya dalam kehidupan sehari-hari!</p>
            <textarea style="width:100%; margin:10px 0; border:1px solid #ddd; padding:10px; border-radius:8px;" rows="4"></textarea>
        </div>
        <button class="btn-success" style="width:100%; padding:15px; font-size:1.1rem;" onclick="submitUjian('${nama}', '${kelas}', '${jenis}', '${judul}')">
            <i class="fa-solid fa-paper-plane"></i> Selesai & Kirim PDF ke WhatsApp Guru
        </button>
    `;
}

function submitUjian(nama, kelas, jenis, judul) {
    const elemen = document.getElementById('lembar-ujian');
    const opt = {
        margin: 0.5, filename: `${jenis}_${nama}_${kelas}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(elemen).save().then(() => {
        const teksWA = `Halo Ibu ${GURU.nama}, saya ${nama} dari kelas ${kelas}. Saya telah menyelesaikan ${jenis} materi *${judul}*. File PDF jawaban sudah saya unduh dan saya lampirkan bersama pesan ini.`;
        window.open(`https://wa.me/${GURU.whatsapp}?text=${encodeURIComponent(teksWA)}`, '_blank');
        renderHome(); 
    });
}

function downloadMateriPDF(judulMateri) {
    const elemen = document.getElementById('pdf-content');
    html2pdf().set({margin: 1, filename: `Ringkasan_Materi_${judulMateri}.pdf`}).from(elemen).save();
}

// ==========================================
// 7. JALANKAN APLIKASI SAAT DIMUAT
// ==========================================
renderHome();
