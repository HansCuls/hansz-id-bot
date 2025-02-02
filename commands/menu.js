module.exports = (ctx) => {
    ctx.reply(`
📌 *MENU BOT HANSZ ID OFFICIAL*
🛠 *Fitur Utama:*
1️⃣ /ping - Cek status bot
2️⃣ /yts <query> - Cari video YouTube
3️⃣ /download <url> - Unduh media
4️⃣ /sticker - Buat stiker dari gambar

👥 *Fitur Grup:*
5️⃣ /kick - Keluarkan anggota
6️⃣ /promote - Jadikan admin
7️⃣ /demote - Turunkan admin
8️⃣ /setname <nama> - Ubah nama grup
9️⃣ /setdescription <deskripsi> - Ubah deskripsi grup
🔟 /setphoto - Ganti foto grup
 
🚀 *Fitur Admin:*
11️⃣ /mute - Matikan chat grup
12️⃣ /unmute - Buka chat grup
13️⃣ /antilink - Aktifkan anti-link
14️⃣ /antibot - Blokir bot lain di grup

🛠 *Fitur Owner:*
15️⃣ /leave - Bot keluar dari grup
16️⃣ /addpremium <id> - Tambah pengguna premium
17️⃣ /delpremium <id> - Hapus pengguna premium
18️⃣ /listpremium - Lihat daftar premium

📡 *Fitur Panel & Domain:*
19️⃣ /listpanel - Lihat panel yang tersedia
20️⃣ /listdomain - Lihat daftar domain
21️⃣ /listsubdomain - Lihat subdomain aktif
22️⃣ /delsubdomain <nama> - Hapus subdomain
    `, { parse_mode: 'Markdown' });
};
