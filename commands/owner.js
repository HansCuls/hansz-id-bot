const settings = require('../settings');
const fs = require('fs');

// File untuk menyimpan daftar grup
const groupListFile = './data/groups.json';

// Membaca daftar grup dari file
const getGroupList = () => {
    if (!fs.existsSync(groupListFile)) return [];
    return JSON.parse(fs.readFileSync(groupListFile));
};

// Menyimpan daftar grup
const saveGroupList = (data) => {
    fs.writeFileSync(groupListFile, JSON.stringify(data, null, 2));
};

module.exports = (bot) => {
    
    // 🔹 Menyimpan grup ketika bot ditambahkan
    bot.on("new_chat_members", (ctx) => {
        if (ctx.chat.type !== "private") {
            let groups = getGroupList();
            if (!groups.includes(ctx.chat.id)) {
                groups.push(ctx.chat.id);
                saveGroupList(groups);
                ctx.reply("✅ Bot telah ditambahkan ke grup ini!");
            }
        }
    });

    // 🔹 Mengirim pesan ke semua grup (Broadcast)
    bot.command("broadcast", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const message = ctx.message.text.split(" ").slice(1).join(" ");
        if (!message) return ctx.reply("⚠️ Masukkan pesan untuk broadcast!");

        const groups = getGroupList();
        if (groups.length === 0) return ctx.reply("❌ Tidak ada grup yang terdaftar!");

        for (const groupId of groups) {
            try {
                await bot.telegram.sendMessage(groupId, `📢 *Broadcast dari Owner:*\n${message}`, { parse_mode: "Markdown" });
            } catch (error) {
                console.error(`❌ Gagal mengirim pesan ke grup ${groupId}`);
            }
        }
        ctx.reply("✅ Broadcast berhasil dikirim ke semua grup!");
    });

    // 🔹 Melihat daftar grup yang telah ditambahkan
    bot.command("getchatlist", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        const groups = getGroupList();
        if (groups.length === 0) return ctx.reply("❌ Tidak ada grup yang terdaftar!");

        let message = "📌 *Daftar Grup yang Terdaftar:*\n";
        groups.forEach((id, index) => {
            message += `${index + 1}. ${id}\n`;
        });

        ctx.reply(message, { parse_mode: "Markdown" });
    });

    // 🔹 Restart Bot
    bot.command("restart", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        ctx.reply("♻️ Bot sedang restart...");
        process.exit(0);
    });

    // 🔹 Mematikan Bot
    bot.command("shutdown", async (ctx) => {
        if (ctx.from.id !== settings.ownerId) {
            return ctx.reply("❌ Perintah ini hanya bisa digunakan oleh owner bot!");
        }

        ctx.reply("🛑 Bot telah dimatikan.");
        process.exit(1);
    });

};
