// ==========================================
// 1. KONFIGURASI FIREBASE & AUTH SISWA
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

// State Siswa & Profil
let currentStudent = JSON.parse(localStorage.getItem('sman2bayan_siswa')) || null;
let currentMateriList = []; 
const contentDiv = document.getElementById('app-content');

let GURU_DATA = {
    nama: "Rianti, S.Pd.", gelar: "Sarjana Pendidikan Fisika", kampus: "Universitas Mataram",
    mapel: "Fisika", quote: "Belajar adalah kunci membuka masa depan yang cerah.",
    email: "rianti@sman2bayan.sch.id", whatsapp: "6281234567890",
    instagram: "https://instagram.com", maps: "https://maps.google.com",
    foto: "images/hero-sman2bayan.jpg"
};

function loadProfilGuru(callback) {
    db.collection("profil_guru").doc("utama").get().then((doc) => {
        if (doc.exists) GURU_DATA = { ...GURU_DATA, ...doc.data() };
        if (callback) callback();
    }).catch(() => { if (callback) callback(); });
}

// ==========================================
// 2. RENDER BERANDA & PROFIL SEKOLAH (HERO)
// ==========================================
function renderHome() {
    loadProfilGuru(() => {
        let html = `
            <div class="hero-banner">
                <img src="images/hero-sman2bayan.jpg" alt="Hero SMAN 2 Bayan" class="hero-img" onerror="this.src='https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80'">
                <div class="hero-overlay" style="display:flex; align-items:center; gap:15px;">
                    <img src="images/logo-sman2bayan.png" style="width:55px; height:55px; object-fit:contain; background:white; padding:5px; border-radius:10px;" onerror="this.style.display='none'">
                    <div>
                        <h2 style="font-size:1.3rem; margin:0; font-weight:bold;">Smart E-Learning SMAN 2 BAYAN</h2>
                        <p style="margin:0; font-size:0.85rem; opacity:0.9;"><i class="fa-solid fa-location-dot"></i> Dusun Ancak, Desa Karang Bajo, Kec. Bayan</p>
                    </div>
                </div>
            </div>

            <!-- Tombol Floating WhatsApp Guru -->
            <a href="https://wa.me/${GURU_DATA.whatsapp}" target="_blank" style="position: fixed; bottom: 80px; right: 20px; background: #25D366; color: white; width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); z-index: 1000; text-decoration: none;">
                <i class="fa-brands fa-whatsapp"></i>
            </a>

            <h3 class="section-title">Semua Mata Pelajaran</h3>
            <div class="grid-container">
        `;
        
        const subjectsList = [
            { name: "Fisika", icon: "fa-atom", grad: "linear-gradient(135deg, #ff9f43, #ff6b6b)", active: true },
            { name: "Matematika", icon: "fa-calculator", grad: "linear-gradient(135deg, #ff416c, #ff4b2b)", active: false },
            { name: "Bahasa Indonesia", icon: "fa-book-open", grad: "linear-gradient(135deg, #4318ff, #290bb4)", active: false }
        ];

        subjectsList.forEach(sub => {
            const onClickAction = sub.active ? `onclick="renderKelas()"` : `onclick="alert('Materi belum dibuka.')"`;
            html += `
                <div class="subject-card" style="background: ${sub.grad}; opacity: ${sub.active ? '1' : '0.8'}" ${onClickAction}>
                    <i class="fa-solid ${sub.icon} bg-icon"></i><h3>${sub.name}</h3><p class="status">${sub.active ? "Tersedia" : "Segera"}</p>
                </div>
            `;
        });
        html += `</div>`;

        // Footer di Bawah
        html += `
            <footer style="margin-top: 40px; padding: 20px; background: #1e293b; color: white; border-radius: 15px; text-align: center; font-size: 0.85rem;">
                <p style="margin-bottom: 5px; font-weight: bold;">Smart E-Learning SMAN 2 BAYAN</p>
                <p style="color: #94a3b8; margin:0;">Kabupaten Lombok Utara, Nusa Tenggara Barat</p>
            </footer>
        `;

        contentDiv.innerHTML = html;
    });
}

function renderKelas() {
    let html = `
        <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div style="background:white; padding:15px; border-radius:12px; margin-bottom:15px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0;">
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="${GURU_DATA.foto}" style="width:45px; height:45px; border-radius:50%; object-fit:cover;">
                <div>
                    <h4 style="margin:0; font-size:0.95rem; color:#2b3674;">${GURU_DATA.nama}</h4>
                    <p style="margin:0; font-size:0.8rem; color:#64748b;">Pengampu: ${GURU_DATA.mapel}</p>
                </div>
            </div>
            <button onclick="renderProfilGuruSiswa()" class="btn-primary" style="padding:6px 12px; font-size:0.8rem;">Profil Guru</button>
        </div>
        <h3 class="section-title" style="margin-bottom: 15px;">Pilih Kelas (Fisika)</h3>
    `;
    
    ['X', 'XI', 'XII'].forEach(tingkat => {
        html += `<h4 style="margin: 10px 0; color: var(--text-dark);">Kelas ${tingkat}</h4><div class="grid-container" style="margin-bottom: 20px;">`;
        ['A', 'B', 'C', 'D'].forEach(sub => {
            const namaKelas = `${tingkat}.${sub}`;
            html += `<div class="subject-card" style="background: linear-gradient(135deg, #4318ff, #868cff); min-height: 70px; padding: 10px;" onclick="renderMateri('${namaKelas}')">
                        <h3 style="font-size: 1.1rem; text-align: center; width: 100%; margin:auto;">${namaKelas}</h3>
                    </div>`;
        });
        html += `</div>`;
    });
    contentDiv.innerHTML = html;
}

