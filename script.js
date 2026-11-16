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
// KONVERTER LINK GAMBAR UNIVERSAL (SEMUA WEBSITE, GOOGLE DRIVE & SOSMED)
// ==========================================
function formatUrlGambar(rawUrl) {
    if (!rawUrl) return "";
    let url = String(rawUrl).trim();
    if (!url) return "";

    if (!/^https?:\/\//i.test(url) && !url.startsWith("images/") && !url.startsWith("./")) {
        url = "https://" + url;
    }

    const gdriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
    if (gdriveMatch && gdriveMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`;
    }

    return url;
}

// ==========================================
// 2. DATA SEKOLAH (DAPODIK), CAROUSEL & DEFAULT TENDIK
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
    jmlEkskul: "9 Ekskul",
    sosmed: {
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        facebook: "https://facebook.com",
        tiktok: "https://tiktok.com",
        maps: "https://maps.google.com/?q=SMAN+2+Bayan+Lombok+Utara"
    }
};

const HERO_SLIDES = [
    {
        img: "images/hero-sman2bayan.jpg",
        fallback: "https://images.unsplash.com/photo-1524901548305-08eeddc35080?auto=format&fit=crop&w=1200&q=80",
        badge: "NPSN: 69807689 • AKREDITASI B",
        title: "Smart E-Learning SMA NEGERI 2 BAYAN",
        sub: "Jl. Raya Bayan - Ancak, Desa Karang Bajo, Kec. Bayan, Kab. Lombok Utara"
    },
    {
        img: "images/hero-slide-2.jpg",
        fallback: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
        badge: "KURIKULUM MERDEKA • DIGITALISASI SEKOLAH",
        title: "Belajar Interaktif, Kolaboratif & Berkarakter",
        sub: "Akses materi pelajaran, diskusi kelas, absensi QR, dan kegiatan ekstrakurikuler dalam satu portal"
    },
    {
        img: "images/hero-slide-3.jpg",
        fallback: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
        badge: "PRESTASI & KREATIVITAS SISWA",
        title: "Mewujudkan Generasi Unggul Lombok Utara",
        sub: "Mandiri, Berprestasi, dan Berakhlak Mulia di Kaki Gunung Rinjani"
    }
];

let GURU_DATA = {
    id: "utama",
    urutan: 2,
    kategoriJabatan: "Guru Mata Pelajaran",
    nama: "Rianti, S.Pd.",
    nip: "-",
    jabatan: "Guru Mata Pelajaran Fisika",
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

let daftarGuruTendikCache = [];
let currentUserSession = null;
let selectedStaffLoginType = "guru";
let isRegisterGuruMode = false;
let currentMateriList = [];
let carouselInterval = null;
let currentSlideIndex = 0;

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
// 3. LOGIKA GERBANG LOGIN AWAL (4 PERAN)
// ==========================================
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;
    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

function validasiKekuatanPassword(pass) {
    if (pass.length < 8) return "Password terlalu pendek! Minimal harus 8 karakter.";
    if (!/[A-Z]/.test(pass)) return "Password wajib mengandung minimal 1 HURUF BESAR (A-Z). Contoh: Bayan2026";
    if (!/[a-z]/.test(pass)) return "Password wajib mengandung minimal 1 HURUF KECIL (a-z). Contoh: Bayan2026";
    if (!/[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) return "Password wajib mengandung minimal 1 ANGKA atau SIMBOL. Contoh: Bayan#2026";
    return null;
}

function pilihPeranLogin(role) {
    document.getElementById('role-selection-box').style.display = 'none';
    if (role === 'operator' || role === 'guru') {
        selectedStaffLoginType = role;
        document.getElementById('form-login-guru').style.display = 'block';
        document.getElementById('form-login-siswa').style.display = 'none';

        const banner = document.getElementById('login-staff-banner');
        if (role === 'operator') {
            banner.style.background = '#fef2f2';
            banner.style.color = '#991b1b';
            banner.innerHTML = '<strong>Login Admin / Operator Sekolah:</strong> Kelola pengumuman beranda, struktur guru/tendik, dan import CSV data siswa.';
        } else {
            banner.style.background = '#eef2ff';
            banner.style.color = '#3730a3';
            banner.innerHTML = '<strong>Login Guru Mata Pelajaran:</strong> Kelola materi, penilaian tugas siswa, dan data siswa kelas.';
        }
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
    document.getElementById('btn-submit-guru').innerText = isRegisterGuruMode 
        ? "Daftar & Buat Akun Baru" 
        : "Masuk Sekarang";
    document.getElementById('btn-toggle-reg-guru').innerText = isRegisterGuruMode 
        ? "Sudah punya akun? Kembali ke Login" 
        : "Belum punya akun? Daftar Akun Baru";
}

function formatToAuthEmail(rawId, prefix) {
    if (rawId.includes('@')) return rawId.toLowerCase();
    const cleanId = rawId.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `${prefix}_${cleanId}@sman2bayan.sch.id`;
}

function prosesLoginGuru() {
    const rawId = document.getElementById('login-guru-id').value.trim();
    const pass = document.getElementById('login-guru-pass').value.trim();
    const namaLengkap = document.getElementById('reg-guru-nama-lengkap')?.value.trim() || rawId;
    const jabatan = document.getElementById('reg-guru-jabatan')?.value.trim() || (selectedStaffLoginType === 'operator' ? "Operator Sekolah" : "Guru Mata Pelajaran");
    const btn = document.getElementById('btn-submit-guru');

    if (!rawId || !pass) return alert("Harap isi ID (Email/NIP/Nama) dan Password!");

    const roleLabel = selectedStaffLoginType === 'operator' ? "Operator" : "Guru";
    const authEmail = formatToAuthEmail(rawId, selectedStaffLoginType);

    if (isRegisterGuruMode) {
        const pesanErrorPass = validasiKekuatanPassword(pass);
        if (pesanErrorPass) return alert(pesanErrorPass);

        btn.disabled = true;
        btn.innerText = "Mendaftarkan Akun...";

        auth.createUserWithEmailAndPassword(authEmail, pass).then((cred) => {
            const userData = { 
                uid: cred.user.uid, 
                role: roleLabel, 
                nama: namaLengkap, 
                sub: jabatan, 
                email: authEmail, 
                bio: "" 
            };
            db.collection("users_sekolah").doc(cred.user.uid).set(userData).catch(() => {});
            alert(`Pendaftaran ${roleLabel} Berhasil! Selamat datang, ${namaLengkap}.`);
            selesaikanLogin(userData);
        }).catch(err => {
            if (err.code === 'auth/email-already-in-use') {
                alert("Email atau ID ini sudah terdaftar! Silakan klik 'Sudah punya akun? Kembali ke Login' lalu masuk.");
            } else {
                alert("Gagal mendaftar akun: " + err.message);
            }
        }).finally(() => {
            btn.disabled = false;
            btn.innerText = isRegisterGuruMode ? "Daftar & Buat Akun Baru" : "Masuk Sekarang";
        });
    } else {
        btn.disabled = true;
        btn.innerText = "Memproses Masuk...";

        auth.signInWithEmailAndPassword(authEmail, pass).then((cred) => {
            db.collection("users_sekolah").doc(cred.user.uid).get().then(doc => {
                const dataLama = doc.exists ? doc.data() : {};
                const userData = {
                    ...dataLama,
                    uid: cred.user.uid,
                    role: roleLabel,
                    nama: dataLama.nama || rawId,
                    sub: dataLama.sub || jabatan,
                    email: authEmail
                };
                db.collection("users_sekolah").doc(cred.user.uid).set(userData, { merge: true }).catch(() => {});
                selesaikanLogin(userData);
            }).catch(() => {
                selesaikanLogin({ uid: cred.user.uid, role: roleLabel, nama: rawId, sub: jabatan, email: authEmail, bio: "" });
            });
        }).catch((err) => {
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                alert("Password yang Anda masukkan salah! Klik ikon mata untuk memeriksa penulisan password.");
            } else {
                alert("Akun belum terdaftar. Silakan klik tombol 'Belum punya akun? Daftar Akun Baru' di bawah.");
            }
        }).finally(() => {
            btn.disabled = false;
            btn.innerText = "Masuk Sekarang";
        });
    }
}

// Login Siswa berdasarkan Database Master Siswa yang diinput/di-CSV oleh Guru/Operator
function prosesLoginSiswa() {
    const idInput = document.getElementById('login-siswa-nama').value.trim();
    const passInput = document.getElementById('login-siswa-nis').value.trim();
    const btn = document.getElementById('btn-submit-siswa');

    if (!idInput || !passInput) return alert("Harap isi NIS (atau Nama Lengkap) dan Password dari Guru!");

    btn.disabled = true;
    btn.innerText = "Memeriksa Data Siswa...";

    db.collection("data_siswa").get().then((snapshot) => {
        let ditemukan = null;
        snapshot.forEach((doc) => {
            const s = doc.data();
            const matchNis = String(s.nis || "").trim().toLowerCase() === idInput.toLowerCase();
            const matchNama = String(s.nama || "").trim().toLowerCase() === idInput.toLowerCase();
            if ((matchNis || matchNama) && String(s.password || "").trim() === passInput) {
                ditemukan = { id: doc.id, ...s };
            }
        });

        if (ditemukan) {
            auth.signInAnonymously().catch(() => {});
            const sessionSiswa = {
                uid: ditemukan.id,
                role: "Siswa",
                nama: ditemukan.nama,
                nis: ditemukan.nis,
                jk: ditemukan.jk || "-",
                sub: ditemukan.kelas || "-",
                foto: formatUrlGambar(ditemukan.foto || ""),
                email: "",
                bio: ""
            };
            alert(`Selamat datang, ${ditemukan.nama} (${ditemukan.kelas})!`);
            selesaikanLogin(sessionSiswa);
        } else {
            alert("NIS / Nama atau Password tidak cocok! Pastikan menggunakan password resmi yang dibagikan oleh Guru atau Operator Sekolah.");
        }
    }).catch((err) => {
        alert("Gagal terhubung ke database siswa: " + err.message);
    }).finally(() => {
        btn.disabled = false;
        btn.innerText = "Masuk Sebagai Siswa";
    });
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
    updateHeaderUserUI();
    renderHome();
}

function updateHeaderUserUI() {
    const badge = document.getElementById('user-badge-status');
    const btnStaff = document.getElementById('btn-dashboard-staff');
    if (!currentUserSession) return;

    if (badge) {
        badge.innerHTML = `<i class="fa-solid fa-circle-user"></i> ${currentUserSession.nama} (${currentUserSession.role})`;
    }

    if (btnStaff) {
        if (currentUserSession.role === "Operator" || currentUserSession.role === "Guru" || currentUserSession.role === "Guru / Staf") {
            btnStaff.style.display = "inline-flex";
            btnStaff.innerHTML = currentUserSession.role === "Operator"
                ? `<i class="fa-solid fa-shield-halved"></i> Panel Operator & Guru`
                : `<i class="fa-solid fa-chalkboard-user"></i> Ruang Kerja Guru`;
        } else {
            btnStaff.style.display = "none";
        }
    }
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
        updateHeaderUserUI();
    }
    loadProfilGuruData(() => {
        renderHome();
    });
});

// ==========================================
// 4. PROFIL GURU & TOMBOL WA KONTEKSTUAL
// ==========================================
function loadProfilGuruData(callback) {
    db.collection("profil_guru").doc("utama").get().then((doc) => {
        if (doc.exists) {
            GURU_DATA = { ...GURU_DATA, ...doc.data() };
        }
        if (callback) callback();
    }).catch(() => {
        if (callback) callback();
    });
}

// WhatsApp mengapung HANYA tampil ketika membuka halaman profil guru tertentu
function setFloatingWAVisible(show, guruObj = GURU_DATA) {
    const waContainer = document.getElementById('floating-wa-container');
    if (!waContainer) return;

    if (!show || !guruObj || !guruObj.whatsapp) {
        waContainer.innerHTML = "";
        return;
    }

    const cleanWa = String(guruObj.whatsapp).replace(/[^0-9]/g, '');
    waContainer.innerHTML = `
        <a href="https://wa.me/${cleanWa}?text=Assalamu'alaikum%20${encodeURIComponent(guruObj.nama)},%20saya%20ingin%20bertanya%20terkait%20pembelajaran%20di%20SMAN%202%20Bayan." target="_blank" title="Chat ${guruObj.nama} via WhatsApp" style="position: fixed; bottom: 25px; right: 20px; background: #25D366; color: white; padding: 12px 18px; border-radius: 50px; display: flex; align-items: center; gap: 8px; font-size: 0.92rem; font-weight: 700; box-shadow: 0 6px 20px rgba(37,211,102,0.45); z-index: 95; text-decoration: none;">
            <i class="fa-brands fa-whatsapp" style="font-size: 1.45rem;"></i> Hubungi Guru
        </a>
    `;
}

function setActiveNav(id) {
    document.querySelectorAll('.menu-pill').forEach(el => el.classList.remove('active-home'));
    const target = document.getElementById(id);
    if (target) target.classList.add('active-home');
}

// ==========================================
// 5. CAROUSEL HERO BANNER
// ==========================================
function startHeroCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    currentSlideIndex = 0;
    carouselInterval = setInterval(() => {
        geserCarousel(1);
    }, 5000);
}

function geserCarousel(step) {
    const slides = document.querySelectorAll('.carousel-slide');
    if (!slides.length) return;
    slides[currentSlideIndex].classList.remove('active');
    currentSlideIndex = (currentSlideIndex + step + slides.length) % slides.length;
    slides[currentSlideIndex].classList.add('active');
}

// ==========================================
// 6. RENDER BERANDA (SUSUNAN SESUAI PERMINTAAN)
//    1. Navbar
//    2. Hero Carousel
//    3. Tentang Profil Sekolah
//    4. Papan Pengumuman (Admin/Operator - Teks & Gambar Banner)
//    5. Kegiatan Berlangsung & Rekap Absensi Hari Ini (Guru & Siswa)
//    6. Sosial Media Sekolah (Paling Bawah)
// ==========================================
function renderHome() {
    setActiveNav('nav-home');
    setFloatingWAVisible(false);

    let slidesHtml = '';
    HERO_SLIDES.forEach((s, idx) => {
        slidesHtml += `
            <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
                <img src="${s.img}" alt="${s.title}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${s.fallback}'">
                <div style="position:absolute; inset:0; background: linear-gradient(to top, rgba(30,27,75,0.92), rgba(67,24,255,0.28)); display:flex; flex-direction:column; justify-content:flex-end; padding:26px; color:white;">
                    <span style="background:#05cd99; color:white; padding:4px 10px; border-radius:6px; font-size:0.72rem; font-weight:800; width:fit-content; margin-bottom:8px;">${s.badge}</span>
                    <h2 style="margin:0; font-size:1.45rem; font-weight:800;">${s.title}</h2>
                    <p style="margin:4px 0 0 0; font-size:0.82rem; opacity:0.92;"><i class="fa-solid fa-location-dot"></i> ${s.sub}</p>
                </div>
            </div>
        `;
    });

    let html = `
        <!-- 2. HERO BANNER CAROUSEL -->
        <div class="hero-carousel">
            ${slidesHtml}
            <button class="carousel-btn" style="left: 12px;" onclick="geserCarousel(-1)"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="carousel-btn" style="right: 12px;" onclick="geserCarousel(1)"><i class="fa-solid fa-chevron-right"></i></button>
        </div>

        <!-- 3. TENTANG PROFIL SEKOLAH -->
        <div class="school-about-card">
            <h3 style="margin:0 0 8px 0; font-size:1.12rem; color:#2b3674;"><i class="fa-solid fa-school" style="color:#4318ff;"></i> Tentang Profil ${DATA_SEKOLAH.nama}</h3>
            <p style="font-size:0.86rem; color:#64748b; line-height:1.6; margin:0;">
                SMA Negeri 2 Bayan adalah satuan pendidikan menengah atas negeri di Kecamatan Bayan, Kabupaten Lombok Utara, Provinsi Nusa Tenggara Barat. Berkomitmen menghadirkan layanan pembelajaran digital modern, transparan, dan interaktif bagi seluruh peserta didik serta tenaga pendidik.
            </p>
            
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

        <!-- 4. PAPAN PENGUMUMAN & BANNER INFO (DIBUAT ADMIN / OPERATOR SEKOLAH) -->
        <div id="papan-pengumuman-home" style="margin-top: 20px;">
            <div class="school-about-card" style="margin-top:0;">
                <p style="color:#64748b; font-size:0.85rem; margin:0;">Memuat pengumuman sekolah...</p>
            </div>
        </div>

        <!-- 5. KEGIATAN SEDANG BERLANGSUNG & KEHADIRAN HARI INI -->
        <div id="kegiatan-berlangsung-home" style="margin-top: 20px;">
            <div class="school-about-card" style="margin-top:0;">
                <p style="color:#64748b; font-size:0.85rem; margin:0;">Memuat aktivitas kehadiran & kegiatan hari ini...</p>
            </div>
        </div>

        <!-- 6. SOSIAL MEDIA RESMI SEKOLAH (PALING BAWAH) -->
        <div class="school-about-card" style="margin-top: 20px;">
            <h3 style="margin:0 0 6px 0; font-size:1.05rem; color:#2b3674;"><i class="fa-solid fa-share-nodes" style="color:#4318ff;"></i> Kanal & Sosial Media Resmi Sekolah</h3>
            <p style="font-size:0.82rem; color:#64748b; margin:0;">Ikuti informasi kegiatan, dokumentasi prestasi, dan lokasi kampus SMAN 2 Bayan:</p>
            <div class="sosmed-grid">
                <a href="${DATA_SEKOLAH.sosmed.instagram}" target="_blank" class="sosmed-btn" style="background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);">
                    <i class="fa-brands fa-instagram" style="font-size:1.15rem;"></i> Instagram
                </a>
                <a href="${DATA_SEKOLAH.sosmed.youtube}" target="_blank" class="sosmed-btn" style="background: #ff0000;">
                    <i class="fa-brands fa-youtube" style="font-size:1.15rem;"></i> YouTube
                </a>
                <a href="${DATA_SEKOLAH.sosmed.facebook}" target="_blank" class="sosmed-btn" style="background: #1877f2;">
                    <i class="fa-brands fa-facebook" style="font-size:1.15rem;"></i> Facebook
                </a>
                <a href="${DATA_SEKOLAH.sosmed.tiktok}" target="_blank" class="sosmed-btn" style="background: #0f172a;">
                    <i class="fa-brands fa-tiktok" style="font-size:1.15rem;"></i> TikTok
                </a>
                <a href="${DATA_SEKOLAH.sosmed.maps}" target="_blank" class="sosmed-btn" style="background: #05cd99;">
                    <i class="fa-solid fa-map-location-dot" style="font-size:1.15rem;"></i> Lokasi Maps
                </a>
            </div>
        </div>
    `;

    contentDiv.innerHTML = html;
    startHeroCarousel();
    muatPengumumanHome();
    muatAktivitasDanAbsensiHome();
}

// Memuat Papan Pengumuman (Mendukung Teks maupun Gambar Banner dari Semua Website & Sosmed)
function muatPengumumanHome() {
    const wadah = document.getElementById('papan-pengumuman-home');
    if (!wadah) return;

    db.collection("pengumuman_sekolah").orderBy("timestamp", "desc").limit(6).get().then((snapshot) => {
        if (snapshot.empty) {
            wadah.innerHTML = `
                <div class="school-about-card" style="margin-top: 0;">
                    <h3 style="margin:0 0 8px 0; font-size:1.08rem; color:#2b3674;"><i class="fa-solid fa-bullhorn" style="color:#f59e0b;"></i> Papan Pengumuman Sekolah</h3>
                    <p style="font-size:0.84rem; color:#64748b; margin:0;">Belum ada pengumuman terbaru dari Admin / Operator Sekolah.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div class="school-about-card" style="margin-top: 0;">
                <h3 style="margin:0 0 14px 0; font-size:1.08rem; color:#2b3674;"><i class="fa-solid fa-bullhorn" style="color:#f59e0b;"></i> Papan Pengumuman Sekolah</h3>
                <div style="display: flex; flex-direction: column; gap: 14px;">
        `;

        snapshot.forEach((doc) => {
            const p = doc.data();
            let badgeBg = "#4318ff";
            let borderCol = "#4318ff";
            if (p.kategori === "PENTING") { badgeBg = "#dc2626"; borderCol = "#dc2626"; }
            if (p.kategori === "KEGIATAN") { badgeBg = "#05cd99"; borderCol = "#05cd99"; }

            const urlBanner = formatUrlGambar(p.gambarBanner);
            const gambarBannerHtml = urlBanner !== ""
                ? `<img src="${urlBanner}" referrerpolicy="no-referrer" alt="${p.judul}" style="width: 100%; max-height: 360px; object-fit: cover; border-radius: 10px; margin-top: 8px; border: 1px solid #cbd5e1;" onerror="this.style.display='none'">`
                : '';

            html += `
                <div class="info-item-box" style="flex-direction: column; align-items: flex-start; gap: 6px; border-left: 4px solid ${borderCol};">
                    <div style="display: flex; justify-content: space-between; width: 100%; align-items: center; flex-wrap: wrap; gap: 6px;">
                        <span style="background: ${badgeBg}; color: white; font-size: 0.7rem; padding: 3px 8px; border-radius: 6px; font-weight: 800;">${p.kategori}</span>
                        <span style="font-size: 0.75rem; color: #64748b;"><i class="fa-regular fa-calendar"></i> ${p.tanggal || ''}</span>
                    </div>
                    <h4 style="margin: 2px 0 0 0; font-size: 0.98rem; color: #2b3674;">${p.judul}</h4>
                    ${p.isi ? `<p style="margin: 0; font-size: 0.85rem; color: #475569; line-height: 1.55; white-space: pre-wrap;">${p.isi}</p>` : ''}
                    ${gambarBannerHtml}
                </div>
            `;
        });

        html += `</div></div>`;
        wadah.innerHTML = html;
    }).catch(() => {});
}

// Memuat Kegiatan Berlangsung: Siapa yang sudah absen (Guru & Siswa), Jumlah Siswa Hadir Hari Ini, & Agenda Aktif
function muatAktivitasDanAbsensiHome() {
    const wadah = document.getElementById('kegiatan-berlangsung-home');
    if (!wadah) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const tanggalTampil = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

    Promise.all([
        db.collection("absensi").get().catch(() => ({ empty: true, forEach: () => {} })),
        db.collection("diskusi").orderBy("waktu", "desc").limit(4).get().catch(() => ({ empty: true, forEach: () => {} }))
    ]).then(([absenSnap, diskusiSnap]) => {
        let siswaHadirList = [];
        let guruHadirList = [];

        absenSnap.forEach((doc) => {
            const a = doc.data();
            const tglDoc = a.tanggal || (a.waktu && a.waktu.toDate ? a.waktu.toDate().toISOString().split('T')[0] : "");
            if (tglDoc === todayStr || !tglDoc) {
                const peran = String(a.role || a.peran || "Siswa").toLowerCase();
                if (peran.includes("guru") || peran.includes("staf") || peran.includes("tendik")) {
                    guruHadirList.push(a);
                } else {
                    siswaHadirList.push(a);
                }
            }
        });

        let diskusiTerbaruHtml = '';
        if (!diskusiSnap.empty) {
            diskusiSnap.forEach(doc => {
                const d = doc.data();
                diskusiTerbaruHtml += `
                    <div style="padding: 8px 10px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; font-size: 0.8rem;">
                        <strong style="color:#4318ff;">${d.pengirim}:</strong> <span style="color:#334155;">"${d.pesan}"</span>
                    </div>
                `;
            });
        } else {
            diskusiTerbaruHtml = `<p style="font-size:0.8rem; color:#64748b; margin:0;">Belum ada diskusi kelas aktif hari ini.</p>`;
        }

        const badgeSiswaHadir = siswaHadirList.length > 0
            ? siswaHadirList.slice(0, 18).map(s => `<span style="background:#dcfce7; color:#166534; padding:4px 9px; border-radius:20px; font-size:0.75rem; font-weight:700;"><i class="fa-solid fa-check"></i> ${s.nama || s.namaSiswa || 'Siswa'} (${s.kelas || '-'})</span>`).join(' ')
            : `<span style="font-size:0.8rem; color:#64748b;">Belum ada data scan absensi siswa hari ini.</span>`;

        const badgeGuruHadir = guruHadirList.length > 0
            ? guruHadirList.map(g => `<span style="background:#e0e7ff; color:#3730a3; padding:4px 9px; border-radius:20px; font-size:0.75rem; font-weight:700;"><i class="fa-solid fa-user-check"></i> ${g.nama || 'Guru'}</span>`).join(' ')
            : `<span style="font-size:0.8rem; color:#64748b;">Belum ada scan kehadiran guru hari ini.</span>`;

        wadah.innerHTML = `
            <div class="school-about-card" style="margin-top: 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:14px;">
                    <h3 style="margin:0; font-size:1.08rem; color:#2b3674;"><i class="fa-solid fa-satellite-dish" style="color:#05cd99;"></i> Kegiatan Berlangsung & Kehadiran Hari Ini</h3>
                    <span style="font-size:0.76rem; background:#eef2ff; color:#4318ff; padding:4px 10px; border-radius:8px; font-weight:700;">${tanggalTampil}</span>
                </div>

                <!-- Ringkasan Angka Kehadiran Hari Ini -->
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-bottom:16px;">
                    <div style="background: linear-gradient(135deg, #05cd99, #02946d); color:white; padding:14px 16px; border-radius:14px;">
                        <div style="font-size:0.78rem; opacity:0.9; font-weight:600;">Siswa Hadir Hari Ini</div>
                        <div style="font-size:1.65rem; font-weight:800; margin:2px 0;">${siswaHadirList.length} <span style="font-size:0.85rem; font-weight:600;">Siswa</span></div>
                        <div style="font-size:0.72rem; opacity:0.88;">Tercatat via Absensi Digital</div>
                    </div>
                    <div style="background: linear-gradient(135deg, #4318ff, #290bb4); color:white; padding:14px 16px; border-radius:14px;">
                        <div style="font-size:0.78rem; opacity:0.9; font-weight:600;">Guru & Tendik Hadir</div>
                        <div style="font-size:1.65rem; font-weight:800; margin:2px 0;">${guruHadirList.length} <span style="font-size:0.85rem; font-weight:600;">Orang</span></div>
                        <div style="font-size:0.72rem; opacity:0.88;">Aktif Mengajar & Piket</div>
                    </div>
                </div>

                <!-- Daftar Nama yang Sudah Absen -->
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; padding:14px; margin-bottom:14px;">
                    <div style="font-size:0.82rem; font-weight:800; color:#2b3674; margin-bottom:6px;"><i class="fa-solid fa-chalkboard-user" style="color:#4318ff;"></i> Guru & Staf Sudah Absen:</div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px;">${badgeGuruHadir}</div>

                    <div style="font-size:0.82rem; font-weight:800; color:#2b3674; margin-bottom:6px;"><i class="fa-solid fa-user-graduate" style="color:#05cd99;"></i> Siswa Sudah Absen:</div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">${badgeSiswaHadir}</div>
                </div>

                <!-- Aktivitas Diskusi Kelas & Agenda Pembelajaran Berlangsung -->
                <div>
                    <div style="font-size:0.84rem; font-weight:800; color:#2b3674; margin-bottom:8px;"><i class="fa-solid fa-comments" style="color:#f59e0b;"></i> Aktivitas Diskusi Pembelajaran Terbaru:</div>
                    <div style="display:flex; flex-direction:column; gap:6px;">${diskusiTerbaruHtml}</div>
                </div>
            </div>
        `;
    });
}

// ==========================================
// 7. MENU MATA PELAJARAN (MUNCUL HANYA SAAT TOMBOL DIKLIK)
// ==========================================
function renderDaftarMapel() {
    setActiveNav('nav-mapel');
    setFloatingWAVisible(false);

    let html = `
        <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda</button>
        <h3 style="margin: 0 0 15px 0; font-size: 1.2rem; color: #2b3674;"><i class="fa-solid fa-book-open" style="color:#4318ff;"></i> Semua Mata Pelajaran SMAN 2 Bayan</h3>
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
}

// ==========================================
// 8. MENU GURU & TENAGA KEPENDIDIKAN (STRUKTUR ORGANISASI & PROFIL DETAIL)
// ==========================================
function renderStrukturGuruTendik() {
    setActiveNav('nav-tendik');
    setFloatingWAVisible(false);

    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderHome()"><i class="fa-solid fa-arrow-left"></i> Kembali ke Beranda</button>
        <div class="school-about-card" style="margin-top:0;">
            <h2 style="margin:0 0 6px 0; font-size:1.22rem; color:#2b3674;"><i class="fa-solid fa-sitemap" style="color:#4318ff;"></i> Struktur Organisasi, Guru & Tenaga Kependidikan</h2>
            <p style="font-size:0.84rem; color:#64748b; margin:0 0 15px 0;">Klik salah satu nama Guru atau Staf di bawah ini untuk melihat profil lengkap, pendidikan, dan kontak WhatsApp.</p>
            <div id="wadah-struktur-tendik"><p style="color:grey; font-size:0.85rem;">Memuat data guru & tenaga kependidikan...</p></div>
        </div>
    `;

    db.collection("struktur_tendik").get().then((snapshot) => {
        daftarGuruTendikCache = [];
        snapshot.forEach((doc) => {
            daftarGuruTendikCache.push({ id: doc.id, ...doc.data() });
        });

        if (daftarGuruTendikCache.length === 0) {
            daftarGuruTendikCache.push(GURU_DATA);
        }

        daftarGuruTendikCache.sort((a, b) => (Number(a.urutan) || 99) - (Number(b.urutan) || 99));

        const kategoriList = [
            { key: "Pimpinan & Manajemen", label: "Pimpinan & Manajemen Sekolah", warna: "#dc2626" },
            { key: "Guru Mata Pelajaran", label: "Dewan Guru Mata Pelajaran", warna: "#4318ff" },
            { key: "Tenaga Kependidikan", label: "Tenaga Kependidikan & Tata Usaha (Staf)", warna: "#05cd99" }
        ];

        let html = '';
        kategoriList.forEach(kat => {
            const anggota = daftarGuruTendikCache.filter(item => (item.kategoriJabatan || "Guru Mata Pelajaran") === kat.key);
            if (anggota.length === 0) return;

            html += `
                <div style="margin-top: 20px;">
                    <div style="display:inline-block; background:${kat.warna}; color:white; padding:5px 14px; border-radius:8px; font-size:0.82rem; font-weight:800; margin-bottom:10px;">
                        ${kat.label}
                    </div>
                    <div class="tendik-grid">
            `;

            anggota.forEach((person) => {
                const idx = daftarGuruTendikCache.findIndex(x => x.id === person.id);
                const validFoto = formatUrlGambar(person.foto);
                const fotoUrl = validFoto !== ""
                    ? validFoto
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=4318ff&color=fff`;

                html += `
                    <div class="tendik-card" onclick="renderProfilDetailGuru(${idx})">
                        <img src="${fotoUrl}" referrerpolicy="no-referrer" alt="${person.nama}" style="width:78px; height:78px; border-radius:50%; object-fit:cover; border:3px solid ${kat.warna}; margin-bottom:10px;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=4318ff&color=fff'">
                        <h4 style="margin:0 0 4px 0; font-size:0.95rem; color:#2b3674;">${person.nama}</h4>
                        <div style="font-size:0.78rem; font-weight:700; color:${kat.warna}; margin-bottom:4px;">${person.jabatan || person.mapel || 'Guru'}</div>
                        ${person.nip && person.nip !== '-' ? `<div style="font-size:0.72rem; color:#64748b;">NIP: ${person.nip}</div>` : ''}
                        <div style="margin-top:10px; font-size:0.75rem; color:#4318ff; font-weight:700;">Lihat Profil Lengkap <i class="fa-solid fa-arrow-right"></i></div>
                    </div>
                `;
            });

            html += `</div></div>`;
        });

        document.getElementById('wadah-struktur-tendik').innerHTML = html;
    }).catch(() => {
        daftarGuruTendikCache = [GURU_DATA];
        renderProfilDetailGuru(0);
    });
}

