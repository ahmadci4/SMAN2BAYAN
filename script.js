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

firebase.auth().signInAnonymously().catch((error) => console.error("Auth failed:", error));

// ==========================================
// 2. DATA UTAMA
// ==========================================
const GURU = { nama: "Rianti, S.Pd.", mapel: "Fisika", whatsapp: "6281234567890" };

let currentMateriList = []; 
let activeAssessment = { type: '', title: '' };
const contentDiv = document.getElementById('app-content');

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
    { name: "Fisika", icon: "fa-atom", grad: "linear-gradient(135deg, #ff9f43, #ff6b6b)", active: true }, 
    { name: "MTK Lanjut", icon: "fa-square-root-variable", grad: "linear-gradient(135deg, #ec008c, #fc6767)", active: false },
    { name: "Sosiologi", icon: "fa-users", grad: "linear-gradient(135deg, #3a1c71, #d76d77)", active: false },
    { name: "Ekonomi", icon: "fa-chart-line", grad: "linear-gradient(135deg, #159957, #155799)", active: false },
    { name: "Geografi", icon: "fa-earth-asia", grad: "linear-gradient(135deg, #2193b0, #6dd5ed)", active: false },
    { name: "Antropologi", icon: "fa-masks-theater", grad: "linear-gradient(135deg, #cc2b5e, #753a88)", active: false },
    { name: "PKWU", icon: "fa-lightbulb", grad: "linear-gradient(135deg, #e65c00, #f9d423)", active: false }
];

// ==========================================
// 3. RENDER BERANDA & KELAS (ROMAWI)
// ==========================================
function renderHome() {
    const heroImagePlaceholder = "https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80";
    let html = `
        <div class="hero-banner">
            <img src="${heroImagePlaceholder}" alt="Hero Image" class="hero-img">
            <div class="hero-overlay"><h2>Selamat Belajar!</h2><p>E-Learning SMAN 2 Bayan</p></div>
        </div>
        <h3 class="section-title">Semua Mata Pelajaran</h3>
        <div class="grid-container">
    `;
    subjectsList.forEach(sub => {
        const onClickAction = sub.active ? `onclick="renderKelas()"` : `onclick="alert('Materi belum ditambahkan.')"`;
        const statusBadge = sub.active ? "Tersedia" : "Segera Hadir";
        html += `
            <div class="subject-card" style="background: ${sub.grad}; opacity: ${sub.active ? '1' : '0.8'}" ${onClickAction}>
                <i class="fa-solid ${sub.icon} bg-icon"></i><h3>${sub.name}</h3><p class="status">${statusBadge}</p>
            </div>
        `;
    });
    html += `</div>`;
    contentDiv.innerHTML = html;
}

function renderKelas() {
    let html = `
        <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <h3 class="section-title" style="margin-bottom: 20px;">Pilih Kelas (Fisika)</h3>
    `;
    const tingkatan = [
        { tingkat: 'X', warna: 'linear-gradient(135deg, #11998e, #38ef7d)' },
        { tingkat: 'XI', warna: 'linear-gradient(135deg, #4318ff, #290bb4)' },
        { tingkat: 'XII', warna: 'linear-gradient(135deg, #ff9f43, #ff6b6b)' }
    ];
    const subKelas = ['A', 'B', 'C', 'D'];

    tingkatan.forEach(t => {
        html += `<h4 style="margin-top: 10px; margin-bottom: 10px; color: var(--text-dark);">Kelas ${t.tingkat}</h4>
                 <div class="grid-container" style="margin-bottom: 25px;">`;
        subKelas.forEach(sub => {
            const namaKelas = `${t.tingkat}.${sub}`;
            html += `
                <div class="subject-card" style="background: ${t.warna}; min-height: 80px; padding: 15px;" onclick="renderMateri('${namaKelas}')">
                    <h3 style="font-size: 1.1rem; text-align: center; width: 100%; margin-top: 10px;">${namaKelas}</h3>
                </div>
            `;
        });
        html += `</div>`;
    });
    contentDiv.innerHTML = html;
}

