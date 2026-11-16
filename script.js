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
// 2. DATA SEKOLAH (DAPODIK) & GURU
// ==========================================
const DATA_SEKOLAH = {
    nama: "SMA NEGERI 2 BAYAN",
    npsn: "69807689",
    status: "Negeri",
    akreditasi: "B",
    kurikulum: "Kurikulum Merdeka",
    alamat: "Jl. Raya Bayan - Ancak, Desa Karang Bajo, Kec. Bayan, Kab. Lombok Utara, NTB 83354",
    kepsek: "Kepala SMAN 2 Bayan",
    jmlSiswa: "345+",
    jmlGuru: "32",
    jmlRombel: "12 Rombel",
    jmlEkskul: "9 Ekskul"
};

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

let currentUserSession = null;
let isRegisterGuruMode = false;
let isRegisterSiswaMode = false;
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
// 3. LOGIKA GERBANG LOGIN AWAL (3 PERAN)
// ==========================================
function pilihPeranLogin(role) {
    document.getElementById('role-selection-box').style.display = 'none';
    if (role === 'guru') {
        document.getElementById('form-login-guru').style.display = 'block';
        document.getElementById('form-login-siswa').style.display = 'none';
    } else if (role === 'siswa') {
        document.getElementById('form-login-siswa').style.display = 'block';
        document.getElementById('form-login-guru').style.display = 'none';
    }
}

function kembaliPilihPeran() {
    document.getElementById('role-selection-box').style.display = 'grid';
    document.getElementById('form-login-guru').style.display = 'none';
    document.getElementById('form-login-siswa').style.display = 'none';
}

function toggleDaftarGuru() {
    isRegisterGuruMode = !isRegisterGuruMode;
    document.getElementById('register-guru-extra').style.display = isRegisterGuruMode ? 'block' : 'none';
    document.getElementById('btn-toggle-reg-guru').innerText = isRegisterGuruMode 
        ? "Sudah punya akun? Kembali ke Login" 
        : "Belum punya akun? Daftar ID Guru/Staf";
}

function toggleDaftarSiswa() {
    isRegisterSiswaMode = !isRegisterSiswaMode;
    document.getElementById('register-siswa-extra').style.display = isRegisterSiswaMode ? 'block' : 'none';
    document.getElementById('btn-toggle-reg-siswa').innerText = isRegisterSiswaMode 
        ? "Sudah terdaftar? Kembali ke Login" 
        : "Belum terdaftar? Buat Akun Siswa";
}

