// Konfigurasi Guru
const GURU = {
    nama: "Rianti, S.Pd.",
    mapel: "Fisika",
    whatsapp: "6281234567890" // Ganti dengan nomor asli
};

// Database Materi Fisika
const materiFisika = {
    "Kelas 10": [
        { bab: "Pengukuran", isi: ["Hakikat Fisika dan Kerja Ilmiah", "Macam-macam Alat Ukur", "Besaran, Satuan, dan Dimensi", "Aturan Angka Penting dan Notasi Ilmiah", "Nilai Ketidakpastian Pengukuran Tunggal", "Nilai Ketidakpastian Pengukuran Berulang"] },
        { bab: "Energi Terbarukan", isi: ["Energi dan Hukum Kekekalan Energi", "Masalah Ketersediaan Energi", "Macam-macam Sumber Energi", "Potensi Sumber Energi Lokal", "Dampak Pemanfaatan Sumber Energi"] },
        { bab: "Pencemaran lingkungan", isi: ["Pendahuluan fisika lingkungan", "Sumber penyebab pencemaran", "Dampak pencemaran", "Upaya penanggulangan", "Studi kasus: limbah baterai, mikroplastik"] },
        { bab: "Perubahan iklim dan pemanasan global", isi: ["Gejala dan Dampak Pemanasan Global", "Penyebab perubahan lingkungan", "Solusi Menanggulangi Pemanasan Global"] }
    ],
    "Kelas 11": [
        { bab: "Vektor", isi: ["Pengenalan Vektor", "Menggambarkan vektor", "Komponen Vektor", "Perkalian Vektor", "Vektor Satuan"] },
        { bab: "Kinematika", isi: ["Pendahuluan Mekanika", "Gerak lurus", "Gerak parabola", "Gerak Melingkar dan Rotasi"] },
        { bab: "Dinamika", isi: ["Pengaruh gaya terhadap gerak", "Gaya gesek", "Hukum Newton", "Gravitasi", "Hukum III Kepler"] },
        { bab: "Usaha dan energi", isi: ["Usaha", "Energi", "Kekekalan energi mekanik", "Daya"] },
        { bab: "Momentum dan impuls", isi: ["Momentum dan Impuls", "Kekekalan Momentum", "Tumbukan"] },
        { bab: "Dinamika Rotasi dan Kesetimbangan Benda Tegar", isi: ["Momen gaya inersia", "Momentum sudut", "Gerak menggelinding", "Titik berat", "Kesetimbangan"] },
        { bab: "Fluida statis dan dinamis", isi: ["Fluida Statis: Hukum Archimedes/Pascal", "Fluida Dinamis: Bernoulli"] },
        { bab: "Getaran harmonik", isi: ["Karakteristik gerak", "Persamaan getaran", "Hukum Hooke", "Susunan pegas"] },
        { bab: "Gelombang", isi: ["Gelombang bunyi (Efek Doppler)", "Gelombang cahaya"] },
        { bab: "Kalor dan termodinamika", isi: ["Perpindahan kalor", "Hukum I & II Termodinamika", "Mesin Carnot", "Entropi"] }
    ],
    "Kelas 12": [
        { bab: "Listrik statis", isi: ["Muatan listrik, gaya Coulomb", "Kapasitor"] },
        { bab: "Rangkaian arus searah", isi: ["Kuat Arus", "Hukum Ohm", "Hukum Kirchoff"] },
        { bab: "Medan magnet", isi: ["Medan Magnet Geometri Kawat", "Gaya Lorentz"] },
        { bab: "Induksi elektromagnetik", isi: ["Fluks Magnetik", "Hukum Faraday-Lenz", "GGL Induksi", "Transformator"] },
        { bab: "Rangkaian arus bolak-balik", isi: ["Tegangan AC", "Rangkaian RLC", "Daya"] },
        { bab: "Radiasi elektromagnetik", isi: ["Spektrum Gelombang Cahaya"] },
        { bab: "Gelombang cahaya", isi: ["Interferensi Celah Ganda", "Cincin Newton", "Difraksi", "Polarisasi"] },
        { bab: "Alat-alat optik", isi: ["Lup dan Kacamata", "Mikroskop", "Teropong"] },
        { bab: "Teknologi digital", isi: ["Sistem Digital", "Gerbang Logika", "Penerapan"] },
        { bab: "Teori relativitas khusus", isi: ["Kerangka Acuan", "Dilatasi Waktu", "Massa/Energi Relativistik"] },
        { bab: "Fisika kuantum", isi: ["Dualisme Sifat Cahaya", "Efek Fotolistrik", "De Broglie"] },
        { bab: "Fisika inti dan radioaktivitas", isi: ["Struktur Atom", "Defek Massa", "Reaksi Inti", "Peluruhan"] }
    ]
};

