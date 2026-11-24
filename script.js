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
// UTILITAS KEAMANAN, KONVERTER GAMBAR & KOMPRESI KAMERA
// ==========================================
function escapeHtml(str) {
    return String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatUrlGambar(rawUrl) {
    if (!rawUrl) return "";
    let url = String(rawUrl).trim();
    if (!url) return "";

    if (url.startsWith("data:image/")) {
        return url;
    }

    if (!/^https?:\/\//i.test(url) && !url.startsWith("images/") && !url.startsWith("./")) {
        url = "https://" + url;
    }

    const gdriveMatch = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/);
    if (gdriveMatch && gdriveMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${gdriveMatch[1]}`;
    }

    return url;
}

function kompresFotoKamera(file, maxWidth = 800, quality = 0.72) {
    return new Promise((resolve, reject) => {
        if (!file) return reject(new Error("Tidak ada file gambar dipilih."));
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;
                if (width > maxWidth) {
                    height = Math.round((height * maxWidth) / width);
                    width = maxWidth;
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", quality));
            };
            img.onerror = () => reject(new Error("Gagal memproses gambar dari kamera."));
            img.src = e.target.result;
        };
        reader.onerror = () => reject(new Error("Gagal membaca file kamera."));
        reader.readAsDataURL(file);
    });
}

function handleInputKamera(inputEl, targetUrlInputId, previewImgId) {
    const file = inputEl.files && inputEl.files[0];
    if (!file) return;
    kompresFotoKamera(file).then((base64Data) => {
        const targetInput = document.getElementById(targetUrlInputId);
        if (targetInput) targetInput.value = base64Data;
        const previewImg = document.getElementById(previewImgId);
        if (previewImg) {
            previewImg.src = base64Data;
            previewImg.style.display = "block";
        }
    }).catch((err) => {
        alert(err.message);
    });
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

let PENGATURAN_PANEL = {
    pilketosAktif: true,
    alasanPilketosNonaktif: "Pemilihan Ketua & Wakil Ketua OSIS belum dibuka karena masih dalam tahap verifikasi kandidat.",
    guruFavoritAktif: true,
    alasanGuruFavoritNonaktif: "Pemilihan Guru Terbaik belum dibuka. Jadwal pemungutan suara akan diumumkan oleh Operator Sekolah."
};

let daftarGuruTendikCache = [];
let currentUserSession = null;
let selectedStaffLoginType = "guru";
let isRegisterGuruMode = false;
let isAktivasiSiswaMode = false;
let currentMateriList = [];
let selectedMapelAktif = "Fisika";
let carouselInterval = null;
let currentSlideIndex = 0;

const contentDiv = document.getElementById('app-content');

const subjectsList = [
    { name: "Pend. Agama", icon: "fa-book-quran", grad: "linear-gradient(135deg, #05cd99, #02946d)", active: true },
    { name: "Pend. Pancasila", icon: "fa-landmark", grad: "linear-gradient(135deg, #ff5b5c, #d93839)", active: true },
    { name: "Bahasa Indonesia", icon: "fa-book-open", grad: "linear-gradient(135deg, #4318ff, #290bb4)", active: true },
    { name: "Matematika", icon: "fa-calculator", grad: "linear-gradient(135deg, #ff416c, #ff4b2b)", active: true },
    { name: "Bahasa Inggris", icon: "fa-language", grad: "linear-gradient(135deg, #00c6ff, #0072ff)", active: true },
    { name: "Sejarah", icon: "fa-hourglass-half", grad: "linear-gradient(135deg, #cb2d3e, #ef473a)", active: true },
    { name: "PJOK", icon: "fa-volleyball", grad: "linear-gradient(135deg, #f7971e, #ffd200)", active: true },
    { name: "Seni & Prakarya", icon: "fa-palette", grad: "linear-gradient(135deg, #8e2de2, #4a00e0)", active: true },
    { name: "Informatika", icon: "fa-laptop-code", grad: "linear-gradient(135deg, #11998e, #38ef7d)", active: true },
    { name: "Biologi", icon: "fa-leaf", grad: "linear-gradient(135deg, #56ab2f, #a8e063)", active: true },
    { name: "Kimia", icon: "fa-flask", grad: "linear-gradient(135deg, #f2994a, #f2c94c)", active: true },
    { name: "Fisika", icon: "fa-atom", grad: "linear-gradient(135deg, #ff9f43, #ff6b6b)", active: true },
    { name: "MTK Lanjut", icon: "fa-square-root-variable", grad: "linear-gradient(135deg, #ec008c, #fc6767)", active: true },
    { name: "Sosiologi", icon: "fa-users", grad: "linear-gradient(135deg, #3a1c71, #d76d77)", active: true },
    { name: "Ekonomi", icon: "fa-chart-line", grad: "linear-gradient(135deg, #159957, #155799)", active: true },
    { name: "Geografi", icon: "fa-earth-asia", grad: "linear-gradient(135deg, #2193b0, #6dd5ed)", active: true },
    { name: "Antropologi", icon: "fa-masks-theater", grad: "linear-gradient(135deg, #cc2b5e, #753a88)", active: true },
    { name: "PKWU", icon: "fa-lightbulb", grad: "linear-gradient(135deg, #e65c00, #f9d423)", active: true }
];

// ==========================================
// 3. SISTEM NOTIFIKASI REAL-TIME
// ==========================================
let notifikasiListCache = [];

function inisialisasiNotifikasiRealtime() {
    const raw = sessionStorage.getItem("sman2bayan_session") || localStorage.getItem("sman2bayan_session");
    const btnLonceng = document.getElementById("btn-lonceng-notif");
    if (!raw) {
        if (btnLonceng) btnLonceng.style.display = "none";
        return;
    }
    if (btnLonceng) btnLonceng.style.display = "inline-flex";

    db.collection("notifikasi_sistem")
        .orderBy("timestamp", "desc")
        .limit(25)
        .onSnapshot((snapshot) => {
            notifikasiListCache = [];
            const lastRead = Number(localStorage.getItem("sman2bayan_notif_last_read") || "0");
            let unreadCount = 0;

            snapshot.forEach((doc) => {
                const d = { id: doc.id, ...doc.data() };
                const target = d.targetRole || "SEMUA";
                const userRole = currentUserSession ? currentUserSession.role : "Tamu";
                const cocokRole =
                    target === "SEMUA" ||
                    (target === "STAFF" && ["Operator", "Guru", "Guru / Staf"].includes(userRole)) ||
                    (target === "SISWA" && userRole === "Siswa");

                if (cocokRole) {
                    notifikasiListCache.push(d);
                    const ts = d.timestamp && d.timestamp.toMillis ? d.timestamp.toMillis() : 0;
                    if (ts > lastRead) unreadCount++;
                }
            });

            const badge = document.getElementById('notif-badge-count');
            if (badge) {
                if (unreadCount > 0) {
                    badge.style.display = "flex";
                    badge.innerText = unreadCount > 9 ? "9+" : String(unreadCount);
                } else {
                    badge.style.display = "none";
                }
            }
        }, () => {});
}

function togglePanelNotifikasi() {
    const panel = document.getElementById('panel-notifikasi-sekolah');
    if (!panel) return;
    if (panel.style.display === 'none' || panel.style.display === '') {
        panel.style.display = 'block';
        renderDaftarNotifikasi();
        localStorage.setItem("sman2bayan_notif_last_read", String(Date.now()));
        const badge = document.getElementById('notif-badge-count');
        if (badge) badge.style.display = "none";
    } else {
        panel.style.display = 'none';
    }
}

function renderDaftarNotifikasi() {
    const container = document.getElementById('list-notifikasi-sekolah');
    if (!container) return;

    if (notifikasiListCache.length === 0) {
        container.innerHTML = `<div style="text-align:center; padding:30px 15px; color:#8f9bba; font-size:0.85rem;">Belum ada pembaruan aktivitas terbaru.</div>`;
        return;
    }

    container.innerHTML = notifikasiListCache.map(n => {
        let icon = "fa-bell";
        let bg = "#eef2ff";
        let color = "#4318ff";
        if (n.tipe === "MATERI") { icon = "fa-book-open"; bg = "#e0e7ff"; color = "#4318ff"; }
        else if (n.tipe === "ABSENSI") { icon = "fa-qrcode"; bg = "#dcfce7"; color = "#05cd99"; }
        else if (n.tipe === "PENGUMUMAN") { icon = "fa-bullhorn"; bg = "#fef3c7"; color = "#f59e0b"; }
        else if (n.tipe === "DISKUSI") { icon = "fa-comments"; bg = "#f3e8ff"; color = "#8b5cf6"; }
        else if (n.tipe === "VOTING") { icon = "fa-check-to-slot"; bg = "#fee2e2"; color = "#ef4444"; }

        const waktu = n.timestamp && n.timestamp.toDate
            ? n.timestamp.toDate().toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
            : "Baru saja";

        return `
        <div onclick="klikItemNotifikasi('${escapeHtml(n.targetNav || "home")}')" style="padding:12px 15px; border-bottom:1px solid #f1f5f9; display:flex; gap:10px; align-items:flex-start; cursor:pointer; transition:0.2s;" onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='#fff'">
            <div style="width:34px; height:34px; border-radius:10px; background:${bg}; color:${color}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-size:0.9rem;">
                <i class="fa-solid ${icon}"></i>
            </div>
            <div style="flex:1; min-width:0;">
                <div style="font-size:0.82rem; font-weight:700; color:#1b254b; line-height:1.3;">${escapeHtml(n.judul || "Info Sekolah")}</div>
                <div style="font-size:0.76rem; color:#5a6a85; margin-top:2px; line-height:1.4;">${escapeHtml(n.pesan || "")}</div>
                <div style="font-size:0.68rem; color:#8f9bba; margin-top:4px;"><i class="fa-regular fa-clock"></i> ${waktu}</div>
            </div>
        </div>`;
    }).join('');
}

function klikItemNotifikasi(targetNav) {
    const panel = document.getElementById('panel-notifikasi-sekolah');
    if (panel) panel.style.display = 'none';
    if (targetNav === "absensi") window.location.href = "absen.html";
    else if (targetNav === "guru_panel") window.location.href = "guru.html";
    else {
        const navBtn = document.getElementById("nav-" + targetNav);
        if (navBtn) navBtn.click();
    }
}

function catatNotifikasiSistem(tipe, judul, pesan, targetRole = "SEMUA", targetNav = "home") {
    db.collection("notifikasi_sistem").add({
        tipe,
        judul,
        pesan,
        targetRole,
        targetNav,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(() => {});
}

// ==========================================
// 4. KONTROL HAK AKSES MENU & INISIALISASI SESI
// ==========================================
function terapkanAksesMenuBerdasarkanRole() {
    const raw = sessionStorage.getItem("sman2bayan_session") || localStorage.getItem("sman2bayan_session");
    if (raw) {
        try {
            currentUserSession = JSON.parse(raw);
            // Sinkronkan ke kedua storage agar konsisten antar tab
            sessionStorage.setItem("sman2bayan_session", raw);
            localStorage.setItem("sman2bayan_session", raw);
        } catch (e) {
            currentUserSession = null;
        }
    } else {
        currentUserSession = null;
    }

    const role = currentUserSession ? currentUserSession.role : "Tamu";
    const isLoggedIn = !!currentUserSession;
    const isStaff = ["Operator", "Guru", "Guru / Staf"].includes(role);
    const isOperator = role === "Operator";
    const isSiswa = role === "Siswa";

    const aturTampil = (id, tampil) => {
        const el = document.getElementById(id);
        if (el) el.style.display = tampil ? "" : "none";
    };

    aturTampil("nav-home", true);
    aturTampil("nav-materi", isLoggedIn);
    aturTampil("nav-ekskul", isLoggedIn);
    aturTampil("nav-galeri", isLoggedIn);
    aturTampil("nav-voting", isLoggedIn);
    aturTampil("nav-kartu", isSiswa || isOperator);
    aturTampil("nav-absensi", isLoggedIn);
    aturTampil("nav-display", isOperator);
    aturTampil("nav-guru", isStaff);

    if (isOperator) {
        aturTampil("nav-voting", true);
        const navVoting = document.getElementById("nav-voting");
        if (navVoting) navVoting.innerHTML = `<i class="fa-solid fa-sliders"></i> Kelola Panel & Voting`;
    } else {
        const navVoting = document.getElementById("nav-voting");
        if (navVoting) navVoting.innerHTML = `<i class="fa-solid fa-check-to-slot"></i> E-Voting`;
    }

    const btnLonceng = document.getElementById("btn-lonceng-notif");
    if (btnLonceng) {
        btnLonceng.style.display = isLoggedIn ? "inline-flex" : "none";
    }
}

function updateNavbarSessionUI() {
    const raw = sessionStorage.getItem("sman2bayan_session") || localStorage.getItem("sman2bayan_session");
    const btnLogin = document.getElementById("btn-login-nav");
    const badgeUser = document.getElementById("user-session-badge");
    const nameEl = document.getElementById("session-user-name");
    const roleEl = document.getElementById("session-user-role");

    terapkanAksesMenuBerdasarkanRole();

    if (raw) {
        try {
            currentUserSession = JSON.parse(raw);
            if (btnLogin) btnLogin.style.display = "none";
            if (badgeUser) badgeUser.style.display = "flex";
            if (nameEl) nameEl.innerText = currentUserSession.nama || "Pengguna";
            if (roleEl) {
                if (currentUserSession.role === "Siswa") {
                    roleEl.innerText = `${currentUserSession.kelas || "Siswa"} • ${currentUserSession.nisn || ""}`;
                } else {
                    roleEl.innerText = `${currentUserSession.role}${currentUserSession.mapel ? " • " + currentUserSession.mapel : ""}`;
                }
            }
            return;
        } catch (e) {}
    }

    currentUserSession = null;
    if (btnLogin) btnLogin.style.display = "inline-flex";
    if (badgeUser) badgeUser.style.display = "none";
}

function bukaModalLogin(defaultTab = "siswa") {
    const modal = document.getElementById("modal-login-portal");
    if (modal) {
        modal.style.display = "flex";
        switchLoginTab(defaultTab);
    }
}

function tutupModalLogin() {
    const modal = document.getElementById("modal-login-portal");
    if (modal) modal.style.display = "none";
}

function switchLoginTab(tab) {
    const tabSiswa = document.getElementById("tab-login-siswa");
    const tabGuru = document.getElementById("tab-login-guru");
    const formSiswa = document.getElementById("form-login-siswa");
    const formGuru = document.getElementById("form-login-guru");

    if (tab === "siswa") {
        if (tabSiswa) { tabSiswa.style.background = "#4318ff"; tabSiswa.style.color = "#fff"; }
        if (tabGuru) { tabGuru.style.background = "transparent"; tabGuru.style.color = "#5a6a85"; }
        if (formSiswa) formSiswa.style.display = "block";
        if (formGuru) formGuru.style.display = "none";
        toggleModeAktivasiSiswa(false);
    } else {
        if (tabGuru) { tabGuru.style.background = "#4318ff"; tabGuru.style.color = "#fff"; }
        if (tabSiswa) { tabSiswa.style.background = "transparent"; tabSiswa.style.color = "#5a6a85"; }
        if (formGuru) formGuru.style.display = "block";
        if (formSiswa) formSiswa.style.display = "none";
        pilihRoleLoginStaff("guru");
        toggleModeRegisterGuru(false);
    }
}

function pilihRoleLoginStaff(roleType) {
    selectedStaffLoginType = roleType;
    const btnGuru = document.getElementById("btn-pilih-login-guru");
    const btnOp = document.getElementById("btn-pilih-login-operator");
    const areaLinkReg = document.getElementById("area-link-register-guru");
    const boxInfoOp = document.getElementById("box-info-login-operator");

    if (roleType === "operator") {
        if (btnOp) { btnOp.style.background = "#4318ff"; btnOp.style.color = "#fff"; btnOp.style.borderColor = "#4318ff"; }
        if (btnGuru) { btnGuru.style.background = "#f4f7fe"; btnGuru.style.color = "#5a6a85"; btnGuru.style.borderColor = "#e2e8f0"; }
        if (areaLinkReg) areaLinkReg.style.display = "none";
        if (boxInfoOp) boxInfoOp.style.display = "block";
        toggleModeRegisterGuru(false);
    } else {
        if (btnGuru) { btnGuru.style.background = "#4318ff"; btnGuru.style.color = "#fff"; btnGuru.style.borderColor = "#4318ff"; }
        if (btnOp) { btnOp.style.background = "#f4f7fe"; btnOp.style.color = "#5a6a85"; btnOp.style.borderColor = "#e2e8f0"; }
        if (areaLinkReg) areaLinkReg.style.display = "block";
        if (boxInfoOp) boxInfoOp.style.display = "none";
    }
}

function toggleModeAktivasiSiswa(forceState = null) {
    isAktivasiSiswaMode = forceState !== null ? forceState : !isAktivasiSiswaMode;
    const areaRegister = document.getElementById("area-aktivasi-siswa-baru");
    const btnSubmit = document.getElementById("btn-submit-siswa");
    const linkToggle = document.getElementById("link-toggle-aktivasi-siswa");
    const teksInfo = document.getElementById("teks-info-aktivasi-siswa");
    const labelPin = document.getElementById("label-pin-siswa");
    const inputPin = document.getElementById("login-pin-siswa");

    if (isAktivasiSiswaMode) {
        if (areaRegister) areaRegister.style.display = "block";
        if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-user-check"></i> Simpan & Masuk ke Portal`;
        if (labelPin) labelPin.innerText = "Buat PIN / Kata Sandi Baru (Min. 4 Karakter)";
        if (inputPin) inputPin.placeholder = "Contoh: 123456 atau sman2bayan";
        if (teksInfo) teksInfo.innerText = "Sudah pernah mengaktifkan akun?";
        if (linkToggle) linkToggle.innerText = "Login Sekarang";
    } else {
        if (areaRegister) areaRegister.style.display = "none";
        if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal Belajar`;
        if (labelPin) labelPin.innerText = "PIN / Kata Sandi Siswa";
        if (inputPin) inputPin.placeholder = "Masukkan PIN / Kata Sandi Anda";
        if (teksInfo) teksInfo.innerText = "Siswa baru / belum pernah membuat PIN?";
        if (linkToggle) linkToggle.innerText = "Buat Akun / Aktivasi NISN";
    }
}

function toggleModeRegisterGuru(forceState = null) {
    isRegisterGuruMode = forceState !== null ? forceState : !isRegisterGuruMode;
    const areaRegister = document.getElementById("area-register-guru");
    const btnSubmit = document.getElementById("btn-submit-guru");
    const linkToggle = document.getElementById("link-toggle-register-guru");
    const teksInfo = document.getElementById("teks-info-register");

    if (isRegisterGuruMode) {
        if (areaRegister) areaRegister.style.display = "block";
        if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-user-plus"></i> Daftar & Masuk Panel`;
        if (teksInfo) teksInfo.innerText = "Sudah punya akun Guru/Staf?";
        if (linkToggle) linkToggle.innerText = "Login Sekarang";
    } else {
        if (areaRegister) areaRegister.style.display = "none";
        if (btnSubmit) btnSubmit.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal`;
        if (teksInfo) teksInfo.innerText = "Belum punya akun Guru?";
        if (linkToggle) linkToggle.innerText = "Daftar Akun Guru";
    }
}

async function prosesLoginSiswa() {
    const nisnInput = document.getElementById("login-nisn-siswa")?.value.trim() || "";
    const pinInput = document.getElementById("login-pin-siswa")?.value.trim() || "";
    const btn = document.getElementById("btn-submit-siswa");

    if (!nisnInput) return alert("Masukkan NISN Anda terlebih dahulu!");
    if (!pinInput || pinInput.length < 4) return alert("PIN / Kata Sandi minimal 4 karakter!");

    if (btn) { btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memverifikasi...`; }

    try {
        const snap = await db.collection("data_siswa").where("nisn", "==", nisnInput).limit(1).get();
        if (snap.empty) {
            alert("NISN tidak ditemukan di database sekolah! Pastikan NISN benar atau hubungi Operator Sekolah.");
            if (btn) {
                btn.disabled = false;
                btn.innerHTML = isAktivasiSiswaMode
                    ? `<i class="fa-solid fa-user-check"></i> Simpan & Masuk ke Portal`
                    : `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal Belajar`;
            }
            return;
        }

        const docSiswa = snap.docs[0];
        const dataSiswa = docSiswa.data();
        const pinTersimpan = dataSiswa.pin ? String(dataSiswa.pin).trim() : "";

        if (isAktivasiSiswaMode) {
            const konfirmasiPin = document.getElementById("reg-konfirmasi-pin-siswa")?.value.trim() || "";
            if (pinInput !== konfirmasiPin) {
                alert("Konfirmasi PIN / Kata Sandi tidak cocok!");
                if (btn) { btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-user-check"></i> Simpan & Masuk ke Portal`; }
                return;
            }
            if (pinTersimpan) {
                alert("NISN ini sudah memiliki akun aktif! Silakan langsung login menggunakan PIN Anda.");
                toggleModeAktivasiSiswa(false);
                if (btn) { btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal Belajar`; }
                return;
            }
            await db.collection("data_siswa").doc(docSiswa.id).update({
                pin: pinInput,
                akunAktif: true,
                waktuAktivasi: firebase.firestore.FieldValue.serverTimestamp()
            });
            alert(`Aktivasi berhasil! Selamat datang, ${dataSiswa.nama}.`);
        } else {
            if (!pinTersimpan) {
                alert("Akun NISN ini belum diaktifkan! Silakan klik 'Buat Akun / Aktivasi NISN' di bawah untuk membuat PIN pribadi Anda.");
                toggleModeAktivasiSiswa(true);
                if (btn) { btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-user-check"></i> Simpan & Masuk ke Portal`; }
                return;
            }
            if (pinInput !== pinTersimpan) {
                alert("PIN / Kata Sandi salah! Silakan periksa kembali atau hubungi Operator untuk reset PIN.");
                if (btn) { btn.disabled = false; btn.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal Belajar`; }
                return;
            }
        }

        const sessionObj = {
            id: docSiswa.id,
            role: "Siswa",
            nama: dataSiswa.nama,
            nisn: dataSiswa.nisn,
            kelas: dataSiswa.kelas,
            jk: dataSiswa.jk || "-"
        };
        const serialized = JSON.stringify(sessionObj);
        sessionStorage.setItem("sman2bayan_session", serialized);
        localStorage.setItem("sman2bayan_session", serialized);
        updateNavbarSessionUI();
        inisialisasiNotifikasiRealtime();
        tutupModalLogin();
        renderHome();
    } catch (err) {
        alert("Gagal terhubung ke server: " + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = isAktivasiSiswaMode
                ? `<i class="fa-solid fa-user-check"></i> Simpan & Masuk ke Portal`
                : `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal Belajar`;
        }
    }
}
async function prosesLoginGuruAtauOperator() {
    const email = document.getElementById("login-email-guru")?.value.trim().toLowerCase() || "";
    const password = document.getElementById("login-pass-guru")?.value.trim() || "";
    const btn = document.getElementById("btn-submit-guru");

    if (!email || !password) return alert("Email dan kata sandi wajib diisi!");
    if (btn) { btn.disabled = true; btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Memproses...`; }

    try {
        if (isRegisterGuruMode) {
            if (selectedStaffLoginType === "operator") {
                throw new Error("Pendaftaran akun Operator tidak dibuka secara publik.");
            }
            const nama = document.getElementById("reg-nama-guru")?.value.trim() || "";
            const nip = document.getElementById("reg-nip-guru")?.value.trim() || "-";
            const mapel = document.getElementById("reg-mapel-guru")?.value || "Fisika";
            if (!nama) throw new Error("Nama lengkap & gelar wajib diisi!");

            const cred = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection("akun_pengguna").doc(cred.user.uid).set({
                uid: cred.user.uid,
                nama,
                nip,
                email,
                mapel,
                role: "Guru",
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            const sessionObj = { uid: cred.user.uid, role: "Guru", nama, nip, email, mapel };
            const serialized = JSON.stringify(sessionObj);
            sessionStorage.setItem("sman2bayan_session", serialized);
            localStorage.setItem("sman2bayan_session", serialized);
            updateNavbarSessionUI();
            inisialisasiNotifikasiRealtime();
            tutupModalLogin();
            renderHome();
            alert("Pendaftaran akun Guru berhasil! Anda sekarang masuk sebagai " + nama);
        } else {
            const cred = await auth.signInWithEmailAndPassword(email, password);
            const uid = cred.user.uid;
            const userDoc = await db.collection("akun_pengguna").doc(uid).get();

            let role = selectedStaffLoginType === "operator" ? "Operator" : "Guru";
            let nama = email.split("@")[0];
            let nip = "-";
            let mapel = "Fisika";

            if (userDoc.exists) {
                const d = userDoc.data();
                role = d.role || role;
                nama = d.nama || nama;
                nip = d.nip || "-";
                mapel = d.mapel || "Fisika";

                if (selectedStaffLoginType === "operator" && role !== "Operator") {
                    await auth.signOut();
                    throw new Error("Akun ini terdaftar sebagai Guru, bukan Operator Sekolah. Silakan login melalui tab Guru.");
                }
            } else {
                if (selectedStaffLoginType === "operator") {
                    role = "Operator";
                    nama = "Operator SMAN 2 Bayan";
                    mapel = "Semua Mapel";
                } else {
                    role = "Guru";
                }
                await db.collection("akun_pengguna").doc(uid).set({
                    uid,
                    nama,
                    nip,
                    email,
                    mapel,
                    role,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            const sessionObj = { uid, role, nama, nip, email, mapel };
            const serialized = JSON.stringify(sessionObj);
            sessionStorage.setItem("sman2bayan_session", serialized);
            localStorage.setItem("sman2bayan_session", serialized);
            updateNavbarSessionUI();
            inisialisasiNotifikasiRealtime();
            tutupModalLogin();
            renderHome();
        }
    } catch (err) {
        let msg = err.message;
        if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
            msg = "Email atau kata sandi salah! Pastikan akun sudah terdaftar di sistem.";
        } else if (err.code === "auth/email-already-in-use") {
            msg = "Email ini sudah terdaftar! Silakan klik 'Login Sekarang' di bawah.";
        } else if (err.code === "auth/weak-password") {
            msg = "Kata sandi minimal 6 karakter!";
        }
        alert(msg);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = isRegisterGuruMode
                ? `<i class="fa-solid fa-user-plus"></i> Daftar & Masuk Panel`
                : `<i class="fa-solid fa-right-to-bracket"></i> Masuk ke Portal`;
        }
    }
}

async function logoutPortal() {
    if (!confirm("Keluar dari akun Anda saat ini?")) return;
    try { await auth.signOut(); } catch (e) {}
    sessionStorage.removeItem("sman2bayan_session");
    localStorage.removeItem("sman2bayan_session");
    currentUserSession = null;
    updateNavbarSessionUI();
    renderHome();
}

function isPenggunaGuruAtauOperator() {
    return currentUserSession && ["Operator", "Guru", "Guru / Staf"].includes(currentUserSession.role);
}

function isPenggunaOperator() {
    return currentUserSession && currentUserSession.role === "Operator";
}

function renderBannerTamuTerbatas(judulFitur) {
    return `
        <div class="card" style="text-align:center; padding:45px 25px; border-top:5px solid #4318ff; max-width:650px; margin:20px auto;">
            <div style="width:72px; height:72px; border-radius:50%; background:#eef2ff; color:#4318ff; display:flex; align-items:center; justify-content:center; font-size:2rem; margin:0 auto 15px;">
                <i class="fa-solid fa-lock"></i>
            </div>
            <h2 style="color:#1b254b; margin-bottom:8px;">Akses Terbatas: ${escapeHtml(judulFitur)}</h2>
            <p style="color:#5a6a85; font-size:0.95rem; line-height:1.6; margin-bottom:22px;">
                Halaman ini hanya dapat diakses oleh <strong>Siswa, Guru, atau Operator SMAN 2 Bayan</strong> yang telah masuk ke portal.
                Pengunjung umum hanya dapat melihat halaman <strong>Beranda & Informasi Sekolah</strong>.
            </p>
            <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                <button class="btn-primary" style="width:auto; padding:12px 24px;" onclick="bukaModalLogin('siswa')">
                    <i class="fa-solid fa-user-graduate"></i> Login Siswa (NISN)
                </button>
                <button class="btn-primary" style="width:auto; padding:12px 24px; background:#05cd99;" onclick="bukaModalLogin('guru')">
                    <i class="fa-solid fa-chalkboard-user"></i> Login Guru / Operator
                </button>
            </div>
        </div>
    `;
}

// ==========================================
// 5. SINKRONISASI DATA PROFIL & PENGATURAN PANEL
// ==========================================
function muatDataGuruDariFirebase() {
    db.collection("profil_guru").doc("utama").onSnapshot((doc) => {
        if (doc.exists) {
            const d = doc.data();
            GURU_DATA = { ...GURU_DATA, ...d };
            if (document.getElementById('nav-home')?.classList.contains('active')) {
                renderProfilGuruCard();
            }
        }
    });

    db.collection("profil_tendik").onSnapshot((snap) => {
        const list = [];
        snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
        list.sort((a, b) => (Number(a.urutan) || 99) - (Number(b.urutan) || 99));
        daftarGuruTendikCache = list;
        if (document.getElementById('nav-home')?.classList.contains('active')) {
            renderProfilGuruCard();
        }
    });

    db.collection("pengaturan_sekolah").doc("panel_voting").onSnapshot((doc) => {
        if (doc.exists) {
            PENGATURAN_PANEL = { ...PENGATURAN_PANEL, ...doc.data() };
            if (document.getElementById('nav-voting')?.classList.contains('active')) {
                renderVoting();
            }
        }
    });
}

// ==========================================
// 6. MENU 1: BERANDA (LENGKAP DENGAN SLIDER, TENDIK & INFO)
// ==========================================
function renderHome() {
    if (carouselInterval) clearInterval(carouselInterval);

    const role = currentUserSession ? currentUserSession.role : "Tamu";
    const isStaff = isPenggunaGuruAtauOperator();
    const isOperator = isPenggunaOperator();
    const isLoggedIn = !!currentUserSession;

    let heroSlidesHTML = HERO_SLIDES.map((s, idx) => `
        <div class="hero-slide ${idx === 0 ? 'active' : ''}" id="hero-slide-${idx}">
            <img src="${s.img}" onerror="this.onerror=null; this.src='${s.fallback}';" alt="Slide ${idx + 1}">
            <div class="hero-overlay">
                <span class="badge-npsn">${s.badge}</span>
                <h1>${s.title}</h1>
                <p>${s.sub}</p>
            </div>
        </div>
    `).join('');

    let heroDotsHTML = HERO_SLIDES.map((_, idx) => `
        <span class="hero-dot ${idx === 0 ? 'active' : ''}" id="hero-dot-${idx}" onclick="goToHeroSlide(${idx})"></span>
    `).join('');

    contentDiv.innerHTML = `
        <div class="hero-banner">
            <div class="hero-slides" id="hero-slides-container">
                ${heroSlidesHTML}
            </div>
            <button class="hero-nav-btn prev" onclick="prevHeroSlide()" aria-label="Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
            <button class="hero-nav-btn next" onclick="nextHeroSlide()" aria-label="Selanjutnya"><i class="fa-solid fa-chevron-right"></i></button>
            <div class="hero-dots">${heroDotsHTML}</div>
        </div>

        <div class="welcome-strip" style="background:linear-gradient(135deg, #4318ff, #7551ff); color:#fff; padding:18px 25px; border-radius:20px; margin-bottom:25px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:15px;">
            <div>
                <h3 style="margin:0 0 4px 0; font-size:1.15rem;">
                    ${isLoggedIn
                        ? `Selamat Datang, ${escapeHtml(currentUserSession.nama)}!`
                        : `Selamat Datang di Portal Digital ${DATA_SEKOLAH.nama}`}
                </h3>
                <p style="margin:0; font-size:0.85rem; opacity:0.9;">
                    ${role === "Operator"
                        ? "Anda masuk sebagai <strong>Operator Sekolah</strong>. Anda memiliki akses penuh mengelola profil PTK, materi, informasi, dan panel E-Voting."
                        : role === "Guru" || role === "Guru / Staf"
                        ? `Anda masuk sebagai <strong>Guru (${escapeHtml(currentUserSession.mapel || "Mapel")})</strong>. Silakan kelola materi pelajaran atau absensi siswa.`
                        : role === "Siswa"
                        ? `Kelas <strong>${escapeHtml(currentUserSession.kelas)}</strong> • NISN: ${escapeHtml(currentUserSession.nisn)}. Silakan pilih mata pelajaran untuk mulai belajar.`
                        : "Anda sedang mengakses halaman publik sekolah. Silakan login menggunakan NISN (Siswa) atau Email (Guru/Operator) untuk membuka fitur pembelajaran."}
                </p>
            </div>
            ${!isLoggedIn ? `
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button onclick="bukaModalLogin('siswa')" style="background:#fff; color:#4318ff; border:none; padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                        <i class="fa-solid fa-user-graduate"></i> Login Siswa
                    </button>
                    <button onclick="bukaModalLogin('guru')" style="background:rgba(255,255,255,0.2); color:#fff; border:1px solid rgba(255,255,255,0.4); padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                        <i class="fa-solid fa-user-tie"></i> Login Guru / Operator
                    </button>
                </div>
            ` : `
                <div style="display:flex; gap:10px; flex-wrap:wrap;">
                    <button onclick="document.getElementById('nav-materi').click()" style="background:#fff; color:#4318ff; border:none; padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer; font-size:0.85rem;">
                        <i class="fa-solid fa-book-open"></i> Mulai Belajar
                    </button>
                    <a href="absen.html" style="background:#05cd99; color:#fff; text-decoration:none; padding:10px 18px; border-radius:12px; font-weight:700; font-size:0.85rem; display:inline-flex; align-items:center; gap:6px;">
                        <i class="fa-solid fa-qrcode"></i> Absensi QR
                    </a>
                </div>
            `}
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-icon" style="background:#e0e7ff; color:#4318ff;"><i class="fa-solid fa-users"></i></div>
                <div><div style="font-size:0.78rem; color:#8f9bba; font-weight:600;">Peserta Didik</div><div style="font-size:1.3rem; font-weight:800; color:#1b254b;">${DATA_SEKOLAH.jmlSiswa}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:#dcfce7; color:#05cd99;"><i class="fa-solid fa-chalkboard-user"></i></div>
                <div><div style="font-size:0.78rem; color:#8f9bba; font-weight:600;">Guru & Tendik</div><div style="font-size:1.3rem; font-weight:800; color:#1b254b;">${DATA_SEKOLAH.jmlGuru} PTK</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:#fef3c7; color:#ffb547;"><i class="fa-solid fa-school"></i></div>
                <div><div style="font-size:0.78rem; color:#8f9bba; font-weight:600;">Rombongan Belajar</div><div style="font-size:1.3rem; font-weight:800; color:#1b254b;">${DATA_SEKOLAH.jmlRombel}</div></div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background:#fee2e2; color:#ff5b5c;"><i class="fa-solid fa-award"></i></div>
                <div><div style="font-size:0.78rem; color:#8f9bba; font-weight:600;">Kurikulum</div><div style="font-size:1.1rem; font-weight:800; color:#1b254b;">Merdeka</div></div>
            </div>
        </div>

        <!-- SEKSI PROFIL KEPALA SEKOLAH, GURU & TENAGA KEPENDIDIKAN -->
        <div class="card" style="margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px; border-bottom:1px solid #f0f3f8; padding-bottom:12px;">
                <div>
                    <h3 style="margin:0; color:#1b254b; font-size:1.15rem;"><i class="fa-solid fa-id-card-clip" style="color:#4318ff;"></i> Pimpinan, Guru & Tenaga Kependidikan</h3>
                    <p style="margin:3px 0 0 0; font-size:0.82rem; color:#8f9bba;">Profil pendidik dan tenaga kependidikan SMA Negeri 2 Bayan</p>
                </div>
                ${isOperator ? `
                    <button onclick="bukaModalKelolaTendik()" class="btn-primary" style="width:auto; padding:9px 16px; font-size:0.82rem; background:#4318ff;">
                        <i class="fa-solid fa-user-pen"></i> Kelola Profil PTK (Operator)
                    </button>
                ` : ""}
            </div>
            <div id="wadah-profil-tendik" class="grid-cards"></div>
        </div>

        <!-- PAPAN PENGUMUMAN & INFORMASI SEKOLAH -->
        <div class="card" style="margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px; border-bottom:1px solid #f0f3f8; padding-bottom:12px;">
                <div>
                    <h3 style="margin:0; color:#1b254b; font-size:1.15rem;"><i class="fa-solid fa-bullhorn" style="color:#ffb547;"></i> Papan Pengumuman & Informasi Sekolah</h3>
                    <p style="margin:3px 0 0 0; font-size:0.82rem; color:#8f9bba;">Agenda kegiatan, pengumuman ujian, dan informasi resmi sekolah</p>
                </div>
                ${isStaff ? `
                    <button onclick="bukaModalTambahInfo()" class="btn-primary" style="width:auto; padding:9px 16px; font-size:0.82rem; background:#05cd99;">
                        <i class="fa-solid fa-plus"></i> Buat Pengumuman
                    </button>
                ` : ""}
            </div>
            <div id="list-pengumuman-sekolah" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">
                <p style="color:#8f9bba; font-size:0.85rem;">Memuat informasi sekolah...</p>
            </div>
        </div>

        <!-- AKSES CEPAT MATA PELAJARAN -->
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:18px;">
                <div>
                    <h3 style="margin:0; color:#1b254b; font-size:1.15rem;"><i class="fa-solid fa-layer-group" style="color:#4318ff;"></i> Rumpun Mata Pelajaran</h3>
                    <p style="margin:3px 0 0 0; font-size:0.82rem; color:#8f9bba;">Klik mata pelajaran untuk melihat materi pembelajaran</p>
                </div>
            </div>
            <div class="subject-grid">
                ${subjectsList.map(s => `
                    <div class="subject-card" onclick="bukaMapelDariBeranda('${escapeHtml(s.name)}')">
                        <div class="subject-icon" style="background:${s.grad};"><i class="fa-solid ${s.icon}"></i></div>
                        <div style="font-weight:700; font-size:0.85rem; color:#1b254b;">${escapeHtml(s.name)}</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    mulaiAutoCarousel();
    renderProfilGuruCard();
    muatPengumumanSekolah();
}

function mulaiAutoCarousel() {
    if (carouselInterval) clearInterval(carouselInterval);
    currentSlideIndex = 0;
    carouselInterval = setInterval(() => {
        nextHeroSlide();
    }, 5500);
}

function goToHeroSlide(index) {
    currentSlideIndex = index;
    HERO_SLIDES.forEach((_, idx) => {
        const slide = document.getElementById(`hero-slide-${idx}`);
        const dot = document.getElementById(`hero-dot-${idx}`);
        if (slide) slide.classList.toggle('active', idx === index);
        if (dot) dot.classList.toggle('active', idx === index);
    });
}

function nextHeroSlide() {
    const next = (currentSlideIndex + 1) % HERO_SLIDES.length;
    goToHeroSlide(next);
}

function prevHeroSlide() {
    const prev = (currentSlideIndex - 1 + HERO_SLIDES.length) % HERO_SLIDES.length;
    goToHeroSlide(prev);
}

function bukaMapelDariBeranda(namaMapel) {
    if (!currentUserSession) {
        alert("Silakan login terlebih dahulu sebagai Siswa atau Guru untuk membuka materi pelajaran.");
        bukaModalLogin('siswa');
        return;
    }
    selectedMapelAktif = namaMapel;
    document.getElementById('nav-materi').click();
}

function renderProfilGuruCard() {
    const container = document.getElementById('wadah-profil-tendik');
    if (!container) return;

    const daftarTampil = daftarGuruTendikCache.length > 0 ? daftarGuruTendikCache : [GURU_DATA];
    const isOperator = isPenggunaOperator();

    container.innerHTML = daftarTampil.map(g => {
        const fotoUrl = formatUrlGambar(g.foto) || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80";
        const badgeColor = (g.kategoriJabatan || "").includes("Kepala") ? "#4318ff"
            : (g.kategoriJabatan || "").includes("Wakil") ? "#05cd99" : "#ffb547";

        return `
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:18px; padding:18px; display:flex; gap:15px; align-items:flex-start; position:relative;">
            <img src="${fotoUrl}" onerror="this.onerror=null; this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(g.nama || 'PTK')}&background=4318ff&color=fff';"
                 style="width:76px; height:76px; border-radius:16px; object-fit:cover; border:2px solid #fff; box-shadow:0 4px 12px rgba(0,0,0,0.08); flex-shrink:0;">
            <div style="flex:1; min-width:0;">
                <span style="display:inline-block; background:${badgeColor}; color:#fff; font-size:0.68rem; font-weight:700; padding:3px 9px; border-radius:20px; margin-bottom:6px;">
                    ${escapeHtml(g.kategoriJabatan || "Guru Mata Pelajaran")}
                </span>
                <h4 style="margin:0 0 3px 0; color:#1b254b; font-size:0.98rem;">${escapeHtml(g.nama)}</h4>
                <div style="font-size:0.78rem; color:#5a6a85; font-weight:600;">${escapeHtml(g.jabatan || g.mapel || "-")}</div>
                <div style="font-size:0.72rem; color:#8f9bba; margin-top:2px;">NIP/NUPTK: ${escapeHtml(g.nip || "-")}</div>
                ${g.quote ? `<p style="font-size:0.75rem; font-style:italic; color:#475569; margin:8px 0 0 0; background:#fff; padding:6px 10px; border-radius:8px; border-left:3px solid ${badgeColor};">"${escapeHtml(g.quote)}"</p>` : ""}
                ${isOperator && g.id !== "utama" ? `
                    <div style="margin-top:10px; display:flex; gap:6px;">
                        <button onclick="editProfilTendik('${g.id}')" style="background:#eef2ff; color:#4318ff; border:none; padding:5px 10px; border-radius:8px; font-size:0.72rem; font-weight:700; cursor:pointer;"><i class="fa-solid fa-pen"></i> Edit</button>
                        <button onclick="hapusProfilTendik('${g.id}')" style="background:#fee2e2; color:#ef4444; border:none; padding:5px 10px; border-radius:8px; font-size:0.72rem; font-weight:700; cursor:pointer;"><i class="fa-solid fa-trash"></i> Hapus</button>
                    </div>
                ` : ""}
            </div>
        </div>`;
    }).join('');
}

function bukaModalKelolaTendik(editData = null) {
    if (!isPenggunaOperator()) return alert("Hanya Operator Sekolah yang dapat mengelola profil PTK.");

    const existing = document.getElementById("modal-kelola-tendik");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "modal-kelola-tendik";
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.innerHTML = `
        <div class="modal-box" style="max-width:520px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:#1b254b;"><i class="fa-solid fa-user-tie" style="color:#4318ff;"></i> ${editData ? "Edit Profil PTK" : "Tambah Profil Guru / Tendik"}</h3>
                <button onclick="document.getElementById('modal-kelola-tendik').remove()" style="background:none; border:none; font-size:1.3rem; cursor:pointer; color:#8f9bba;">&times;</button>
            </div>
            <input type="hidden" id="tendik-id" value="${editData ? editData.id : ""}">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div>
                    <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">Kategori Jabatan</label>
                    <select id="tendik-kategori" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
                        <option value="Kepala Sekolah" ${editData?.kategoriJabatan === "Kepala Sekolah" ? "selected" : ""}>Kepala Sekolah</option>
                        <option value="Wakil Kepala Sekolah" ${editData?.kategoriJabatan === "Wakil Kepala Sekolah" ? "selected" : ""}>Wakil Kepala Sekolah</option>
                        <option value="Guru Mata Pelajaran" ${!editData || editData?.kategoriJabatan === "Guru Mata Pelajaran" ? "selected" : ""}>Guru Mata Pelajaran</option>
                        <option value="Tata Usaha / Operator" ${editData?.kategoriJabatan === "Tata Usaha / Operator" ? "selected" : ""}>Tata Usaha / Operator</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">Urutan Tampil</label>
                    <input type="number" id="tendik-urutan" value="${editData?.urutan || 3}" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
                </div>
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">Nama Lengkap & Gelar</label>
                <input type="text" id="tendik-nama" value="${escapeHtml(editData?.nama || "")}" placeholder="Contoh: Drs. H. Ahmad, M.Pd." style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:10px;">
                <div>
                    <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">NIP / NUPTK</label>
                    <input type="text" id="tendik-nip" value="${escapeHtml(editData?.nip || "-")}" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
                </div>
                <div>
                    <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">Jabatan / Mapel</label>
                    <input type="text" id="tendik-jabatan" value="${escapeHtml(editData?.jabatan || "")}" placeholder="Guru Matematika" style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
                </div>
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">Foto Profil (URL Google Drive / Foto Langsung)</label>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="tendik-foto" value="${escapeHtml(editData?.foto || "")}" placeholder="https://..." style="flex:1; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
                    <label style="background:#eef2ff; color:#4318ff; padding:9px 12px; border-radius:10px; cursor:pointer; font-size:0.8rem; font-weight:700; display:flex; align-items:center; gap:5px;">
                        <i class="fa-solid fa-camera"></i> Foto
                        <input type="file" accept="image/*" style="display:none;" onchange="handleInputKamera(this, 'tendik-foto', 'preview-foto-tendik')">
                    </label>
                </div>
                <img id="preview-foto-tendik" src="${editData?.foto ? formatUrlGambar(editData.foto) : ""}" style="max-height:80px; border-radius:10px; margin-top:8px; display:${editData?.foto ? "block" : "none"};">
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-size:0.78rem; font-weight:700; display:block; margin-bottom:4px;">Motto / Kutipan Singkat</label>
                <input type="text" id="tendik-quote" value="${escapeHtml(editData?.quote || "")}" placeholder="Mendidik dengan hati..." style="width:100%; padding:9px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <button onclick="simpanProfilTendik()" class="btn-primary"><i class="fa-solid fa-floppy-disk"></i> Simpan Data PTK</button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function simpanProfilTendik() {
    const id = document.getElementById("tendik-id").value.trim();
    const payload = {
        kategoriJabatan: document.getElementById("tendik-kategori").value,
        urutan: Number(document.getElementById("tendik-urutan").value) || 99,
        nama: document.getElementById("tendik-nama").value.trim(),
        nip: document.getElementById("tendik-nip").value.trim() || "-",
        jabatan: document.getElementById("tendik-jabatan").value.trim(),
        foto: document.getElementById("tendik-foto").value.trim(),
        quote: document.getElementById("tendik-quote").value.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    if (!payload.nama) return alert("Nama PTK wajib diisi!");

    try {
        if (id) {
            await db.collection("profil_tendik").doc(id).update(payload);
        } else {
            await db.collection("profil_tendik").add(payload);
        }
        document.getElementById("modal-kelola-tendik")?.remove();
        alert("Profil PTK berhasil disimpan!");
    } catch (e) {
        alert("Gagal menyimpan profil: " + e.message);
    }
}

function editProfilTendik(id) {
    const data = daftarGuruTendikCache.find(item => item.id === id);
    if (data) bukaModalKelolaTendik(data);
}

async function hapusProfilTendik(id) {
    if (!confirm("Hapus profil PTK ini dari beranda?")) return;
    try {
        await db.collection("profil_tendik").doc(id).delete();
    } catch (e) {
        alert("Gagal menghapus: " + e.message);
    }
}

function muatPengumumanSekolah() {
    const container = document.getElementById('list-pengumuman-sekolah');
    if (!container) return;

    db.collection("informasi_sekolah").orderBy("timestamp", "desc").limit(6).onSnapshot((snap) => {
        if (snap.empty) {
            container.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:25px; color:#8f9bba; background:#f8fafc; border-radius:14px;">Belum ada pengumuman terbaru dari sekolah.</div>`;
            return;
        }
        const isStaff = isPenggunaGuruAtauOperator();
        container.innerHTML = snap.docs.map(doc => {
            const d = doc.data();
            const tgl = d.timestamp && d.timestamp.toDate
                ? d.timestamp.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
                : "Info Terbaru";
            return `
                <div style="background:#f8fafc; border:1px solid #e2e8f0; border-left:4px solid #4318ff; border-radius:14px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
                    <div>
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
                            <span style="font-size:0.7rem; font-weight:700; background:#eef2ff; color:#4318ff; padding:3px 9px; border-radius:20px;">${escapeHtml(d.kategori || "Pengumuman")}</span>
                            <span style="font-size:0.72rem; color:#8f9bba;">${tgl}</span>
                        </div>
                        <h4 style="margin:0 0 6px 0; color:#1b254b; font-size:0.95rem;">${escapeHtml(d.judul)}</h4>
                        <p style="margin:0; font-size:0.82rem; color:#5a6a85; line-height:1.5;">${escapeHtml(d.isi)}</p>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; padding-top:8px; border-top:1px solid #e2e8f0; font-size:0.72rem; color:#8f9bba;">
                        <span><i class="fa-solid fa-user-pen"></i> ${escapeHtml(d.penulis || "Admin Sekolah")}</span>
                        ${isStaff ? `<button onclick="hapusInfoSekolah('${doc.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:700;"><i class="fa-solid fa-trash"></i> Hapus</button>` : ""}
                    </div>
                </div>
            `;
        }).join('');
    });
}

function bukaModalTambahInfo() {
    if (!isPenggunaGuruAtauOperator()) return;
    const existing = document.getElementById("modal-tambah-info");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "modal-tambah-info";
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.innerHTML = `
        <div class="modal-box" style="max-width:460px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:#1b254b;"><i class="fa-solid fa-bullhorn" style="color:#ffb547;"></i> Buat Pengumuman Sekolah</h3>
                <button onclick="document.getElementById('modal-tambah-info').remove()" style="background:none; border:none; font-size:1.3rem; cursor:pointer;">&times;</button>
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Kategori</label>
                <select id="info-kategori" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                    <option value="Pengumuman Akademik">Pengumuman Akademik</option>
                    <option value="Agenda Kegiatan">Agenda Kegiatan</option>
                    <option value="Info Ujian / Asesmen">Info Ujian / Asesmen</option>
                    <option value="Prestasi Sekolah">Prestasi Sekolah</option>
                </select>
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Judul Pengumuman</label>
                <input type="text" id="info-judul" placeholder="Contoh: Jadwal Penilaian Akhir Semester" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Isi Informasi</label>
                <textarea id="info-isi" rows="4" placeholder="Tulis rincian informasi di sini..." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;"></textarea>
            </div>
            <button onclick="simpanInfoSekolah()" class="btn-primary"><i class="fa-solid fa-paper-plane"></i> Publikasikan Sekarang</button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function simpanInfoSekolah() {
    const kategori = document.getElementById("info-kategori").value;
    const judul = document.getElementById("info-judul").value.trim();
    const isi = document.getElementById("info-isi").value.trim();

    if (!judul || !isi) return alert("Judul dan isi pengumuman wajib diisi!");

    try {
        await db.collection("informasi_sekolah").add({
            kategori,
            judul,
            isi,
            penulis: currentUserSession?.nama || "Staf Sekolah",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        catatNotifikasiSistem("PENGUMUMAN", judul, isi.substring(0, 90) + "...", "SEMUA", "home");
        document.getElementById("modal-tambah-info")?.remove();
        alert("Pengumuman berhasil dipublikasikan!");
    } catch (e) {
        alert("Gagal menyimpan pengumuman: " + e.message);
    }
}

async function hapusInfoSekolah(id) {
    if (!confirm("Hapus pengumuman ini?")) return;
    try {
        await db.collection("informasi_sekolah").doc(id).delete();
    } catch (e) {
        alert("Gagal menghapus: " + e.message);
    }
}
// ==========================================
// 7. MENU 2: MATERI PELAJARAN & DISKUSI KELAS
// ==========================================
function renderMateri() {
    if (!currentUserSession) {
        contentDiv.innerHTML = renderBannerTamuTerbatas("Materi & Diskusi Kelas");
        return;
    }

    const isStaff = isPenggunaGuruAtauOperator();
    const mapelDefault = currentUserSession.mapel && currentUserSession.mapel !== "Semua Mapel"
        ? currentUserSession.mapel
        : selectedMapelAktif;
    selectedMapelAktif = mapelDefault;

    contentDiv.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:15px;">
                <div>
                    <h2 style="margin:0; color:#1b254b; font-size:1.3rem;"><i class="fa-solid fa-book-open-reader" style="color:#4318ff;"></i> Ruang Materi & Diskusi Pembelajaran</h2>
                    <p style="margin:4px 0 0 0; font-size:0.84rem; color:#5a6a85;">Pilih mata pelajaran dan jenjang kelas untuk membaca modul atau berdiskusi bersama guru</p>
                </div>
                ${isStaff ? `
                    <a href="guru.html" class="btn-primary" style="width:auto; padding:10px 18px; text-decoration:none; background:#05cd99; font-size:0.85rem;">
                        <i class="fa-solid fa-plus-circle"></i> Upload Materi / Soal di Panel Guru
                    </a>
                ` : ""}
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:12px; background:#f8fafc; padding:15px; border-radius:14px; border:1px solid #e2e8f0;">
                <div>
                    <label style="font-size:0.76rem; font-weight:700; color:#5a6a85; display:block; margin-bottom:4px;">Mata Pelajaran</label>
                    <select id="filter-mapel-materi" onchange="ubahFilterMateri()" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600; color:#1b254b;">
                        ${subjectsList.map(s => `<option value="${escapeHtml(s.name)}" ${s.name === selectedMapelAktif ? "selected" : ""}>${escapeHtml(s.name)}</option>`).join('')}
                    </select>
                </div>
                <div>
                    <label style="font-size:0.76rem; font-weight:700; color:#5a6a85; display:block; margin-bottom:4px;">Filter Kelas</label>
                    <select id="filter-kelas-materi" onchange="ubahFilterMateri()" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1; font-weight:600; color:#1b254b;">
                        <option value="SEMUA">Semua Jenjang (X, XI, XII)</option>
                        <option value="X" ${currentUserSession.kelas?.startsWith("X ") || currentUserSession.kelas === "X" ? "selected" : ""}>Kelas X</option>
                        <option value="XI" ${currentUserSession.kelas?.startsWith("XI ") || currentUserSession.kelas === "XI" ? "selected" : ""}>Kelas XI</option>
                        <option value="XII" ${currentUserSession.kelas?.startsWith("XII ") || currentUserSession.kelas === "XII" ? "selected" : ""}>Kelas XII</option>
                    </select>
                </div>
                <div>
                    <label style="font-size:0.76rem; font-weight:700; color:#5a6a85; display:block; margin-bottom:4px;">Cari Judul Materi</label>
                    <input type="text" id="cari-judul-materi" onkeyup="renderDaftarMateriFiltered()" placeholder="Ketik kata kunci..." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                </div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:20px; align-items:start;">
            <div id="wadah-daftar-materi" style="display:flex; flex-direction:column; gap:15px;">
                <div class="card" style="text-align:center; padding:30px; color:#8f9bba;">Memuat daftar materi...</div>
            </div>

            <!-- FORUM DISKUSI KELAS REAL-TIME -->
            <div class="card" style="position:sticky; top:90px;">
                <h3 style="margin:0 0 6px 0; color:#1b254b; font-size:1.05rem;"><i class="fa-solid fa-comments" style="color:#4318ff;"></i> Forum Tanya Jawab (<span id="label-mapel-diskusi">${escapeHtml(selectedMapelAktif)}</span>)</h3>
                <p style="margin:0 0 12px 0; font-size:0.78rem; color:#8f9bba;">Diskusi langsung antara siswa dan guru pengampu mata pelajaran</p>
                <div id="wadah-chat-diskusi" style="height:310px; overflow-y:auto; background:#f8fafc; border:1px solid #e2e8f0; border-radius:14px; padding:12px; display:flex; flex-direction:column; gap:10px; margin-bottom:12px;">
                    <div style="text-align:center; color:#8f9bba; font-size:0.8rem; margin-top:40px;">Memuat percakapan...</div>
                </div>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="input-pesan-diskusi" placeholder="Tulis pertanyaan atau tanggapan..." onkeypress="if(event.key==='Enter') kirimPesanDiskusi()" style="flex:1; padding:10px 12px; border-radius:12px; border:1px solid #cbd5e1; font-size:0.85rem;">
                    <button onclick="kirimPesanDiskusi()" class="btn-primary" style="width:auto; padding:10px 16px; border-radius:12px;"><i class="fa-solid fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;

    muatMateriDariFirestore();
    muatDiskusiMapel(selectedMapelAktif);
}

function ubahFilterMateri() {
    const mapelEl = document.getElementById("filter-mapel-materi");
    if (mapelEl) {
        selectedMapelAktif = mapelEl.value;
        const lbl = document.getElementById("label-mapel-diskusi");
        if (lbl) lbl.innerText = selectedMapelAktif;
        muatDiskusiMapel(selectedMapelAktif);
    }
    renderDaftarMateriFiltered();
}

function muatMateriDariFirestore() {
    db.collection("materi_pembelajaran").orderBy("timestamp", "desc").onSnapshot((snap) => {
        currentMateriList = [];
        snap.forEach(doc => currentMateriList.push({ id: doc.id, ...doc.data() }));
        renderDaftarMateriFiltered();
    }, (err) => {
        const wadah = document.getElementById("wadah-daftar-materi");
        if (wadah) wadah.innerHTML = `<div class="card" style="color:#ef4444;">Gagal memuat materi: ${escapeHtml(err.message)}</div>`;
    });
}

function renderDaftarMateriFiltered() {
    const wadah = document.getElementById("wadah-daftar-materi");
    if (!wadah) return;

    const mapelFilter = document.getElementById("filter-mapel-materi")?.value || selectedMapelAktif;
    const kelasFilter = document.getElementById("filter-kelas-materi")?.value || "SEMUA";
    const keyword = (document.getElementById("cari-judul-materi")?.value || "").toLowerCase().trim();

    const hasil = currentMateriList.filter(m => {
        const mapelMateri = m.mapel || "Fisika";
        const cocokMapel = mapelMateri.toLowerCase() === mapelFilter.toLowerCase();
        const cocokKelas = kelasFilter === "SEMUA" || (m.kelas || "").toUpperCase().startsWith(kelasFilter);
        const cocokKeyword = !keyword || (m.judul || "").toLowerCase().includes(keyword) || (m.ringkasan || "").toLowerCase().includes(keyword);
        return cocokMapel && cocokKelas && cocokKeyword;
    });

    if (hasil.length === 0) {
        wadah.innerHTML = `
            <div class="card" style="text-align:center; padding:40px 20px; color:#8f9bba;">
                <i class="fa-solid fa-folder-open" style="font-size:2.5rem; margin-bottom:10px; opacity:0.5;"></i>
                <p style="margin:0; font-weight:600;">Belum ada materi untuk ${escapeHtml(mapelFilter)} (${escapeHtml(kelasFilter)}).</p>
            </div>
        `;
        return;
    }

    wadah.innerHTML = hasil.map(m => {
        const tgl = m.timestamp && m.timestamp.toDate
            ? m.timestamp.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })
            : "Baru diunggah";
        return `
            <div class="card" style="border-left:5px solid #4318ff;">
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
                    <div style="display:flex; gap:6px; align-items:center;">
                        <span style="background:#eef2ff; color:#4318ff; font-size:0.72rem; font-weight:700; padding:4px 10px; border-radius:20px;">Kelas ${escapeHtml(m.kelas || "Umum")}</span>
                        <span style="background:#dcfce7; color:#05cd99; font-size:0.72rem; font-weight:700; padding:4px 10px; border-radius:20px;">${escapeHtml(m.mapel || "Fisika")}</span>
                    </div>
                    <span style="font-size:0.75rem; color:#8f9bba;"><i class="fa-regular fa-calendar"></i> ${tgl}</span>
                </div>
                <h3 style="margin:0 0 8px 0; color:#1b254b; font-size:1.08rem;">${escapeHtml(m.judul)}</h3>
                <p style="margin:0 0 12px 0; font-size:0.86rem; color:#5a6a85; line-height:1.55;">${escapeHtml(m.ringkasan || m.konten || "")}</p>
                <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:10px; border-top:1px solid #f1f5f9;">
                    <span style="font-size:0.78rem; color:#5a6a85;"><i class="fa-solid fa-chalkboard-user" style="color:#4318ff;"></i> ${escapeHtml(m.guru || "Guru Pengampu")}</span>
                    <div style="display:flex; gap:8px; flex-wrap:wrap;">
                        <button onclick="bukaDetailMateriModal('${m.id}')" style="background:#4318ff; color:#fff; border:none; padding:7px 14px; border-radius:10px; font-size:0.78rem; font-weight:700; cursor:pointer;">
                            <i class="fa-solid fa-book-open"></i> Baca Lengkap
                        </button>
                        ${m.linkFile ? `<a href="${escapeHtml(m.linkFile)}" target="_blank" style="background:#05cd99; color:#fff; text-decoration:none; padding:7px 14px; border-radius:10px; font-size:0.78rem; font-weight:700;"><i class="fa-solid fa-file-arrow-down"></i> Lampiran / PDF</a>` : ""}
                        ${m.linkVideo ? `<a href="${escapeHtml(m.linkVideo)}" target="_blank" style="background:#ff5b5c; color:#fff; text-decoration:none; padding:7px 14px; border-radius:10px; font-size:0.78rem; font-weight:700;"><i class="fa-brands fa-youtube"></i> Video</a>` : ""}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function bukaDetailMateriModal(materiId) {
    const m = currentMateriList.find(item => item.id === materiId);
    if (!m) return;

    const existing = document.getElementById("modal-baca-materi");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "modal-baca-materi";
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.innerHTML = `
        <div class="modal-box" style="max-width:720px;">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px; border-bottom:1px solid #e2e8f0; padding-bottom:12px; margin-bottom:15px;">
                <div>
                    <span style="background:#eef2ff; color:#4318ff; font-size:0.74rem; font-weight:700; padding:4px 10px; border-radius:20px;">${escapeHtml(m.mapel || "Mapel")} • Kelas ${escapeHtml(m.kelas || "-")}</span>
                    <h2 style="margin:8px 0 2px 0; color:#1b254b; font-size:1.25rem;">${escapeHtml(m.judul)}</h2>
                    <div style="font-size:0.78rem; color:#8f9bba;">Oleh: ${escapeHtml(m.guru || "Guru SMAN 2 Bayan")}</div>
                </div>
                <button onclick="document.getElementById('modal-baca-materi').remove()" style="background:#f1f5f9; border:none; width:34px; height:34px; border-radius:50%; font-size:1.2rem; cursor:pointer;">&times;</button>
            </div>
            <div style="font-size:0.92rem; color:#1e293b; line-height:1.75; white-space:pre-line; background:#f8fafc; padding:18px; border-radius:14px; border:1px solid #e2e8f0;">
                ${escapeHtml(m.konten || m.ringkasan || "Tidak ada konten teks.")}
            </div>
            <div style="margin-top:16px; display:flex; gap:10px; justify-content:flex-end; flex-wrap:wrap;">
                ${m.linkFile ? `<a href="${escapeHtml(m.linkFile)}" target="_blank" class="btn-primary" style="width:auto; padding:10px 18px; text-decoration:none; background:#05cd99;"><i class="fa-solid fa-download"></i> Unduh Modul / LKPD</a>` : ""}
                ${m.linkVideo ? `<a href="${escapeHtml(m.linkVideo)}" target="_blank" class="btn-primary" style="width:auto; padding:10px 18px; text-decoration:none; background:#ff5b5c;"><i class="fa-brands fa-youtube"></i> Tonton Video Pembelajaran</a>` : ""}
                <button onclick="document.getElementById('modal-baca-materi').remove()" style="background:#e2e8f0; color:#1b254b; border:none; padding:10px 18px; border-radius:12px; font-weight:700; cursor:pointer;">Tutup</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

let unsubscribeDiskusi = null;
function muatDiskusiMapel(mapel) {
    if (unsubscribeDiskusi) unsubscribeDiskusi();
    const wadah = document.getElementById("wadah-chat-diskusi");
    if (!wadah) return;

    unsubscribeDiskusi = db.collection("diskusi_kelas")
        .where("mapel", "==", mapel)
        .orderBy("timestamp", "asc")
        .limitToLast(40)
        .onSnapshot((snap) => {
            if (!document.getElementById("wadah-chat-diskusi")) return;
            if (snap.empty) {
                wadah.innerHTML = `<div style="text-align:center; color:#8f9bba; font-size:0.8rem; margin-top:50px;">Belum ada diskusi di mata pelajaran ${escapeHtml(mapel)}. Mulai bertanya sekarang!</div>`;
                return;
            }
            wadah.innerHTML = snap.docs.map(doc => {
                const d = doc.data();
                const isGuru = ["Guru", "Operator", "Guru / Staf"].includes(d.role);
                const isMe = currentUserSession && d.pengirim === currentUserSession.nama;
                return `
                    <div style="align-self:${isMe ? "flex-end" : "flex-start"}; max-width:85%; background:${isGuru ? "#eef2ff" : isMe ? "#4318ff" : "#fff"}; color:${isMe && !isGuru ? "#fff" : "#1b254b"}; padding:9px 12px; border-radius:12px; border:1px solid ${isGuru ? "#c7d2fe" : "#e2e8f0"};">
                        <div style="font-size:0.68rem; font-weight:700; margin-bottom:3px; opacity:0.85;">
                            ${escapeHtml(d.pengirim)} ${isGuru ? `<span style="background:#4318ff; color:#fff; padding:1px 6px; border-radius:6px; font-size:0.62rem;">GURU</span>` : `(${escapeHtml(d.kelas || "Siswa")})`}
                        </div>
                        <div style="font-size:0.82rem; line-height:1.4;">${escapeHtml(d.pesan)}</div>
                    </div>
                `;
            }).join('');
            wadah.scrollTop = wadah.scrollHeight;
        }, () => {
            wadah.innerHTML = `<div style="text-align:center; color:#8f9bba; font-size:0.78rem; padding:20px;">Menyiapkan ruang diskusi...</div>`;
        });
}

async function kirimPesanDiskusi() {
    if (!currentUserSession) return alert("Silakan login terlebih dahulu!");
    const input = document.getElementById("input-pesan-diskusi");
    const pesan = input?.value.trim() || "";
    if (!pesan) return;

    input.value = "";
    try {
        await db.collection("diskusi_kelas").add({
            mapel: selectedMapelAktif,
            pengirim: currentUserSession.nama,
            role: currentUserSession.role,
            kelas: currentUserSession.kelas || "-",
            pesan,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
    } catch (e) {
        alert("Gagal mengirim pesan: " + e.message);
    }
}

// ==========================================
// 8. MENU 3: EKSTRAKURIKULER & PEMBINAAN
// ==========================================
function renderEkskul() {
    if (!currentUserSession) {
        contentDiv.innerHTML = renderBannerTamuTerbatas("Ekstrakurikuler & Pembinaan");
        return;
    }

    const isStaff = isPenggunaGuruAtauOperator();
    contentDiv.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <h2 style="margin:0; color:#1b254b; font-size:1.3rem;"><i class="fa-solid fa-medal" style="color:#ffb547;"></i> Ekstrakurikuler & Pengembangan Diri</h2>
                    <p style="margin:4px 0 0 0; font-size:0.84rem; color:#5a6a85;">Wadah bakat, minat, olahraga, seni, dan organisasi siswa SMA Negeri 2 Bayan</p>
                </div>
                ${isStaff ? `
                    <button onclick="bukaModalTambahEkskul()" class="btn-primary" style="width:auto; padding:10px 18px; background:#05cd99; font-size:0.85rem;">
                        <i class="fa-solid fa-plus"></i> Tambah Ekstrakurikuler
                    </button>
                ` : ""}
            </div>
        </div>
        <div id="wadah-list-ekskul" class="grid-cards">
            <div class="card" style="text-align:center; color:#8f9bba;">Memuat data ekstrakurikuler...</div>
        </div>
    `;

    db.collection("ekstrakurikuler").orderBy("nama", "asc").onSnapshot((snap) => {
        const wadah = document.getElementById("wadah-list-ekskul");
        if (!wadah) return;

        const defaultEkskul = [
            { nama: "OSIS & MPK", pembina: "Wakasek Kesiswaan", jadwal: "Sabtu, 14.00 WITA", deskripsi: "Organisasi Siswa Intra Sekolah sebagai wadah kepemimpinan dan kegiatan siswa." },
            { nama: "Pramuka (Ambalan Rinjani)", pembina: "Pembina Pramuka", jadwal: "Jumat, 15.00 WITA", deskripsi: "Pendidikan kepramukaan, kedisiplinan, dan kecakapan alam terbuka." },
            { nama: "Paskibra", pembina: "Pembina Paskibra", jadwal: "Selasa & Kamis, 15.30 WITA", deskripsi: "Pasukan Pengibar Bendera sekolah dan pembinaan baris-berbaris." },
            { nama: "PMR (Palang Merah Remaja)", pembina: "Pembina PMR", jadwal: "Rabu, 15.30 WITA", deskripsi: "Pertolongan pertama, kesehatan remaja, dan aksi kemanusiaan." },
            { nama: "Futsal & Sepak Bola", pembina: "Guru PJOK", jadwal: "Senin & Kamis, 16.00 WITA", deskripsi: "Pembinaan prestasi olahraga sepak bola dan futsal antar pelajar." },
            { nama: "Rohis (Kerohanian Islam)", pembina: "Guru PAI", jadwal: "Jumat, 13.30 WITA", deskripsi: "Kajian keislaman, tilawah Al-Qur'an, dan peringatan hari besar Islam." }
        ];

        const dataList = snap.empty ? defaultEkskul : snap.docs.map(d => ({ id: d.id, ...d.data() }));

        wadah.innerHTML = dataList.map(e => `
            <div class="card" style="border-top:4px solid #4318ff; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="background:#fef3c7; color:#d97706; font-size:0.72rem; font-weight:700; padding:4px 10px; border-radius:20px;"><i class="fa-regular fa-clock"></i> ${escapeHtml(e.jadwal || "Terjadwal")}</span>
                        ${isStaff && e.id ? `<button onclick="hapusEkskul('${e.id}')" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>` : ""}
                    </div>
                    <h3 style="margin:0 0 6px 0; color:#1b254b; font-size:1.08rem;">${escapeHtml(e.nama)}</h3>
                    <p style="margin:0 0 12px 0; font-size:0.84rem; color:#5a6a85; line-height:1.5;">${escapeHtml(e.deskripsi || "")}</p>
                </div>
                <div style="padding-top:10px; border-top:1px solid #f1f5f9; font-size:0.78rem; color:#4318ff; font-weight:700;">
                    <i class="fa-solid fa-user-tie"></i> Pembina: ${escapeHtml(e.pembina || "-")}
                </div>
            </div>
        `).join('');
    });
}

function bukaModalTambahEkskul() {
    const existing = document.getElementById("modal-tambah-ekskul");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "modal-tambah-ekskul";
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.innerHTML = `
        <div class="modal-box" style="max-width:450px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:#1b254b;">Tambah Ekstrakurikuler</h3>
                <button onclick="document.getElementById('modal-tambah-ekskul').remove()" style="background:none; border:none; font-size:1.3rem; cursor:pointer;">&times;</button>
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Nama Ekstrakurikuler</label>
                <input type="text" id="ekskul-nama" placeholder="Contoh: Bola Voli" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Nama Pembina</label>
                <input type="text" id="ekskul-pembina" placeholder="Contoh: Lalu Ahmad, S.Pd." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Jadwal Latihan</label>
                <input type="text" id="ekskul-jadwal" placeholder="Contoh: Rabu & Sabtu, 15.30 WITA" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Deskripsi Singkat</label>
                <textarea id="ekskul-deskripsi" rows="3" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;"></textarea>
            </div>
            <button onclick="simpanEkskulBaru()" class="btn-primary">Simpan Ekstrakurikuler</button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function simpanEkskulBaru() {
    const nama = document.getElementById("ekskul-nama").value.trim();
    const pembina = document.getElementById("ekskul-pembina").value.trim();
    const jadwal = document.getElementById("ekskul-jadwal").value.trim();
    const deskripsi = document.getElementById("ekskul-deskripsi").value.trim();

    if (!nama) return alert("Nama ekstrakurikuler wajib diisi!");

    try {
        await db.collection("ekstrakurikuler").add({ nama, pembina, jadwal, deskripsi });
        document.getElementById("modal-tambah-ekskul")?.remove();
    } catch (e) {
        alert("Gagal menyimpan: " + e.message);
    }
}

async function hapusEkskul(id) {
    if (!confirm("Hapus ekstrakurikuler ini?")) return;
    await db.collection("ekstrakurikuler").doc(id).delete();
}

// ==========================================
// 9. MENU 4: GALERI KEGIATAN SEKOLAH
// ==========================================
function renderGaleri() {
    if (!currentUserSession) {
        contentDiv.innerHTML = renderBannerTamuTerbatas("Galeri Kegiatan Sekolah");
        return;
    }

    const isStaff = isPenggunaGuruAtauOperator();
    contentDiv.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                <div>
                    <h2 style="margin:0; color:#1b254b; font-size:1.3rem;"><i class="fa-solid fa-images" style="color:#05cd99;"></i> Galeri Dokumentasi Kegiatan</h2>
                    <p style="margin:4px 0 0 0; font-size:0.84rem; color:#5a6a85;">Dokumentasi kegiatan pembelajaran, upacara, lomba, dan prestasi SMA Negeri 2 Bayan</p>
                </div>
                ${isStaff ? `
                    <button onclick="bukaModalTambahGaleri()" class="btn-primary" style="width:auto; padding:10px 18px; background:#4318ff; font-size:0.85rem;">
                        <i class="fa-solid fa-camera"></i> Unggah Foto Kegiatan
                    </button>
                ` : ""}
            </div>
        </div>
        <div id="wadah-galeri-sekolah" class="grid-cards">
            <div class="card" style="text-align:center; color:#8f9bba;">Memuat galeri foto...</div>
        </div>
    `;

    db.collection("galeri_sekolah").orderBy("timestamp", "desc").onSnapshot((snap) => {
        const wadah = document.getElementById("wadah-galeri-sekolah");
        if (!wadah) return;

        if (snap.empty) {
            wadah.innerHTML = `<div class="card" style="grid-column:1/-1; text-align:center; padding:40px; color:#8f9bba;">Belum ada foto dokumentasi yang diunggah.</div>`;
            return;
        }

        wadah.innerHTML = snap.docs.map(doc => {
            const d = doc.data();
            const imgUrl = formatUrlGambar(d.url);
            return `
                <div class="card" style="padding:14px; overflow:hidden;">
                    <img src="${imgUrl}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80';"
                         style="width:100%; height:200px; object-fit:cover; border-radius:12px; margin-bottom:12px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px;">
                        <div>
                            <h4 style="margin:0 0 4px 0; color:#1b254b; font-size:0.95rem;">${escapeHtml(d.judul)}</h4>
                            <p style="margin:0; font-size:0.78rem; color:#5a6a85;">${escapeHtml(d.keterangan || "")}</p>
                        </div>
                        ${isStaff ? `<button onclick="hapusFotoGaleri('${doc.id}')" style="background:#fee2e2; color:#ef4444; border:none; padding:6px 9px; border-radius:8px; cursor:pointer;"><i class="fa-solid fa-trash"></i></button>` : ""}
                    </div>
                </div>
            `;
        }).join('');
    });
}

function bukaModalTambahGaleri() {
    const existing = document.getElementById("modal-tambah-galeri");
    if (existing) existing.remove();

    const modal = document.createElement("div");
    modal.id = "modal-tambah-galeri";
    modal.className = "modal-overlay";
    modal.style.display = "flex";
    modal.innerHTML = `
        <div class="modal-box" style="max-width:460px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
                <h3 style="margin:0; color:#1b254b;">Unggah Foto Galeri</h3>
                <button onclick="document.getElementById('modal-tambah-galeri').remove()" style="background:none; border:none; font-size:1.3rem; cursor:pointer;">&times;</button>
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Judul Kegiatan</label>
                <input type="text" id="galeri-judul" placeholder="Contoh: Upacara Bendera Hari Senin" style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <div style="margin-bottom:10px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Ambil Foto / Link Google Drive</label>
                <div style="display:flex; gap:8px;">
                    <input type="text" id="galeri-url" placeholder="https://..." style="flex:1; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
                    <label style="background:#eef2ff; color:#4318ff; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:700; font-size:0.8rem;">
                        <i class="fa-solid fa-camera"></i> Kamera
                        <input type="file" accept="image/*" style="display:none;" onchange="handleInputKamera(this, 'galeri-url', 'preview-galeri-img')">
                    </label>
                </div>
                <img id="preview-galeri-img" style="max-height:110px; border-radius:10px; margin-top:8px; display:none;">
            </div>
            <div style="margin-bottom:15px;">
                <label style="font-size:0.8rem; font-weight:700; display:block; margin-bottom:4px;">Keterangan Singkat</label>
                <input type="text" id="galeri-ket" placeholder="Deskripsi kegiatan..." style="width:100%; padding:10px; border-radius:10px; border:1px solid #cbd5e1;">
            </div>
            <button onclick="simpanFotoGaleri()" class="btn-primary">Simpan ke Galeri</button>
        </div>
    `;
    document.body.appendChild(modal);
}

async function simpanFotoGaleri() {
    const judul = document.getElementById("galeri-judul").value.trim();
    const url = document.getElementById("galeri-url").value.trim();
    const keterangan = document.getElementById("galeri-ket").value.trim();

    if (!judul || !url) return alert("Judul dan foto wajib diisi!");

    try {
        await db.collection("galeri_sekolah").add({
            judul,
            url,
            keterangan,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        document.getElementById("modal-tambah-galeri")?.remove();
    } catch (e) {
        alert("Gagal mengunggah foto: " + e.message);
    }
}

async function hapusFotoGaleri(id) {
    if (!confirm("Hapus foto ini dari galeri?")) return;
    await db.collection("galeri_sekolah").doc(id).delete();
}

// ==========================================
// 10. MENU 5: E-VOTING SEKOLAH & PANEL KONTROL OPERATOR
// ==========================================
function renderVoting() {
    if (!currentUserSession) {
        contentDiv.innerHTML = renderBannerTamuTerbatas("E-Voting Sekolah");
        return;
    }

    const isOperator = isPenggunaOperator();
    contentDiv.innerHTML = `
        <div class="card" style="margin-bottom:20px;">
            <h2 style="margin:0 0 6px 0; color:#1b254b; font-size:1.3rem;"><i class="fa-solid fa-check-to-slot" style="color:#4318ff;"></i> E-Voting Digital SMA Negeri 2 Bayan</h2>
            <p style="margin:0; font-size:0.85rem; color:#5a6a85;">Demokrasi sekolah berbasis digital untuk Pemilihan Ketua OSIS (Pilketos) dan Apresiasi Guru Favorit.</p>
        </div>

        ${isOperator ? `
            <div class="card" style="margin-bottom:20px; border-left:5px solid #ffb547; background:#fffbeb;">
                <h3 style="margin:0 0 12px 0; color:#92400e; font-size:1.05rem;"><i class="fa-solid fa-sliders"></i> Panel Kontrol Operator: Status Pembukaan Voting</h3>
                <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:15px;">
                    <div style="background:#fff; padding:14px; border-radius:12px; border:1px solid #fde68a;">
                        <label style="display:flex; align-items:center; gap:8px; font-weight:700; color:#1b254b; margin-bottom:8px; cursor:pointer;">
                            <input type="checkbox" id="chk-pilketos-aktif" ${PENGATURAN_PANEL.pilketosAktif ? "checked" : ""}> Aktifkan Pemilihan Ketua OSIS
                        </label>
                        <input type="text" id="txt-alasan-pilketos" value="${escapeHtml(PENGATURAN_PANEL.alasanPilketosNonaktif)}" placeholder="Pesan jika ditutup..." style="width:100%; padding:8px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.8rem;">
                    </div>
                    <div style="background:#fff; padding:14px; border-radius:12px; border:1px solid #fde68a;">
                        <label style="display:flex; align-items:center; gap:8px; font-weight:700; color:#1b254b; margin-bottom:8px; cursor:pointer;">
                            <input type="checkbox" id="chk-gurufav-aktif" ${PENGATURAN_PANEL.guruFavoritAktif ? "checked" : ""}> Aktifkan Pemilihan Guru Favorit
                        </label>
                        <input type="text" id="txt-alasan-gurufav" value="${escapeHtml(PENGATURAN_PANEL.alasanGuruFavoritNonaktif)}" placeholder="Pesan jika ditutup..." style="width:100%; padding:8px; border-radius:8px; border:1px solid #cbd5e1; font-size:0.8rem;">
                    </div>
                </div>
                <button onclick="simpanPengaturanVotingOperator()" class="btn-primary" style="width:auto; padding:10px 20px; margin-top:12px; background:#d97706;">
                    <i class="fa-solid fa-floppy-disk"></i> Simpan Pengaturan Panel Voting
                </button>
            </div>
        ` : ""}

        <div class="grid-cards">
            <div class="card">
                <h3 style="margin:0 0 10px 0; color:#1b254b;"><i class="fa-solid fa-users-rectangle" style="color:#4318ff;"></i> Pemilihan Ketua & Wakil Ketua OSIS</h3>
                ${PENGATURAN_PANEL.pilketosAktif
                    ? `<p style="font-size:0.85rem; color:#05cd99; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Pemungutan suara sedang dibuka! Setiap akun memiliki 1 hak suara.</p>
                       <div id="wadah-kandidat-osis" style="margin-top:12px;">Memuat kandidat OSIS...</div>`
                    : `<div style="background:#fee2e2; color:#b91c1c; padding:15px; border-radius:12px; font-size:0.85rem; line-height:1.5;">
                        <strong><i class="fa-solid fa-lock"></i> Pemungutan Suara Ditutup</strong><br>${escapeHtml(PENGATURAN_PANEL.alasanPilketosNonaktif)}
                       </div>`
                }
            </div>

            <div class="card">
                <h3 style="margin:0 0 10px 0; color:#1b254b;"><i class="fa-solid fa-award" style="color:#ffb547;"></i> Pemilihan Guru Favorit Siswa</h3>
                ${PENGATURAN_PANEL.guruFavoritAktif
                    ? `<p style="font-size:0.85rem; color:#05cd99; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Pemungutan suara sedang dibuka! Berikan apresiasi untuk guru inspiratif Anda.</p>
                       <div id="wadah-kandidat-guru" style="margin-top:12px;">Memuat daftar guru...</div>`
                    : `<div style="background:#fee2e2; color:#b91c1c; padding:15px; border-radius:12px; font-size:0.85rem; line-height:1.5;">
                        <strong><i class="fa-solid fa-lock"></i> Pemungutan Suara Ditutup</strong><br>${escapeHtml(PENGATURAN_PANEL.alasanGuruFavoritNonaktif)}
                       </div>`
                }
            </div>
        </div>
    `;

    if (PENGATURAN_PANEL.pilketosAktif) muatKandidatVoting("osis", "wadah-kandidat-osis");
    if (PENGATURAN_PANEL.guruFavoritAktif) muatKandidatVoting("guru", "wadah-kandidat-guru");
}

async function simpanPengaturanVotingOperator() {
    if (!isPenggunaOperator()) return;
    const payload = {
        pilketosAktif: document.getElementById("chk-pilketos-aktif").checked,
        alasanPilketosNonaktif: document.getElementById("txt-alasan-pilketos").value.trim(),
        guruFavoritAktif: document.getElementById("chk-gurufav-aktif").checked,
        alasanGuruFavoritNonaktif: document.getElementById("txt-alasan-gurufav").value.trim()
    };
    try {
        await db.collection("pengaturan_sekolah").doc("panel_voting").set(payload, { merge: true });
        alert("Pengaturan panel E-Voting berhasil diperbarui!");
    } catch (e) {
        alert("Gagal menyimpan pengaturan: " + e.message);
    }
}

function muatKandidatVoting(jenis, containerId) {
    const wadah = document.getElementById(containerId);
    if (!wadah) return;

    db.collection("kandidat_voting").where("jenis", "==", jenis).onSnapshot((snap) => {
        if (!document.getElementById(containerId)) return;
        if (snap.empty) {
            wadah.innerHTML = `<p style="font-size:0.82rem; color:#8f9bba;">Belum ada data kandidat yang didaftarkan oleh Operator.</p>`;
            return;
        }
        wadah.innerHTML = snap.docs.map(doc => {
            const d = doc.data();
            return `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:12px; margin-bottom:10px;">
                    <div>
                        <div style="font-weight:700; color:#1b254b; font-size:0.92rem;">${escapeHtml(d.nama)}</div>
                        <div style="font-size:0.76rem; color:#5a6a85;">${escapeHtml(d.keterangan || "")}</div>
                    </div>
                    <button onclick="kirimSuaraVoting('${doc.id}', '${jenis}', '${escapeHtml(d.nama)}')" class="btn-primary" style="width:auto; padding:8px 14px; font-size:0.78rem;">
                        <i class="fa-solid fa-check"></i> Pilih (${d.suara || 0})
                    </button>
                </div>
            `;
        }).join('');
    });
}

async function kirimSuaraVoting(kandidatId, jenis, namaKandidat) {
    if (!currentUserSession) return alert("Silakan login terlebih dahulu!");
    const voterKey = `${jenis}_${currentUserSession.nisn || currentUserSession.uid}`;
    const voteRef = db.collection("rekam_suara_voting").doc(voterKey);

    try {
        const cek = await voteRef.get();
        if (cek.exists) {
            return alert("Anda sudah menggunakan hak suara Anda pada pemilihan ini!");
        }
        if (!confirm(`Kirim pilihan Anda untuk ${namaKandidat}? Pilihan tidak dapat diubah.`)) return;

        await voteRef.set({
            voter: currentUserSession.nama,
            voterId: currentUserSession.nisn || currentUserSession.uid,
            jenis,
            kandidatId,
            namaKandidat,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        await db.collection("kandidat_voting").doc(kandidatId).update({
            suara: firebase.firestore.FieldValue.increment(1)
        });

        alert("Terima kasih! Suara Anda berhasil direkam.");
    } catch (e) {
        alert("Gagal mengirim suara: " + e.message);
    }
}

// ==========================================
// 11. EVENT LISTENER NAVIGASI & INISIALISASI AWAL
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    const navButtons = {
        "nav-home": renderHome,
        "nav-materi": renderMateri,
        "nav-ekskul": renderEkskul,
        "nav-galeri": renderGaleri,
        "nav-voting": renderVoting
    };

    Object.entries(navButtons).forEach(([btnId, renderFn]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                document.querySelectorAll(".nav-links button, .nav-links a").forEach(el => el.classList.remove("active"));
                btn.classList.add("active");
                renderFn();
            });
        }
    });

    // Tutup panel notifikasi jika klik di luar area
    document.addEventListener("click", (e) => {
        const panel = document.getElementById("panel-notifikasi-sekolah");
        const btnLonceng = document.getElementById("btn-lonceng-notif");
        if (panel && panel.style.display === "block" && !panel.contains(e.target) && btnLonceng && !btnLonceng.contains(e.target)) {
            panel.style.display = "none";
        }
    });

    updateNavbarSessionUI();
    inisialisasiNotifikasiRealtime();
    muatDataGuruDariFirebase();
    renderHome();
});