function formatToAuthEmail(rawId, prefix) {
    if (rawId.includes('@')) return rawId.toLowerCase();
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${prefix}_${cleanId}@sman2bayan.sch.id`;
}

function prosesLoginGuru() {
    const rawId = document.getElementById('login-guru-id').value.trim();
    const pass = document.getElementById('login-guru-pass').value.trim();
    const jabatan = document.getElementById('reg-guru-jabatan').value.trim() || "Guru / Staf";

    if (!rawId || !pass) return alert("Harap isi ID (Email/NIP/Nama) dan Password!");
    if (pass.length < 6) return alert("Password minimal 6 karakter!");

    const authEmail = formatToAuthEmail(rawId, "staf");

    if (isRegisterGuruMode) {
        auth.createUserWithEmailAndPassword(authEmail, pass).then((cred) => {
            const userData = { uid: cred.user.uid, role: "Guru / Staf", nama: rawId, sub: jabatan, email: authEmail, bio: "" };
            db.collection("users_sekolah").doc(cred.user.uid).set(userData).then(() => {
                selesaikanLogin(userData);
            });
        }).catch(err => alert("Gagal mendaftar akun Guru/Staf: " + err.message));
    } else {
        auth.signInWithEmailAndPassword(authEmail, pass).then((cred) => {
            db.collection("users_sekolah").doc(cred.user.uid).get().then(doc => {
                const userData = doc.exists ? doc.data() : { uid: cred.user.uid, role: "Guru / Staf", nama: rawId, sub: "Guru SMAN 2 Bayan", email: authEmail, bio: "" };
                selesaikanLogin(userData);
            });
        }).catch(() => {
            alert("Akun tidak ditemukan atau password salah. Jika baru pertama kali masuk, silakan klik tombol 'Belum punya akun? Daftar ID Guru/Staf' di bawah.");
        });
    }
}

function prosesLoginSiswa() {
    const nama = document.getElementById('login-siswa-nama').value.trim();
    const nis = document.getElementById('login-siswa-nis').value.trim();
    const kelas = document.getElementById('reg-siswa-kelas').value.trim() || "Siswa SMAN 2 Bayan";

    if (!nama || !nis) return alert("Harap isi Nama Asli dan NIS Anda!");
    if (nis.length < 6) return alert("Password NIS minimal 6 digit/karakter (tambahkan angka 0 di depan jika NIS kurang dari 6 digit)!");

    const authEmail = formatToAuthEmail(nama, "siswa");

    if (isRegisterSiswaMode) {
        auth.createUserWithEmailAndPassword(authEmail, nis).then((cred) => {
            const userData = { uid: cred.user.uid, role: "Siswa", nama: nama, sub: kelas, nis: nis, email: authEmail, bio: "" };
            db.collection("users_sekolah").doc(cred.user.uid).set(userData).then(() => {
                selesaikanLogin(userData);
            });
        }).catch(err => alert("Gagal mendaftar Siswa: " + err.message));
    } else {
        auth.signInWithEmailAndPassword(authEmail, nis).then((cred) => {
            db.collection("users_sekolah").doc(cred.user.uid).get().then(doc => {
                const userData = doc.exists ? doc.data() : { uid: cred.user.uid, role: "Siswa", nama: nama, sub: kelas, nis: nis, email: authEmail, bio: "" };
                selesaikanLogin(userData);
            });
        }).catch(() => {
            alert("Nama atau NIS belum terdaftar. Silakan klik tombol 'Belum terdaftar? Buat Akun Siswa' terlebih dahulu.");
        });
    }
}

function masukSebagaiTamu() {
    auth.signInAnonymously().catch(() => {});
    const guestData = { uid: "tamu", role: "Tamu", nama: "Tamu Pengunjung", sub: "Pengunjung Umum", email: "", bio: "" };
    selesaikanLogin(guestData);
}

function selesaikanLogin(userData) {
    currentUserSession = userData;
    localStorage.setItem("sman2bayan_session", JSON.stringify(userData));
    document.getElementById('login-gate-screen').style.display = 'none';
    document.getElementById('user-badge-status').innerText = `${userData.nama} (${userData.role})`;
    renderHome();
}

function keluarAkun() {
    if (confirm("Keluar dari sesi saat ini dan kembali ke layar pemilihan akses masuk?")) {
        auth.signOut().catch(() => {});
        localStorage.removeItem("sman2bayan_session");
        currentUserSession = null;
        kembaliPilihPeran();
        document.getElementById('login-gate-screen').style.display = 'flex';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem("sman2bayan_session");
    if (saved) {
        currentUserSession = JSON.parse(saved);
        document.getElementById('login-gate-screen').style.display = 'none';
        document.getElementById('user-badge-status').innerText = `${currentUserSession.nama} (${currentUserSession.role})`;
    }
    loadProfilGuruData(() => {
        renderHome();
    });
});

// ==========================================
// 4. PROFIL GURU & TOMBOL WA MENGAPUNG
// ==========================================
function loadProfilGuruData(callback) {
    db.collection("profil_guru").doc("utama").get().then((doc) => {
        if (doc.exists) {
            GURU_DATA = { ...GURU_DATA, ...doc.data() };
        }
        updateFloatingWA();
        if (callback) callback();
    }).catch(() => {
        updateFloatingWA();
        if (callback) callback();
    });
}

function updateFloatingWA() {
    const waContainer = document.getElementById('floating-wa-container');
    if (waContainer) {
        waContainer.innerHTML = `
            <a href="https://wa.me/${GURU_DATA.whatsapp}?text=Halo%20Ibu%20Guru%20${encodeURIComponent(GURU_DATA.nama)},%20saya%20ingin%20bertanya%20terkait%20materi%20pelajaran." target="_blank" title="Chat Guru via WhatsApp" style="position: fixed; bottom: 25px; right: 20px; background: #25D366; color: white; width: 55px; height: 55px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 4px 15px rgba(37,211,102,0.4); z-index: 95; text-decoration: none;">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
        `;
    }
}

function setActiveNav(id) {
    document.querySelectorAll('.menu-pill').forEach(el => el.classList.remove('active-home'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active-home');
}

// ==========================================
// 5. RENDER BERANDA (PROFIL SEKOLAH & MAPEL)
// ==========================================
function renderHome() {
    setActiveNav('nav-home');
    let html = `
        <div class="hero-banner" style="border-radius: 20px; overflow: hidden; position: relative; height: 210px; box-shadow: 0 10px 25px rgba(0,0,0,0.08);">
            <img src="images/hero-sman2bayan.jpg" alt="SMAN 2 Bayan" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80'">
            <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(30,27,75,0.9), rgba(67,24,255,0.3)); display:flex; flex-direction:column; justify-content:flex-end; padding:25px; color:white;">
                <span style="background:#05cd99; color:white; padding:4px 10px; border-radius:6px; font-size:0.72rem; font-weight:800; width:fit-content; margin-bottom:8px;">NPSN: ${DATA_SEKOLAH.npsn} • AKREDITASI ${DATA_SEKOLAH.akreditasi}</span>
                <h2 style="margin:0; font-size:1.45rem; font-weight:800;">Smart E-Learning ${DATA_SEKOLAH.nama}</h2>
                <p style="margin:4px 0 0 0; font-size:0.82rem; opacity:0.9;"><i class="fa-solid fa-location-dot"></i> ${DATA_SEKOLAH.alamat}</p>
            </div>
        </div>

        <!-- Tentang Sekolah & Statistik -->
        <div class="school-about-card">
            <h3 style="margin:0 0 6px 0; font-size:1.1rem; color:#2b3674;"><i class="fa-solid fa-school" style="color:#4318ff;"></i> Profil & Data Akademik Sekolah</h3>
            <p style="font-size:0.85rem; color:#64748b; line-height:1.5; margin:0;">Portal pembelajaran digital terpadu SMA Negeri 2 Bayan, Kabupaten Lombok Utara. Mendukung akses materi pelajaran, diskusi kelas interaktif, pemilihan OSIS digital, dan informasi ekstrakurikuler.</p>
            
            <div class="stat-grid-4">
                <div class="stat-box">
                    <i class="fa-solid fa-users" style="color:#4318ff; font-size:1.2rem;"></i>
                    <div class="stat-num">${DATA_SEKOLAH.jmlSiswa}</div>
                    <div class="stat-lbl">Peserta Didik</div>
                </div>
                <div class="stat-box">
                    <i class="fa-solid fa-chalkboard-user" style="color:#05cd99; font-size:1.2rem;"></i>
                    <div class="stat-num">${DATA_SEKOLAH.jmlGuru}</div>
                    <div class="stat-lbl">Guru & Tendik</div>
                </div>
                <div class="stat-box">
                    <i class="fa-solid fa-door-open" style="color:#f59e0b; font-size:1.2rem;"></i>
                    <div class="stat-num">${DATA_SEKOLAH.jmlRombel}</div>
                    <div class="stat-lbl">Rombongan Belajar</div>
                </div>
                <div class="stat-box">
                    <i class="fa-solid fa-trophy" style="color:#ec4899; font-size:1.2rem;"></i>
                    <div class="stat-num">${DATA_SEKOLAH.jmlEkskul}</div>
                    <div class="stat-lbl">Ekstrakurikuler</div>
                </div>
            </div>
        </div>

        <!-- Papan Pengumuman Sekolah Dinamis -->
        <div id="papan-pengumuman-home" style="margin-top: 20px;"></div>

        <h3 style="margin: 25px 0 15px 0; font-size: 1.15rem; color: #2b3674;">Semua Mata Pelajaran</h3>
        <div class="grid-container">
    `;

    subjectsList.forEach(sub => {
        const onClickAction = sub.active ? `onclick="renderKelas()"` : `onclick="alert('Materi mata pelajaran ${sub.name} belum ditambahkan oleh guru pengampu.')"`;
        html += `
            <div class="subject-card" style="background: ${sub.grad}; opacity: ${sub.active ? '1' : '0.82'}" ${onClickAction}>
                <i class="fa-solid ${sub.icon} bg-icon"></i><h3>${sub.name}</h3><p class="status">${sub.active ? "Tersedia" : "Segera Hadir"}</p>
            </div>
        `;
    });
    html += `</div>`;
    contentDiv.innerHTML = html;
    muatPengumumanHome();
}

function renderDaftarMapel() {
    setActiveNav('nav-mapel');
    let html = `
        <h3 style="margin: 0 0 15px 0; font-size: 1.2rem; color: #2b3674;"><i class="fa-solid fa-book-open" style="color:#4318ff;"></i> Daftar Mata Pelajaran SMAN 2 Bayan</h3>
        <div class="grid-container">
    `;
    subjectsList.forEach(sub => {
        const onClickAction = sub.active ? `onclick="renderKelas()"` : `onclick="alert('Materi belum tersedia.')"`;
        html += `
            <div class="subject-card" style="background: ${sub.grad}; opacity: ${sub.active ? '1' : '0.82'}" ${onClickAction}>
                <i class="fa-solid ${sub.icon} bg-icon"></i><h3>${sub.name}</h3><p class="status">${sub.active ? "Tersedia" : "Segera Hadir"}</p>
            </div>
        `;
    });
    html += `</div>`;
    contentDiv.innerHTML = html;
}

function renderProfilGuru() {
    setActiveNav('nav-guru');
    loadProfilGuruData(() => {
        contentDiv.innerHTML = `
            <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda</button>
            <div class="detail-box" style="text-align:center; padding: 30px; background:white; border-radius:20px;">
                <img src="${GURU_DATA.foto}" style="width:120px; height:120px; border-radius:50%; object-fit:cover; margin-bottom:15px; border: 4px solid #4318ff;">
                <h2 style="color:#2b3674; margin-bottom:5px;">${GURU_DATA.nama}</h2>
                <p style="color:#4318ff; font-weight:700; margin-bottom:15px;">Guru Mata Pelajaran ${GURU_DATA.mapel}</p>
                
                <div style="background: #f8fafc; padding: 15px; border-radius: 12px; margin-bottom: 20px; font-style: italic; color: #475569; border-left: 4px solid #4318ff;">
                    "${GURU_DATA.quote || 'Semangat belajar siswa-siswiku!'}"
                </div>

                <div style="text-align:left; max-width:500px; margin: 0 auto 25px auto; line-height: 1.9; font-size: 0.92rem; color: #334155;">
                    <p><i class="fa-solid fa-graduation-cap" style="color:#4318ff; width:25px;"></i> <strong>Pendidikan:</strong> ${GURU_DATA.gelar} (${GURU_DATA.kampus})</p>
                    <p><i class="fa-solid fa-envelope" style="color:#4318ff; width:25px;"></i> <strong>Email:</strong> ${GURU_DATA.email}</p>
                    <p><i class="fa-solid fa-location-dot" style="color:#4318ff; width:25px;"></i> <strong>Lokasi Rumah:</strong> <a href="${GURU_DATA.maps}" target="_blank" style="color:#4318ff; text-decoration:underline;">Buka Google Maps Rumah Guru</a></p>
                </div>

                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <a href="https://wa.me/${GURU_DATA.whatsapp}" target="_blank" style="background:#25D366; padding:10px 20px; border-radius:10px; text-decoration:none; color:white; font-weight:700;"><i class="fa-brands fa-whatsapp"></i> Chat WhatsApp</a>
                    <a href="${GURU_DATA.instagram}" target="_blank" style="background:#e1306c; padding:10px 20px; border-radius:10px; text-decoration:none; color:white; font-weight:700;"><i class="fa-brands fa-instagram"></i> Instagram</a>
                </div>
            </div>
        `;
    });
}

function renderKelas() {
    let html = `
        <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        
        <div style="background:white; padding:16px; border-radius:16px; margin-bottom:20px; display:flex; align-items:center; gap:15px; border:1px solid #e2e8f0; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.03);" onclick="renderProfilGuru()">
            <img src="${GURU_DATA.foto}" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #4318ff;">
            <div>
                <h4 style="margin:0; color:#2b3674; font-size:1.05rem;">${GURU_DATA.nama}</h4>
                <p style="margin:3px 0 0 0; font-size:0.82rem; color:#475569;">Guru Pengampu: <strong>${GURU_DATA.mapel}</strong> • <span style="color:#4318ff; font-weight:600;">Lihat Profil Lengkap</span></p>
            </div>
        </div>

        <h3 style="margin-bottom: 15px; color:#2b3674;">Pilih Kelas (Fisika)</h3>
    `;
    const tingkatan = [
        { tingkat: 'X', warna: 'linear-gradient(135deg, #11998e, #38ef7d)' },
        { tingkat: 'XI', warna: 'linear-gradient(135deg, #4318ff, #290bb4)' },
        { tingkat: 'XII', warna: 'linear-gradient(135deg, #ff9f43, #ff6b6b)' }
    ];
    const subKelas = ['A', 'B', 'C', 'D'];

    tingkatan.forEach(t => {
        html += `<h4 style="margin-top: 10px; margin-bottom: 10px; color: #2b3674;">Kelas ${t.tingkat}</h4>
                 <div class="grid-container" style="margin-bottom: 20px;">`;
        subKelas.forEach(sub => {
            const namaKelas = `${t.tingkat}.${sub}`;
            html += `
                <div class="subject-card" style="background: ${t.warna}; min-height: 75px; padding: 15px;" onclick="renderMateri('${namaKelas}')">
                    <h3 style="font-size: 1.1rem; text-align: center; width: 100%; margin: 8px 0;">${namaKelas}</h3>
                </div>
            `;
        });
        html += `</div>`;
    });
    contentDiv.innerHTML = html;
}

// ==========================================
// 6. MENGAMBIL & MENAMPILKAN MATERI PELAJARAN
// ==========================================
function renderMateri(kelas) {
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="skeleton-box" style="height: 82px;"></div>
        <div class="skeleton-box"></div>
        <div class="skeleton-box"></div>
        <div class="skeleton-box"></div>
    `;
    
    db.collection("materi_pelajaran").where("mapel", "==", "Fisika").where("kelas", "==", kelas).get().then((querySnapshot) => {
        let html = `
            <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
            
            <div style="background:white; padding:15px; border-radius:14px; margin-bottom:20px; display:flex; align-items:center; gap:15px; border:1px solid #e2e8f0; cursor:pointer;" onclick="renderProfilGuru()">
                <img src="${GURU_DATA.foto}" style="width:52px; height:52px; border-radius:50%; object-fit:cover; border:2px solid #4318ff;">
                <div>
                    <h4 style="margin:0; color:#2b3674; font-size:1rem;">${GURU_DATA.nama}</h4>
                    <p style="margin:2px 0 0 0; font-size:0.8rem; color:#475569;">Pengampu: <strong>${GURU_DATA.mapel}</strong></p>
                </div>
            </div>

            <h3 style="margin-bottom:15px; color:#2b3674;">Materi Fisika - ${kelas}</h3>
            <div class="material-list">
        `;
        
        if (querySnapshot.empty) {
            html += `<p style="color:#707eae; text-align:center; padding: 25px; background:white; border-radius:14px;">Belum ada materi yang diunggah guru untuk kelas ini.</p>`;
        } else {
            currentMateriList = []; 
            querySnapshot.forEach((doc) => { currentMateriList.push({ id: doc.id, ...doc.data() }); });
            currentMateriList.sort((a, b) => (a.timestamp?.toMillis() || 0) - (b.timestamp?.toMillis() || 0));

            currentMateriList.forEach((data, index) => {
                html += `<div class="material-item" onclick="renderDetailMateriDinamis('${kelas}', ${index})">
                            <div style="font-weight:700; color:#2b3674;">${index + 1}. ${data.bab} <span style="font-weight:400; color:#64748b; font-size:0.85rem;">(${data.subBab})</span></div>
                            <i class="fa-solid fa-chevron-right" style="color:#a3aed1;"></i>
                        </div>`;
            });
        }
        html += `</div>`;
        contentDiv.innerHTML = html;
    }).catch(err => {
        console.error(err);
        contentDiv.innerHTML += `<p style="color:red; text-align:center;">Gagal memuat materi. Cek koneksi internet Anda.</p>`;
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
                        <iframe width="100%" height="250" src="https://www.youtube.com/embed/${ytId}" title="${linkObj.label}" frameborder="0" allowfullscreen></iframe>
                        <div style="background: #f8fafc; padding: 10px; border: 1px solid #e2e8f0; border-top: none;">
                            <p style="color: #2b3674; font-weight: 600; font-size: 0.9rem; margin: 0;"><i class="fa-brands fa-youtube" style="color:red;"></i> ${linkObj.label}</p>
                        </div>
                    </div>
                `;
            } else {
                const uiConf = getIconForUrl(linkObj.url);
                mediaHtml += `
                    <a href="${linkObj.url}" target="_blank" style="display: flex; align-items: center; background: #f8fafc; padding: 12px 15px; border-radius: 10px; border: 1px solid #e2e8f0; text-decoration: none;">
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
                <div style="margin-bottom: 20px; padding: 15px; background: #fff3cd; border-radius: 12px; border-left: 4px solid #ffc107;">
                    <p style="margin-bottom: 5px; font-weight: bold; color: #856404;"><i class="fa-solid fa-tasks"></i> Tugas / PR:</p>
                    <p style="color: #856404; font-size: 0.95rem; margin-top: 5px; white-space: pre-wrap;">${babData.pr}</p>
                    
                    <!-- Kotak Pengumpulan Tugas Online Siswa -->
                    <div id="wadah-pengumpulan-tugas" style="margin-top: 15px; padding-top: 12px; border-top: 1px dashed #eab308;">
                        <p style="font-size: 0.85rem; color: #713f12;">Memeriksa status pengumpulan tugas Anda...</p>
                    </div>
                </div>
            `;
        }
    
    const namaAktif = currentUserSession ? `${currentUserSession.nama} (${currentUserSession.sub})` : "Belum Login";

    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderMateri('${kelas}')"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="detail-box" style="background:white; padding:25px; border-radius:20px; margin-bottom:20px;">
            <h2 style="color:#2b3674; margin:0;">${babData.bab}</h2>
            <h4 style="color:#4318ff; margin-top:6px;">${babData.subBab}</h4>
            <p style="color:#707eae; font-size:0.85rem; margin-top:5px; cursor:pointer;" onclick="renderProfilGuru()">Guru: <span style="color:#4318ff; text-decoration:underline;">${GURU_DATA.nama}</span></p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
            <p style="margin-bottom: 10px; line-height: 1.6; white-space: pre-wrap; color:#334155;">${babData.deskripsi || ''}</p>
            ${mediaHtml} 
            ${prHtml} 
        </div>

        <!-- Diskusi Sosial Media -->
        <div class="detail-box" style="background:white; padding:25px; border-radius:20px;">
            <h3 style="margin-bottom:15px; font-size:1.1rem; color:#2b3674;"><i class="fa-solid fa-comments" style="color:#4318ff;"></i> Diskusi & Tanya Jawab Kelas</h3>
            <div id="comments-container" style="margin-bottom:15px; max-height: 400px; overflow-y:auto; padding-right:5px;">
                <p style="color:grey; font-size:0.9rem;">Memuat diskusi...</p>
            </div>
            
            <div style="background:#f8fafc; padding:15px; border-radius:12px; border:1px solid #e2e8f0;">
                <h4 style="font-size:0.9rem; margin:0 0 8px 0; color:#2b3674;">Buat Pertanyaan Baru</h4>
                <p style="font-size:0.8rem; color:#64748b; margin-bottom:8px;">Akun Anda: <strong>${namaAktif}</strong></p>
                <textarea id="input-diskusi" rows="2" class="form-input" style="background:white;" placeholder="Tulis pertanyaanmu di sini..."></textarea>
                <button class="btn-primary" style="width: 100%; padding:10px; border-radius:10px; font-weight:700;" onclick="tambahDiskusiUtama('${babData.id}')">Kirim Pertanyaan</button>
            </div>
        </div>
    `;
    
    listenDiskusi(babData.id);
    if (babData.pr && babData.pr.trim() !== "") {
        cekStatusTugasSiswa(babData.id, kelas, babData.bab);
    }
}

// ==========================================
// 7. DISKUSI SOSIAL MEDIA (NESTED REPLIES)
// ==========================================
let unsubscribeDiskusi = null;
function listenDiskusi(materiId) {
    if (unsubscribeDiskusi) unsubscribeDiskusi(); 
    
    unsubscribeDiskusi = db.collection("diskusi").where("materiId", "==", materiId)
      .onSnapshot((snapshot) => {
          const commentsDiv = document.getElementById('comments-container');
          if (!commentsDiv) return;
          
          commentsDiv.innerHTML = '';
          if (snapshot.empty) {
              commentsDiv.innerHTML = "<p style='color:grey; font-size:0.85rem; text-align:center;'>Belum ada diskusi. Jadilah yang pertama bertanya!</p>";
              return;
          }

          let diskusiList = [];
          snapshot.forEach((doc) => diskusiList.push({ id: doc.id, ...doc.data() }));
          diskusiList.sort((a, b) => (a.waktu?.toMillis() || 0) - (b.waktu?.toMillis() || 0));

          let parentComments = diskusiList.filter(d => !d.parentId);

          parentComments.forEach(parent => {
              let replies = diskusiList.filter(d => d.parentId === parent.id);
              let repliesHtml = '';
              replies.forEach(rep => {
                  let badgeGuru = rep.isGuru ? `<span style="background:#4318ff; color:white; font-size:0.7rem; padding:2px 6px; border-radius:4px; margin-left:5px;">Guru</span>` : '';
                  repliesHtml += `
                      <div style="background:#f1f5f9; padding:10px 12px; border-radius:8px; margin-top:8px; margin-left:20px; border-left:3px solid #4318ff;">
                          <strong style="font-size:0.85rem; color:#1e293b;">${rep.pengirim}</strong> ${badgeGuru}
                          <p style="font-size:0.85rem; margin:3px 0; color:#334155;">${rep.pesan}</p>
                      </div>
                  `;
              });

              commentsDiv.innerHTML += `
                  <div style="background:white; border:1px solid #e2e8f0; padding:12px; border-radius:10px; margin-bottom:12px;">
                      <strong style="color:#2b3674; font-size:0.9rem;">${parent.pengirim}</strong>
                      <p style="font-size:0.9rem; margin:5px 0; color:#1e293b;">${parent.pesan}</p>
                      ${repliesHtml}
                      <div style="margin-top:8px; text-align:right;">
                          <button onclick="toggleReplyBox('${parent.id}')" style="background:none; border:none; color:#4318ff; font-size:0.8rem; font-weight:700; cursor:pointer;"><i class="fa-solid fa-reply"></i> Balas</button>
                      </div>
                      <div id="reply-box-${parent.id}" style="display:none; margin-top:8px; background:#f8fafc; padding:10px; border-radius:8px;">
                          <textarea id="reply-msg-${parent.id}" rows="2" placeholder="Tulis balasan..." class="form-input" style="background:white; font-size:0.85rem; margin-bottom:6px;"></textarea>
                          <button onclick="kirimBalasan('${materiId}', '${parent.id}')" class="btn-primary" style="padding:8px 12px; font-size:0.8rem; width:100%; border-radius:8px;">Kirim Balasan</button>
                      </div>
                  </div>
              `;
          });
      });
}

function toggleReplyBox(parentId) {
    if (!currentUserSession || currentUserSession.role === "Tamu") {
        alert("Tamu tidak dapat membalas diskusi. Silakan keluar dan masuk menggunakan akun Siswa atau Guru.");
        return;
    }
    const box = document.getElementById(`reply-box-${parentId}`);
    box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function tambahDiskusiUtama(materiId) {
    if (!currentUserSession || currentUserSession.role === "Tamu") {
        alert("Akun Tamu hanya dapat membaca materi. Silakan keluar dan masuk menggunakan akun Siswa atau Guru untuk bertanya.");
        return;
    }
    const pesan = document.getElementById('input-diskusi').value.trim();
    if (!pesan) return alert("Pesan pertanyaan tidak boleh kosong!");

    db.collection("diskusi").add({
        materiId: materiId,
        pengirim: `${currentUserSession.nama} (${currentUserSession.sub})`,
        pesan: pesan,
        parentId: null,
        isGuru: currentUserSession.role === "Guru / Staf",
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('input-diskusi').value = ""; 
    }).catch(err => alert("Gagal mengirim: " + err.message));
}

function kirimBalasan(materiId, parentId) {
    if (!currentUserSession || currentUserSession.role === "Tamu") return;
    const pesan = document.getElementById(`reply-msg-${parentId}`).value.trim();
    if (!pesan) return alert("Pesan balasan tidak boleh kosong!");

    db.collection("diskusi").add({
        materiId: materiId,
        pengirim: `${currentUserSession.nama} (${currentUserSession.sub})`,
        pesan: pesan,
        parentId: parentId,
        isGuru: currentUserSession.role === "Guru / Staf",
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById(`reply-msg-${parentId}`).value = "";
        document.getElementById(`reply-box-${parentId}`).style.display = 'none';
    }).catch(err => alert("Gagal membalas: " + err.message));
}

// ==========================================
// 8. MODAL EDIT PROFIL PENGGUNA
// ==========================================
function openProfilSayaModal() {
    if (!currentUserSession || currentUserSession.role === "Tamu") {
        alert("Anda sedang masuk sebagai Tamu. Silakan keluar dan masuk dengan akun Siswa atau Guru untuk mengedit profil.");
        return;
    }
    document.getElementById('modal-prof-role-info').innerText = `Peran Akun: ${currentUserSession.role}`;
    document.getElementById('edit-prof-nama').value = currentUserSession.nama || '';
    document.getElementById('edit-prof-sub').value = currentUserSession.sub || '';
    document.getElementById('edit-prof-email').value = currentUserSession.email || '';
    document.getElementById('edit-prof-bio').value = currentUserSession.bio || '';
    document.getElementById('user-profile-modal').classList.remove('hidden');
}

function closeProfilSayaModal() {
    document.getElementById('user-profile-modal').classList.add('hidden');
}

function simpanEditProfilUser() {
    if (!currentUserSession || currentUserSession.role === "Tamu") return;
    currentUserSession.nama = document.getElementById('edit-prof-nama').value.trim() || currentUserSession.nama;
    currentUserSession.sub = document.getElementById('edit-prof-sub').value.trim() || currentUserSession.sub;
    currentUserSession.email = document.getElementById('edit-prof-email').value.trim();
    currentUserSession.bio = document.getElementById('edit-prof-bio').value.trim();

    localStorage.setItem("sman2bayan_session", JSON.stringify(currentUserSession));
    document.getElementById('user-badge-status').innerText = `${currentUserSession.nama} (${currentUserSession.role})`;

    if (currentUserSession.uid && currentUserSession.uid !== "tamu") {
        db.collection("users_sekolah").doc(currentUserSession.uid).set(currentUserSession, { merge: true });
    }
    alert("Profil akun berhasil diperbarui!");
    closeProfilSayaModal();
}

// ==========================================
// 9. FITUR DARK MODE & NOTIFIKASI MODERN (SWEETALERT2)
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('sman2bayan_darkmode', isDark ? '1' : '0');
    
    const btn = document.getElementById('btn-dark-mode');
    if (btn) {
        btn.innerHTML = isDark ? '<i class="fa-solid fa-sun" style="color:#f59e0b;"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
}

if (localStorage.getItem('sman2bayan_darkmode') === '1') {
    document.body.classList.add('dark-mode');
    window.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('btn-dark-mode');
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun" style="color:#f59e0b;"></i>';
    });
}