function renderProfilDetailGuru(index) {
    const person = daftarGuruTendikCache[index] || GURU_DATA;
    // Aktifkan WhatsApp mengapung KHUSUS di halaman profil guru ini
    setFloatingWAVisible(true, person);

    const validFoto = formatUrlGambar(person.foto);
    const fotoUrl = validFoto !== ""
        ? validFoto
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=4318ff&color=fff`;

    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderStrukturGuruTendik()"><i class="fa-solid fa-arrow-left"></i> Kembali ke Daftar Guru & Tendik</button>
        <div class="detail-box" style="text-align:center; padding: 30px; background:white; border-radius:20px;">
            <img src="${fotoUrl}" referrerpolicy="no-referrer" style="width:125px; height:125px; border-radius:50%; object-fit:cover; margin-bottom:15px; border: 4px solid #4318ff;" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(person.nama)}&background=4318ff&color=fff'">
            <h2 style="color:#2b3674; margin-bottom:5px;">${person.nama}</h2>
            <p style="color:#4318ff; font-weight:700; margin-bottom:4px;">${person.jabatan || ('Guru Mata Pelajaran ' + (person.mapel || ''))}</p>
            ${person.nip && person.nip !== '-' ? `<p style="font-size:0.82rem; color:#64748b; margin-top:0;">NIP: ${person.nip}</p>` : ''}
            
            <div style="background: #f8fafc; padding: 15px; border-radius: 12px; margin: 16px auto 20px auto; max-width:520px; font-style: italic; color: #475569; border-left: 4px solid #4318ff;">
                "${person.quote || 'Mengabdi dengan hati untuk mencerdaskan generasi SMAN 2 Bayan.'}"
            </div>

            <div style="text-align:left; max-width:500px; margin: 0 auto 25px auto; line-height: 1.9; font-size: 0.92rem; color: #334155;">
                ${person.gelar ? `<p><i class="fa-solid fa-graduation-cap" style="color:#4318ff; width:25px;"></i> <strong>Pendidikan:</strong> ${person.gelar} ${person.kampus ? '(' + person.kampus + ')' : ''}</p>` : ''}
                ${person.mapel ? `<p><i class="fa-solid fa-book" style="color:#4318ff; width:25px;"></i> <strong>Bidang Tugas / Mapel:</strong> ${person.mapel}</p>` : ''}
                ${person.email ? `<p><i class="fa-solid fa-envelope" style="color:#4318ff; width:25px;"></i> <strong>Email:</strong> ${person.email}</p>` : ''}
                ${person.maps ? `<p><i class="fa-solid fa-location-dot" style="color:#4318ff; width:25px;"></i> <strong>Alamat / Maps:</strong> <a href="${person.maps}" target="_blank" style="color:#4318ff; text-decoration:underline;">Buka Google Maps</a></p>` : ''}
            </div>

            <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                ${person.whatsapp ? `<a href="https://wa.me/${String(person.whatsapp).replace(/[^0-9]/g, '')}" target="_blank" style="background:#25D366; padding:10px 20px; border-radius:10px; text-decoration:none; color:white; font-weight:700;"><i class="fa-brands fa-whatsapp"></i> Chat WhatsApp</a>` : ''}
                ${person.instagram ? `<a href="${person.instagram}" target="_blank" style="background:#e1306c; padding:10px 20px; border-radius:10px; text-decoration:none; color:white; font-weight:700;"><i class="fa-brands fa-instagram"></i> Instagram</a>` : ''}
            </div>
        </div>
    `;
}