const contentDiv = document.getElementById('app-content');
let activeAssessment = { type: '', title: '' };

// 1. Render Beranda (Pilihan Mapel)
function renderHome() {
    contentDiv.innerHTML = `
        <h2>Pilih Mata Pelajaran</h2>
        <div class="grid-container">
            <div class="card active" onclick="renderKelas()">
                <h3>Fisika</h3>
                <p style="font-weight:normal; font-size:12px; margin-top:5px;">Guru: ${GURU.nama}</p>
            </div>
            <div class="card locked"><h3>Matematika</h3><p>Segera Hadir</p></div>
            <div class="card locked"><h3>Biologi</h3><p>Segera Hadir</p></div>
            <div class="card locked"><h3>Kimia</h3><p>Segera Hadir</p></div>
        </div>
    `;
}

// 2. Render Pilihan Kelas
function renderKelas() {
    contentDiv.innerHTML = `
        <button onclick="renderHome()" style="margin-bottom:15px;">&larr; Kembali</button>
        <h2>Pilih Kelas (Fisika)</h2>
        <div class="grid-container">
            <div class="card active" onclick="renderMateri('Kelas 10')"><h3>Kelas 10</h3></div>
            <div class="card active" onclick="renderMateri('Kelas 11')"><h3>Kelas 11</h3></div>
            <div class="card active" onclick="renderMateri('Kelas 12')"><h3>Kelas 12</h3></div>
        </div>
    `;
}

// 3. Render Daftar Materi berdasarkan Kelas
function renderMateri(kelas) {
    const materi = materiFisika[kelas];
    let html = `<button onclick="renderKelas()" style="margin-bottom:15px;">&larr; Kembali</button>
                <h2>Materi ${kelas}</h2>
                <div class="material-list">`;
    
    materi.forEach((item, index) => {
        html += `<div class="material-item" onclick="renderDetailMateri('${kelas}', ${index})">
                    <h4>${index + 1}. ${item.bab}</h4>
                 </div>`;
    });
    html += `</div>`;
    contentDiv.innerHTML = html;
}

// 4. Render Detail Materi & Sub-materi
function renderDetailMateri(kelas, index) {
    const bab = materiFisika[kelas][index];
    let isiHtml = bab.isi.map(sub => `<li>${sub}</li>`).join('');
    
    contentDiv.innerHTML = `
        <button onclick="renderMateri('${kelas}')" style="margin-bottom:15px;">&larr; Kembali</button>
        <div class="detail-box" id="pdf-content">
            <h2>${bab.bab}</h2>
            <p><strong>Mata Pelajaran:</strong> Fisika | <strong>Guru:</strong> ${GURU.nama}</p>
            <hr style="margin: 10px 0;">
            <p><strong>Sub-materi yang dipelajari:</strong></p>
            <ul style="margin-left: 20px; margin-top: 10px; line-height:1.6;">
                ${isiHtml}
            </ul>
            <p style="margin-top: 20px; font-style: italic;">*Penjelasan lengkap akan ditambahkan oleh guru pada pertemuan berikutnya.</p>
        </div>
        
        <div class="btn-group">
            <button onclick="downloadMateriPDF('${bab.bab}')">📄 Download PDF Materi</button>
            <button onclick="openModal('Kuis', '${bab.bab}')" style="background:#0984e3;">📝 Kerjakan Kuis</button>
        </div>

        <div class="discussion-board">
            <h3>Kolom Diskusi Bersama</h3>
            <div id="comments-${index}" style="margin-bottom:15px; max-height: 200px; overflow-y:auto;"></div>
            <textarea id="input-diskusi" rows="2" placeholder="Tulis pertanyaan atau diskusi..."></textarea>
            <button onclick="tambahDiskusi('${kelas}_${index}')">Kirim</button>
        </div>
    `;
    loadDiskusi(`${kelas}_${index}`, index);
}

