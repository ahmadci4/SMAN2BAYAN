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
// 2. DATA DEFAULT GURU (Sinkron dengan Profil Guru)
// ==========================================
let GURU_DATA = {
    nama: "Rianti, S.Pd.",
    gelar: "Sarjana Pendidikan Fisika",
    kampus: "Universitas Mataram",
    mapel: "Fisika",
    quote: "Belajar adalah kunci membuka masa depan yang cerah.",
    email: "rianti@sman2bayan.sch.id",
    whatsapp: "6281234567890",
    instagram: "https://instagram.com",
    maps: "https://maps.google.com",
    foto: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
};

// Ambil profil guru dari database agar selalu sinkron
function loadProfilGuruData(callback) {
    db.collection("profil_guru").doc("utama").get().then((doc) => {
        if (doc.exists) {
            GURU_DATA = { ...GURU_DATA, ...doc.data() };
        }
        if (callback) callback();
    }).catch(() => { if (callback) callback(); });
}

let currentMateriList = []; 
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
// 3. RENDER BERANDA & PROFIL GURU
// ==========================================
function renderHome() {
    loadProfilGuruData(() => {
        const heroImagePlaceholder = "https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80";
        let html = `
            <div class="hero-banner" style="cursor:pointer;" onclick="renderProfilGuru()">
                <img src="${heroImagePlaceholder}" alt="Hero" class="hero-img">
                <div class="hero-overlay" style="display:flex; align-items:center; gap:15px;">
                    <img src="${GURU_DATA.foto}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid white;">
                    <div>
                        <h2 style="font-size:1.2rem; margin:0;">${GURU_DATA.nama}</h2>
                        <p style="margin:0; font-size:0.85rem; opacity:0.9;">Guru ${GURU_DATA.mapel} • Klik lihat Profil</p>
                    </div>
                </div>
            </div>
            <h3 class="section-title">Semua Mata Pelajaran</h3>
            <div class="grid-container">
        `;
        subjectsList.forEach(sub => {
            const onClickAction = sub.active ? `onclick="renderKelas()"` : `onclick="alert('Materi belum ditambahkan.')"`;
            html += `
                <div class="subject-card" style="background: ${sub.grad}; opacity: ${sub.active ? '1' : '0.8'}" ${onClickAction}>
                    <i class="fa-solid ${sub.icon} bg-icon"></i><h3>${sub.name}</h3><p class="status">${sub.active ? "Tersedia" : "Segera Hadir"}</p>
                </div>
            `;
        });
        html += `</div>`;
        contentDiv.innerHTML = html;
    });
}