// ==========================================
// 4. MENGAMBIL DATA MATERI (TANPA INDEX FIREBASE)
// ==========================================
function renderMateri(kelas) {
    contentDiv.innerHTML = `<button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
                            <h3 class="section-title" style="color:#a3aed1;">Mengambil materi dari server... <i class="fa-solid fa-spinner fa-spin"></i></h3>`;
    
    db.collection("materi_pelajaran")
      .where("mapel", "==", "Fisika")
      .where("kelas", "==", kelas)
      .get().then((querySnapshot) => {
          let html = `<button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
                      <h3 class="section-title">Materi Fisika - ${kelas}</h3>
                      <div class="material-list">`;
          
          if (querySnapshot.empty) {
              html += `<p style="color:var(--text-light); text-align:center; padding: 20px;">Belum ada materi dari guru.</p>`;
          } else {
              currentMateriList = []; 
              querySnapshot.forEach((doc) => {
                  currentMateriList.push({ id: doc.id, ...doc.data() });
              });

              // Mengurutkan secara manual dengan JavaScript untuk menghindari error indeks komposit
              currentMateriList.sort((a, b) => {
                  let timeA = a.timestamp ? a.timestamp.toMillis() : 0;
                  let timeB = b.timestamp ? b.timestamp.toMillis() : 0;
                  return timeA - timeB;
              });

              currentMateriList.forEach((data, index) => {
                  html += `<div class="material-item" onclick="renderDetailMateriDinamis('${kelas}', ${index})">
                              <div style="font-weight:600;">${index + 1}. ${data.bab}</div>
                              <i class="fa-solid fa-chevron-right" style="color:#a3aed1;"></i>
                          </div>`;
              });
          }
          html += `</div>`;
          contentDiv.innerHTML = html;
      }).catch(err => {
          console.error(err);
          contentDiv.innerHTML += `<p style="color:red; text-align:center;">Gagal memuat materi. Cek koneksi Anda.</p>`;
      });
}

function getYouTubeEmbedId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

function getIconForUrl(url) {
    if(url.includes("instagram.com")) return { icon: "fa-brands fa-instagram", color: "#e1306c" };
    if(url.includes("drive.google.com")) return { icon: "fa-brands fa-google-drive", color: "#0F9D58" };
    if(url.includes("facebook.com")) return { icon: "fa-brands fa-facebook", color: "#1877F2" };
    return { icon: "fa-solid fa-link", color: "#4318ff" };
}