// ==========================================
// 3. PROFIL GURU UNTUK SISWA
// ==========================================
function renderProfilGuruSiswa() {
    loadProfilGuru(() => {
        contentDiv.innerHTML = `
            <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
            <div class="detail-box" style="text-align:center; padding: 25px;">
                <img src="${GURU_DATA.foto}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:15px; border: 3px solid #4318ff;">
                <h2 style="color:#2b3674; margin-bottom:5px;">${GURU_DATA.nama}</h2>
                <p style="color:#4318ff; font-weight:600; margin-bottom:15px;">Guru Mata Pelajaran ${GURU_DATA.mapel}</p>
                <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 20px; font-style: italic; color: #475569;">"${GURU_DATA.quote}"</div>
                <div style="text-align:left; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.6;">
                    <p>🎓 <strong>Pendidikan:</strong> ${GURU_DATA.gelar} (${GURU_DATA.kampus})</p>
                    <p>📧 <strong>Email:</strong> ${GURU_DATA.email}</p>
                    <p>📍 <strong>Alamat Rumah:</strong> <a href="${GURU_DATA.maps}" target="_blank" style="color:#4318ff;">Buka Google Maps</a></p>
                </div>
            </div>
        `;
    });
}

// ==========================================
// 4. MATERI & DISKUSI DENGAN AUTENTIKASI SISWA
// ==========================================
function renderMateri(kelas) {
    contentDiv.innerHTML = `<button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button><p style="text-align:center; padding:20px;">Memuat materi...</p>`;
    
    db.collection("materi_pelajaran").where("mapel", "==", "Fisika").where("kelas", "==", kelas).get().then((snapshot) => {
        let html = `<button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
                    <h3 class="section-title">Materi Fisika - ${kelas}</h3><div class="material-list">`;
        
        if (snapshot.empty) {
            html += `<p style="text-align:center; color:grey;">Belum ada materi.</p>`;
        } else {
            currentMateriList = [];
            snapshot.forEach(doc => currentMateriList.push({ id: doc.id, ...doc.data() }));
            currentMateriList.forEach((data, index) => {
                html += `<div class="material-item" onclick="renderDetailMateri('${kelas}', ${index})">
                            <div style="font-weight:600;">${index + 1}. ${data.bab}</div>
                            <i class="fa-solid fa-chevron-right" style="color:#a3aed1;"></i>
                        </div>`;
            });
        }
        contentDiv.innerHTML = html + `</div>`;
    });
}

