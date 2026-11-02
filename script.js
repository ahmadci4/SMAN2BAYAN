// Konfigurasi Guru Fisika (sebagai contoh materi yang sudah ada)
const GURU = {
    nama: "Rianti, S.Pd.",
    mapel: "Fisika",
    whatsapp: "6281234567890" 
};

// Data Seluruh Mata Pelajaran beserta Ikon & Warna
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
    { name: "Fisika", icon: "fa-atom", grad: "linear-gradient(135deg, #ff9f43, #ff6b6b)", active: true }, // Hanya Fisika yg aktif
    { name: "MTK Lanjut", icon: "fa-square-root-variable", grad: "linear-gradient(135deg, #ec008c, #fc6767)", active: false },
    { name: "Sosiologi", icon: "fa-users", grad: "linear-gradient(135deg, #3a1c71, #d76d77)", active: false },
    { name: "Ekonomi", icon: "fa-chart-line", grad: "linear-gradient(135deg, #159957, #155799)", active: false },
    { name: "Geografi", icon: "fa-earth-asia", grad: "linear-gradient(135deg, #2193b0, #6dd5ed)", active: false },
    { name: "Antropologi", icon: "fa-masks-theater", grad: "linear-gradient(135deg, #cc2b5e, #753a88)", active: false },
    { name: "PKWU", icon: "fa-lightbulb", grad: "linear-gradient(135deg, #e65c00, #f9d423)", active: false }
];

// Data Materi Fisika
const materiFisika = {
    "Kelas 10": [
        { bab: "Pengukuran", isi: ["Hakikat Fisika dan Kerja Ilmiah", "Macam-macam Alat Ukur", "Besaran, Satuan, dan Dimensi", "Aturan Angka Penting", "Nilai Ketidakpastian"] },
        { bab: "Energi Terbarukan", isi: ["Energi dan Hukum Kekekalan Energi", "Macam-macam Sumber Energi", "Potensi Sumber Energi Lokal"] },
        { bab: "Pencemaran lingkungan", isi: ["Pendahuluan fisika lingkungan", "Sumber penyebab", "Dampak pencemaran", "Upaya penanggulangan"] },
        { bab: "Perubahan iklim", isi: ["Gejala dan Dampak", "Penyebab perubahan lingkungan", "Solusi"] }
    ],
    "Kelas 11": [
        { bab: "Vektor", isi: ["Besaran skalar dan vektor", "Komponen Vektor", "Perkalian Vektor"] },
        { bab: "Kinematika", isi: ["Gerak lurus", "Gerak parabola", "Gerak Melingkar"] },
        { bab: "Dinamika", isi: ["Hukum Newton", "Gravitasi", "Hukum III Kepler"] },
        { bab: "Usaha dan energi", isi: ["Usaha", "Energi", "Kekekalan energi mekanik", "Daya"] },
        { bab: "Momentum dan impuls", isi: ["Momentum dan Impuls", "Tumbukan"] },
        { bab: "Fluida", isi: ["Fluida Statis", "Fluida Dinamis"] }
    ],
    "Kelas 12": [
        { bab: "Listrik statis", isi: ["Muatan listrik, gaya Coulomb", "Kapasitor"] },
        { bab: "Rangkaian arus searah", isi: ["Kuat Arus", "Hukum Ohm", "Hukum Kirchoff"] },
        { bab: "Medan magnet", isi: ["Medan Magnet Kawat", "Gaya Lorentz"] },
        { bab: "Induksi elektromagnetik", isi: ["Fluks Magnetik", "Hukum Faraday", "Transformator"] },
        { bab: "Teori relativitas", isi: ["Kerangka Acuan", "Dilatasi Waktu", "Energi Relativistik"] }
    ]
};

const contentDiv = document.getElementById('app-content');
let activeAssessment = { type: '', title: '' };

