const fs = require('fs');
const settings = require('../settings');

const bannedUsersFile = './data/banned_users.json';

// Membaca daftar user yang diblokir
const getBannedUsers = () => {
    if (!fs.existsSync(bannedUsersFile)) return [];
    return JSON.parse(fs.readFileSync(bannedUsersFile));
};

// Menyimpan daftar user yang diblokir
const saveBannedUsers = (data) => {
    fs.writeFileSync(bannedUsersFile, JSON.stringify(data, null, 2));
};

module.exports = (bot) => {

    // 🔹 Menampilkan Informasi Pengguna
    bot.command("info", async (ctx) => {
        const user = ctx.from;
        ctx.reply(`
📌 *Informasi Pengguna*
🆔 ID: ${user.id}
👤 Nama: ${user.first_name} ${user.last_name || ""}
📛 Username: @${user.username || "Tidak ada"}
🌍 Bahasa: ${user.language_code}
        `, { parse_mode: "Markdown" });
    });

    // 🔹 Memblokir User dari Bot (Hanya Owner)
    bot.command("ban", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const userId = ctx.message.text.split(" ")[1];
        if (!userId) return ctx.reply("⚠️ Masukkan ID pengguna yang ingin diblokir!");

        let bannedUsers = getBannedUsers();
        if (!bannedUsers.includes(userId)) {
            bannedUsers.push(userId);
            saveBannedUsers(bannedUsers);
            ctx.reply(`🚫 User ${userId} telah diblokir dari bot.`);
        } else {
            ctx.reply("⚠️ User ini sudah diblokir.");
        }
    });

    // 🔹 Membuka Blokir User (Hanya Owner)
    bot.command("unban", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const userId = ctx.message.text.split(" ")[1];
        if (!userId) return ctx.reply("⚠️ Masukkan ID pengguna yang ingin dibuka blokirnya!");

        let bannedUsers = getBannedUsers();
        if (bannedUsers.includes(userId)) {
            bannedUsers = bannedUsers.filter((id) => id !== userId);
            saveBannedUsers(bannedUsers);
            ctx.reply(`✅ User ${userId} telah di-unban.`);
        } else {
            ctx.reply("⚠️ User ini tidak ada dalam daftar blokir.");
        }
    });

    // 🔹 Melihat Daftar User yang Diblokir (Hanya Owner)
    bot.command("listban", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const bannedUsers = getBannedUsers();
        if (bannedUsers.length === 0) {
            return ctx.reply("📌 Tidak ada pengguna yang diblokir.");
        }

        ctx.reply("📌 *Daftar Pengguna yang Diblokir:*\n" + bannedUsers.map((id, i) => `${i + 1}. ${id}`).join("\n"), { parse_mode: "Markdown" });
    });

};
