const axios = require('axios');

module.exports = async (ctx) => {
    const query = ctx.message.text.split(' ').slice(1).join(' ');
    if (!query) return ctx.reply('❌ Masukkan kata kunci untuk mencari video YouTube.');

    try {
        const res = await axios.get(`https://www.googleapis.com/youtube/v3/search`, {
            params: {
                q: query,
                key: 'YOUR_YOUTUBE_API_KEY',
                part: 'snippet',
                maxResults: 5,
            }
        });

        const results = res.data.items.map((video, i) => {
            return `${i + 1}. [${video.snippet.title}](https://youtu.be/${video.id.videoId})`;
        }).join('\n');

        ctx.reply(`📺 *Hasil Pencarian YouTube:*\n\n${results}`, { parse_mode: 'Markdown' });
    } catch (error) {
        ctx.reply('❌ Terjadi kesalahan saat mencari video.');
    }
};
