module.exports = (bot) => {
 
// 🔹 Welcome Message (Menyambut Anggota Baru)
    bot.on("new_chat_members", async (ctx) => {
        const newMembers = ctx.message.new_chat_members;
        newMembers.forEach((member) => {
            ctx.reply(`👋 Selamat datang, ${member.first_name}! Jangan lupa baca deskripsi grup.`);
        });
    });

    // 🔹 Anti-Link (Menghapus Pesan yang Mengandung Link)
    bot.on("message", async (ctx) => {
        const messageText = ctx.message.text || "";
        if (/https?:\/\/\S+/.test(messageText)) {  // Deteksi link
            try {
                await ctx.deleteMessage();
                ctx.reply(`🚫 @${ctx.from.username || ctx.from.first_name}, link tidak diperbolehkan di grup ini!`);
            } catch (error) {
                console.error("Gagal menghapus pesan:", error);
            }
        }
    });

    // 🔹 Anti-Bot (Mengeluarkan Bot Lain)
    bot.on("new_chat_members", async (ctx) => {
        const newMembers = ctx.message.new_chat_members;
        newMembers.forEach(async (member) => {
            if (member.is_bot) {
                try {
                    await ctx.kickChatMember(member.id);
                    ctx.reply(`🤖 Bot ${member.first_name} telah dikeluarkan!`);
                } catch (error) {
                    console.error("Gagal mengeluarkan bot:", error);
                }
            }
        });
    });



    // Mengeluarkan anggota dari grup
    bot.command("kick", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan anggota yang ingin dikeluarkan.");
        }

        const targetUser = ctx.message.reply_to_message.from.id;
        try {
            await ctx.kickChatMember(targetUser);
            ctx.reply(`🚫 ${ctx.message.reply_to_message.from.first_name} telah dikeluarkan.`);
        } catch (error) {
            ctx.reply("❌ Gagal mengeluarkan anggota. Pastikan bot adalah admin.");
        }
    });

    // Menjadikan anggota sebagai admin
    bot.command("promote", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan anggota yang ingin dijadikan admin.");
        }

        const targetUser = ctx.message.reply_to_message.from.id;
        try {
            await ctx.promoteChatMember(targetUser, {
                can_manage_chat: true,
                can_change_info: true,
                can_delete_messages: true,
                can_invite_users: true,
                can_restrict_members: true,
                can_pin_messages: true,
                can_promote_members: false
            });
            ctx.reply(`✅ ${ctx.message.reply_to_message.from.first_name} sekarang adalah admin!`);
        } catch (error) {
            ctx.reply("❌ Gagal mempromosikan anggota. Pastikan bot adalah admin.");
        }
    });

    // Menurunkan admin menjadi anggota biasa
    bot.command("demote", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan admin yang ingin diturunkan.");
        }

        const targetUser = ctx.message.reply_to_message.from.id;
        try {
            await ctx.promoteChatMember(targetUser, {
                can_manage_chat: false,
                can_change_info: false,
                can_delete_messages: false,
                can_invite_users: false,
                can_restrict_members: false,
                can_pin_messages: false,
                can_promote_members: false
            });
            ctx.reply(`🔽 ${ctx.message.reply_to_message.from.first_name} bukan admin lagi.`);
        } catch (error) {
            ctx.reply("❌ Gagal menurunkan admin. Pastikan bot adalah admin.");
        }
    });

    // Mengubah nama grup
    bot.command("setname", async (ctx) => {
        const newName = ctx.message.text.split(" ").slice(1).join(" ");
        if (!newName) {
            return ctx.reply("⚠️ Masukkan nama grup baru.");
        }

        try {
            await ctx.setChatTitle(newName);
            ctx.reply(`✅ Nama grup telah diubah menjadi: *${newName}*`, { parse_mode: "Markdown" });
        } catch (error) {
            ctx.reply("❌ Gagal mengubah nama grup. Pastikan bot adalah admin.");
        }
    });

    // Mengubah deskripsi grup
    bot.command("setdescription", async (ctx) => {
        const newDescription = ctx.message.text.split(" ").slice(1).join(" ");
        if (!newDescription) {
            return ctx.reply("⚠️ Masukkan deskripsi grup baru.");
        }

        try {
            await ctx.setChatDescription(newDescription);
            ctx.reply("✅ Deskripsi grup telah diperbarui!");
        } catch (error) {
            ctx.reply("❌ Gagal mengubah deskripsi grup. Pastikan bot adalah admin.");
        }
    });

    // Mengubah foto grup
    bot.on("photo", async (ctx) => {
        if (ctx.message.caption && ctx.message.caption.toLowerCase() === "/setphoto") {
            const fileId = ctx.message.photo[ctx.message.photo.length - 1].file_id;
            try {
                await ctx.setChatPhoto(fileId);
                ctx.reply("✅ Foto grup telah diperbarui!");
            } catch (error) {
                ctx.reply("❌ Gagal mengubah foto grup. Pastikan bot adalah admin.");
            }
        }
    });

    // Mute (membatasi user dari mengirim pesan)
    bot.command("mute", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan anggota yang ingin dimute.");
        }

        const targetUser = ctx.message.reply_to_message.from.id;
        try {
            await ctx.restrictChatMember(targetUser, {
                can_send_messages: false
            });
            ctx.reply(`🔇 ${ctx.message.reply_to_message.from.first_name} telah dimute!`);
        } catch (error) {
            ctx.reply("❌ Gagal memute anggota. Pastikan bot adalah admin.");
        }
    });

    // Unmute (mengizinkan user untuk mengirim pesan lagi)
    bot.command("unmute", async (ctx) => {
        if (!ctx.message.reply_to_message) {
            return ctx.reply("⚠️ Balas pesan anggota yang ingin diunmute.");
        }

        const targetUser = ctx.message.reply_to_message.from.id;
        try {
            await ctx.restrictChatMember(targetUser, {
                can_send_messages: true
            });
            ctx.reply(`🔊 ${ctx.message.reply_to_message.from.first_name} telah diunmute!`);
        } catch (error) {
            ctx.reply("❌ Gagal mengunmute anggota. Pastikan bot adalah admin.");
        }
    });


}

    

    