function renderDetailMateri(kelas, index) {
    const item = currentMateriList[index];
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderMateri('${kelas}')"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="detail-box">
            <h2>${item.bab}</h2>
            <h4 style="color:#4318ff;">${item.subBab}</h4>
            <hr style="margin:15px 0; border:0; border-top:1px solid #eee;">
            <p style="white-space:pre-wrap; line-height:1.6;">${item.deskripsi || ''}</p>
        </div>

        <div class="detail-box">
            <h3 style="font-size:1.1rem; margin-bottom:15px;"><i class="fa-solid fa-comments"></i> Diskusi Kelas</h3>
            <div id="comments-container" style="max-height:300px; overflow-y:auto; margin-bottom:15px;"></div>
            
            <div id="auth-comment-box" style="background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;">
                ${currentStudent ? renderFormDiskusi() : renderFormLoginSiswa(item.id)}
            </div>
        </div>
    `;
    listenDiskusi(item.id);
}

function renderFormLoginSiswa(materiId) {
    return `
        <h4 style="font-size:0.9rem; margin-bottom:8px; color:#2b3674;">Login / Daftar Identitas Siswa untuk Bertanya</h4>
        <input type="email" id="s-email" placeholder="Email Aktif" style="width:100%; padding:8px; margin-bottom:6px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
        <input type="password" id="s-pass" placeholder="Password (bebas untuk akun lokal)" style="width:100%; padding:8px; margin-bottom:6px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
        <input type="text" id="s-nama" placeholder="Nama Lengkap" style="width:100%; padding:8px; margin-bottom:6px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
        <input type="text" id="s-kelas" placeholder="Kelas (Contoh: X.A)" style="width:100%; padding:8px; margin-bottom:10px; border:1px solid #cbd5e1; border-radius:6px; background:white;">
        <button onclick="loginRegisterSiswa('${materiId}')" class="btn-primary" style="width:100%; padding:8px;">Masuk & Mulai Tanya</button>
    `;
}

function renderFormDiskusi() {
    return `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span style="font-size:0.85rem; color:#475569;">Masuk sebagai: <strong>${currentStudent.nama}</strong> (${currentStudent.kelas})</span>
            <button onclick="editProfilSiswa()" style="background:none; border:none; color:#4318ff; font-size:0.8rem; cursor:pointer;">Edit Profil / Ganti Akun</button>
        </div>
        <textarea id="input-diskusi" rows="2" placeholder="Tulis pertanyaanmu..." style="width:100%; padding:8px; border:1px solid #cbd5e1; border-radius:6px; background:white; margin-bottom:8px;"></textarea>
        <button onclick="kirimDiskusi('${currentMateriList[0].id}')" class="btn-primary" style="width:100%; padding:8px;">Kirim Pertanyaan</button>
    `;
}

function loginRegisterSiswa(materiId) {
    const email = document.getElementById('s-email').value.trim();
    const pass = document.getElementById('s-pass').value.trim();
    const nama = document.getElementById('s-nama').value.trim();
    const kelas = document.getElementById('s-kelas').value.trim();

    if(!email || !pass || !nama || !kelas) return alert("Harap isi semua kolom identitas!");

    auth.signInWithEmailAndPassword(email, pass).catch(() => {
        return auth.createUserWithEmailAndPassword(email, pass);
    }).then(() => {
        currentStudent = { email, nama, kelas };
        localStorage.setItem('sman2bayan_siswa', JSON.stringify(currentStudent));
        alert("Berhasil masuk!");
        location.reload();
    }).catch(err => alert("Gagal login: " + err.message));
}

function editProfilSiswa() {
    localStorage.removeItem('sman2bayan_siswa');
    currentStudent = null;
    renderDetailMateri(currentMateriList[0].kelas, 0);
}

function kirimDiskusi(materiId) {
    const pesan = document.getElementById('input-diskusi').value.trim();
    if(!pesan) return alert("Pesan tidak boleh kosong!");

    db.collection("diskusi").add({
        materiId, pengirim: `${currentStudent.nama} (${currentStudent.kelas})`,
        pesan, parentId: null, isGuru: false, waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => { document.getElementById('input-diskusi').value = ""; });
}

function listenDiskusi(materiId) {
    db.collection("diskusi").where("materiId", "==", materiId).orderBy("waktu", "asc").onSnapshot(snapshot => {
        const container = document.getElementById('comments-container');
        if(!container) return;
        container.innerHTML = '';
        if(snapshot.empty) { container.innerHTML = "<p style='color:grey; font-size:0.85rem;'>Belum ada diskusi.</p>"; return; }

        let list = [];
        snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        list.filter(d => !d.parentId).forEach(p => {
            let replies = list.filter(d => d.parentId === p.id);
            let repHtml = '';
            replies.forEach(r => {
                repHtml += `<div style="background:#f1f5f9; padding:8px; border-radius:6px; margin-top:5px; margin-left:20px; font-size:0.85rem;"><strong>${r.pengirim}:</strong> ${r.pesan}</div>`;
            });

            container.innerHTML += `
                <div style="background:white; border:1px solid #e2e8f0; padding:10px; border-radius:8px; margin-bottom:10px;">
                    <strong style="color:#2b3674; font-size:0.9rem;">${p.pengirim}</strong>
                    <p style="margin:4px 0; font-size:0.9rem;">${p.pesan}</p>
                    ${repHtml}
                    <div style="text-align:right; margin-top:5px;"><button onclick="toggleReply('${p.id}')" style="background:none; border:none; color:#4318ff; font-size:0.8rem; cursor:pointer;">Balas</button></div>
                    <div id="reply-${p.id}" style="display:none; margin-top:5px;"><input type="text" id="rmsg-${p.id}" placeholder="Tulis balasan..." style="width:100%; padding:6px; font-size:0.8rem; border:1px solid #cbd5e1; border-radius:4px;"><button onclick="kirimBalasan('${materiId}', '${p.id}')" class="btn-primary" style="margin-top:4px; padding:4px 8px; font-size:0.75rem;">Kirim</button></div>
                </div>
            `;
        });
    });
}

function toggleReply(id) { const el = document.getElementById(`reply-${id}`); el.style.display = el.style.display === 'none' ? 'block' : 'none'; }
function kirimBalasan(materiId, parentId) {
    const pesan = document.getElementById(`rmsg-${parentId}`).value.trim();
    if(!pesan) return;
    db.collection("diskusi").add({
        materiId, pengirim: currentStudent ? currentStudent.nama : "Siswa",
        pesan, parentId, isGuru: false, waktu: firebase.firestore.FieldValue.serverTimestamp()
    });
}

renderHome();