// ==========================================
// 9. PILIH KELAS & MATERI PELAJARAN
// ==========================================
function renderKelas() {
    setFloatingWAVisible(false);
    const fotoGuru = formatUrlGambar(GURU_DATA.foto);
    let html = `
        <button class="btn-back" onclick="renderDaftarMapel()"><i class="fa-solid fa-arrow-left"></i> Kembali ke Mata Pelajaran</button>
        
        <div style="background:white; padding:16px; border-radius:16px; margin-bottom:20px; display:flex; align-items:center; gap:15px; border:1px solid #e2e8f0; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.03);" onclick="daftarGuruTendikCache=[GURU_DATA]; renderProfilDetailGuru(0)">
            <img src="${fotoGuru}" referrerpolicy="no-referrer" style="width:60px; height:60px; border-radius:50%; object-fit:cover; border:2px solid #4318ff;">
            <div>
                <h4 style="margin:0; color:#2b3674; font-size:1.05rem;">${GURU_DATA.nama}</h4>
                <p style="margin:3px 0 0 0; font-size:0.82rem; color:#475569;">Guru Pengampu: <strong>${GURU_DATA.mapel}</strong> • <span style="color:#4318ff; font-weight:600;">Lihat Profil & Kontak Guru</span></p>
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

function renderMateri(kelas) {
    setFloatingWAVisible(false);
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="skeleton-box" style="height: 82px;"></div>
        <div class="skeleton-box"></div>
        <div class="skeleton-box"></div>
    `;
    
    db.collection("materi_pelajaran").where("mapel", "==", "Fisika").where("kelas", "==", kelas).get().then((querySnapshot) => {
        let html = `
            <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
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
    }).catch(() => {
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
    setFloatingWAVisible(false);
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
            <p style="color:#707eae; font-size:0.85rem; margin-top:5px;">Guru: <span style="color:#4318ff;">${GURU_DATA.nama}</span></p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
            <p style="margin-bottom: 10px; line-height: 1.6; white-space: pre-wrap; color:#334155;">${babData.deskripsi || ''}</p>
            ${mediaHtml} 
            ${prHtml} 
        </div>

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
// 10. DISKUSI KELAS (NESTED REPLIES)
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

    const isStaff = ["Operator", "Guru", "Guru / Staf"].includes(currentUserSession.role);
    db.collection("diskusi").add({
        materiId: materiId,
        pengirim: `${currentUserSession.nama} (${currentUserSession.sub})`,
        pesan: pesan,
        parentId: null,
        isGuru: isStaff,
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById('input-diskusi').value = ""; 
    }).catch(err => alert("Gagal mengirim: " + err.message));
}

function kirimBalasan(materiId, parentId) {
    if (!currentUserSession || currentUserSession.role === "Tamu") return;
    const pesan = document.getElementById(`reply-msg-${parentId}`).value.trim();
    if (!pesan) return alert("Pesan balasan tidak boleh kosong!");

    const isStaff = ["Operator", "Guru", "Guru / Staf"].includes(currentUserSession.role);
    db.collection("diskusi").add({
        materiId: materiId,
        pengirim: `${currentUserSession.nama} (${currentUserSession.sub})`,
        pesan: pesan,
        parentId: parentId,
        isGuru: isStaff,
        waktu: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        document.getElementById(`reply-msg-${parentId}`).value = "";
        document.getElementById(`reply-box-${parentId}`).style.display = 'none';
    }).catch(err => alert("Gagal membalas: " + err.message));
}

// ==========================================
// 11. MODAL PROFIL USER POJOK KANAN ATAS
// ==========================================
function openProfilSayaModal() {
    if (!currentUserSession || currentUserSession.role === "Tamu") {
        alert("Anda sedang masuk sebagai Tamu. Silakan keluar dan masuk menggunakan akun Siswa, Guru, atau Operator.");
        return;
    }

    const fotoEl = document.getElementById('modal-prof-foto');
    const validFoto = formatUrlGambar(currentUserSession.foto);
    const fotoSrc = validFoto !== ""
        ? validFoto
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUserSession.nama)}&background=4318ff&color=fff`;
    fotoEl.setAttribute("referrerpolicy", "no-referrer");
    fotoEl.src = fotoSrc;

    document.getElementById('modal-prof-judul').innerText = currentUserSession.nama;
    document.getElementById('modal-prof-role-info').innerText = `Status Akses: ${currentUserSession.role}`;

    if (currentUserSession.role === "Siswa") {
        document.getElementById('view-profil-siswa-readonly').style.display = 'block';
        document.getElementById('edit-profil-staff-form').style.display = 'none';

        document.getElementById('ro-siswa-nama').innerText = currentUserSession.nama || '-';
        document.getElementById('ro-siswa-nis').innerText = currentUserSession.nis || '-';
        document.getElementById('ro-siswa-jk').innerText = currentUserSession.jk || '-';
        document.getElementById('ro-siswa-kelas').innerText = currentUserSession.sub || '-';
    } else {
        document.getElementById('view-profil-siswa-readonly').style.display = 'none';
        document.getElementById('edit-profil-staff-form').style.display = 'block';

        document.getElementById('edit-prof-nama').value = currentUserSession.nama || '';
        document.getElementById('edit-prof-sub').value = currentUserSession.sub || '';
        document.getElementById('edit-prof-email').value = currentUserSession.email || '';
        document.getElementById('edit-prof-bio').value = currentUserSession.bio || '';
        document.getElementById('edit-prof-pass-baru').value = '';
    }

    document.getElementById('user-profile-modal').classList.remove('hidden');
}

function closeProfilSayaModal() {
    document.getElementById('user-profile-modal').classList.add('hidden');
}

function simpanEditProfilUser() {
    if (!currentUserSession || currentUserSession.role === "Tamu" || currentUserSession.role === "Siswa") return;

    const passBaru = document.getElementById('edit-prof-pass-baru').value.trim();
    if (passBaru !== "") {
        const errPass = validasiKekuatanPassword(passBaru);
        if (errPass) return alert(errPass);
    }

    currentUserSession.nama = document.getElementById('edit-prof-nama').value.trim() || currentUserSession.nama;
    currentUserSession.sub = document.getElementById('edit-prof-sub').value.trim() || currentUserSession.sub;
    currentUserSession.email = document.getElementById('edit-prof-email').value.trim();
    currentUserSession.bio = document.getElementById('edit-prof-bio').value.trim();

    localStorage.setItem("sman2bayan_session", JSON.stringify(currentUserSession));
    updateHeaderUserUI();

    if (currentUserSession.uid && currentUserSession.uid !== "tamu") {
        db.collection("users_sekolah").doc(currentUserSession.uid).set(currentUserSession, { merge: true }).catch(() => {});
    }

    if (passBaru !== "" && auth.currentUser) {
        auth.currentUser.updatePassword(passBaru).then(() => {
            alert("Profil dan Password baru Anda berhasil diperbarui!");
            closeProfilSayaModal();
        }).catch(() => {
            alert("Data profil tersimpan! Untuk mengganti password login, silakan keluar (Logout) lalu masuk kembali terlebih dahulu.");
            closeProfilSayaModal();
        });
    } else {
        alert("Profil akun berhasil diperbarui!");
        closeProfilSayaModal();
    }
}

// ==========================================
// 12. DARK MODE & NOTIFIKASI MODERN
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('sman2bayan_darkmode', isDark ? '1' : '0');
    const btn = document.getElementById('btn-dark-mode');
    if (btn) btn.innerHTML = isDark ? '<i class="fa-solid fa-sun" style="color:#f59e0b;"></i>' : '<i class="fa-solid fa-moon"></i>';
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
        const isSuccess = String(pesan).toLowerCase().includes('berhasil') || String(pesan).toLowerCase().includes('diperbarui') || String(pesan).toLowerCase().includes('selamat datang');
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
// 13. PENGUMPULAN TUGAS & CEK NILAI SISWA
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