function renderProfilGuru() {
    loadProfilGuruData(() => {
        contentDiv.innerHTML = `
            <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
            <div class="detail-box" style="text-align:center; padding: 30px;">
                <img src="${GURU_DATA.foto}" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:15px; border: 4px solid #4318ff;">
                <h2 style="color:#2b3674; margin-bottom:5px;">${GURU_DATA.nama}</h2>
                <p style="color:#4318ff; font-weight:600; margin-bottom:15px;">Guru Mata Pelajaran ${GURU_DATA.mapel}</p>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 10px; margin-bottom: 20px; font-style: italic; color: #475569; border-left: 4px solid #4318ff;">
                    "${GURU_DATA.quote || 'Semangat belajar siswa-siswiku!'}"
                </div>

                <div style="text-align:left; margin-bottom: 25px; line-height: 1.8; font-size: 0.95rem; color: #334155;">
                    <p><i class="fa-solid fa-graduation-cap" style="color:#4318ff; width:25px;"></i> <strong>Pendidikan:</strong> ${GURU_DATA.gelar} (${GURU_DATA.kampus})</p>
                    <p><i class="fa-solid fa-envelope" style="color:#4318ff; width:25px;"></i> <strong>Email:</strong> ${GURU_DATA.email}</p>
                    <p><i class="fa-solid fa-location-dot" style="color:#4318ff; width:25px;"></i> <strong>Lokasi Rumah:</strong> <a href="${GURU_DATA.maps}" target="_blank" style="color:#4318ff; text-decoration:underline;">Buka Google Maps Rumah Guru</a></p>
                </div>

                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <a href="https://wa.me/${GURU_DATA.whatsapp}" target="_blank" class="btn-success" style="padding:10px 20px; border-radius:10px; text-decoration:none; color:white;"><i class="fa-brands fa-whatsapp"></i> Chat WhatsApp</a>
                    <a href="${GURU_DATA.instagram}" target="_blank" class="btn-primary" style="padding:10px 20px; border-radius:10px; text-decoration:none; background:#e1306c;"><i class="fa-brands fa-instagram"></i> Instagram</a>
                </div>
            </div>
        `;
    });
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
// 4. MENGAMBIL DATA MATERI
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
    loadProfilGuruData(() => {
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
            <div class="detail-box">
                <h2 style="color:var(--text-dark);">${babData.bab}</h2>
                <h4 style="color:var(--primary); margin-top:5px;">${babData.subBab}</h4>
                <p style="color:var(--text-light); font-size:0.9rem; margin-top:5px; cursor:pointer;" onclick="renderProfilGuru()">Guru: <span style="color:#4318ff; text-decoration:underline;">${GURU_DATA.nama}</span></p>
                <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
                <p style="margin-bottom: 10px; line-height: 1.6; white-space: pre-wrap;">${babData.deskripsi || ''}</p>
                ${mediaHtml} 
                ${prHtml} 
            </div>

            <!-- Ruang Diskusi Bergaya Sosial Media (Komentar & Balasan) -->
            <div class="detail-box">
                <h3 style="margin-bottom:15px; font-size:1.1rem;"><i class="fa-solid fa-comments"></i> Diskusi & Tanya Jawab Kelas</h3>
                <div id="comments-container" style="margin-bottom:15px; max-height: 400px; overflow-y:auto; padding-right:5px;">
                    <p style="color:grey; font-size:0.9rem;">Memuat diskusi...</p>
                </div>
                
                <div style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;">
                    <h4 style="font-size:0.9rem; margin-bottom:10px; color:#2b3674;">Buat Pertanyaan Baru</h4>
                    <input type="text" id="input-nama-siswa" placeholder="Nama Anda (Misal: Budi X.A)" style="width:100%; border:1px solid #cbd5e1; border-radius:8px; padding:10px; margin-bottom:10px; background:white;">
                    <textarea id="input-diskusi" rows="2" style="width:100%; border:1px solid #cbd5e1; border-radius:8px; padding:10px; background:white;" placeholder="Tulis pertanyaanmu di sini..."></textarea>
                    <button class="btn-primary" style="margin-top:5px; width: 100%; padding:10px;" onclick="tambahDiskusi Utama('${babData.id}')">Kirim Pertanyaan</button>
                </div>
            </div>
        `;
        
        listenDiskusi(babData.id);
    });
}

// ==========================================
// 5. FITUR DISKUSI SOSIAL MEDIA (NESTED REPLIES)
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
              commentsDiv.innerHTML = "<p style='color:grey; font-size:0.85rem; text-align:center;'>Belum ada diskusi. Jadilah yang pertama bertanya!</p>";
              return;
          }

          let diskusiList = [];
          snapshot.forEach((doc) => {
              diskusiList.push({ id: doc.id, ...doc.data() });
          });

          // Filter hanya komentar utama (yang tidak punya parentId)
          let parentComments = diskusiList.filter(d => !d.parentId);

          parentComments.forEach(parent => {
              let replies = diskusiList.filter(d => d.parentId === parent.id);
              
              let repliesHtml = '';
              replies.forEach(rep => {
                  let isGuru = rep.isGuru ? `<span style="background:#4318ff; color:white; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:5px;">Guru</span>` : '';
                  repliesHtml += `
                      <div style="background:#f1f5f9; padding:10px 12px; border-radius:8px; margin-top:8px; margin-left:25px; border-left:3px solid #4318ff;">
                          <strong style="font-size:0.85rem; color:#1e293b;">${rep.pengirim}</strong> ${isGuru}
                          <p style="font-size:0.85rem; margin:3px 0; color:#334155;">${rep.pesan}</p>
                      </div>
                  `;
              });

              commentsDiv.innerHTML += `
                  <div style="background:white; border:1px solid #e2e8f0; padding:12px; border-radius:10px; margin-bottom:12px;">
                      <strong style="color:#2b3674; font-size:0.9rem;">${parent.pengirim}</strong>
                      <p style="font-size:0.9rem; margin:5px 0; color:#1e293b;">${parent.pesan}</p>
                      
                      ${repliesHtml}

                      <div style="margin-top:10px; text-align:right;">
                          <button onclick="toggleReplyBox('${parent.id}')" style="background:none; border:none; color:#4318ff; font-size:0.8rem; font-weight:600; cursor:pointer;"><i class="fa-solid fa-reply">} Balas</button>
                      </div>

                      <div id="reply-box-${parent.id}" style="display:none; margin-top:8px; background:#f8fafc; padding:10px; border-radius:8px;">
                          <input type="text" id="reply-name-${parent.id}" placeholder="Nama Anda" style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem; margin-bottom:6px; background:white;">
                          <textarea id="reply-msg-${parent.id}" rows="2" placeholder="Tulis balasan..." style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; font-size:0.85rem; margin-bottom:6px; background:white;"></textarea>
                          <button onclick="kirimBalasan('${materiId}', '${parent.id}')" class="btn-primary" style="padding:6px 12px; font-size:0.8rem; width:100%;">Kirim Balasan</button>
                      </div>
                  </div>
              `;
          });
      });
}

function toggleReplyBox(parentId) {
    const box = document.getElementById(`reply-box-${parentId}`);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function tambahDiskusiUtama(materiId) {
    const nama = document.getElementById('input-nama-siswa').value.trim();
    const pesan = document.getElementById('input-diskusi').value.trim();
    
    if (!nama || !pesan) return alert("Harap isi Nama dan Pertanyaannya!");

    db.collection("diskusi").add({
        materiId: materiId,
        pengirim: nama,
        pesan: pesan,
        parentId: null,
        isGuru: false,
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('input-diskusi').value = ""; 
    }).catch(err => alert("Gagal mengirim: " + err.message));
}

function kirimBalasan(materiId, parentId) {
    const nama = document.getElementById(`reply-name-${parentId}`).value.trim();
    const pesan = document.getElementById(`reply-msg-${parentId}`).value.trim();
    
    if (!nama || !pesan) return alert("Harap isi Nama dan Balasan Anda!");

    db.collection("diskusi").add({
        materiId: materiId,
        pengirim: nama,
        pesan: pesan,
        parentId: parentId,
        isGuru: false,
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById(`reply-msg-${parentId}`).value = "";
        document.getElementById(`reply-box-${parentId}`).style.display = 'none';
    }).catch(err => alert("Gagal membalas: " + err.message));
}

function renderLatihanSoal() {
    renderHome(); // Karena menu evaluasi dihilangkan, kembalikan ke beranda
}

renderHome();
