const fs = require('fs');
const settings = require('../settings');

const warnFile = './data/warnings.json';

// Membaca daftar peringatan
const getWarnings = () => {
    if (!fs.existsSync(warnFile)) return {};
    return JSON.parse(fs.readFileSync(warnFile));
};

// Menyimpan daftar peringatan
const saveWarnings = (data) => {
    fs.writeFileSync(warnFile, JSON.stringify(data, null, 2));
};

module.exports = (bot) => {

    // 🔹 Membuka grup agar semua orang bisa bergabung
    bot.command("open", async (ctx) => {
        try {
            await ctx.setChatPermissions({
                can_send_messages: true,
                can_invite_users: true
            });
            ctx.reply("🔓 Grup sekarang terbuka! Semua orang bisa bergabung.");
        } catch (error) {
            ctx.reply("❌ Gagal membuka grup. Pastikan bot adalah admin.");
        }
    });

    // 🔹 Menutup grup agar tidak ada yang bisa bergabung
    bot.command("close", async (ctx) => {
        try {
            await ctx.setChatPermissions({
                can_send_messages: true,
                can_invite_users: false
            });
            ctx.reply("🔒 Grup telah ditutup! Hanya admin yang bisa mengundang anggota baru.");
        } catch (error) {
            ctx.reply("❌ Gagal menutup grup. Pastikan bot adalah admin.");
        }
    });

    // 🔹 Menetapkan peraturan grup
    bot.command("setrules", async (ctx) => {
        const rules = ctx.message.text.split(" ").slice(1).join(" ");
        if (!rules) return ctx.reply("⚠️ Masukkan peraturan grup!");

        fs.writeFileSync("./data/rules.txt", rules);
        ctx.reply("✅ Peraturan grup telah diperbarui!");
    });

    // 🔹 Memberikan peringatan ke anggota
    bot.command("warn", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan anggota yang ingin diberi peringatan.");
        }

        const userId = ctx.message.reply_to_message.from.id;
        let warnings = getWarnings();

        if (!warnings[userId]) {
            warnings[userId] = 1;
        } else {
            warnings[userId] += 1;
        }

        saveWarnings(warnings);

        ctx.reply(`⚠️ ${ctx.message.reply_to_message.from.first_name} telah mendapatkan peringatan ke-${warnings[userId]}.`);
        
        if (warnings[userId] >= 3) {
            try {
                await ctx.kickChatMember(userId);
                ctx.reply(`🚫 ${ctx.message.reply_to_message.from.first_name} telah dikeluarkan karena mendapat 3 peringatan.`);
            } catch (error) {
                ctx.reply("❌ Gagal mengeluarkan anggota. Pastikan bot adalah admin.");
            }
        }
    });

    // 🔹 Menghapus semua peringatan anggota
    bot.command("resetwarn", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan anggota yang ingin dihapus peringatannya.");
        }

        const userId = ctx.message.reply_to_message.from.id;
        let warnings = getWarnings();

        if (warnings[userId]) {
            delete warnings[userId];
            saveWarnings(warnings);
            ctx.reply(`✅ Peringatan ${ctx.message.reply_to_message.from.first_name} telah dihapus.`);
        } else {
            ctx.reply("⚠️ Anggota ini belum memiliki peringatan.");
        }
    });

};