function renderDetailMateriDinamis(kelas, index) {
    const babData = currentMateriList[index];
    
    let mediaHtml = '';
    if (babData.links && babData.links.length > 0) {
        mediaHtml += `<div style="margin-top: 20px; margin-bottom: 20px;">
                        <h4 style="font-size: 0.95rem; color: #64748b; margin-bottom: 10px;"><i class="fa-solid fa-photo-film"></i> Media & Literatur:</h4>
                        <div style="display: flex; flex-direction: column; gap: 12px;">`;
        
        babData.links.forEach(linkObj => {
            const ytId = getYouTubeEmbedId(linkObj.url);
            if (ytId) {
                mediaHtml += `
                    <div style="width: 100%; background: #000; border-radius: 10px; overflow: hidden; margin-bottom: 5px;">
                        <iframe width="100%" height="250" src="https://www.youtube.com/embed/${ytId}" title="${linkObj.label}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                        <div style="background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-top: none; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
                            <p style="color: #2b3674; font-weight: 600; font-size: 0.9rem; margin: 0;"><i class="fa-brands fa-youtube" style="color:red;"></i> ${linkObj.label}</p>
                        </div>
                    </div>
                `;
            } else {
                const uiConf = getIconForUrl(linkObj.url);
                mediaHtml += `
                    <a href="${linkObj.url}" target="_blank" style="display: flex; align-items: center; background: #f8fafc; padding: 12px 15px; border-radius: 10px; border: 1px solid #e2e8f0; text-decoration: none; transition: background 0.2s;">
                        <i class="${uiConf.icon}" style="color: ${uiConf.color}; font-size: 1.5rem; margin-right: 15px; width: 25px; text-align: center;"></i>
                        <div>
                            <p style="color: #2b3674; font-weight: 600; font-size: 0.95rem; margin-bottom: 2px;">${linkObj.label}</p>
                            <p style="color: #64748b; font-size: 0.75rem;">Buka Tautan (Tab Baru)</p>
                        </div>
                    </a>
                `;
            }
        });
        mediaHtml += `</div></div>`;
    }

    let prHtml = '';
    if (babData.pr && babData.pr.trim() !== "") {
        prHtml = `
            <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 10px; border-left: 4px solid #ffc107;">
                <p style="margin-bottom: 5px; font-weight: bold; color: #856404;"><i class="fa-solid fa-tasks"></i> Tugas / PR:</p>
                <p style="color: #856404; font-size: 0.95rem; margin-top: 5px; white-space: pre-wrap;">${babData.pr}</p>
            </div>
        `;
    }
    
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderMateri('${kelas}')"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="detail-box" id="pdf-content">
            <h2 style="color:var(--text-dark);">${babData.bab}</h2>
            <h4 style="color:var(--primary); margin-top:5px;">${babData.subBab}</h4>
            <p style="color:var(--text-light); font-size:0.9rem; margin-top:5px;">Guru: ${GURU.nama}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
            
            <p style="margin-bottom: 10px; line-height: 1.6; white-space: pre-wrap;">${babData.deskripsi || ''}</p>
            
            ${mediaHtml} 
            ${prHtml} 
        </div>
        
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
            <button class="btn-success" onclick="openModal('Kuis', '${babData.bab}')" style="width:100%;"><i class="fa-solid fa-pen"></i> Kerjakan Evaluasi/Kuis</button>
        </div>

        <div class="detail-box">
            <h3 style="margin-bottom:15px; font-size:1.1rem;">Tanya Guru (Diskusi Kelas)</h3>
            <div id="comments-container" style="margin-bottom:15px; max-height: 250px; overflow-y:auto; padding-right:10px;">
                <p style="color:grey; font-size:0.9rem;">Memuat diskusi...</p>
            </div>
            
            <input type="text" id="input-nama-siswa" placeholder="Nama Anda (Misal: Budi X.A)" style="width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:10px; margin-bottom:10px;">
            <textarea id="input-diskusi" rows="3" style="width:100%; border:1px solid #e2e8f0; border-radius:10px; padding:10px;" placeholder="Tulis pertanyaan Anda di sini..."></textarea>
            <button class="btn-primary" style="margin-top:10px; width: 100%;" onclick="tambahDiskusi('${babData.id}', '${babData.bab}', '${kelas}')">Kirim Pertanyaan</button>
        </div>
    `;
    
    listenDiskusi(babData.id);
}

// ==========================================
// 5. FITUR DISKUSI
// ==========================================
let unsubscribeDiskusi = null;

function listenDiskusi(materiId) {
    if (unsubscribeDiskusi) unsubscribeDiskusi(); 
    
    unsubscribeDiskusi = db.collection("diskusi").where("materiId", "==", materiId).orderBy("waktu", "asc")
      .onSnapshot((snapshot) => {
          const commentsDiv = document.getElementById('comments-container');
          if (!commentsDiv) return;
          
          commentsDiv.innerHTML = '';
          if (snapshot.empty) {
              commentsDiv.innerHTML = "<p style='color:grey; font-size:0.8rem;'>Belum ada pertanyaan. Jadilah yang pertama bertanya!</p>";
              return;
          }

          snapshot.forEach((doc) => {
              const data = doc.data();
              let htmlMsg = `
                  <div style="margin-bottom: 15px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
                      <strong style="color:#4318ff;">${data.pengirim}:</strong> 
                      <span style="font-size:0.9rem;">${data.pesan}</span>
              `;
              
              if (data.balasanGuru) {
                  htmlMsg += `
                      <div style="background: #f4f7fe; padding: 10px; border-radius: 8px; margin-top: 10px; margin-left: 20px; font-size:0.85rem;">
                          <strong style="color:#05cd99;"><i class="fa-solid fa-check-circle"></i> Balasan Guru:</strong><br>
                          ${data.balasanGuru}
                      </div>
                  `;
              }
              htmlMsg += `</div>`;
              commentsDiv.innerHTML += htmlMsg;
          });
      });
}

function tambahDiskusi(materiId, judulBab, namaKelas) {
    const nama = document.getElementById('input-nama-siswa').value.trim();
    const pesan = document.getElementById('input-diskusi').value.trim();
    
    if (!nama || !pesan) return alert("Harap isi Nama Anda dan Pertanyaannya!");

    db.collection("diskusi").add({
        materiId: materiId,
        bab: judulBab,
        kelasSiswa: namaKelas,
        pengirim: nama,
        pesan: pesan,
        balasanGuru: "",
        status: "unread",
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('input-diskusi').value = ""; 
    }).catch(err => alert("Gagal mengirim pertanyaan. Error: " + err.message));
}

// ==========================================
// 6. LATIHAN SOAL KHUSUS & PDF
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
function closeModal() { document.getElementById('student-modal').classList.add('hidden'); }

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
        const teksWA = `Halo Ibu ${GURU.nama}, saya ${nama} dari kelas ${kelas}. Saya telah menyelesaikan ${jenis} materi *${judul}*. File PDF jawaban sudah saya lampirkan.`;
        window.open(`https://wa.me/${GURU.whatsapp}?text=${encodeURIComponent(teksWA)}`, '_blank');
        renderHome(); 
    });
}

// Inisialisasi awal saat halaman dimuat
renderHome();
