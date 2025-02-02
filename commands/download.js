const axios = require('axios');
require('dotenv').config();

module.exports = async (ctx) => {
    const args = ctx.message.text.split(" ");
    if (args.length < 2) {
        return ctx.reply("❌ Masukkan URL video yang ingin diunduh!\n\nContoh: `/download https://youtube.com/...`", { parse_mode: "Markdown" });
    }

    const url = args[1];
    const apiKey = process.env.CALIPH_API_KEY;

    let endpoint = "";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
        endpoint = `https://api.caliph.biz.id/api/ytmp4?url=${url}&apikey=${apiKey}`;
    } else if (url.includes("tiktok.com")) {
        endpoint = `https://api.caliph.biz.id/api/tiktok?url=${url}&apikey=${apiKey}`;
    } else if (url.includes("instagram.com")) {
        endpoint = `https://api.caliph.biz.id/api/instagram?url=${url}&apikey=${apiKey}`;
    } else {
        return ctx.reply("❌ Platform tidak didukung! Hanya mendukung *YouTube, TikTok, dan Instagram.*", { parse_mode: "Markdown" });
    }

    ctx.reply("⏳ Sedang memproses video...");

    try {
        const response = await axios.get(endpoint);
        const data = response.data;

        if (!data || !data.result || !data.result.url) {
            return ctx.reply("❌ Gagal mendapatkan link download!");
        }

        await ctx.replyWithVideo(data.result.url, { caption: `✅ *Download Berhasil!*\n📌 Sumber: ${url}`, parse_mode: "Markdown" });

    } catch (error) {
        console.error(error);
        ctx.reply("❌ Terjadi kesalahan saat mengunduh video. Coba lagi nanti.");
    }
};