// 1. Render Beranda
function renderHome() {
    // Placeholder gambar yang bisa diganti link-nya nanti oleh Anda
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

// 2. Render Pilihan Kelas (Untuk Mapel yang aktif)
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

// 3. Render Daftar Materi berdasarkan Kelas
function renderMateri(kelas) {
    const materi = materiFisika[kelas];
    let html = `
        <button class="btn-back" onclick="renderKelas()"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <h3 class="section-title">Materi Fisika - ${kelas}</h3>
        <div class="material-list">
    `;
    
    materi.forEach((item, index) => {
        html += `
            <div class="material-item" onclick="renderDetailMateri('${kelas}', ${index})">
                <div style="font-weight:600;">${index + 1}. ${item.bab}</div>
                <i class="fa-solid fa-chevron-right" style="color:#a3aed1;"></i>
            </div>
        `;
    });
    html += `</div>`;
    contentDiv.innerHTML = html;
}

// 4. Render Detail Materi & Sub-materi
function renderDetailMateri(kelas, index) {
    const bab = materiFisika[kelas][index];
    let isiHtml = bab.isi.map(sub => `<li style="margin-bottom:8px;"><i class="fa-solid fa-check" style="color:#05cd99; margin-right:8px;"></i>${sub}</li>`).join('');
    
    contentDiv.innerHTML = `
        <button class="btn-back" onclick="renderMateri('${kelas}')"><i class="fa-solid fa-arrow-left"></i> Kembali</button>
        <div class="detail-box" id="pdf-content">
            <h2 style="color:var(--text-dark);">${bab.bab}</h2>
            <p style="color:var(--text-light); font-size:0.9rem; margin-top:5px;">Mata Pelajaran: Fisika | Guru: ${GURU.nama}</p>
            <hr style="margin: 15px 0; border: 0; border-top: 1px solid #e2e8f0;">
            <p style="font-weight:600; margin-bottom:10px;">Sub-materi yang dipelajari:</p>
            <ul style="list-style:none;">
                ${isiHtml}
            </ul>
        </div>
        
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">
            <button class="btn-primary" onclick="downloadMateriPDF('${bab.bab}')"><i class="fa-solid fa-download"></i> Unduh Materi PDF</button>
            <button class="btn-success" onclick="openModal('Kuis', '${bab.bab}')"><i class="fa-solid fa-pen"></i> Kerjakan Kuis</button>
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

// 5. Fitur Diskusi
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

// 6. Latihan Soal Khusus
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

// 7. Pengelolaan Ujian (PDF)
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
        <div id="lembar-ujian" class="detail-box">
            <h2 style="text-align:center; color:#4318ff;">Lembar ${jenis}</h2>
            <h4 style="text-align:center;">${judul}</h4>
            <hr style="margin: 15px 0;">
            <table style="width:100%; margin-bottom:20px;">
                <tr><td style="width:30%;"><strong>Nama</strong></td><td>: ${nama}</td></tr>
                <tr><td><strong>Kelas</strong></td><td>: ${kelas}</td></tr>
                <tr><td><strong>Tanggal</strong></td><td>: ${new Date().toLocaleDateString('id-ID')}</td></tr>
            </table>
            
            <p>1. Jelaskan pemahaman Anda mengenai materi ini dengan singkat!</p>
            <textarea style="width:100%; margin:10px 0 20px; border:1px solid #ddd; padding:10px; border-radius:8px;" rows="3"></textarea>
            
            <p>2. Sebutkan contoh penerapannya dalam kehidupan sehari-hari!</p>
            <textarea style="width:100%; margin:10px 0; border:1px solid #ddd; padding:10px; border-radius:8px;" rows="3"></textarea>
        </div>
        <button class="btn-success" style="width:100%; padding:15px; font-size:1.1rem;" onclick="submitUjian('${nama}', '${kelas}', '${jenis}', '${judul}')">
            <i class="fa-solid fa-paper-plane"></i> Selesai & Kirim ke WhatsApp Guru
        </button>
    `;
}

// 8. Cetak & Kirim WA
function submitUjian(nama, kelas, jenis, judul) {
    const elemen = document.getElementById('lembar-ujian');
    const opt = {
        margin: 0.5, filename: `${jenis}_${nama}_${kelas}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(elemen).save().then(() => {
        const teksWA = `Halo Ibu ${GURU.nama}, saya ${nama} dari kelas ${kelas}. Saya telah menyelesaikan ${jenis} untuk materi *${judul}*. File PDF jawaban sudah saya unduh dan saya lampirkan bersama pesan ini.`;
        window.open(`https://wa.me/${GURU.whatsapp}?text=${encodeURIComponent(teksWA)}`, '_blank');
        renderHome(); 
    });
}

function downloadMateriPDF(judulMateri) {
    const elemen = document.getElementById('pdf-content');
    html2pdf().set({margin: 1, filename: `Materi_Fisika_${judulMateri}.pdf`}).from(elemen).save();
}

renderHome();