window.alert = function(pesan) {
    if (typeof Swal !== 'undefined') {
        const isSuccess = String(pesan).toLowerCase().includes('berhasil') || String(pesan).toLowerCase().includes('diperbarui');
        Swal.fire({
            text: pesan,
            icon: isSuccess ? 'success' : 'info',
            confirmButtonColor: '#4318ff',
            confirmButtonText: 'Oke'
        });
    } else {
        console.log(pesan);
    }
};

// ==========================================
// 10. PAPAN PENGUMUMAN & AGENDA SEKOLAH
// ==========================================
function muatPengumumanHome() {
    const wadah = document.getElementById('papan-pengumuman-home');
    if (!wadah) return;

    db.collection("pengumuman_sekolah").orderBy("timestamp", "desc").limit(5).get().then((snapshot) => {
        if (snapshot.empty) {
            wadah.innerHTML = "";
            return;
        }

        let html = `
            <div class="school-about-card" style="margin-top: 0;">
                <h3 style="margin:0 0 12px 0; font-size:1.05rem; color:#2b3674;"><i class="fa-solid fa-bullhorn" style="color:#f59e0b;"></i> Papan Pengumuman & Agenda Sekolah</h3>
                <div style="display: flex; flex-direction: column; gap: 10px;">
        `;

        snapshot.forEach((doc) => {
            const p = doc.data();
            let badgeBg = "#4318ff";
            let borderCol = "#4318ff";
            if (p.kategori === "PENTING") { badgeBg = "#dc2626"; borderCol = "#dc2626"; }
            if (p.kategori === "KEGIATAN") { badgeBg = "#05cd99"; borderCol = "#05cd99"; }

            html += `
                <div class="info-item-box" style="flex-direction: column; align-items: flex-start; gap: 6px; border-left: 4px solid ${borderCol};">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
                        <span style="background: ${badgeBg}; color: white; font-size: 0.7rem; padding: 3px 8px; border-radius: 6px; font-weight: 800;">${p.kategori}</span>
                        <span style="font-size: 0.75rem; color: #64748b;"><i class="fa-regular fa-calendar"></i> ${p.tanggal || ''}</span>
                    </div>
                    <h4 style="margin: 2px 0 0 0; font-size: 0.95rem; color: #2b3674;">${p.judul}</h4>
                    <p style="margin: 0; font-size: 0.84rem; color: #475569; line-height: 1.5; white-space: pre-wrap;">${p.isi}</p>
                </div>
            `;
        });

        html += `</div></div>`;
        wadah.innerHTML = html;
    }).catch(() => {});
}
// ==========================================
// 11. PENGUMPULAN TUGAS & CEK NILAI SISWA
// ==========================================
function cekStatusTugasSiswa(materiId, kelas, judulBab) {
    const wadah = document.getElementById('wadah-pengumpulan-tugas');
    if (!wadah) return;

    if (!currentUserSession || currentUserSession.role !== "Siswa") {
        wadah.innerHTML = `<p style="font-size:0.82rem; color:#856404; margin:0;"><i class="fa-solid fa-lock"></i> Masuk sebagai <strong>Siswa</strong> untuk mengumpulkan jawaban tugas dan melihat nilai.</p>`;
        return;
    }

    const docId = `${materiId}_${currentUserSession.uid}`;
    db.collection("pengumpulan_tugas").doc(docId).get().then((doc) => {
        if (doc.exists) {
            const d = doc.data();
            const statusNilai = d.nilai !== null && d.nilai !== undefined && d.nilai !== ""
                ? `<span style="background:#05cd99; color:white; padding:4px 10px; border-radius:6px; font-weight:800; font-size:0.85rem;">Nilai: ${d.nilai} / 100</span>`
                : `<span style="background:#f59e0b; color:white; padding:4px 10px; border-radius:6px; font-weight:700; font-size:0.8rem;">Menunggu Penilaian Guru</span>`;

            const catatanGuruHtml = d.catatanGuru
                ? `<div style="margin-top:8px; padding:8px 10px; background:#eff6ff; border-radius:6px; border-left:3px solid #4318ff; font-size:0.82rem; color:#1e3a8a;"><strong>Catatan Guru:</strong> ${d.catatanGuru}</div>`
                : '';

            wadah.innerHTML = `
                <div style="background:white; padding:12px; border-radius:10px; border:1px solid #fde68a;">
                    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:8px;">
                        <strong style="color:#15803d; font-size:0.88rem;"><i class="fa-solid fa-circle-check"></i> Tugas Sudah Dikumpulkan</strong>
                        ${statusNilai}
                    </div>
                    <p style="font-size:0.82rem; color:#475569; margin:4px 0;"><strong>Link Jawaban:</strong> <a href="${d.linkTugas}" target="_blank" style="color:#4318ff; text-decoration:underline; word-break:break-all;">${d.linkTugas}</a></p>
                    ${d.catatanSiswa ? `<p style="font-size:0.82rem; color:#64748b; margin:2px 0;"><strong>Catatan Anda:</strong> ${d.catatanSiswa}</p>` : ''}
                    ${catatanGuruHtml}
                </div>
            `;
        } else {
            wadah.innerHTML = `
                <div style="background:white; padding:12px; border-radius:10px; border:1px solid #fde68a;">
                    <strong style="display:block; font-size:0.88rem; color:#2b3674; margin-bottom:8px;"><i class="fa-solid fa-paper-plane" style="color:#4318ff;"></i> Kumpulkan Jawaban Tugas Anda</strong>
                    <input type="url" id="input-link-tugas" class="form-input" style="font-size:0.85rem; margin-bottom:8px;" placeholder="Paste Link Google Drive / Foto Jawaban (https://...)">
                    <input type="text" id="input-catatan-tugas" class="form-input" style="font-size:0.85rem; margin-bottom:8px;" placeholder="Catatan tambahan untuk guru (opsional)...">
                    <button onclick="kirimTugasSiswa('${materiId}', '${kelas}', '${judulBab.replace(/'/g, "\\'")}')" class="btn-primary" style="width:100%; padding:10px; border-radius:8px; font-size:0.85rem; font-weight:700;">Kirim Jawaban Tugas</button>
                </div>
            `;
        }
    }).catch(() => {
        wadah.innerHTML = `<p style="color:red; font-size:0.8rem;">Gagal memuat status tugas.</p>`;
    });
}

function kirimTugasSiswa(materiId, kelas, judulBab) {
    const linkTugas = document.getElementById('input-link-tugas').value.trim();
    const catatanSiswa = document.getElementById('input-catatan-tugas').value.trim();

    if (!linkTugas) return alert("Harap tempelkan link jawaban tugas (Google Drive / dokumen)!");
    if (!linkTugas.startsWith("http")) return alert("Link jawaban harus diawali dengan http:// atau https://");

    const docId = `${materiId}_${currentUserSession.uid}`;
    db.collection("pengumpulan_tugas").doc(docId).set({
        materiId: materiId,
        judulBab: judulBab,
        kelas: kelas,
        uidSiswa: currentUserSession.uid,
        namaSiswa: currentUserSession.nama,
        nisSiswa: currentUserSession.nis || "-",
        linkTugas: linkTugas,
        catatanSiswa: catatanSiswa,
        nilai: null,
        catatanGuru: "",
        waktuKumpul: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        alert("Jawaban tugas berhasil dikirim ke guru!");
        cekStatusTugasSiswa(materiId, kelas, judulBab);
    }).catch(err => alert("Gagal mengirim tugas: " + err.message));
}
