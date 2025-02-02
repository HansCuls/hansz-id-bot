const fs = require('fs');
const settings = require('../settings'); // Import konfigurasi owner
const premiumFile = './data/premium.json';

// Membaca daftar user premium
const getPremiumUsers = () => {
    if (!fs.existsSync(premiumFile)) return [];
    return JSON.parse(fs.readFileSync(premiumFile));
};

// Menyimpan daftar user premium
const savePremiumUsers = (data) => {
    fs.writeFileSync(premiumFile, JSON.stringify(data, null, 2));
};

module.exports = (bot) => {
    
    // 🔹 Menambahkan User Premium (Hanya Owner)
    bot.command("addpremium", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const userId = ctx.message.text.split(" ")[1];
        if (!userId) return ctx.reply("⚠️ Masukkan ID pengguna!");

        let premiumUsers = getPremiumUsers();
        if (!premiumUsers.includes(userId)) {
            premiumUsers.push(userId);
            savePremiumUsers(premiumUsers);
            ctx.reply(`✅ User ${userId} telah ditambahkan ke daftar premium.`);
        } else {
            ctx.reply("⚠️ User ini sudah ada dalam daftar premium.");
        }
    });

    // 🔹 Menghapus User Premium (Hanya Owner)
    bot.command("delpremium", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const userId = ctx.message.text.split(" ")[1];
        if (!userId) return ctx.reply("⚠️ Masukkan ID pengguna!");

        let premiumUsers = getPremiumUsers();
        premiumUsers = premiumUsers.filter((id) => id !== userId);
        savePremiumUsers(premiumUsers);

        ctx.reply(`✅ User ${userId} telah dihapus dari daftar premium.`);
    });

    // 🔹 Menampilkan Daftar Premium (Bisa Digunakan oleh Semua Orang)
    bot.command("listpremium", async (ctx) => {
        const premiumUsers = getPremiumUsers();
        if (premiumUsers.length === 0) {
            return ctx.reply("📌 Tidak ada pengguna premium saat ini.");
        }

        ctx.reply("📌 *Daftar Pengguna Premium:*\n" + premiumUsers.map((id, i) => `${i + 1}. ${id}`).join("\n"), { parse_mode: "Markdown" });
    });

};
