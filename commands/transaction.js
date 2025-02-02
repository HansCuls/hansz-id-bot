const settings = require('../settings'); // Import konfigurasi owner

module.exports = (bot) => {

    // 🔹 Mengirim Pesan Massal ke Kontak (Hanya Owner)
    bot.command("pushkontak", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        ctx.reply("📢 Fitur ini belum tersedia.");
    });

    // 🔹 Menyimpan Kontak User (Hanya Owner)
    bot.command("savekontak", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        ctx.reply("📂 Kontak telah disimpan.");
    });

    // 🔹 Menjalankan Pemasaran Massal (Hanya Owner)
    bot.command("jpm", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        ctx.reply("📌 Fitur pemasaran massal belum tersedia.");
    });

};