// 5. Fitur Diskusi (Menyimpan di LocalStorage per perangkat)
function loadDiskusi(id, index) {
    const commentsDiv = document.getElementById(`comments-${index}`);
    const data = JSON.parse(localStorage.getItem(`diskusi_${id}`)) || [];
    commentsDiv.innerHTML = data.length === 0 ? "<p style='color:grey; font-size:12px;'>Belum ada diskusi.</p>" : "";
    data.forEach(c => {
        commentsDiv.innerHTML += `<div class="comment"><span>Siswa:</span> ${c}</div>`;
    });
}

function tambahDiskusi(id) {
    const text = document.getElementById('input-diskusi').value;
    if (!text) return;
    let data = JSON.parse(localStorage.getItem(`diskusi_${id}`)) || [];
    data.push(text);
    localStorage.setItem(`diskusi_${id}`, JSON.stringify(data));
    
    // Refresh DOM
    const index = id.split('_')[1];
    loadDiskusi(id, index);
    document.getElementById('input-diskusi').value = "";
}

// 6. Menu Latihan Soal Khusus
function renderLatihanSoal() {
    contentDiv.innerHTML = `
        <h2>Latihan Soal Bebas</h2>
        <p style="margin-bottom: 15px;">Latihan soal dapat diakses kapan saja untuk persiapan ujian.</p>
        <button onclick="openModal('Soal', 'Latihan Mandiri')">Mulai Latihan Soal Baru</button>
    `;
}

// 7. Modal Identitas & Assessment (Kuis/Soal)
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
    
    if(!name || !cls) {
        alert("Harap isi Nama dan Kelas terlebih dahulu!");
        return;
    }
    
    closeModal();
    renderUjian(name, cls, activeAssessment.type, activeAssessment.title);
}

function renderUjian(nama, kelas, jenis, judul) {
    contentDiv.innerHTML = `
        <div id="lembar-ujian" class="detail-box">
            <h2 style="text-align:center;">${jenis}: ${judul}</h2>
            <hr style="margin: 10px 0;">
            <p><strong>Nama :</strong> ${nama}</p>
            <p><strong>Kelas :</strong> ${kelas}</p>
            <p><strong>Tanggal :</strong> ${new Date().toLocaleDateString('id-ID')}</p>
            
            <div style="margin-top: 20px;">
                <p>1. Jelaskan pemahaman Anda mengenai materi ini!</p>
                <textarea id="jawaban-1" rows="3"></textarea>
                
                <p style="margin-top:10px;">2. Sebutkan satu contoh penerapannya dalam kehidupan sehari-hari!</p>
                <textarea id="jawaban-2" rows="3"></textarea>
            </div>
        </div>
        <button onclick="submitUjian('${nama}', '${kelas}', '${jenis}', '${judul}')" style="background:#00b894; width:100%;">Selesai & Kirim ke Guru</button>
    `;
}

// 8. Proses Submit (PDF & WhatsApp)
function submitUjian(nama, kelas, jenis, judul) {
    const elemen = document.getElementById('lembar-ujian');
    const namaFile = `${jenis}_${nama}_${kelas}.pdf`;

    // Pengaturan library html2pdf
    const opt = {
        margin: 1,
        filename: namaFile,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Buat PDF
    html2pdf().set(opt).from(elemen).save().then(() => {
        // Buat Link WhatsApp setelah PDF terunduh
        const teksWA = `Halo Ibu ${GURU.nama}, saya ${nama} dari kelas ${kelas}. Saya telah menyelesaikan ${jenis} untuk materi *${judul}*. File PDF jawaban sudah saya unduh dan saya lampirkan bersama pesan ini. Terima kasih.`;
        const linkWA = `https://wa.me/${GURU.whatsapp}?text=${encodeURIComponent(teksWA)}`;
        
        alert("File PDF berhasil diunduh! Anda akan diarahkan ke WhatsApp untuk mengirim file tersebut ke guru.");
        window.open(linkWA, '_blank');
        renderHome(); // Kembali ke awal
    });
}

// 9. Download Materi Saja
function downloadMateriPDF(judulMateri) {
    const elemen = document.getElementById('pdf-content');
    const opt = {
        margin: 1,
        filename: `Materi_Fisika_${judulMateri}.pdf`,
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(elemen).save();
}

// Inisialisasi awal
renderHome();
